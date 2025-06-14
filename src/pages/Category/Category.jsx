import React from 'react';
import './Category.css';
import { useLanguage } from '../../hooks/useLanguage';
import Translations from '../../Translations/Translations';
import HeadingH2 from '../../components/HeadingH2/HeadingH2';

export default function Home() {
    const { language } = useLanguage();
    const t = Translations[language];

    return (
        <div className="page-category">
            <div>
                <HeadingH2>{t.categories}</HeadingH2>
            </div>
        </div>
    );
}