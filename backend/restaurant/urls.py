# restaurant/urls.py
from django.urls import path
from .views import (
    RestaurantCreateView,
    RestaurantDetailView,
    ZoneCreateView,
    ZoneListView,
    ZoneDetailView,
    TableCreateView,
    TableListView,
    TableDetailView,
    VacationCreateView,
    VacationListView,
    VacationDetailView,
    BookingPeriodCreateView,
    BookingPeriodListView,
    BookingPeriodDetailView,
)

urlpatterns = [
    path('restaurants/', RestaurantCreateView.as_view(), name='restaurant-create'),
    path('restaurants/<int:pk>/', RestaurantDetailView.as_view(), name='restaurant-detail'),
    path('zones/', ZoneCreateView.as_view(), name='zone-create'),
    path('zones/list/', ZoneListView.as_view(), name='zone-list'),
    path('zones/<int:pk>/', ZoneDetailView.as_view(), name='zone-detail'),
    path('tables/', TableCreateView.as_view(), name='table-create'),
    path('tables/list/', TableListView.as_view(), name='table-list'),
    path('tables/<int:pk>/', TableDetailView.as_view(), name='table-detail'),
    path('vacations/', VacationCreateView.as_view(), name='vacation-create'),
    path('vacations/list/', VacationListView.as_view(), name='vacation-list'),
    path('vacations/<int:pk>/', VacationDetailView.as_view(), name='vacation-detail'),
    path('booking-periods/', BookingPeriodCreateView.as_view(), name='booking-period-create'),
    path('booking-periods/list/', BookingPeriodListView.as_view(), name='booking-period-list'),
    path('booking-periods/<int:pk>/', BookingPeriodDetailView.as_view(), name='booking-period-detail'),
]