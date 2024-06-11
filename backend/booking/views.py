from rest_framework import generics
from .models import Booking
from .serializers import BookingSerializer, BookingListSerializer, AvailableDaysSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.exceptions import ValidationError
from datetime import datetime, timedelta
from rest_framework.views import APIView
from rest_framework.response import Response
from restaurant.models import BookingPeriod, DefaultBookingDuration, Table




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
    serializer_class = BookingSerializer

    def get_queryset(self):
        user = self.request.user
        return Booking.objects.filter(restaurant__user=user.pk)

from datetime import datetime, timedelta
from rest_framework import generics
from rest_framework.permissions import AllowAny
from restaurant.models import Restaurant, Vacation, BookingPeriod, DefaultBookingDuration
from .serializers import AvailableDaysSerializer

class AvailableDaysView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = AvailableDaysSerializer
    queryset = Restaurant.objects.all()

    def is_table_available(self, restaurant_id, table, day, guest_count):
        print("table top")
        reservations = Booking.objects.filter(table=table, start__date=day)
        restaurant = Restaurant.objects.get(id=restaurant_id)
        
        # Define the start and end of the day and the minimum duration
        day_start = BookingPeriod.objects.get(restaurant_id=restaurant_id, weekday=day.weekday()).open
        day_end = BookingPeriod.objects.filter(restaurant=restaurant, weekday=day.weekday()).close
        min_duration = DefaultBookingDuration.objects.get(restaurant=table.zone.restaurant).duration

        # Parse and sort the reservations by start time
        reservations = sorted(reservations, key=lambda x: datetime.fromisoformat(x["start"]))

        # Find free slots
        free_slots = []

        # Check the time before the first reservation
        first_res_start = datetime.fromisoformat(reservations[0]["start"])
        if first_res_start - day_start >= min_duration:
            free_slots.append((day_start, first_res_start))

        # Check the time between reservations
        for i in range(len(reservations) - 1):
            current_end = datetime.fromisoformat(reservations[i]["end"])
            next_start = datetime.fromisoformat(reservations[i + 1]["start"])
            if next_start - current_end >= min_duration:
                free_slots.append((current_end, next_start))

        # Check the time after the last reservation
        last_res_end = datetime.fromisoformat(reservations[-1]["end"])
        if day_end - last_res_end >= min_duration:
            free_slots.append((last_res_end, day_end))
        if free_slots:
            print("table func" + free_slots)
            return free_slots
        else:
            print("table func" + False)
            return False

    def is_day_available(self, restaurant_id, day, guest_count):
        # Check if the day is within the booking period
        restaurant = Restaurant.objects.get(id=restaurant_id)
        weekday = day.strftime('%A').upper()[:2]  # Convert to "MO", "TU", etc.
        booking_periods = restaurant.bookingperiod_set.filter(weekday=weekday).exists()

        if not booking_periods:
            print("day with no booking period")
            return False

        # Check if the day is not within the vacation period
        vacation_exists = Vacation.objects.filter(
            restaurant_id=restaurant_id,
            start__lte=day,
            end__gte=day
        ).exists()

        if vacation_exists:
            print("day with vacation")
            return False

        # Check if within the day there is at least one table available with the required capacity
        tables = Table.objects.filter(zone__restaurant_id=restaurant_id)
        for table in tables:
            if self.is_table_available(restaurant_id, table, day, guest_count) == True:
                print("day func" + day)
                return day
            else:
                print("day func" + False)
                return False
    
    def get_queryset(self):
        user = self.request.user
        restaurant = Restaurant.objects.get(user=user.pk)
        restaurant_id = restaurant.pk
        guest_count = int(self.request.query_params.get('guest_count'))
        available_days = []
        current_day = self.request.query_params.get('start_day')
        current_day = datetime.strptime(self.request.query_params.get('start_day'), '%Y-%m-%d').date()
        for _ in range(30):
            if self.is_day_available(restaurant_id, current_day, guest_count):
                available_days.append(current_day.strftime('%Y-%m-%d'))
            current_day += timedelta(days=1)
        print("list func")
        print(available_days)
        return available_days
