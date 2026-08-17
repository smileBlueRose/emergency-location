import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { MapPanel } from '../../components/map/MapPanel';
import { useLocale } from '../../app/providers/LocaleProvider';
import { locationApi } from '../../services/api/location';
import { photoApi } from '../../services/api/photo';
import type {
  LocationShareRecord,
  Photo,
} from '../../types';

export function OperatorRequestPage() {
  const { t } = useLocale();
  const { requestId } = useParams<{
    requestId: string;
  }>();

  const numericRequestId = Number(requestId);

  const [location, setLocation] =
    useState<LocationShareRecord | null>(null);

  const [photos, setPhotos] = useState<Photo[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!Number.isInteger(numericRequestId)) {
      setLoading(false);
      return;
    }

    async function loadRequest() {
      try {
        const [
          latestLocation,
          photoList,
        ] = await Promise.all([
          locationApi.getLatestLocation(
            numericRequestId,
          ),
          photoApi.getAll(
            numericRequestId,
          ),
        ]);

        setLocation(latestLocation);
        setPhotos(photoList.items);
      } catch (error) {
        console.error(
          'Failed to load operator request:',
          error,
        );
      } finally {
        setLoading(false);
      }
    }

    void loadRequest();
  }, [numericRequestId]);

  const locationReceived = location !== null;

  return (
    <div className="page operator-request-page">
      <Header />

      <main className="operator-request">
        <section className="operator-request__main-card">
          <header className="operator-request__header">
            <h1>
              {t.operator.request} #{requestId}
            </h1>

            <span className="operator-request__status">
              {loading
                ? t.operator.locationWaiting
                : locationReceived
                  ? t.operator.locationReceived
                  : t.operator.locationWaiting}
            </span>
          </header>

          <div className="operator-request__map">
            <MapPanel
              latitude={
                location?.latitude ?? null
              }
              longitude={
                location?.longitude ?? null
              }
            />
          </div>

          <div className="operator-request__share">
            <span>
              {t.operator.shareData}
            </span>

            <div className="operator-request__share-actions">
              <a
                href="https://t.me/"
                target="_blank"
                rel="noreferrer"
                className="share-button share-button--telegram"
              >
                Telegram
              </a>

              <a
                href="https://wa.me/"
                target="_blank"
                rel="noreferrer"
                className="share-button share-button--whatsapp"
              >
                WhatsApp
              </a>

              <button
                type="button"
                className="share-button share-button--copy"
                onClick={() => {
                  void navigator.clipboard.writeText(
                    window.location.href,
                  );
                }}
              >
                {t.operator.copyLink}
              </button>
            </div>
          </div>
        </section>

        <aside className="operator-request__photo-panel">
          <h2>
            {t.operator.photos}
          </h2>

          {photos.length === 0 ? (
            <div className="operator-request__photo-placeholder operator-request__photo-placeholder--blue">
              {t.operator.photosWaiting}
            </div>
          ) : (
            <div className="operator-request__photos">
            {photos.map((photo) => (
                <img
                key={photo.id}
                src={photo.url}
                alt={t.operator.photos}
                className="operator-request__photo"
                onError={(event) => {
                    event.currentTarget.style.display = 'none';
                }}
                />
            ))}
            </div>
          )}
        </aside>
      </main>

      <Footer />
    </div>
  );
}