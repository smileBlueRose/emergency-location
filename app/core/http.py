from httpx import AsyncClient


class AsyncClientProvider:
    def __init__(self) -> None:
        self._client: AsyncClient | None = None

    async def get_client(self) -> AsyncClient:
        if self._client is None:
            self._client = AsyncClient()
        return self._client

    async def close(self) -> None:
        if self._client is not None:
            await self._client.aclose()
            self._client = None


client_provider = AsyncClientProvider()
