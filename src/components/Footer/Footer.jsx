import './Footer.css';
import React from 'react';
import logoLight from '/src/assets/comercio-electronico.svg';
import logoDark from '/src/assets/comercio-electronico-negro.svg';
import useDarkMode from '../../hooks/useDarkMode';
import { useLanguage } from '../../hooks/useLanguage';
import Translations from '../../Translations/Translations';

function Footer() {
    const isDarkMode = useDarkMode();
    const { language } = useLanguage();
    const t = Translations[language];

    return (
        <footer className="footer">
            <div className="footer-top">
                <div className="footer-top-content">
                    <div className="footer-section">
                        <h4>Mapa del sitio</h4>
                        <ul>
                            <li><a href="/">Inicio</a></li>
                            <li><a href="/about">Acerca de</a></li>
                            <li><a href="/services">Servicios</a></li>
                            <li><a href="/contact">Contacto</a></li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h4>Contacto</h4>
                        <p><strong>Teléfono:</strong> +57 3138127195</p>
                        <p><strong>Email:</strong> <a href="mailto:diegomendez01soft@gmail.com" title="Ir a correo">diegomendez01soft@gmail.com</a></p>
                        <p><strong>Dirección:</strong> Chiquinquirá, Boyacá</p>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <div className="footer-logo">
                    <img
                        src={isDarkMode ? logoLight : logoDark}
                        alt={t.logoAlt}
                        title={t.goHome}
                    />
                    <span>E-commerce</span>
                </div>
                <div className="footer-copy">
                    © 2025 E-commerce. {t.rightsReserved}
                </div>
            </div>
        </footer>
    );
}

export default Footer;