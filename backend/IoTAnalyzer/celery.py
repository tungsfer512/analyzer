import kombu
from kombu import Consumer, Exchange, Queue
from celery import bootsteps
from celery import Celery
import os
# from . import config

# set the default Django settings module for the 'celery' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'IoTAnalyzer.settings')

RABBITMQ_DEFAULT_USER = os.environ.get("RABBITMQ_DEFAULT_USER")
RABBITMQ_DEFAULT_PASS = os.environ.get("RABBITMQ_DEFAULT_PASS")
RABBIT_HOST_NAME = os.environ.get("RABBIT_HOST_NAME")
BROKER_URL = f'amqp://{RABBITMQ_DEFAULT_USER}:{RABBITMQ_DEFAULT_PASS}@{RABBIT_HOST_NAME}:5672/'
# print(BROKER_URL)
app = Celery('IoTAnalyzer', broker=BROKER_URL)

# print(app)
# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes.
# - namespace='CELERY' means all celery-related configuration keys
#   should have a `CELERY_` prefix.
app.config_from_object('django.conf:settings', namespace='CELERY')

# Load task modules from all registered Django app configs.
app.autodiscover_tasks()

# setting publisher
# with app.pool.acquire(block=True) as conn:
#     exchange = kombu.Exchange(
#         name=config.RabbitMQ_Config['exchange'],
#         type='direct',
#         durable=True,
#         channel=conn,
#     )
#     exchange.declare()
#     queue = kombu.Queue(
#         name=config.RabbitMQ_Config['queue'],
#         exchange=exchange,
#         routing_key=config.RabbitMQ_Config['routing_key'],
#         channel=conn,
#         message_ttl=600,
#         queue_arguments={
#             'x-queue-type': 'classic'
#         },
#         durable=True
#     )
#     queue.declare()

# setting consumer class


# class MyConsumerStep(bootsteps.ConsumerStep):
#     def get_consumers(self, channel):
#         return [kombu.Consumer(channel,
#                                queues=[queue],
#                                callbacks=[self.handle_message],
#                                accept=['json'])]

#     def handle_message(self, body, message):
#         print('Received message: {0!r}'.format(body))
#         message.ack()


# # Register the custom consumer
# app.steps['consumer'].add(MyConsumerStep)


@app.task(bind=True)
def debug_task(self):
    print(f'Request: {self.request!r}')
