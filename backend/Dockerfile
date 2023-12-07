FROM python:3.8-slim-buster
ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1

ARG DJANGO_ALLOWED_HOSTS
ARG DJANGO_SECRET_KEY
ARG DJANGO_CORS_ORIGIN_WHITELIST

ENV DJANGO_ALLOWED_HOSTS $DJANGO_ALLOWED_HOSTS
ENV DJANGO_SECRET_KEY $DJANGO_SECRET_KEY
ENV DJANGO_CORS_ORIGIN_WHITELIST $DJANGO_CORS_ORIGIN_WHITELIST

RUN apt-get update && apt-get install -y gcc python3-dev musl-dev  libffi-dev libpython3-dev pkg-config libcairo2-dev libjpeg-dev libgif-dev
RUN mkdir /backend
WORKDIR /backend
RUN pip install --upgrade pip

RUN pip install pipenv
COPY Pipfile /backend/
RUN pipenv lock 
# RUN pipenv run pip freeze > requirements.txt
RUN pipenv requirements > requirements.txt

# COPY requirements.txt /backend/
RUN pip install -r requirements.txt
RUN pip install elasticsearch

# copy entrypoint.sh
COPY ./entrypoint.sh /backend

COPY . /backend/

RUN ["chmod", "+x", "/backend/entrypoint.sh"]
RUN DEBIAN_FRONTEND=noninteractive apt-get install -y tshark
# RUN apt-get install python3-pip && pip install --upgrade pip
# RUN apt-get install python-dev libxml2-dev libxslt1-dev antiword unrtf poppler-utils pstotext tesseract-ocr flac ffmpeg lame libmad0 libsox-fmt-mp3 sox libjpeg-dev swig
RUN pip install textract
# RUN pip install python-telegram-bot
RUN pip install distro
# RUN pip install elasticsearch

EXPOSE 8080
# RUN python manage.py collectstatic --noinput
# RUN python manage.py makemigrations
# RUN python manage.py migrate