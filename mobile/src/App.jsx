import { useState, useEffect } from 'react';
import './App.css';

const T = {
  RU: {
    title: 'emergency Geolocation',
    subtitle: 'Запросите геолокацию пострадавшего по номеру телефона',
    button: 'Запросить геолокацию',
    invalidPhone: 'Неправильный формат телефона. Номер должен начинаться с (+) кода страны',
    requestError: 'Произошла ошибка во время отправки запроса.',
    timerPrefix: 'До следующего запроса: ',
    sharingBanner: 'Вы делитесь геолокацией с оператором',
    mapHint: 'Ваша геопозиция передана оператору',
    coordsPrefix: 'Координаты: ',
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
    mapLoading: 'Определяем геопозицию…',
  },
  EN: {
    title: 'emergency Geolocation',
    subtitle: "Request the affected person's location by phone number",
    button: 'Request geolocation',
    invalidPhone: 'Invalid phone format. The number must start with (+) country code',
    requestError: 'An error occurred while sending the request.',
    timerPrefix: 'Next request available in: ',
    sharingBanner: 'You are sharing your location with the operator',
    mapHint: 'Your location has been sent to the operator',
    coordsPrefix: 'Coordinates: ',
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
    mapLoading: 'Detecting location…',
  },
  KZ: {
    title: 'emergency Geolocation',
    subtitle: 'Телефон нөмірі бойынша зардап шеккен адамның геолокациясын сұраңыз',
    button: 'Геолокацияны сұрау',
    invalidPhone: 'Телефон нөмірінің форматы қате. Нөмір елдің (+) кодынан басталуы керек',
    requestError: 'Сұрауды жіберу кезінде қате орын алды.',
    timerPrefix: 'Келесі сұрауға дейін: ',
    sharingBanner: 'Сіз операторыңызбен геолокациямен бөлісіп жатырсыз',
    mapHint: 'Сіздің геопозицияңыз операторға жіберілді',
    coordsPrefix: 'Координаттар: ',
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
    mapLoading: 'Геопозиция анықталуда…',
  },
};

export default function App() {
  const lon2tile = (lon, zoom) => Math.floor((lon + 180) / 360 * Math.pow(2, zoom));
  const lat2tile = (lat, zoom) => Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom));

  const [lang, setLang] = useState('RU');
  const t = T[lang];

  const [view, setView] = useState('main');
  const [phone, setPhone] = useState('+7 700 777 1111');
  const [errorType, setErrorType] = useState(null);
  const [nextAvailableAt, setNextAvailableAt] = useState(null);
  const [now, setNow] = useState(Date.now());

  const [photos, setPhotos] = useState([]);
  const [photoError, setPhotoError] = useState(null);
  const [selectedColor, setSelectedColor] = useState('#C23A2B');
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
    let done = false;
    const setup = (lat, lon) => {
      if (done) return;
      done = true;
      setCoords({ lat, lon });
    };

    const fallbackTimer = setTimeout(() => setup(43.2385, 76.9456), 4000);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => { clearTimeout(fallbackTimer); setup(pos.coords.latitude, pos.coords.longitude); },
        () => { clearTimeout(fallbackTimer); setup(43.2385, 76.9456); },
        { timeout: 5000, enableHighAccuracy: true }
      );
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
            <svg width="54" height="54" viewBox="0 0 24 24" fill="none" stroke="#1C1C1E" strokeWidth="1.5">
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

          <div className="map-box" style={{ position: 'relative' }}>
            {coords ? (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: '1fr 1fr 1fr', width: '100%', height: '100%' }}>
                  {(() => {
                    const zoom = 16;
                    const xc = lon2tile(coords.lon, zoom);
                    const yc = lat2tile(coords.lat, zoom);
                    const tiles = [];
                    for (let dy = -1; dy <= 1; dy++) {
                      for (let dx = -1; dx <= 1; dx++) {
                        tiles.push(
                          <img
                            key={`${dx}-${dy}`}
                            src={`https://tile.openstreetmap.org/${zoom}/${xc + dx}/${yc + dy}.png`}
                            alt=""
                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                          />
                        );
                      }
                    }
                    return tiles;
                  })()}
                </div>
                <svg width="34" height="44" viewBox="0 0 24 30" style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -95%)' }}>
                  <path d="M12 0C6 0 1 5 1 11c0 8 11 19 11 19s11-11 11-19C23 5 18 0 12 0z" fill={selectedColor} stroke="#fff" strokeWidth="1.5" />
                  <circle cx="12" cy="11" r="4" fill="#fff" />
                </svg>
                <div style={{ position: 'absolute', right: 4, bottom: 2, fontSize: 8, color: '#6B6B70', background: 'rgba(255,255,255,0.7)', padding: '1px 4px', borderRadius: 3 }}>
                  © OpenStreetMap
                </div>
              </>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#6B6B70', fontSize: 13 }}>
                {t.mapLoading}
              </div>
            )}
          </div>
          <div className="map-hint">{t.mapHint}</div>
          {coords && (
            <div className="map-hint" style={{ fontFamily: 'monospace', marginTop: 4 }}>
              {t.coordsPrefix}{coords.lat.toFixed(5)}, {coords.lon.toFixed(5)}
            </div>
          )}

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
        <a className="flink" href="https://github.com/smileBlueRose/emergency-location" target="_blank" rel="noreferrer">
          <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
          </svg>
          <span>{t.github}</span>
        </a>
        <button className="flink" onClick={() => alert('contact@emergency-location.dev')}>✉ {t.contacts}</button>
        <button className="flink" onClick={() => alert(t.privacySoon)}>🔒 {t.privacy}</button>
      </div>
    </div>
  );
}