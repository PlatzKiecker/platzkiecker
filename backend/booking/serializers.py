# booking/serializers.py
from rest_framework import serializers
from .models import Booking

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ['id', 'guest_name', 'guest_phone', 'start', 'guest_count', 'status', 'notes', 'table', 'restaurant']