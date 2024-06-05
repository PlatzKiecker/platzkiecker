# restaurant/views.py
from django.shortcuts import render
from rest_framework import generics
from .models import Restaurant, Zone, Table, Vacation, BookingPeriod
from .serializers import RestaurantSerializer, ZoneSerializer, TableSerializer, VacationSerializer, BookingPeriodSerializer

class RestaurantCreateView(generics.CreateAPIView):
    queryset = Restaurant.objects.all()
    serializer_class = RestaurantSerializer

class RestaurantDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Restaurant.objects.all()
    serializer_class = RestaurantSerializer


class ZoneCreateView(generics.CreateAPIView):
    queryset = Zone.objects.all()
    serializer_class = ZoneSerializer

class ZoneListView(generics.ListAPIView):
    queryset = Zone.objects.all()
    serializer_class = ZoneSerializer

class ZoneDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Zone.objects.all()
    serializer_class = ZoneSerializer


class TableCreateView(generics.CreateAPIView):
    queryset = Table.objects.all()
    serializer_class = TableSerializer

class TableListView(generics.ListAPIView):
    queryset = Table.objects.all()
    serializer_class = TableSerializer

class TableDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Table.objects.all()
    serializer_class = TableSerializer


class VacationCreateView(generics.CreateAPIView):
    queryset = Vacation.objects.all()
    serializer_class = VacationSerializer

class VacationListView(generics.ListAPIView):
    queryset = Vacation.objects.all()
    serializer_class = VacationSerializer

class VacationDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Vacation.objects.all()
    serializer_class = VacationSerializer


class BookingPeriodCreateView(generics.CreateAPIView):
    queryset = BookingPeriod.objects.all()
    serializer_class = BookingPeriodSerializer

class BookingPeriodListView(generics.ListAPIView):
    queryset = BookingPeriod.objects.all()
    serializer_class = BookingPeriodSerializer

class BookingPeriodDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = BookingPeriod.objects.all()
    serializer_class = BookingPeriodSerializer
