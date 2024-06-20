# booking/views.py
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from restaurant.models import BookingPeriod, DefaultBookingDuration, Table, Restaurant, Vacation
from .models import Booking
from .serializers import BookingSerializer, BookingListSerializer, BookingDetailSerializer
from django.http import JsonResponse
from django.utils import timezone  # Import timezone
import calendar
from datetime import datetime, timedelta


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
        return Booking.objects.filter(restaurant__user=user.pk)


class BookingDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingDetailSerializer

    def get_queryset(self):
        user = self.request.user
        return Booking.objects.filter(restaurant__user=user.pk)


class AvailableDaysView(APIView):
    permission_classes = [IsAuthenticated]

    def is_table_available(self, restaurant_id, table, day):
        reservations = Booking.objects.filter(table=table, start__date=day)
        weekday = calendar.day_name[day.weekday()][:2].upper()

        # Retrieve all booking periods for the restaurant and weekday
        booking_periods = BookingPeriod.objects.filter(restaurant_id=restaurant_id, weekday=weekday)

        # Initialize lists to store start and end times of booking periods
        day_starts = []
        day_ends = []

        # Populate the lists with start and end times of booking periods
        for period in booking_periods:
            day_starts.append(period.open)
            day_ends.append(period.close)

        # Define the start and end of the day as the minimum and maximum of all booking period times
        day_start = min(day_starts)
        day_end = max(day_ends)

        # Define the minimum duration based on default booking duration
        default_duration = DefaultBookingDuration.objects.get(restaurant_id=restaurant_id).duration

        # Convert default_duration to minutes
        default_duration_minutes = default_duration.hour * 60 + default_duration.minute

        # Parse and sort the reservations by start time
        reservations = sorted(reservations, key=lambda x: x.start)

        # Find free slots
        free_slots = []

        if not reservations:
            free_slots.append((day_start, day_end))
        else:
            # Check the time before the first reservation
            first_res_start = reservations[0].start.time()
            # Convert start_time to datetime.datetime
            if datetime.combine(day, first_res_start) - datetime.combine(day, day_start) >= timedelta(minutes=default_duration_minutes):
                free_slots.append((day_start, first_res_start))

            # Check the time between reservations
            for i in range(len(reservations) - 1):
                current_end = reservations[i].end.time()
                next_start = reservations[i + 1].start.time()
                # Convert current_end and next_start to datetime.datetime
                if datetime.combine(day, next_start) - datetime.combine(day, current_end) >= timedelta(minutes=default_duration_minutes):
                    free_slots.append((current_end, next_start))

            # Check the time after the last reservation
            last_res_end = reservations[-1].end.time()
            # Convert last_res_end to datetime.datetime
            if datetime.combine(day, day_end) - datetime.combine(day, last_res_end) >= timedelta(minutes=default_duration_minutes):
                free_slots.append((last_res_end, day_end))

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


    def is_day_available(self, restaurant_id, day, guest_count):
        # Check if the day is within the booking period
        weekday = calendar.day_name[day.weekday()][:2].upper()
        booking_period_exists = BookingPeriod.objects.filter(restaurant_id=restaurant_id, weekday=weekday).exists()

        if not booking_period_exists:
            return False

        # Check if the day is not within the vacation period
        vacation_exists = Vacation.objects.filter(restaurant_id=restaurant_id, start__lte=day, end__gte=day).exists()

        if vacation_exists:
            return False

        # Check if there is at least one available table with the required capacity
        tables = Table.objects.filter(zone__restaurant_id=restaurant_id, capacity__gte=guest_count, bookable=True)
        for table in tables:
            if self.is_table_available(restaurant_id, table, day):
                return True
        return False

    def get(self, request, *args, **kwargs):
        user = self.request.user
        restaurant = Restaurant.objects.get(user=user.pk)
        restaurant_id = restaurant.pk
        guest_count = int(self.request.query_params.get('guest_count'))
        available_days = []
        current_day = datetime.strptime(self.request.query_params.get('start_day'), '%Y-%m-%d').date()

        for _ in range(30):
            if self.is_day_available(restaurant_id, current_day, guest_count):
                available_days.append(current_day.strftime('%Y-%m-%d'))
            current_day += timedelta(days=1)

        return JsonResponse({'available_days': available_days})


class AvailableTimeSlotsView(APIView):
    permission_classes = [IsAuthenticated]

    def is_table_available(self, restaurant_id, table, day, guest_count):
        reservations = Booking.objects.filter(table=table, start__date=day)
        weekday = calendar.day_name[day.weekday()][:2].upper()

        # Retrieve all booking periods for the restaurant and weekday
        booking_periods = BookingPeriod.objects.filter(restaurant_id=restaurant_id, weekday=weekday)

        # Initialize lists to store start and end times of booking periods
        day_starts = []
        day_ends = []

        # Populate the lists with start and end times of booking periods
        for period in booking_periods:
            day_starts.append(period.open)
            day_ends.append(period.close)

        # Define the start and end of the day as the minimum and maximum of all booking period times
        day_start = min(day_starts)
        day_end = max(day_ends)

        # Define the minimum duration based on default booking duration
        default_duration = DefaultBookingDuration.objects.get(restaurant_id=restaurant_id).duration

        # Convert default_duration to minutes
        default_duration_minutes = default_duration.hour * 60 + default_duration.minute

        # Parse and sort the reservations by start time
        reservations = sorted(reservations, key=lambda x: x.start)

        # Find free slots
        free_slots = []

        if not reservations:
            free_slots.append((day_start, day_end))
        else:
            # Check the time before the first reservation
            first_res_start = reservations[0].start.time()
            if datetime.combine(day, first_res_start) - datetime.combine(day, day_start) >= timedelta(minutes=default_duration_minutes):
                free_slots.append((day_start, first_res_start))

            # Check the time between reservations
            for i in range(len(reservations) - 1):
                current_end = reservations[i].end.time()
                next_start = reservations[i + 1].start.time()
                if datetime.combine(day, next_start) - datetime.combine(day, current_end) >= timedelta(minutes=default_duration_minutes):
                    free_slots.append((current_end, next_start))

            # Check the time after the last reservation
            last_res_end = reservations[-1].end.time()
            if datetime.combine(day, day_end) - datetime.combine(day, last_res_end) >= timedelta(minutes=default_duration_minutes):
                free_slots.append((last_res_end, day_end))

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
        interval_slots = [slot for slot in interval_slots if timezone.make_aware(datetime.combine(day, datetime.strptime(slot['start'], '%H:%M').time()), timezone.get_current_timezone()) > current_time]

        if interval_slots:
            return interval_slots
        return False

    def get(self, request, *args, **kwargs):
        user = self.request.user
        restaurant = Restaurant.objects.get(user=user.pk)
        restaurant_id = restaurant.pk
        guest_count = int(self.request.query_params.get('guest_count'))
        day = datetime.strptime(self.request.query_params.get('day'), '%Y-%m-%d').date()
        tables = Table.objects.filter(zone__restaurant_id=restaurant_id)

        free_slots = []

        for table in tables:
            if table.capacity >= guest_count and table.bookable:
                slots = self.is_table_available(restaurant_id, table, day, guest_count)
                if slots:
                    free_slots.extend(slots)

        # Remove duplicates
        free_slots = [dict(t) for t in {tuple(slot.items()) for slot in free_slots}]

        return JsonResponse({'free_slots': free_slots})
