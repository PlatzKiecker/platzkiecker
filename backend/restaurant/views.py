# restaurant/views.py
from django.shortcuts import render
from rest_framework import generics
from .models import Restaurant, Zone, Table, Vacation, BookingPeriod
from .serializers import RestaurantSerializer, ZoneSerializer, TableSerializer, VacationSerializer, BookingPeriodSerializer
from rest_framework.permissions import IsAuthenticated

class RestaurantCreateView(generics.CreateAPIView):
    authentication_classes = [IsAuthenticated]
    serializer_class = RestaurantSerializer
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class RestaurantDetailView(generics.RetrieveUpdateDestroyAPIView):
    authentication_classes = [IsAuthenticated]
    queryset = Restaurant.objects.all()
    serializer_class = RestaurantSerializer

    def get_object(self):
        user = self.request.user
        return Restaurant.objects.get(user=user.pk)


class ZoneCreateView(generics.CreateAPIView):
    authentication_classes = [IsAuthenticated]
    queryset = Zone.objects.all()
    serializer_class = ZoneSerializer

    def perform_create(self, serializer):
        serializer.save(restaurant=self.request.user.restaurant)

class ZoneListView(generics.ListAPIView):
    authentication_classes = [IsAuthenticated]
    queryset = Zone.objects.all()
    serializer_class = ZoneSerializer

    def get_queryset(self):
        user = self.request.user
        return Zone.objects.filter(restaurant__user=user.pk)

class ZoneDetailView(generics.RetrieveUpdateDestroyAPIView):
    authentication_classes = [IsAuthenticated]
    serializer_class = ZoneSerializer

    def get_queryset(self):
        user = self.request.user
        return Zone.objects.filter(restaurant__user=user.pk)

class TableCreateView(generics.CreateAPIView):
    authentication_classes = [IsAuthenticated]
    serializer_class = TableSerializer

    def get_queryset(self):
        user = self.request.user
        return Table.objects.filter(zone__restaurant__user=user)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['zones'] = Zone.objects.filter(restaurant__user=self.request.user)
        return context
    

class TableListView(generics.ListAPIView):
    authentication_classes = [IsAuthenticated]
    queryset = Table.objects.all()
    serializer_class = TableSerializer

    def get_queryset(self):
        user = self.request.user
        return Table.objects.filter(zone__restaurant__user=user.pk)
    
class TableDetailView(generics.RetrieveUpdateDestroyAPIView):
    authentication_classes = [IsAuthenticated]
    queryset = Table.objects.all()
    serializer_class = TableSerializer

    def get_queryset(self):
        user = self.request.user
        return Table.objects.filter(zone__restaurant__user=user)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['zones'] = Zone.objects.filter(restaurant__user=self.request.user)
        return context

class VacationCreateView(generics.CreateAPIView):
    authentication_classes = [IsAuthenticated]
    queryset = Vacation.objects.all()
    serializer_class = VacationSerializer

    def perform_create(self, serializer):
        serializer.save(restaurant=self.request.user.restaurant)


class VacationListView(generics.ListAPIView):
    authentication_classes = [IsAuthenticated]
    queryset = Vacation.objects.all()
    serializer_class = VacationSerializer

    def get_queryset(self):
        user = self.request.user
        return Vacation.objects.filter(restaurant__user=user.pk)
    
class VacationDetailView(generics.RetrieveUpdateDestroyAPIView):
    authentication_classes = [IsAuthenticated]
    queryset = Vacation.objects.all()
    serializer_class = VacationSerializer

    def get_queryset(self):
        user = self.request.user
        return Vacation.objects.filter(restaurant__user=user.pk)

class BookingPeriodCreateView(generics.CreateAPIView):
    authentication_classes = [IsAuthenticated]
    queryset = BookingPeriod.objects.all()
    serializer_class = BookingPeriodSerializer

    def perform_create(self, serializer):
        serializer.save(restaurant=self.request.user.restaurant)

class BookingPeriodListView(generics.ListAPIView):
    authentication_classes = [IsAuthenticated]
    queryset = BookingPeriod.objects.all()
    serializer_class = BookingPeriodSerializer

    def get_queryset(self):
        user = self.request.user
        return BookingPeriod.objects.filter(restaurant__user=user.pk)
    
class BookingPeriodDetailView(generics.RetrieveUpdateDestroyAPIView):
    authentication_classes = [IsAuthenticated]
    queryset = BookingPeriod.objects.all()
    serializer_class = BookingPeriodSerializer
        
    def get_queryset(self):
        user = self.request.user
        return BookingPeriod.objects.filter(restaurant__user=user.pk)
