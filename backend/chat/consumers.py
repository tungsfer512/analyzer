# chat/consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer
import logging

logger = logging.getLogger(__name__)


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # print('connecting...')
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name
        # print(self.room_group_name)
        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        address = text_data_json['address']
        id = text_data_json['id']
        type = text_data_json.get('type', 'chat_message')
        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': type,
                'message': message,
                'id': id,
                'address': address,
            }
        )

    # Receive message from room group
    async def chat_message(self, event):
        message = event.get('message', None)
        address = event.get('address', None)
        id = event.get('id', None)
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message,
            'type': 'alerts',
            'id': id,
            'address': address,
        }))

    async def alert_check_norm(self, event):
        message = event.get('message', None)
        address = event.get('address', None)
        id = event.get('id', None)
        
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message,
            'type': 'alert_check_norm',
            'id': id,
            'address': address,
            
        }))

    async def alert_process(self, event):
        message = event.get('message', None)
        id = event.get('id', None)
        alert_id = event.get("alert_id", None)
        pid = event.get("pid", None)
        address = event.get('address', None)
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message,
            'type': 'alert_process',
            'id': id,
            "alert_id":alert_id,
            "pid":pid,
            'address': address,
        }))
        
    async def processlist_message(self, event):
        message = event.get('message', None)
        address = event.get('address', None)
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message,
            'type': 'processlist',
            'address': address,
        }))

    async def integrity_message(self, event):
        message = event.get('message', None)
        address = event.get('address', None)
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message,
            'type': 'integrity',
            'address': address,
        }))

    async def cmd_message(self, event):
        message = event.get('message', None)
        address = event.get('address', None)
        await self.send(text_data=json.dumps({
            'message': message,
            'type': 'cmd',
            'address': address,
        }))

    async def devices_message(self, event):
        message = event.get('message', None)
        address = event.get('address', None)
        await self.send(text_data=json.dumps({
            'message': message,
            'type': 'devices',
            'address': address,
        }))

    async def syscalllist_message(self, event):
        message = event.get('message', None)
        address = event.get('address', None)
        await self.send(text_data=json.dumps({
            'message': message,
            'type': 'syscall',
            'address': address,
        }))
