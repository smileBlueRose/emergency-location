import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { MapPanel } from '../../components/map/MapPanel';
import { useLocale } from '../../app/providers/LocaleProvider';

export function OperatorRequestPage() {
  const { t } = useLocale();

  return (
    <div className="page operator-request-page">
      <Header />

      <main className="operator-request">
        <section className="operator-request__main-card">
          <header className="operator-request__header">
            <h1>
              {t.operator.request} #123
            </h1>

            <span className="operator-request__status">
              {t.operator.locationReceived}
            </span>
          </header>

          <div className="operator-request__map">
            <MapPanel
              latitude={43.2389}
              longitude={76.8897}
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

          <div className="operator-request__photo-placeholder operator-request__photo-placeholder--blue">
            {t.operator.photosWaiting}
          </div>

          <div className="operator-request__photo-placeholder operator-request__photo-placeholder--green" />

          <div className="operator-request__photo-placeholder operator-request__photo-placeholder--yellow" />
        </aside>
      </main>

      <Footer />
    </div>
  );
}