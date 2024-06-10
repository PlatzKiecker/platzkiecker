# restaurant/serializers.py
from rest_framework import serializers
from .models import Restaurant, Zone, Table, Vacation, BookingPeriod
from datetime import datetime, date
from rest_framework import serializers
from .models import BookingPeriod

class RestaurantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Restaurant
        fields = ['id', 'name', 'user']
        extra_kwargs = {'user': {'read_only': True}}

class ZoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Zone
        fields = ['id', 'name', 'bookable', 'restaurant']
        extra_kwargs = {'restaurant': {'read_only': True}}


class TableSerializer(serializers.ModelSerializer):
    zone = serializers.PrimaryKeyRelatedField(queryset=Zone.objects.none())

    class Meta:
        model = Table
        fields = ['id', 'name', 'capacity', 'bookable', 'combinable', 'zone']
        extra_kwargs = {'bookable': {'read_only': True}, 'combinable': {'read_only': True}}

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


class VacationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vacation
        fields = ['id', 'start', 'end', 'restaurant']
        extra_kwargs = {'restaurant': {'read_only': True}}


class BookingPeriodSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookingPeriod
        fields = ['id', 'weekday', 'open', 'close', 'default_duration', 'restaurant']
        extra_kwargs = {'restaurant': {'read_only': True}}

    def validate(self, attrs):
        open_time = attrs.get('open')
        close_time = attrs.get('close')
        default_duration = attrs.get('default_duration')

        # Ensure the opening time is before the closing time
        if open_time >= close_time:
            raise serializers.ValidationError("Opening time must be before closing time.")

        # Ensure the default duration does not exceed the time slot duration
        time_slot_duration = (datetime.combine(date.min, close_time) - datetime.combine(date.min, open_time)).total_seconds()
        default_duration_seconds = (datetime.combine(date.min, default_duration) - datetime.min).total_seconds()

        if default_duration_seconds > time_slot_duration:
            raise serializers.ValidationError("Default duration cannot exceed the time slot duration.")

        return attrs

