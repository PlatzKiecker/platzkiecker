from django.shortcuts import render
from rest_framework import generics
from .models import Booking
from .serializers import BookingSerializer, BookingListSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils import timezone
from restaurant.models import Table, BookingPeriod, Vacation
from .serializers import AvailableDates, AvailableTables, AvailableTimeslots

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
