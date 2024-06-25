# user/tests.py
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from .models import User

class UserTests(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.user_data = {
            'email': 'testuser@example.com',
            'password': 'testpassword123'
        }
        self.user = User.objects.create_user(**self.user_data)

    def test_register_user(self):
        response = self.client.post(reverse('register'), {
            'email': 'newuser@example.com',
            'password': 'newpassword123'
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('email', response.data)

    def test_login_user(self):
        response = self.client.post(reverse('login'), self.user_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('message', response.data)
        self.assertEqual(response.data['message'], 'Logged in successfully')

    def test_logout_user(self):
        self.client.login(email=self.user_data['email'], password=self.user_data['password'])
        response = self.client.get(reverse('logout'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

class EdgeCaseTests(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.user_data = {
            'email': 'testuser@example.com',
            'password': 'testpassword123'
        }
        self.user = User.objects.create_user(**self.user_data)

    def test_register_user_with_invalid_email(self):
        client = APIClient()
        response = client.post(reverse('register'), {
            'email': 'invalidemail',
            'password': 'password123'
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_user_with_existing_email(self):
        response = self.client.post(reverse('register'), self.user_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_user_with_short_password(self):
        client = APIClient()
        response = client.post(reverse('register'), {
            'email': 'testuser1@example.com',
            'password': '123'
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_register_user_with_no_password(self):
        client = APIClient()
        response = client.post(reverse('register'), {
            'email': 'testuser1@example.com',
            'password': ''
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_user_with_invalid_credentials(self):
        response = self.client.post(reverse('login'), {
            'email': 'wronguser@example.com',
            'password': 'wrongpassword'
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_user_with_no_email(self):
        response = self.client.post(reverse('login'), {
            'email': '',
            'password': 'password123'
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_login_user_with_no_password(self):
        response = self.client.post(reverse('login'), {
            'email': 'wrongpassword@example.com',
            'password': ''
        })