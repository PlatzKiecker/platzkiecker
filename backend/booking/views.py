# booking/views.py
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from restaurant.models import BookingPeriod, DefaultBookingDuration, Table, Restaurant, Vacation
from .models import Booking
from .serializers import BookingSerializer, BookingListSerializer, BookingDetailSerializer
from django.http import JsonResponse
from django.utils import timezone
import calendar
from datetime import datetime, timedelta
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi



class BookingCreateView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = BookingSerializer

    def perform_create(self, serializer):
        restaurant_id = self.kwargs.get('restaurant_id')
        serializer.save(restaurant_id=restaurant_id)


class BookingListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = BookingListSerializer

    def get_queryset(self):
        user = self.request.user
        day = self.request.query_params.get('day', None)
        if day:
            return Booking.objects.filter(restaurant__user=user.pk, start__startswith=day)
        return Booking.objects.filter(restaurant__user=user.pk)


class BookingDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingDetailSerializer

    def get_queryset(self):
        user = self.request.user
        return Booking.objects.filter(restaurant__user=user.pk)


class AvailableDaysView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]

    def is_table_available(self, restaurant_id, table, day, booking_periods, default_duration_minutes):
        reservations = Booking.objects.filter(table=table, start__date=day)
        weekday = calendar.day_name[day.weekday()][:2].upper()

        # Retrieve all booking periods for the restaurant and weekday
        booking_periods = booking_periods.filter(weekday=weekday)

        # Initialize lists to store start and end times of booking periods
        day_starts = [period.open for period in booking_periods]
        day_ends = [period.close for period in booking_periods]

        # Define the start and end of the day as the minimum and maximum of all booking period times
        day_start = min(day_starts)
        day_end = max(day_ends)

        # Parse and sort the reservations by start time
        reservations = sorted(reservations, key=lambda x: x.start)

        # Find free slots
        free_slots = []

        if not reservations:
            free_slots.append((day_start, day_end))
        else:
            # Check the time before the first reservation
            first_res_start = datetime.combine(day, reservations[0].start.time())
            day_start_dt = datetime.combine(day, day_start)
            if first_res_start - day_start_dt >= timedelta(minutes=default_duration_minutes):
                free_slots.append((day_start, first_res_start.time()))

            # Check the time between reservations
            for i in range(len(reservations) - 1):
                current_end = reservations[i].end.time()
                next_start = reservations[i + 1].start.time()
                current_end_dt = datetime.combine(day, current_end)
                next_start_dt = datetime.combine(day, next_start)
                if next_start_dt - current_end_dt >= timedelta(minutes=default_duration_minutes):
                    free_slots.append((current_end, next_start))
    
            # Check the time after the last reservation
            last_res_end = datetime.combine(day, reservations[-1].end.time())
            day_end_dt = datetime.combine(day, day_end)
            if day_end_dt - last_res_end >= timedelta(minutes=default_duration_minutes):
                free_slots.append((last_res_end.time(), day_end))

        # Break down free slots into 15-minute intervals
        interval_slots = []
        for start, end in free_slots:
            start_time = datetime.combine(day, start)
            end_time = datetime.combine(day, end)

            while start_time + timedelta(minutes=default_duration_minutes) <= end_time:
                slot_end_time = start_time + timedelta(minutes=default_duration_minutes)
                interval_slots.append({
                    "start": start_time.strftime('%H:%M'),
                    "end": slot_end_time.strftime('%H:%M')
                })
                start_time += timedelta(minutes=15)

        if interval_slots:
            return interval_slots
        return False


    def is_day_available(self, restaurant_id, day, guest_count, booking_periods, default_duration_minutes):
        # Check if the day is within the booking period
        weekday = calendar.day_name[day.weekday()][:2].upper()
        booking_period_exists = booking_periods.filter(weekday=weekday).exists()

        # Check if a booking period exists for the restaurant
        if not booking_period_exists:
            return False

        # Check if the day is not within the vacation period
        vacation_exists = Vacation.objects.filter(restaurant_id=restaurant_id, start__lte=day, end__gt=day).exists()

        # Check if the day is in the past
        if day < timezone.localtime().date():
            return False

        # Check if the day is not within the vacation period
        if vacation_exists:
            return False

        # Check if there is at least one available table with the required capacity
        tables = Table.objects.filter(zone__restaurant_id=restaurant_id, capacity__gte=guest_count, bookable=True)
        for table in tables:
            if self.is_table_available(restaurant_id, table, day, booking_periods, default_duration_minutes):
                return True
        return False
    @swagger_auto_schema(
        operation_description="Get available days for a given guest count and start day",
        manual_parameters=[
            openapi.Parameter(
                'restaurant_id',
                openapi.IN_QUERY,
                description="The ID of the restaurant",
                type=openapi.TYPE_INTEGER
            ),
            openapi.Parameter(
                'guest_count',
                openapi.IN_QUERY,
                description="The number of guests",
                type=openapi.TYPE_INTEGER
            ),
            openapi.Parameter(
                'start_day',
                openapi.IN_QUERY,
                description="The date in the format 'YYYY-MM-DD'",
                type=openapi.TYPE_STRING
            )
        ]
    )
    def get(self, request, *args, **kwargs):
        user = self.request.user
        restaurant = Restaurant.objects.get(user=user.pk)
        restaurant_id = restaurant.pk
        guest_count = int(self.request.query_params.get('guest_count'))
        default_duration = DefaultBookingDuration.objects.get(restaurant_id=restaurant_id).duration
        default_duration_minutes = DefaultBookingDuration.objects.get(restaurant_id=restaurant_id).duration.hour * 60 + default_duration.minute
        available_days = []
        current_day = datetime.strptime(self.request.query_params.get('start_day'), '%Y-%m-%d').date()

        booking_periods = BookingPeriod.objects.filter(restaurant_id=restaurant_id)

        for _ in range(30):
            if self.is_day_available(restaurant_id, current_day, guest_count, booking_periods, default_duration_minutes):
                available_days.append(current_day.strftime('%Y-%m-%d'))
            current_day += timedelta(days=1)

        return JsonResponse({'available_days': available_days})


class AvailableTimeSlotsView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]

    def is_table_available(self, restaurant_id, table, day, booking_periods, default_duration_minutes):
        reservations = Booking.objects.filter(table=table, start__date=day)
        weekday = calendar.day_name[day.weekday()][:2].upper()

        # Retrieve all booking periods for the restaurant and weekday
        booking_periods = booking_periods.filter(restaurant_id=restaurant_id, weekday=weekday)
        if not booking_periods:
            return False
        
        # Initialize lists to store start and end times of booking periods
        day_starts = [period.open for period in booking_periods]
        day_ends = [period.close for period in booking_periods]

        # Define the start and end of the day as the minimum and maximum of all booking period times
        day_start = min(day_starts)
        day_end = max(day_ends)

        # Parse and sort the reservations by start time
        reservations = sorted(reservations, key=lambda x: x.start)

        # Find free slots
        free_slots = []

        if not reservations:
            free_slots.append((day_start, day_end))
        else:
            # Check the time before the first reservation
            first_res_start = datetime.combine(day, reservations[0].start.time())
            day_start_dt = datetime.combine(day, day_start)
            if first_res_start - day_start_dt >= timedelta(minutes=default_duration_minutes):
                free_slots.append((day_start, first_res_start.time()))

            # Check the time between reservations
            for i in range(len(reservations) - 1):
                current_end = reservations[i].end.time()
                next_start = reservations[i + 1].start.time()
                current_end_dt = datetime.combine(day, current_end)
                next_start_dt = datetime.combine(day, next_start)
                if next_start_dt - current_end_dt >= timedelta(minutes=default_duration_minutes):
                    free_slots.append((current_end, next_start))

            # Check the time after the last reservation
            last_res_end = datetime.combine(day, reservations[-1].end.time())
            day_end_dt = datetime.combine(day, day_end)
            if day_end_dt - last_res_end >= timedelta(minutes=default_duration_minutes):
                free_slots.append((last_res_end.time(), day_end))

        # Break down free slots into 15-minute intervals
        interval_slots = []
        for start, end in free_slots:
            start_time = datetime.combine(day, start)
            end_time = datetime.combine(day, end)

            while start_time + timedelta(minutes=default_duration_minutes) <= end_time:
                slot_end_time = start_time + timedelta(minutes=default_duration_minutes)
                interval_slots.append({
                    "start": start_time.strftime('%H:%M'),
                    "end": slot_end_time.strftime('%H:%M')
                })
                start_time += timedelta(minutes=15)

        # Remove timeslots that are in the past
        current_time = timezone.localtime()

        # Convert combined datetime to the same timezone
        interval_slots = [
            slot for slot in interval_slots
            if timezone.make_aware(datetime.combine(day, datetime.strptime(slot['start'], '%H:%M').time()), current_time.tzinfo) > current_time
            ]

        if interval_slots:
            return interval_slots
        return False
    

    @swagger_auto_schema(
        operation_description="Get available time slots for a given day and guest count",
        manual_parameters=[
            openapi.Parameter(
                'restaurant_id',
                openapi.IN_QUERY,
                description="The ID of the restaurant",
                type=openapi.TYPE_INTEGER
            ),
            openapi.Parameter(
                'guest_count',
                openapi.IN_QUERY,
                description="The number of guests",
                type=openapi.TYPE_INTEGER
            ),
            openapi.Parameter(
                'day',
                openapi.IN_QUERY,
                description="The date in the format 'YYYY-MM-DD'",
                type=openapi.TYPE_STRING
            )
        ]
    )
    def get(self, request, *args, **kwargs):
        user = self.request.user
        restaurant = Restaurant.objects.get(user=user.pk)
        restaurant_id = restaurant.pk
        tables = Table.objects.filter(zone__restaurant_id=restaurant_id)
        booking_periods = BookingPeriod.objects.filter(restaurant_id=restaurant_id)
        default_duration = DefaultBookingDuration.objects.get(restaurant_id=restaurant_id).duration
        default_duration_minutes = DefaultBookingDuration.objects.get(restaurant_id=restaurant_id).duration.hour * 60 + default_duration.minute

        guest_count = int(self.request.query_params.get('guest_count'))
        day = datetime.strptime(self.request.query_params.get('day'), '%Y-%m-%d').date()

        free_slots = []

        for table in tables:
            if table.capacity >= guest_count and table.bookable:
                slots = self.is_table_available(restaurant_id, table, day, booking_periods, default_duration_minutes)
                if slots:
                    free_slots.extend(slots)

        # Remove duplicates
        free_slots = [dict(t) for t in {tuple(slot.items()) for slot in free_slots}]

        # Sort the free slots by start time
        free_slots = sorted(free_slots, key=lambda x: x['start'])

        return JsonResponse({'free_slots': free_slots})
