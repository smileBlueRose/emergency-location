import { useState } from 'react';

import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { MapPanel } from '../../components/map/MapPanel';
import { PhotoPanel } from '../../components/photos/PhotoPanel';
import { RequestForm } from '../../components/request/RequestForm';
import { useLocale } from '../../app/providers/LocaleProvider';

export function OperatorPage() {
  const { t } = useLocale();

  const [requestId, setRequestId] =
    useState<number | null>(null);

  const [phone, setPhone] =
    useState<string | null>(null);

  function handleRequestCreated(
    id: number,
    requestPhone: string,
  ) {
    setRequestId(id);
    setPhone(requestPhone);
  }

  return (
    <div className="page">
      <Header />

      <main className="operator-page">
        {!requestId ? (
          <section className="operator-request-create">
            <h1>
              {t.request.create}
            </h1>

            <RequestForm
              onRequestCreated={
                handleRequestCreated
              }
            />
          </section>
        ) : (
          <>
            <section className="operator-request-created">
              <h1>
                {t.request.number} #{requestId}
              </h1>

              {phone && (
                <p>{phone}</p>
              )}
            </section>

            <section className="operator-page__content">
              <div className="operator-page__map">
                <MapPanel
                  latitude={null}
                  longitude={null}
                />
              </div>

              <div className="operator-page__photos">
                <PhotoPanel />
              </div>
            </section>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}