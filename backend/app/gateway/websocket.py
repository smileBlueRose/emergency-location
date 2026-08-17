from fastapi import WebSocket
from typing import Any


class WebSocketGateway:
    __slots__ = ("connections",)

    def __init__(self) -> None:
        self.connections: dict[int, list[WebSocket]] = {}

    async def connect(self, request_id: int, websocket: WebSocket) -> None:
        await websocket.accept()
        self.connections.setdefault(request_id, []).append(websocket)

    def disconnect(self, request_id: int, websocket: WebSocket) -> None:
        connections = self.connections.get(request_id)
        if connections is None:
            return
        connections.remove(websocket)
        if not connections:
            del self.connections[request_id]


class LocationWebSocketGateway(WebSocketGateway):
    async def broadcast(self, request_id: int, data: dict[str, Any]) -> None:
        for websocket in self.connections.get(request_id, []):
            await websocket.send_json(data)


class PhotoWebSocketGateway(WebSocketGateway):
    async def broadcast(self, request_id: int, data: dict[str, Any]) -> None:
        for websocket in self.connections.get(request_id, []):
            await websocket.send_json(data)
