# Generated by Django 3.2.25 on 2024-06-11 19:52

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('restaurant', '0008_auto_20240611_1528'),
    ]

    operations = [
        migrations.AlterField(
            model_name='defaultbookingduration',
            name='restaurant',
            field=models.OneToOneField(help_text='The restaurant this default booking duration belongs to.', on_delete=django.db.models.deletion.CASCADE, to='restaurant.restaurant'),
        ),
    ]
