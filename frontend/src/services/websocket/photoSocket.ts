export interface PhotoSocketMessage {
  id: number;
  url: string;
}

function getWebSocketBaseUrl() {
  const apiUrl =
    import.meta.env.VITE_API_URL ||
    'http://localhost:8080';

  return apiUrl
    .replace(/^https:\/\//, 'wss://')
    .replace(/^http:\/\//, 'ws://');
}

export function connectPhotoSocket(
  requestId: number,
  onPhoto: (
    photo: PhotoSocketMessage,
  ) => void,
) {
  const socket = new WebSocket(
    `${getWebSocketBaseUrl()}/api/v1/photo/photo-shares/ws/${requestId}`,
  );

  socket.onopen = () => {
    console.log(
      `Photo WebSocket connected for request ${requestId}`,
    );
  };

  socket.onmessage = (event) => {
    try {
      const message =
        JSON.parse(
          event.data,
        ) as PhotoSocketMessage;

      console.log(
        'Photo WebSocket message:',
        message,
      );

      onPhoto(message);
    } catch (error) {
      console.error(
        'Failed to parse photo WebSocket message:',
        error,
      );
    }
  };

  socket.onerror = (error) => {
    console.error(
      'Photo WebSocket error:',
      error,
    );
  };

  socket.onclose = () => {
    console.log(
      `Photo WebSocket closed for request ${requestId}`,
    );
  };

  return () => {
    socket.close();
  };
}