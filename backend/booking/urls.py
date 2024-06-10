# booking/urls.py
from django.urls import path
from .views import BookingCreateView, BookingListView, BookingDetailView

urlpatterns = [
    path('bookings/<int:restaurant_id>/', BookingCreateView.as_view(), name='booking-create'),
    path('bookings/list/', BookingListView.as_view(), name='booking-list'),
    path('bookings/detail/<int:pk>/', BookingDetailView.as_view(), name='booking-detail'),
]