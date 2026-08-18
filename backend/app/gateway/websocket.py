from fastapi import WebSocket
from typing import Any
from core.interfaces import WebSocketGateway


class RequestWebSocketGateway(WebSocketGateway[int, Any]):
    __slots__ = ("connections",)

    def __init__(self) -> None:
        self.connections: dict[int, list[WebSocket]] = {}

    async def connect(self, key: int, websocket: WebSocket) -> None:
        """
        :param key: request_id integer
        :param websocket: fastapi.WebSocket
        """
        await websocket.accept()
        self.connections.setdefault(key, []).append(websocket)

    def disconnect(self, key: int, websocket: WebSocket) -> None:
        """
        :param key: request_id integer
        :param websocket: fastapi.WebSocket
        """
        connections = self.connections.get(key)
        if connections is None:
            return
        connections.remove(websocket)
        if not connections:
            del self.connections[key]

    async def broadcast(self, key: int, data: dict[str, str]) -> None:
        raise NotImplementedError()


class LocationWebSocketGateway(RequestWebSocketGateway):
    async def broadcast(self, key: int, data: dict[str, Any]) -> None:
        for websocket in self.connections.get(key, []):
            await websocket.send_json(data)


class PhotoWebSocketGateway(RequestWebSocketGateway):
    async def broadcast(self, key: int, data: dict[str, Any]) -> None:
        for websocket in self.connections.get(key, []):
            await websocket.send_json(data)
