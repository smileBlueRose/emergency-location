import { useState } from 'react';
import { locationApi } from '../../services/api/location';
import { getCurrentPosition } from '../../services/geolocation';
import { create2GisGeoUrl } from '../../services/maps';
import { useLocale } from '../../app/providers/LocaleProvider';

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
  const { t } = useLocale();

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
          t.location.requesting}

        {status === 'sending' &&
          t.location.sending}

        {status === 'idle' &&
          t.location.share}

        {status === 'success' &&
          t.location.success}

        {status === 'error' &&
          t.location.error}
      </button>

      {mapUrl && status === 'success' && (
        <a
          href={mapUrl}
          target="_blank"
          rel="noreferrer"
        >
          {t.location.open2gis}
        </a>
      )}
    </section>
  );
}