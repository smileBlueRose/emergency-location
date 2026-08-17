import { useState, useEffect } from 'react';
import './App.css';

const T = {
  RU: {
    title: 'Emergency Geolocation',
    subtitle: 'Запросите геолокацию пострадавшего по номеру телефона',
    button: 'Запросить геолокацию',
    invalidPhone: 'Неправильный формат телефона. Номер должен начинаться с (+) кода страны',
    requestError: 'Произошла ошибка во время отправки запроса.',
    timerPrefix: 'До следующего запроса: ',
    sharingBanner: 'Вы делитесь геолокацией с оператором',
    mapHint: 'Ваша геопозиция передана оператору',
    attachPhoto: 'Прикрепить фото',
    sendPhoto: 'Отправить фото',
    photoSent: 'Фото отправлены',
    invalidImage: 'Файл не является изображением',
    invalidImageSub: 'Поддерживаются JPG, PNG, WEBP, HEIC',
    tooMany: 'Вы можете прикрепить не более 20 фото',
    backHome: '← Назад на главную',
    footerDesc: 'сервис оперативной передачи геоданных',
    github: 'GitHub', contacts: 'Контакты', privacy: 'Политика конфиденциальности',
    privacySoon: 'Документ пока в разработке',
  },
  EN: {
    title: 'Emergency Geolocation',
    subtitle: "Request the affected person's location by phone number",
    button: 'Request geolocation',
    invalidPhone: 'Invalid phone format. The number must start with (+) country code',
    requestError: 'An error occurred while sending the request.',
    timerPrefix: 'Next request available in: ',
    sharingBanner: 'You are sharing your location with the operator',
    mapHint: 'Your location has been sent to the operator',
    attachPhoto: 'Attach photo',
    sendPhoto: 'Send photo',
    photoSent: 'Photos sent',
    invalidImage: 'File is not an image',
    invalidImageSub: 'Supported formats: JPG, PNG, WEBP, HEIC',
    tooMany: 'You can attach up to 20 photos',
    backHome: '← Back to home',
    footerDesc: 'emergency geodata sharing service',
    github: 'GitHub', contacts: 'Contacts', privacy: 'Privacy Policy',
    privacySoon: 'Document coming soon',
  },
  KZ: {
    title: 'Emergency Geolocation',
    subtitle: 'Телефон нөмірі бойынша зардап шеккен адамның геолокациясын сұраңыз',
    button: 'Геолокацияны сұрау',
    invalidPhone: 'Телефон нөмірінің форматы қате. Нөмір елдің (+) кодынан басталуы керек',
    requestError: 'Сұрауды жіберу кезінде қате орын алды.',
    timerPrefix: 'Келесі сұрауға дейін: ',
    sharingBanner: 'Сіз операторыңызбен геолокациямен бөлісіп жатырсыз',
    mapHint: 'Сіздің геопозицияңыз операторға жіберілді',
    attachPhoto: 'Фото тіркеу',
    sendPhoto: 'Фотоны жіберу',
    photoSent: 'Фотолар жіберілді',
    invalidImage: 'Файл сурет емес',
    invalidImageSub: 'JPG, PNG, WEBP, HEIC форматтары қолдау көрсетіледі',
    tooMany: '20-дан артық фото тіркеуге болмайды',
    backHome: '← Басты бетке оралу',
    footerDesc: 'геодеректерді жедел жеткізу қызметі',
    github: 'GitHub', contacts: 'Байланыс', privacy: 'Құпиялылық саясаты',
    privacySoon: 'Құжат дайындалуда',
  },
};

export default function App() {
  const [lang, setLang] = useState('RU');
  const t = T[lang];

  const [view, setView] = useState('main');
  const [phone, setPhone] = useState('+7 700 777 1111');
  const [errorType, setErrorType] = useState(null);
  const [nextAvailableAt, setNextAvailableAt] = useState(null);
  const [now, setNow] = useState(Date.now());

  const [photos, setPhotos] = useState([]);
  const [photoError, setPhotoError] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [coords, setCoords] = useState(null);

  let pressTimer;

  const cycleLang = () => setLang(lang === 'RU' ? 'EN' : lang === 'EN' ? 'KZ' : 'RU');

  useEffect(() => {
    if (!nextAvailableAt) return;
    const i = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(i);
  }, [nextAvailableAt]);

  const remaining = nextAvailableAt ? Math.max(0, Math.ceil((nextAvailableAt - now) / 1000)) : 0;
  const isTimerActive = remaining > 0;
  const formatTimer = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  const handleSubmit = () => {
    if (isTimerActive) return;
    if (!/^\+\d{7,15}$/.test(phone.replace(/\s/g, ''))) {
      setErrorType('invalidPhone');
      return;
    }
    setErrorType(null);
    setNextAvailableAt(Date.now() + 137000);
    setView('sharing');
  };

  const startPress = () => { pressTimer = setTimeout(() => setErrorType('requestError'), 800); };
  const endPress = () => clearTimeout(pressTimer);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { setPhotoError('invalidImage'); return; }
    if (photos.length >= 20) { setPhotoError('tooMany'); return; }
    setPhotoError(null);
    setPhotos([...photos, file.name]);
  };

  useEffect(() => {
    if (view !== 'sharing' || coords) return;
    const setup = (lat, lon) => setCoords({ lat, lon });
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setup(pos.coords.latitude, pos.coords.longitude),
        () => setup(43.2385, 76.9456),
        { timeout: 4000 }
      );
    } else {
      setup(43.2385, 76.9456);
    }
  }, [view]);

  return (
    <div className="device">
      <div className="app-header">
        <div className="app-title">E-Geo</div>
        <button className="lang-pill" onClick={cycleLang}>🌐 {lang}</button>
      </div>

      {view === 'main' && (
        <div className="content">
          <div className="pin-icon" onPointerDown={startPress} onPointerUp={endPress} onPointerLeave={endPress}>
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#1C1C1E" strokeWidth="1.7">
              <path d="M12 21s-7-7.5-7-12a7 7 0 0 1 14 0c0 4.5-7 12-7 12z" />
              <circle cx="12" cy="9" r="2.5" />
            </svg>
          </div>
          <h1>{t.title}</h1>
          <div className="subtitle">{t.subtitle}</div>

          <input className="phone-input" value={phone} onChange={(e) => setPhone(e.target.value)} />

          {errorType === 'invalidPhone' && <div className="msg-error">⚠ {t.invalidPhone}</div>}
          {errorType === 'requestError' && <div className="msg-error">⚠ {t.requestError}</div>}
          {isTimerActive && <div className="msg-timer">🕐 {t.timerPrefix}{formatTimer(remaining)}</div>}

          <button className="btn-primary" onClick={handleSubmit} disabled={isTimerActive}>{t.button}</button>
        </div>
      )}

      {view === 'sharing' && (
        <>
          <div className="info-banner">📡 {t.sharingBanner}</div>

          <div className="map-box">
            {coords && (
              <iframe
                title="map"
                src={`https://maps.google.com/maps?q=${coords.lat},${coords.lon}&z=16&output=embed`}
                loading="lazy"
              />
            )}
          </div>
          <div className="map-hint">{t.mapHint}</div>

          <div className="swatch-row">
            <label className="swatch-cam">
              📷
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoChange} />
            </label>
            {['#A8C5E0', '#A8D5B0', '#EDE0A0', '#F0C4C0'].map((c) => (
              <button
                key={c}
                className={`swatch ${selectedColor === c ? 'selected' : ''}`}
                style={{ background: c }}
                onClick={() => setSelectedColor(c)}
              />
            ))}
          </div>

          <label style={{ display: 'block' }}>
            <div className="btn-outline">{t.attachPhoto} ({photos.length})</div>
            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoChange} />
          </label>
          <button className="btn-dark" onClick={() => photos.length > 0 && alert(t.photoSent)}>{t.sendPhoto}</button>

          {photoError === 'invalidImage' && <div className="photo-msg-error">⚠ {t.invalidImage}<br />{t.invalidImageSub}</div>}
          {photoError === 'tooMany' && <div className="photo-msg-error">⚠ {t.tooMany}</div>}

          <div className="back-row">
            <button className="btn-back" onClick={() => { setView('main'); setPhotoError(null); setPhotos([]); setCoords(null); }}>{t.backHome}</button>
          </div>
        </>
      )}

      <div className="app-footer">
        <div className="fname">© 2026 Emergency Location</div>
        <div className="fsub">{t.footerDesc}</div>
        <a className="flink" href="https://github.com/smileBlueRose/emergency-location" target="_blank" rel="noreferrer">⎇ {t.github}</a>
        <button className="flink" onClick={() => alert('contact@emergency-location.dev')}>✉ {t.contacts}</button>
        <button className="flink" onClick={() => alert(t.privacySoon)}>🔒 {t.privacy}</button>
      </div>
    </div>
  );
}