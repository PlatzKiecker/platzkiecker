#!/bin/sh

if [ "$DATABASE" = "postgres" ]
then
    echo "Waiting for postgres..."

    while ! nc -z $SQL_HOST $SQL_PORT; do
      sleep 0.1
    done

    echo "PostgreSQL started"
fi

# Database migrations
python manage.py flush --no-input
python manage.py makemigrations user
python manage.py makemigrations restaurant
python manage.py makemigrations booking
python manage.py migrate

# Integration Tests
python manage.py test user
python manage.py test restaurant
python manage.py test booking

# Create superuser
python manage.py createsuperuser --noinput

exec "$@"