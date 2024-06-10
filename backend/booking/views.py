from django.shortcuts import render
from rest_framework import generics
from .models import Booking
from .serializers import BookingSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny

class BookingCreateView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = BookingSerializer

    def perform_create(self, serializer):
        restaurant_id = self.kwargs.get('restaurant_id')
        serializer.save(restaurant_id=restaurant_id)

        # Create an entry in the booked tables attribute availability
        start = serializer.validated_data.get('start')
        default_duration = serializer.validated_data.get('default_duration')
        end = start + default_duration
        serializer.instance.booked_tables.availability.create(start=start, end=end)

class BookingListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer

    def get_queryset(self):
        user = self.request.user
        return Booking.objects.filter(restaurant__user=user.pk)

class BookingDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer

    def get_queryset(self):
        user = self.request.user
        return Booking.objects.filter(restaurant__user=user.pk)
