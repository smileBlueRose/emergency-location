import { useState } from 'react';

import { Header } from '../../components/layout/Header';
import { MapPanel } from '../../components/map/MapPanel';
import {
  LocationSharing,
  type LocationStatus,
} from '../../components/location/LocationSharing';
import { PhotoUploader } from '../../components/photos/PhotoUploader';

export function UserPage() {
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
            Вы делитесь геолокацией с оператором
          </section>
        )}

        {locationStatus === 'requesting' && (
          <section className="user-page__status">
            Определяем ваше местоположение...
          </section>
        )}

        {locationStatus === 'sending' && (
          <section className="user-page__status">
            Отправляем геолокацию оператору...
          </section>
        )}

        {locationStatus === 'error' && (
          <section className="user-page__status user-page__status--error">
            Не удалось отправить геолокацию. Попробуйте ещё раз.
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