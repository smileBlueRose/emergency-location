import { useState } from 'react';

import { Header } from '../../components/layout/Header';
import { MapPanel } from '../../components/map/MapPanel';
import { LocationSharing } from '../../components/location/LocationSharing';
import { PhotoUploader } from '../../components/photos/PhotoUploader';

export function UserPage() {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  return (
    <div className="page">
      <Header />

      <main className="user-page">
        <section className="user-page__status">
          Вы делитесь геолокацией с оператором
        </section>

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
        />
        <PhotoUploader requestId={3} />
        
      </main>
    </div>
  );
}