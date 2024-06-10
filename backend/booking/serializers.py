# booking/serializers.py
from rest_framework import serializers
from .models import Booking, Restaurant
from django.utils import timezone

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ['id', 'guest_name', 'guest_phone', 'start', 'guest_count', 'status', 'notes', 'table', 'restaurant']
        read_only_fields = ['restaurant', 'status', 'default_duration', 'table']

    def validate(self, data):
        if data['start'] < timezone.now():
            raise serializers.ValidationError('Booking time must be in the future.')

        guest_count = data.get('guest_count')
        table = data.get('table')
        restaurant = data.get('restaurant')
        #data['default_duration'] = restaurant.default_duration

        if guest_count and table:
            if table.capacity < guest_count:
                raise serializers.ValidationError('Table capacity must be equal or greater than the number of guests.')

        if data['start'].minute % 15 != 0:
            raise serializers.ValidationError('Booking time must be in 15-minute intervals.')
        
        if restaurant and data['start'] not in restaurant.booking_periods:
            raise serializers.ValidationError('Booking time must be within the restaurant\'s booking periods.')

        if data['start'] in restaurant.vacations:
            raise serializers.ValidationError('Booking time must not be within the restaurant\'s vacations.')
        
        if (data['start']  ) and table in Booking.objects.filter(start=data['start']):
            raise serializers.ValidationError('Table must be available for the booking time.')

        print(restaurant.BookingPeriod.filter(weekday=data['start'].weekday()))


        return data

class AvailableDates(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ['start']

class AvailableTables(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ['table']

## Infos
#Bookingperiod
#Vacation
#Zones
#Tables


#1 Guest Count: GET + param
    # - TableCapacity abfragen
#2      Dates: GET
            # Daten
            # - an denen geöffnet ist und
            # - an denen keine Betriebsferien sind und
            # - an denen Tische mit ausreichend Kapazität frei sind
#3 Date: GET + param
    # - Datum für die Reservierung
#4 Timeslots GET
    # Timeslots mit Liste an Tischen für gewünschtes Datum an denen diese Tisch(e)
    # - frei sind und
    # - kein Betriebsurlaub ist und
    # - Kapazität ausreicht und
    # - innerhalb der Öffnungszeiten
    # - in 15-Minuten-Intervallen 
    # - mit default_duration als Endzeitpunkt
