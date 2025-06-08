import React from 'react';
import useDarkMode from '../../hooks/useDarkMode';
import logoLight from '/src/assets/comercio-electronico.svg';
import logoDark from '/src/assets/comercio-electronico-negro.svg';
import './Header.css';
import LanguageSelector from '../LanguageSelector/LanguageSelector';

export default function Header() {
    const isDarkMode = useDarkMode();

    return (
        <>
            <div className="top-bar" role="navigation" aria-label="Selector de idioma">
                <LanguageSelector />
            </div>

            <header className="header">
                <div className="header__logo">
                    <img
                        src={isDarkMode ? logoLight : logoDark}
                        alt="Logo E-commerce"
                        style={{ height: '40px' }}
                    />
                    <span className="header__app-name">E-commerce</span>
                </div>

                <nav className="header__socials" aria-label="Redes sociales">
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                        <i className="fab fa-facebook-f" aria-hidden="true"></i>
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                        <i className="fab fa-twitter" aria-hidden="true"></i>
                    </a>
                    <a href="/sitemap" aria-label="Mapa del sitio" className="header__socials--sitemap">
                        <i className="fas fa-sitemap" aria-hidden="true"></i>
                    </a>
                </nav>
            </header>
        </>
    );
}