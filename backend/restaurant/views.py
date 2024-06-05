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

    def get_queryset(self):
        user = self.request.user
        return Restaurant.objects.filter(user=user.pk)


class ZoneCreateView(generics.CreateAPIView):
    queryset = Zone.objects.all()
    serializer_class = ZoneSerializer

class ZoneListView(generics.ListAPIView):
    queryset = Zone.objects.all()
    serializer_class = ZoneSerializer

    def get_queryset(self):
        user = self.request.user
        return Zone.objects.filter(restaurant__user=user.pk)

class ZoneDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Zone.objects.all()
    serializer_class = ZoneSerializer

    def get_queryset(self):
        user = self.request.user
        return Zone.objects.filter(restaurant__user=user.pk)

class TableCreateView(generics.CreateAPIView):
    queryset = Table.objects.all()
    serializer_class = TableSerializer

class TableListView(generics.ListAPIView):
    queryset = Table.objects.all()
    serializer_class = TableSerializer

    def get_queryset(self):
        user = self.request.user
        return Table.objects.filter(zone__restaurant__user=user.pk)
    
class TableDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Table.objects.all()
    serializer_class = TableSerializer

    def get_queryset(self):
        user = self.request.user
        return Table.objects.filter(zone__restaurant__user=user.pk)

class VacationCreateView(generics.CreateAPIView):
    queryset = Vacation.objects.all()
    serializer_class = VacationSerializer

class VacationListView(generics.ListAPIView):
    queryset = Vacation.objects.all()
    serializer_class = VacationSerializer

    def get_queryset(self):
        user = self.request.user
        return Vacation.objects.filter(restaurant__user=user.pk)
    
class VacationDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Vacation.objects.all()
    serializer_class = VacationSerializer

    def get_queryset(self):
        user = self.request.user
        return Vacation.objects.filter(restaurant__user=user.pk)

class BookingPeriodCreateView(generics.CreateAPIView):
    queryset = BookingPeriod.objects.all()
    serializer_class = BookingPeriodSerializer

class BookingPeriodListView(generics.ListAPIView):
    queryset = BookingPeriod.objects.all()
    serializer_class = BookingPeriodSerializer

    def get_queryset(self):
        user = self.request.user
        return BookingPeriod.objects.filter(restaurant__user=user.pk)
    
class BookingPeriodDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = BookingPeriod.objects.all()
    serializer_class = BookingPeriodSerializer
        
    def get_queryset(self):
        user = self.request.user
        return BookingPeriod.objects.filter(restaurant__user=user.pk)
