import {
  useLocale,
  type Locale,
} from '../../app/providers/LocaleProvider';

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();

  const locales: {
    value: Locale;
    label: string;
  }[] = [
    { value: 'ru', label: 'RU' },
    { value: 'kk', label: 'KZ' },
    { value: 'en', label: 'EN' },
  ];

  return (
    <select
      value={locale}
      onChange={(event) =>
        setLocale(event.target.value as Locale)
      }
      aria-label="Language"
    >
      {locales.map((item) => (
        <option
          key={item.value}
          value={item.value}
        >
          {item.label}
        </option>
      ))}
    </select>
  );
}