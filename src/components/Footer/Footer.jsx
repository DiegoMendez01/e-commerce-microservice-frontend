import './Footer.css';
import React from 'react';
import logoLight from '/src/assets/comercio-electronico.svg';
import logoDark from '/src/assets/comercio-electronico-negro.svg';
import useDarkMode from '../../hooks/useDarkMode';
import { useLanguage } from '../../hooks/useLanguage';
import Translations from '../../Translations/Translations';
import { Link } from 'react-router-dom';

function Footer() {
    const isDarkMode = useDarkMode();
    const { language } = useLanguage();
    const t = Translations[language];

    return (
        <footer className="footer">
            <div className="footer-top">
                <div className="footer-top-content">
                    <div className="footer-section">
                        <h4>{t.informationAditional}</h4>
                        <p><Link to="/sitemap" title={t.sitemap}>{t.sitemap}</Link></p>
                        <p><strong>{t.developer}:</strong> {t.developerName}</p>
                        <p><strong>{t.phone}:</strong> +57 3138127195</p>
                    </div>
                    <div className="footer-section">
                        <h4>{t.contact}</h4>
                        <p><strong>{t.phone}:</strong> +57 3138127195</p>
                        <p><strong>{t.email}:</strong> <a href="mailto:diegomendez01soft@gmail.com" title={t.goEmail}>diegomendez01soft@gmail.com</a></p>
                        <p><strong>{t.address}:</strong> Chiquinquirá, Boyacá</p>
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
                    <span>{t.appName || 'E-commerce'}</span>
                </div>
                <div className="footer-copy">
                    © 2025 {t.appName || 'E-commerce'}. {t.rightsReserved}
                </div>
            </div>
        </footer>
    );
}

export default Footer;