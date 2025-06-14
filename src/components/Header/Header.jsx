import React from 'react';
import useDarkMode from '../../hooks/useDarkMode';
import logoLight from '/src/assets/comercio-electronico.svg';
import logoDark from '/src/assets/comercio-electronico-negro.svg';
import './Header.css';
import LanguageSelector from '../LanguageSelector/LanguageSelector';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import Translations from '../../Translations/Translations';

export default function Header() {
    const isDarkMode = useDarkMode();
    const { language } = useLanguage();
    const t = Translations[language];

    return (
        <>
            <div className="top-bar" role="navigation" aria-label={t.toggleMenu}>
                <LanguageSelector />
            </div>

            <header className="header">
                <div className="header__logo">
                    <Link to="/" title={t.goHome}>
                        <img
                            src={isDarkMode ? logoLight : logoDark}
                            alt={t.logoAlt}
                            title={t.goHome}
                        />
                    </Link>
                </div>

                <nav className="header__socials" aria-label="Social media">
                    <a
                        href="https://facebook.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={t.socialFacebook}
                        title={t.goFacebook}
                        className="header__socials--facebook"
                    >
                        <i className="fab fa-facebook-f" aria-hidden="true"></i>
                    </a>
                    <a
                        href="https://twitter.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={t.socialTwitter}
                        title={t.goTwitter}
                        className="header__socials--twitter"
                    >
                        <i className="fab fa-twitter" aria-hidden="true"></i>
                    </a>
                    <Link
                        to="/sitemap"
                        aria-label={t.sitemap}
                        title={t.goSitemap}
                        className="header__socials--sitemap"
                    >
                        <i className="fas fa-sitemap" aria-hidden="true"></i>
                    </Link>
                </nav>
            </header>
        </>
    );
}