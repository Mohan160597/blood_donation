from channels.generic.websocket import AsyncWebsocketConsumer
import json

class BloodRequestConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

    async def receive(self, text_data):
        # Handle the notification (text_data will be the blood request info)
        data = json.loads(text_data)
        blood_request_info = data.get('message')

        # Send notification to connected clients
        await self.send(text_data=json.dumps({
            'message': blood_request_info
        }))
