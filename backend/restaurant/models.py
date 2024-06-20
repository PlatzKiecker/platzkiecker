#restaurant/models.py
from django.db import models
from user.models import User

class Restaurant(models.Model):
    """
    Model representing a restaurant.
    """
    name = models.CharField(max_length=255, help_text="The name of the restaurant.")
    user = models.OneToOneField(User, on_delete=models.CASCADE, help_text="The user managing this restaurant.")

    def __str__(self):
        return self.name


class Zone(models.Model):
    """
    Model representing a zone within a restaurant.
    """
    name = models.CharField(max_length=255, help_text="The name of the zone.")
    bookable = models.BooleanField(default=False, help_text="Indicates if the zone is bookable.")
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, help_text="The restaurant this zone belongs to.")

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if not self.bookable:
            Table.objects.filter(zone=self).update(bookable=False)

class Table(models.Model):
    """
    Model representing a table within a zone.
    """
    name = models.CharField(null=True, max_length=255, help_text="The name of the table.")
    capacity = models.IntegerField(help_text="The number of seats at the table.")
    bookable = models.BooleanField(default=False, help_text="Indicates if the table is bookable.")
    combinable = models.BooleanField(default=False, help_text="Indicates if the table can be combined with others.")
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE, help_text="The zone this table belongs to.")

    def __str__(self):
        return f"Table {self.id} (Capacity: {self.capacity})"

class Vacation(models.Model):
    """
    Model representing a vacation period for a restaurant.
    """
    start = models.DateField(help_text="The start date and time of the vacation.")
    end = models.DateField(help_text="The end date and time of the vacation.")
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name='vacations', help_text="The restaurant this vacation belongs to.")

    def __str__(self):
        return f"Vacation from {self.start} to {self.end}"

class BookingPeriod(models.Model):
    """
    Model representing booking periods for a restaurant.
    """
    WEEKDAYS = [
        ('MO', 'Monday'),
        ('TU', 'Tuesday'),
        ('WE', 'Wednesday'),
        ('TH', 'Thursday'),
        ('FR', 'Friday'),
        ('SA', 'Saturday'),
        ('SU', 'Sunday'),
    ]

    weekday = models.CharField(max_length=2, choices=WEEKDAYS, help_text="The day of the week.")
    open = models.TimeField(help_text="The opening time for bookings.")
    close = models.TimeField(help_text="The closing time for bookings.")
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, help_text="The restaurant this booking period belongs to.")

    def __str__(self):
        return f"{self.weekday} ({self.open} - {self.close})"
    
    def get_default_duration(self):
        return self.default_duration

class DefaultBookingDuration(models.Model):
    """
    Model representing the default duration for bookings.
    """
    duration = models.TimeField(help_text="The default duration for bookings.")
    restaurant = models.OneToOneField(Restaurant, on_delete=models.CASCADE, help_text="The restaurant this default booking duration belongs to.")

    def __str__(self):
        return f"Default Booking Duration: {self.duration}"