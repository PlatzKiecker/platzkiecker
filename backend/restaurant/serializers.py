# restaurant/serializers.py
from rest_framework import serializers
from .models import Restaurant, Zone, Table, Vacation, BookingPeriod

class RestaurantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Restaurant
        fields = ['id', 'name', 'user']

class ZoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Zone
        fields = ['id', 'name', 'bookable', 'restaurant']

class TableSerializer(serializers.ModelSerializer):
    class Meta:
        model = Table
        fields = ['id', 'capacity', 'bookable', 'combinable', 'zone']

class VacationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vacation
        fields = ['id', 'start', 'end', 'restaurant']

class BookingPeriodSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookingPeriod
        fields = ['id', 'weekday', 'open', 'close', 'default_duration', 'restaurant']
