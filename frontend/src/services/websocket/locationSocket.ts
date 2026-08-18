export interface LocationSocketMessage {
  id: number;
  latitude: number;
  longitude: number;
}

function getWebSocketBaseUrl() {
  const apiUrl =
    import.meta.env.VITE_API_URL ||
    'http://localhost:8080';

  return apiUrl
    .replace(/^https:\/\//, 'wss://')
    .replace(/^http:\/\//, 'ws://');
}

export function connectLocationSocket(
  requestId: number,
  onLocation: (
    location: LocationSocketMessage,
  ) => void,
) {
  const socket = new WebSocket(
    `${getWebSocketBaseUrl()}/api/v1/location/location-shares/ws/${requestId}`,
  );

  socket.onopen = () => {
    console.log(
      `Location WebSocket connected for request ${requestId}`,
    );
  };

  socket.onmessage = (event) => {
    try {
      const message =
        JSON.parse(
          event.data,
        ) as LocationSocketMessage;

      console.log(
        'Location WebSocket message:',
        message,
      );

      onLocation(message);
    } catch (error) {
      console.error(
        'Failed to parse location WebSocket message:',
        error,
      );
    }
  };

  socket.onerror = (error) => {
    console.error(
      'Location WebSocket error:',
      error,
    );
  };

  socket.onclose = () => {
    console.log(
      `Location WebSocket closed for request ${requestId}`,
    );
  };

  return () => {
    socket.close();
  };
}