import { useLocale } from '../../app/providers/LocaleProvider';

export function PhotoPanel() {
  const { t } = useLocale();

  return (
    <section className="photo-panel">
      <h2 className="photo-panel__title">
        {t.operator.photos}
      </h2>

      <div className="photo-panel__content">
        {t.operator.photosWaiting}
      </div>
    </section>
  );
}