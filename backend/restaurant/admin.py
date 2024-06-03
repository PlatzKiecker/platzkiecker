from django.contrib import admin
from .models import Restaurant, Zone, Table, Vacation, BookingPeriod

admin.site.register(Restaurant)
admin.site.register(Zone)
admin.site.register(Table)
admin.site.register(Vacation)
admin.site.register(BookingPeriod)
