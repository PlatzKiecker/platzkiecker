# booking/tests.py
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from user.models import User
from restaurant.models import Restaurant, Table, BookingPeriod, DefaultBookingDuration, Vacation, Zone
from .models import Booking
from datetime import datetime, timedelta, time
from django.utils import timezone

class BookingTests(TestCase):
    
    def setUp(self):
        self.user = User.objects.create_user(email='testuser@example.com', password='12345')
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        self.restaurant = Restaurant.objects.create(name='Test Restaurant', user=self.user)
        self.zone = Zone.objects.create(name='Test Zone', bookable=True, restaurant=self.restaurant)
        self.table = Table.objects.create(name='Table 1', capacity=4, bookable=True, zone=self.zone)
        self.default_duration = DefaultBookingDuration.objects.create(
            duration=time(hour=1), 
            restaurant=self.restaurant
        )
        self.booking_period = BookingPeriod.objects.create(
            weekday='MO', 
            open='09:00:00', 
            close='17:00:00', 
            restaurant=self.restaurant
        )

    def test_create_booking(self):
        start_time = (timezone.localtime() + timedelta(days=7 - timezone.localtime().weekday())).replace(hour=10, minute=0, second=0, microsecond=0)
        response = self.client.post(reverse('booking-create', kwargs={'restaurant_id': self.restaurant.id}), {
            'guest_name': 'John Doe',
            'guest_phone': '1234567890',
            'start': start_time.strftime('%Y-%m-%dT%H:%M:%S'),
            'guest_count': 4,
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_list_bookings(self):
        Booking.objects.create(
            guest_name='John Doe',
            guest_phone='1234567890',
            start=(timezone.localtime() + timedelta(days=7 - timezone.localtime().weekday())).replace(hour=10, minute=0, second=0, microsecond=0),
            guest_count=4,
            table=self.table,
            restaurant=self.restaurant
        )
        response = self.client.get(reverse('booking-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.json()), 1)

    def test_get_booking_detail(self):
        booking = Booking.objects.create(
            guest_name='John Doe',
            guest_phone='1234567890',
            start=(timezone.localtime() + timedelta(days=7 - timezone.localtime().weekday())).replace(hour=10, minute=0, second=0, microsecond=0),
            guest_count=4,
            table=self.table,
            restaurant=self.restaurant
        )
        response = self.client.get(reverse('booking-detail', kwargs={'pk': booking.pk}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()['guest_name'], booking.guest_name)

    def test_available_days(self):
        start_day = timezone.localtime().strftime('%Y-%m-%d')
        response = self.client.get(reverse('available-days', kwargs={'restaurant_id': self.restaurant.id}), {'start_day': start_day, 'guest_count': 4})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('available_days', response.json())

    def test_available_time_slots(self):
        start_day = (timezone.localtime() + timedelta(days=7 - timezone.localtime().weekday())).strftime('%Y-%m-%d')
        response = self.client.get(reverse('available-timeslots', kwargs={'restaurant_id': self.restaurant.id}), {'day': start_day, 'guest_count': 4})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('free_slots', response.json())

class BookingEdgeCaseTests(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(email='testuser@example.com', password='12345')
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        self.restaurant = Restaurant.objects.create(name='Test Restaurant', user=self.user)
        self.zone = Zone.objects.create(name='Test Zone', bookable=True, restaurant=self.restaurant)
        self.table = Table.objects.create(name='Table 1', capacity=4, bookable=True, zone=self.zone)
        self.default_duration = DefaultBookingDuration.objects.create(
            duration=time(hour=1), 
            restaurant=self.restaurant
        )
        self.booking_period = BookingPeriod.objects.create(
            weekday='MO', 
            open='09:00:00', 
            close='17:00:00', 
            restaurant=self.restaurant
        )
        self.booking_period = BookingPeriod.objects.create(
            weekday='SU',
            open='09:00:00',
            close='17:00:00',
            restaurant=self.restaurant
        )
        self.vacation = Vacation.objects.create(
            start=(timezone.localtime() + timedelta(days=7 - timezone.localtime().weekday())).date(),
            end=(timezone.localtime() + timedelta(days=8 - timezone.localtime().weekday())).date(),
            restaurant=self.restaurant
        )

    def test_create_booking_with_past_start_time(self):
        start_time = (timezone.localtime() - timedelta(days=1)).replace(hour=10, minute=0, second=0, microsecond=0)
        response = self.client.post(reverse('booking-create', kwargs={'restaurant_id': self.restaurant.id}), {
            'guest_name': 'John Doe',
            'guest_phone': '1234567890',
            'start': start_time.strftime('%Y-%m-%dT%H:%M:%S'),
            'guest_count': 4,
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('start', response.json())

    def test_create_booking_with_invalid_guest_count(self):
        start_time = (timezone.localtime() + timedelta(days=6 - timezone.localtime().weekday())).replace(hour=10, minute=0, second=0, microsecond=0)
        response = self.client.post(reverse('booking-create', kwargs={'restaurant_id': self.restaurant.id}), {
            'guest_name': 'John Doe',
            'guest_phone': '1234567890',
            'start': start_time.strftime('%Y-%m-%dT%H:%M:%S'),
            'guest_count': 10,
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('guest_count', response.json())

    def test_create_booking_without_15_minute_interval(self):
        start_time = (timezone.localtime() + timedelta(days=7 - timezone.localtime().weekday())).replace(hour=10, minute=7, second=0, microsecond=0)
        response = self.client.post(reverse('booking-create', kwargs={'restaurant_id': self.restaurant.id}), {
            'guest_name': 'John Doe',
            'guest_phone': '1234567890',
            'start': start_time.strftime('%Y-%m-%dT%H:%M:%S'),
            'guest_count': 4,
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('start', response.json())
    
    def test_create_booking_during_vacation(self):
        start_time = (timezone.localtime() + timedelta(days=7 - timezone.localtime().weekday())).replace(hour=10, minute=0, second=0, microsecond=0)
        response = self.client.post(reverse('booking-create', kwargs={'restaurant_id': self.restaurant.id}), {
            'guest_name': 'Jane Doe',
            'guest_phone': '0987654321',
            'start': start_time.strftime('%Y-%m-%dT%H:%M:%S'),
            'guest_count': 4,
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('start', response.json())

    def test_create_booking_outside_booking_period(self):
        start_time = (timezone.localtime() + timedelta(days=7 - timezone.localtime().weekday())).replace(hour=18, minute=0, second=0, microsecond=0)
        response = self.client.post(reverse('booking-create', kwargs={'restaurant_id': self.restaurant.id}), {
            'guest_name': 'Jane Doe',
            'guest_phone': '0987654321',
            'start': start_time.strftime('%Y-%m-%dT%H:%M:%S'),
            'guest_count': 4,
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('start', response.json())

    def test_create_overlapping_booking(self):
        start_time = (timezone.localtime() + timedelta(days=7 - timezone.localtime().weekday())).replace(hour=10, minute=0, second=0, microsecond=0)
        Booking.objects.create(
            guest_name='John Smith',
            guest_phone='1234567890',
            start=start_time,
            end=start_time + timedelta(hours=1),
            guest_count=4,
            status='PENDING',
            table=self.table,
            restaurant=self.restaurant
        )
        response = self.client.post(reverse('booking-create', kwargs={'restaurant_id': self.restaurant.id}), {
            'guest_name': 'Jane Doe',
            'guest_phone': '0987654321',
            'start': start_time.strftime('%Y-%m-%dT%H:%M:%S'),
            'guest_count': 4,
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('start', response.json())
