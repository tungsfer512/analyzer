RabbitMQ_Config = dict(
    exchange='agent_exchange',
    queue='agent_queue',
    routing_key='agent_key',
    queue_arguments={'x-message-ttl': 600000}
)
