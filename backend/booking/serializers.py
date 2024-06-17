# booking/serializers.py
from datetime import datetime, timedelta
from django.utils import timezone
from rest_framework import serializers
from .models import Booking, Table, Restaurant
from restaurant.models import DefaultBookingDuration
from restaurant.models import Zone


class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ['id', 'guest_name', 'guest_phone', 'start', 'end', 'guest_count', 'status', 'notes', 'restaurant']
        read_only_fields = ['restaurant', 'status', 'table', 'end']
    
    def validate(self, data):
        # Check if the booking start time is in the future
        if data['start'] < timezone.localtime():
            raise serializers.ValidationError('Booking time must be in the future.')

        guest_count = data.get('guest_count')
        table = data.get('table')
        restaurant_id = self.context['view'].kwargs.get('restaurant_id')
        
        try:
            restaurant = Restaurant.objects.get(id=restaurant_id)
        except Restaurant.DoesNotExist:
            try:
                restaurant = data['restaurant']
            except KeyError:
                raise serializers.ValidationError('Restaurant not found.')

        # Check if the table has sufficient capacity
        if guest_count and table:
            if table.capacity < guest_count:
                raise serializers.ValidationError('Table capacity must be equal or greater than the number of guests.')

        # Check if the booking time is in 15-minute intervals
        if data['start'].minute % 15 != 0:
            raise serializers.ValidationError('Booking time must be in 15-minute intervals.')

        # Calculate the default duration for the booking
        try:
            default_duration = DefaultBookingDuration.objects.get(restaurant=restaurant).duration
        except DefaultBookingDuration.DoesNotExist:
            raise serializers.ValidationError('No default booking duration found for the restaurant.')

        default_duration_timedelta = timedelta(hours=default_duration.hour, 
                                               minutes=default_duration.minute, 
                                               seconds=default_duration.second)

        # Calculate the booking end time
        booking_end_time = data['start'] + default_duration_timedelta

        # Ensure the booking time is within the restaurant's booking periods
        weekday = data['start'].strftime('%A').upper()[:2]  # Convert to "MO", "TU", etc.
        booking_periods = restaurant.bookingperiod_set.filter(weekday=weekday)

        in_booking_period = False

        for period in booking_periods:
            period_start = timezone.make_aware(datetime.combine(data['start'].date(), period.open), timezone.get_current_timezone())
            period_end = timezone.make_aware(datetime.combine(data['start'].date(), period.close), timezone.get_current_timezone())

            if period_start <= data['start'] <= period_end and period_start <= booking_end_time <= period_end:
                in_booking_period = True
                break

        if not in_booking_period:
            raise serializers.ValidationError('Booking time must be within the restaurant\'s booking periods.')

        # Ensure the booking time does not overlap with the restaurant's vacations
        if restaurant and restaurant.vacations.filter(start__lte=data['start'], end__gte=data['start']).exists():
            raise serializers.ValidationError('Booking time must not be within the restaurant\'s vacations.')

        # If table is not provided in the data, find an available table with closest capacity
        if not data.get('table'):
            # Get all bookable zones
            bookable_zones = Zone.objects.filter(restaurant=restaurant, bookable=True)
            
            # Get all tables with capacity greater than or equal to the required guest count and are bookable
            available_tables = Table.objects.filter(
                capacity__gte=data['guest_count'],
                zone__in=bookable_zones,
                bookable=True
            )

            # Iterate over available tables to find the one with the closest capacity
            closest_table = None
            min_capacity_difference = float('inf')  # Initialize with infinity

            for tbl in available_tables:
                # Check if the table is available for the booking time
                if not Booking.objects.filter(
                    table=tbl,
                    start__lt=booking_end_time,
                    start__gte=data['start']
                ).exists():
                    # Calculate the difference between table capacity and required guest count
                    capacity_difference = tbl.capacity - data['guest_count']

                    # Update closest_table if the current table has a closer capacity
                    if capacity_difference < min_capacity_difference:
                        closest_table = tbl
                        min_capacity_difference = capacity_difference

            # Raise validation error if no suitable table is found
            if not closest_table:
                raise serializers.ValidationError('No available table with sufficient capacity for the booking.')

            # Set the closest table found as the chosen table for the booking
            data['table'] = closest_table

        # Ensure the booking time does not overlap with another booking for the same table
        if Booking.objects.filter(
            table=data['table'], 
            start__lt=booking_end_time, 
            start__gte=data['start']
        ).exists():
            raise serializers.ValidationError('Booking time must not overlap with another booking.')

        return data

    def create(self, validated_data):
        # Calculate the booking end time
        restaurant_id = self.context['view'].kwargs.get('restaurant_id')
        restaurant = Restaurant.objects.get(id=restaurant_id)
        try:
            default_duration = DefaultBookingDuration.objects.get(restaurant=restaurant).duration
        except DefaultBookingDuration.DoesNotExist:
            raise serializers.ValidationError('No default booking duration found for the restaurant.')

        default_duration_timedelta = timedelta(hours=default_duration.hour, 
                                               minutes=default_duration.minute, 
                                               seconds=default_duration.second)
        
        validated_data['end'] = validated_data['start'] + default_duration_timedelta
        return super().create(validated_data)

    def update(self, instance, validated_data):
        # Calculate the booking end time
        restaurant_id = self.context['view'].kwargs.get('restaurant_id')
        restaurant = Restaurant.objects.get(id=restaurant_id)
        try:
            default_duration = DefaultBookingDuration.objects.get(restaurant=restaurant).duration
        except DefaultBookingDuration.DoesNotExist:
            raise serializers.ValidationError('No default booking duration found for the restaurant.')

        default_duration_timedelta = timedelta(hours=default_duration.hour, 
                                               minutes=default_duration.minute, 
                                               seconds=default_duration.second)

        instance.end = instance.start + default_duration_timedelta
        return super().update(instance, validated_data)


class BookingListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ['id', 'guest_name', 'guest_phone', 'start', 'end', 'guest_count', 'status', 'notes', 'restaurant', 'table']