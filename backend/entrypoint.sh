#!/bin/sh

if [ "$DATABASE" = "postgres" ]
then
    echo "Waiting for postgres..."

    while ! nc -z $SQL_HOST $SQL_PORT; do
      sleep 0.1
    done

    echo "PostgreSQL started"
fi

echo "Starting Migrate db .."

# python manage.py flush --no-input
python manage.py makemigrations
python manage.py migrate
python manage.py loaddata initial_auth_user_data.json
echo "Load user db .."
python manage.py loaddata initial_auth_group_data.json
echo "Load group db .."
python manage.py loaddata initial_auth_user_groups_data.json
echo "Load user_groups db .."
python manage.py loaddata initial_menus_data.json
echo "Load menus db .."
python manage.py loaddata initial_group_menus_data.json
echo "Load group_menus db .."

echo "Migrate db done.."
exec "$@"