#!/bin/sh

python manage.py test user
python manage.py test restaurant
python manage.py test booking

exec "$@"