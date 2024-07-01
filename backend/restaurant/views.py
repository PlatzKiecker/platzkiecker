from django.shortcuts import render
from rest_framework import generics
from .models import Restaurant, Zone, Table, Vacation, BookingPeriod, DefaultBookingDuration
from .serializers import RestaurantSerializer, ZoneSerializer, TableSerializer, VacationSerializer, BookingPeriodSerializer, DefaultBookingDurationSerializer
from rest_framework.permissions import IsAuthenticated


class RestaurantCreateView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = RestaurantSerializer
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class RestaurantDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Restaurant.objects.all()
    serializer_class = RestaurantSerializer

    def get_object(self):
        user = self.request.user
        print("USER: ", user.pk)
        return Restaurant.objects.get(user=user.pk)


class ZoneCreateView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Zone.objects.all()
    serializer_class = ZoneSerializer

    def perform_create(self, serializer):
        serializer.save(restaurant=self.request.user.restaurant)


class ZoneListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Zone.objects.all()
    serializer_class = ZoneSerializer

    def get_queryset(self):
        user = self.request.user
        return Zone.objects.filter(restaurant__user=user.pk)


class ZoneDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ZoneSerializer

    def get_queryset(self):
        user = self.request.user
        return Zone.objects.filter(restaurant__user=user.pk)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['tables'] = Table.objects.filter(zone__restaurant__user=self.request.user)
        return context
    

class TableCreateView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = TableSerializer

    def get_queryset(self):
        user = self.request.user
        return Table.objects.filter(zone__restaurant__user=user)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['zones'] = Zone.objects.filter(restaurant__user=self.request.user)
        return context
    

class TableListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Table.objects.all()
    serializer_class = TableSerializer

    def get_queryset(self):
        user = self.request.user
        return Table.objects.filter(zone__restaurant__user=user.pk)


class TableDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
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
    permission_classes = [IsAuthenticated]
    serializer_class = VacationSerializer

    def perform_create(self, serializer):
        serializer.save(restaurant=self.request.user.restaurant)


class VacationListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Vacation.objects.all()
    serializer_class = VacationSerializer

    def get_queryset(self):
        user = self.request.user
        return Vacation.objects.filter(restaurant__user=user.pk)


class VacationDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = VacationSerializer

    def get_queryset(self):
        return Vacation.objects.filter(restaurant__user=self.request.user)


class DefaultBookingDurationCreateView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = DefaultBookingDurationSerializer

    def perform_create(self, serializer):
        serializer.save(restaurant=self.request.user.restaurant)

class DefaultBookingDurationDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = DefaultBookingDurationSerializer

    def get_queryset(self):
        return DefaultBookingDuration.objects.filter(restaurant__user=self.request.user)


class BookingPeriodCreateView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = BookingPeriod.objects.all()
    serializer_class = BookingPeriodSerializer

    def perform_create(self, serializer):
        serializer.save(restaurant=self.request.user.restaurant)

    def get_queryset(self):
        user = self.request.user
        return BookingPeriod.objects.filter(restaurant__user=user)


class BookingPeriodListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    queryset = BookingPeriod.objects.all()
    serializer_class = BookingPeriodSerializer

    def get_queryset(self):
        user = self.request.user
        return BookingPeriod.objects.filter(restaurant__user=user.pk)    


class BookingPeriodDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = BookingPeriod.objects.all()
    serializer_class = BookingPeriodSerializer
        
    def get_queryset(self):
        user = self.request.user
        return BookingPeriod.objects.filter(restaurant__user=user.pk)