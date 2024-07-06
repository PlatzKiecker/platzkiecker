#!/bin/sh

echo " ____  _  __ "
echo "|  _ \| |/ / "
echo "| |_) | ' /  "
echo "|  __/| . \  "
echo "|_|   |_|\_\ "

if [ "$DATABASE" = "postgres" ]
then
    echo "Waiting for postgres..."

    while ! nc -z $SQL_HOST $SQL_PORT; do
      sleep 0.1
    done

    echo "PostgreSQL started"
fi

# Collect static files
python manage.py collectstatic --no-input

exec "$@"