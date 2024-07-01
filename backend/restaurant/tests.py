# restaurant/tests.py
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from user.models import User
from .models import Restaurant, Zone, Table, Vacation, BookingPeriod, DefaultBookingDuration
from datetime import datetime, time

class RestaurantTests(TestCase):
    
    def setUp(self):
        self.user = User.objects.create_user(email='testuser@example.com', password='12345')
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        self.restaurant = Restaurant.objects.create(name='TestRestaurant', user=self.user)

    def test_create_restaurant(self):
        self.restaurant.delete()
        response = self.client.post(reverse('restaurant-create'), {'name': 'New Restaurant'})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_get_restaurant_detail(self):
        response = self.client.get(reverse('restaurant-detail'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], self.restaurant.name)
    
    def test_update_restaurant(self):
        response = self.client.put(reverse('restaurant-detail'), {'name': 'Updated Restaurant'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Updated Restaurant')

    def test_delete_restaurant(self):
        response = self.client.delete(reverse('restaurant-detail'))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_restaurant_without_name(self):
        response = self.client.post(reverse('restaurant-create'), {'name': ''})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class ZoneTests(TestCase):
    
    def setUp(self):
        self.user = User.objects.create_user(email='testuser@example.com', password='12345')
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        self.restaurant = Restaurant.objects.create(name='Test Restaurant', user=self.user)
        self.zone = Zone.objects.create(name='Test Zone', bookable=True, restaurant=self.restaurant)

    def test_create_zone(self):
        response = self.client.post(reverse('zone-create'), {'name': 'New Zone', 'bookable': True})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_list_zones(self):
        response = self.client.get(reverse('zone-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_get_zone_detail(self):
        response = self.client.get(reverse('zone-detail', kwargs={'pk': self.zone.pk}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], self.zone.name)

    def test_update_zone(self):
        response = self.client.put(reverse('zone-detail', kwargs={'pk': self.zone.pk}), {'name': 'Updated Zone'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Updated Zone')

    def test_delete_zone(self):
        response = self.client.delete(reverse('zone-detail', kwargs={'pk': self.zone.pk}))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_zone_without_name(self):
        response = self.client.post(reverse('zone-create'), {'name': '', 'bookable': True})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class TableTests(TestCase):
    
    def setUp(self):
        self.user = User.objects.create_user(email='testuser@example.com', password='12345')
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        self.restaurant = Restaurant.objects.create(name='Test Restaurant', user=self.user)
        self.zone = Zone.objects.create(name='Test Zone', bookable=True, restaurant=self.restaurant)
        self.table = Table.objects.create(name='Table 1', capacity=4, bookable=True, zone=self.zone)

    def test_create_table(self):
        response = self.client.post(reverse('table-create'), {
            'name': 'New Table',
            'capacity': 4,
            'bookable': True,
            'zone': self.zone.pk
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_table_without_name(self):
        response = self.client.post(reverse('table-create'), {
            'name': '',
            'capacity': 4,
            'bookable': True,
            'zone': self.zone.pk
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_list_tables(self):
        response = self.client.get(reverse('table-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_get_table_detail(self):
        response = self.client.get(reverse('table-detail', kwargs={'pk': self.table.pk}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], self.table.name)
    
    def test_update_table(self):
        response = self.client.put(reverse('table-detail', kwargs={'pk': self.table.pk}), {
            'name': 'Updated Table',
            'capacity': 4,
            'bookable': True,
            'zone': self.zone.pk
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Updated Table')

    def test_delete_table(self):
        response = self.client.delete(reverse('table-detail', kwargs={'pk': self.table.pk}))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
    
    def test_table_without_capacity(self):
        response = self.client.post(reverse('table-create'), {
            'name': 'New Table',
            'capacity': '',
            'bookable': True,
            'zone': self.zone.pk
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_table_without_zone(self):
        response = self.client.post(reverse('table-create'), {
            'name': 'New Table',
            'capacity': 4,
            'bookable': True,
            'zone': ''
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_table_with_invalid_zone(self):
        response = self.client.post(reverse('table-create'), {
            'name': 'New Table',
            'capacity': 4,
            'bookable': True,
            'zone': 999
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

class VacationTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(email='testuser@example.com', password='12345')
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        self.restaurant = Restaurant.objects.create(name='Test Restaurant', user=self.user)
        self.vacation = Vacation.objects.create(start='2024-06-01', end='2024-06-10', restaurant=self.restaurant)

    def test_create_vacation(self):
        response = self.client.post(reverse('vacation-create'), {
            'start': '2024-07-01',
            'end': '2024-07-10'
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_list_vacations(self):
        response = self.client.get(reverse('vacation-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_get_vacation_detail(self):
        response = self.client.get(reverse('vacation-detail', kwargs={'pk': self.vacation.pk}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['start'], '2024-06-01')
    
    def test_update_vacation(self):
        response = self.client.put(reverse('vacation-detail', kwargs={'pk': self.vacation.pk}), {
            'start': '2024-06-02',
            'end': '2024-06-11'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['start'], '2024-06-02')
    
    def test_delete_vacation(self):
        response = self.client.delete(reverse('vacation-detail', kwargs={'pk': self.vacation.pk}))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
    
    def test_vacation_without_start_date(self):
        response = self.client.post(reverse('vacation-create'), {
            'start': '',
            'end': '2024-07-10'
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_vacation_without_end_date(self):
        response = self.client.post(reverse('vacation-create'), {
            'start': '2024-07-01',
            'end': ''
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_vacation_with_invalid_dates(self):
        response = self.client.post(reverse('vacation-create'), {
            'start': '2024-07-10',
            'end': '2024-07-01'
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_vacation_with_overlapping_dates(self):
        response = self.client.post(reverse('vacation-create'), {
            'start': '2024-06-05',
            'end': '2024-06-15'
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

class DefaultBookingDurationTests(TestCase):
    
    def setUp(self):
        self.user = User.objects.create_user(email='testuser@example.com', password='12345')
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        self.restaurant = Restaurant.objects.create(name='Test Restaurant', user=self.user)
        self.default_duration = DefaultBookingDuration.objects.create(
            duration='01:00:00', 
            restaurant=self.restaurant
        )

    def test_create_default_booking_duration(self):
        # Delete the existing default duration to avoid unique constraint violation
        self.default_duration.delete()
        
        response = self.client.post(reverse('default-duration-create'), {
            'duration': '02:00:00'
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    
    def test_get_default_booking_duration(self):
        response = self.client.get(reverse('default-duration-detail'))
        print(response.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['duration'], '01:00:00')
    
    def test_update_default_booking_duration(self):
        response = self.client.put(reverse('default-duration-detail'), {
            'duration': '03:00:00'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['duration'], '03:00:00')
    
    def test_delete_default_booking_duration(self):
        response = self.client.delete(reverse('default-duration-detail'))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
    
    def test_add_second_default_booking_duration(self):
        response = self.client.post(reverse('default-duration-create'), {
            'duration': '02:00:00'
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

class BookingPeriodTests(TestCase):
    
    def setUp(self):
        self.user = User.objects.create_user(email='testuser@example.com', password='12345')
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        self.restaurant = Restaurant.objects.create(name='Test Restaurant', user=self.user)
        self.default_duration = DefaultBookingDuration.objects.create(
            duration='01:00:00', 
            restaurant=self.restaurant
        )
        self.booking_period = BookingPeriod.objects.create(
            weekday='MO', 
            open='09:00:00', 
            close='17:00:00', 
            restaurant=self.restaurant
        )

    def test_create_booking_period_without_default_duration(self):
        self.default_duration.delete()
        response = self.client.post(reverse('booking-period-create'), {
            'weekday': 'TU',
            'open': '10:00:00',
            'close': '18:00:00'
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_booking_period(self):
        response = self.client.post(reverse('booking-period-create'), {
            'weekday': 'TU',
            'open': '10:00:00',
            'close': '18:00:00'
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_list_booking_periods(self):
        response = self.client.get(reverse('booking-period-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_get_booking_period_detail(self):
        response = self.client.get(reverse('booking-period-detail', kwargs={'pk': self.booking_period.pk}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['weekday'], self.booking_period.weekday)

    def test_update_booking_period(self):
        response = self.client.put(reverse('booking-period-detail', kwargs={'pk': self.booking_period.pk}), {
            'weekday': 'WE',
            'open': '10:00:00',
            'close': '18:00:00'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['open'], '10:00:00')
    
    def test_delete_booking_period(self):
        response = self.client.delete(reverse('booking-period-detail', kwargs={'pk': self.booking_period.pk}))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
    
    def test_booking_period_without_weekday(self):
        response = self.client.post(reverse('booking-period-create'), {
            'weekday': '',
            'open': '10:00:00',
            'close': '18:00:00'
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_booking_period_without_open_time(self):
        response = self.client.post(reverse('booking-period-create'), {
            'weekday': 'TU',
            'open': '',
            'close': '18:00:00'
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_booking_period_without_close_time(self):
        response = self.client.post(reverse('booking-period-create'), {
            'weekday': 'TU',
            'open': '10:00:00',
            'close': ''
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_booking_period_with_invalid_weekday(self):
        response = self.client.post(reverse('booking-period-create'), {
            'weekday': 'XX',
            'open': '10:00:00',
            'close': '18:00:00'
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_booking_period_with_invalid_open_time(self):
        response = self.client.post(reverse('booking-period-create'), {
            'weekday': 'TU',
            'open': '25:00:00',
            'close': '18:00:00'
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_booking_period_with_invalid_close_time(self):
        response = self.client.post(reverse('booking-period-create'), {
            'weekday': 'TU',
            'open': '10:00:00',
            'close': '25:00:00'
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_booking_period_with_invalid_open_and_close_times(self):
        response = self.client.post(reverse('booking-period-create'), {
            'weekday': 'TU',
            'open': '18:00:00',
            'close': '10:00:00'
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_booking_period_with_overlapping_times(self):
        response = self.client.post(reverse('booking-period-create'), {
            'weekday': 'MO',
            'open': '08:00:00',
            'close': '10:00:00'
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_booking_period_with_reversed_times(self):
        response = self.client.post(reverse('booking-period-create'), {
            'weekday': 'MO',
            'open': '18:00:00',
            'close': '10:00:00'
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
