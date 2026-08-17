export function Footer() {
  return (
    <footer className="app-footer">
      <div className="app-footer__info">
        <div className="app-footer__copyright">
          © 2026 Emergency Location
        </div>

        <div className="app-footer__subtitle">
          сервис оперативной передачи геоданных
        </div>
      </div>

      <nav className="app-footer__links">
        <a
          href="https://github.com/smileBlueRose/emergency-location"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>

        <a href="#contacts">
          Контакты
        </a>

        <a href="#privacy">
          Политика конфиденциальности
        </a>
      </nav>
    </footer>
  );
}