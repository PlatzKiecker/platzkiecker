# restaurant/serializers.py
from rest_framework import serializers
from .models import Restaurant, Zone, Table, Vacation, BookingPeriod, DefaultBookingDuration
from .models import BookingPeriod
from restaurant.models import Table, BookingPeriod, Vacation
from django.core.exceptions import ObjectDoesNotExist
from datetime import timedelta


class RestaurantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Restaurant
        fields = ['id', 'name', 'user']
        extra_kwargs = {'user': {'read_only': True}}


class TableSerializer(serializers.ModelSerializer):
    zone = serializers.PrimaryKeyRelatedField(queryset=Zone.objects.none())

    class Meta:
        model = Table
        fields = ['id', 'name', 'capacity', 'bookable', 'combinable', 'zone']
        extra_kwargs = {'combinable': {'read_only': True}}

    def __init__(self, *args, **kwargs):
        super(TableSerializer, self).__init__(*args, **kwargs)
        request = self.context.get('request', None)
        zones = self.context.get('zones', Zone.objects.none())
        if request and hasattr(request, 'user'):
            self.fields['zone'].queryset = zones

    def validate_zone(self, value):
        ## Check that the zone belongs to the user's restaurant.
        user = self.context['request'].user
        if not Zone.objects.filter(id=value.id, restaurant__user=user).exists():
            raise serializers.ValidationError("You can only create tables in zones belonging to your restaurant.")
        return value


class ZoneSerializer(serializers.ModelSerializer):
    tables = TableSerializer(many=True, read_only=True, source='table_set')
    class Meta:
        model = Zone
        fields = ['id', 'name', 'bookable', 'restaurant', 'tables']
        extra_kwargs = {'restaurant': {'read_only': True}}


class VacationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vacation
        fields = ['id', 'start', 'end', 'restaurant']
        extra_kwargs = {'restaurant': {'read_only': True}}


class DefaultBookingDurationSerializer(serializers.ModelSerializer):
    class Meta:
        model = DefaultBookingDuration
        fields = ['id', 'duration', 'restaurant']
        extra_kwargs = {'restaurant': {'read_only': True}}


class BookingPeriodSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookingPeriod
        fields = ['id', 'weekday', 'open', 'close', 'restaurant']
        extra_kwargs = {'restaurant': {'read_only': True}}

    def validate(self, attrs):
        open_time = attrs.get('open')
        close_time = attrs.get('close')

        # Ensure the opening time is before the closing time
        if open_time >= close_time:
            raise serializers.ValidationError("Opening time must be before closing time.")
    
        # Ensure the opening and closing times are in 15-minute intervals
        if open_time.minute % 15 != 0 or close_time.minute % 15 != 0:
            raise serializers.ValidationError("Opening and closing times must be in 15-minute intervals.")
        
        # Ensure there are no overlapping booking periods for the same weekday
        weekday = attrs.get('weekday')
        open_time = attrs.get('open')
        close_time = attrs.get('close')
        restaurant = self.context['request'].user.restaurant
        existing_booking_periods = BookingPeriod.objects.filter(weekday=weekday, restaurant=restaurant).exclude(id=self.instance.id)
        
        for booking_period in existing_booking_periods:
            if (open_time >= booking_period.open and open_time < booking_period.close) or (close_time > booking_period.open and close_time <= booking_period.close):
                raise serializers.ValidationError("There is an overlapping booking period for this weekday.")


        # Fetch the default duration for the restaurant
        restaurant = self.context['request'].user.restaurant

        try:
            default_duration = DefaultBookingDuration.objects.get(restaurant=restaurant)
        except ObjectDoesNotExist:
            raise serializers.ValidationError("No default booking duration found for the restaurant.")

        # Calculate the default duration as a timedelta
        default_duration_timedelta = timedelta(hours=default_duration.duration.hour, 
                                               minutes=default_duration.duration.minute, 
                                               seconds=default_duration.duration.second)

        # Calculate the booking period duration as a timedelta
        booking_period_duration = timedelta(hours=close_time.hour - open_time.hour,
                                            minutes=close_time.minute - open_time.minute,
                                            seconds=close_time.second - open_time.second)

        # Ensure the default duration does not exceed the time slot duration
        if booking_period_duration < default_duration_timedelta:
            raise serializers.ValidationError("The default booking duration cannot exceed the booking period duration.")

        return attrs