# Create your tasks here
from __future__ import absolute_import, unicode_literals

from celery import shared_task

from IoTAnalyzer import config

from IoTAnalyzer.celery import app


@shared_task
def publish_message(message):
    with app.producer_pool.acquire(block=True) as producer:
        # print(producer)
        producer.publish(
            message,
            exchange=config.RabbitMQ_Config['exchange'],
            routing_key=config.RabbitMQ_Config['routing_key'],
        )
