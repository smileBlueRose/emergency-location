import { useState } from 'react';
import { locationApi } from '../../services/api/location';
import { getCurrentPosition } from '../../services/geolocation';
import { create2GisGeoUrl } from '../../services/maps';

interface LocationSharingProps {
  requestId: number;
  onLocationReceived: (
    latitude: number,
    longitude: number,
  ) => void;
}

type LocationStatus =
  | 'idle'
  | 'requesting'
  | 'sending'
  | 'success'
  | 'error';

export function LocationSharing({
  requestId,
  onLocationReceived,
}: LocationSharingProps) {
    const [status, setStatus] = useState<LocationStatus>('idle');
    const [mapUrl, setMapUrl] = useState<string | null>(null);

    async function handleShareLocation() {
    try {
        setStatus('requesting');

        const { latitude, longitude } =
        await getCurrentPosition();
        onLocationReceived(latitude, longitude);

        const geoUrl = create2GisGeoUrl(
        latitude,
        longitude,
        );

        setMapUrl(geoUrl);

        setStatus('sending');

        await locationApi.submitLocation(
        requestId,
        latitude,
        longitude,
        );

        setStatus('success');
    } catch (error) {
        console.error('Failed to share location:', error);
        setStatus('error');
    }
    }

return (
  <section>
    <button
      type="button"
      onClick={handleShareLocation}
      disabled={
        status === 'requesting' ||
        status === 'sending'
      }
    >
      {status === 'requesting' &&
        'Определяем местоположение...'}

      {status === 'sending' &&
        'Отправляем геолокацию...'}

      {status === 'idle' &&
        'Поделиться геолокацией'}

      {status === 'success' &&
        'Геолокация отправлена'}

      {status === 'error' &&
        'Повторить отправку'}
    </button>

    {mapUrl && (
      <a
        href={mapUrl}
        target="_blank"
        rel="noreferrer"
      >
        Открыть местоположение в 2GIS
      </a>
    )}
  </section>
);
  
}