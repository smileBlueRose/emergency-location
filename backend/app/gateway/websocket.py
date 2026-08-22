import asyncio
from typing import Any
from fastapi import WebSocket
from core.interfaces import WebSocketGateway


class RequestWebSocketGateway(WebSocketGateway[int, Any]):
    __slots__ = ("connections",)

    def __init__(self) -> None:
        self.connections: dict[int, list[WebSocket]] = {}

    async def connect(self, key: int, websocket: WebSocket) -> None:
        await websocket.accept()
        self.connections.setdefault(key, []).append(websocket)

    def disconnect(self, key: int, websocket: WebSocket) -> None:
        connections = self.connections.get(key)
        if connections is None:
            return
        if websocket in connections:
            connections.remove(websocket)
        if not connections:
            del self.connections[key]

    async def broadcast(self, key: int, data: dict[str, Any]) -> None:
        targets = list(self.connections.get(key, []))
        if not targets:
            return

        async def _safe_send(ws: WebSocket):
            try:
                await ws.send_json(data)
            except Exception:
                self.disconnect(key, ws)

        await asyncio.gather(*[_safe_send(ws) for ws in targets])


class LocationWebSocketGateway(RequestWebSocketGateway):
    pass


class PhotoWebSocketGateway(RequestWebSocketGateway):
    pass
