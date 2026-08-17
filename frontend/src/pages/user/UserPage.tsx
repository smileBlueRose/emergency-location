import { useState } from 'react';

import { Header } from '../../components/layout/Header';
import { MapPanel } from '../../components/map/MapPanel';
import {
  LocationSharing,
  type LocationStatus,
} from '../../components/location/LocationSharing';
import { PhotoUploader } from '../../components/photos/PhotoUploader';
import { useLocale } from '../../app/providers/LocaleProvider';

export function UserPage() {
  const { t } = useLocale();

  const [latitude, setLatitude] =
    useState<number | null>(null);

  const [longitude, setLongitude] =
    useState<number | null>(null);

  const [locationStatus, setLocationStatus] =
    useState<LocationStatus>('idle');

  return (
    <div className="page">
      <Header />

      <main className="user-page">
        {locationStatus === 'success' && (
          <section className="user-page__status">
            {t.location.shared}
          </section>
        )}

        {locationStatus === 'requesting' && (
          <section className="user-page__status">
            {t.location.requesting}
          </section>
        )}

        {locationStatus === 'sending' && (
          <section className="user-page__status">
            {t.location.sending}
          </section>
        )}

        {locationStatus === 'error' && (
          <section className="user-page__status user-page__status--error">
            {t.location.error}
          </section>
        )}

        <MapPanel
          latitude={latitude}
          longitude={longitude}
        />

        <LocationSharing
          requestId={3}
          onLocationReceived={(lat, lon) => {
            setLatitude(lat);
            setLongitude(lon);
          }}
          onStatusChange={setLocationStatus}
        />

        <PhotoUploader requestId={3} />
      </main>
    </div>
  );
}