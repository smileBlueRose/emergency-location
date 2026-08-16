import { Header } from '../../components/layout/Header';
import { MapPanel } from '../../components/map/MapPanel';
import { PhotoPanel } from '../../components/photos/PhotoPanel';

export function OperatorPage() {
  return (
    <div className="page">
      <Header />

      <main className="operator-page">
        <section className="operator-page__content">
          <div className="operator-page__map">
            <MapPanel />
          </div>

          <div className="operator-page__photos">
            <PhotoPanel />
          </div>
        </section>
      </main>
    </div>
  );
}