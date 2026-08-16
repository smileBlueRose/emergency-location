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
  onStatusChange: (status: LocationStatus) => void;
}

export type LocationStatus =
  | 'idle'
  | 'requesting'
  | 'sending'
  | 'success'
  | 'error';

export function LocationSharing({
  requestId,
  onLocationReceived,
  onStatusChange,
}: LocationSharingProps) {
  const [status, setStatus] =
    useState<LocationStatus>('idle');

  const [mapUrl, setMapUrl] =
    useState<string | null>(null);

  function updateStatus(nextStatus: LocationStatus) {
    setStatus(nextStatus);
    onStatusChange(nextStatus);
  }

  async function handleShareLocation() {
    try {
      updateStatus('requesting');

      const { latitude, longitude } =
        await getCurrentPosition();

      onLocationReceived(latitude, longitude);

      setMapUrl(
        create2GisGeoUrl(
          latitude,
          longitude,
        ),
      );

      updateStatus('sending');

      await locationApi.submitLocation(
        requestId,
        latitude,
        longitude,
      );

      updateStatus('success');
    } catch (error) {
      console.error(
        'Failed to share location:',
        error,
      );

      updateStatus('error');
    }
  }

  return (
    <section className="location-sharing">
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

      {mapUrl && status === 'success' && (
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