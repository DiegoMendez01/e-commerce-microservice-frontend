import React from 'react';
import useDarkMode from '../../hooks/useDarkMode';
import logoLight from '/src/assets/comercio-electronico.svg';
import logoDark from '/src/assets/comercio-electronico-negro.svg';
import './Header.css';
import LanguageSelector from '../LanguageSelector/LanguageSelector';
import { Link } from 'react-router-dom';

export default function Header() {
    const isDarkMode = useDarkMode();

    return (
        <>
            <div className="top-bar" role="navigation" aria-label="Selector de idioma">
                <LanguageSelector />
            </div>

            <header className="header">
                <div className="header__logo">
                    <Link to="/" title="Ir a la página de inicio">
                        <img
                            src={isDarkMode ? logoLight : logoDark}
                            alt="Logo E-commerce"
                            title="Ir a Inicio"
                        />
                    </Link>
                </div>

                <nav className="header__socials" aria-label="Redes sociales">
                    <a
                        href="https://facebook.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Facebook"
                        title="Ir a Facebook"
                        className='header__socials--facebook'
                    >
                        <i className="fab fa-facebook-f" aria-hidden="true"></i>
                    </a>
                    <a
                        href="https://twitter.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Twitter"
                        title="Ir a Twitter"
                        className='header__socials--twitter'
                    >
                        <i className="fab fa-twitter" aria-hidden="true"></i>
                    </a>
                    <a
                        href="/sitemap"
                        aria-label="Mapa del sitio"
                        title="Ir a mapa del sitio"
                        className="header__socials--sitemap"
                    >
                        <i className="fas fa-sitemap" aria-hidden="true"></i>
                    </a>
                </nav>
            </header>
        </>
    );
}