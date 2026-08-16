import { Header } from '../../components/layout/Header';
import { MapPanel } from '../../components/map/MapPanel';
import { PhotoPanel } from '../../components/photos/PhotoPanel';

export function UserPage() {
  return (
    <div className="page">
      <Header />

      <main className="user-page">
        <section className="user-page__status">
          Вы делитесь геолокацией с оператором
        </section>

        <MapPanel />

        <PhotoPanel />
      </main>
    </div>
  );
}