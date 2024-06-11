#booking/models.py
from django.db import models
from restaurant.models import Restaurant, Table

class Booking(models.Model):
    """
    Model representing a booking made by a guest at a restaurant.
    """
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('CONFIRMED', 'Confirmed'),
        ('SEATED', 'Seated'),
        ('CANCELLED', 'Cancelled'),
        ('COMPLETED', 'Completed'),
    ]

    guest_name = models.CharField(max_length=255, help_text="The name of the guest.")
    guest_phone = models.CharField(max_length=20, help_text="The phone number of the guest.")
    start = models.DateTimeField(help_text="The start date and time of the booking.")
    end = models.DateTimeField(help_text="The end date and time of the booking.", blank=True, null=True)
    guest_count = models.IntegerField(help_text="The number of guests.")
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='PENDING', help_text="The status of the booking.")
    notes = models.TextField(blank=True, null=True, help_text="Additional notes for the booking.")
    table = models.ForeignKey(Table, on_delete=models.CASCADE, help_text="The table reserved for this booking.")
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, help_text="The restaurant this booking belongs to.")

    def __str__(self):
        return f"Booking for {self.guest_name} on {self.start}"
    
    def calculate_booking_endtime(self):
        return self.start + self.restaurant.default_duration.duration
