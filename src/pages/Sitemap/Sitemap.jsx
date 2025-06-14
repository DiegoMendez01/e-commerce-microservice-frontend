import './Sitemap.css';
import { useLanguage } from '../../hooks/useLanguage';
import Translations from '../../Translations/Translations';
import { Link } from 'react-router-dom';
import getSitemapItems from '../../data/navbarItems';

export default function Sitemap() {
  const { language } = useLanguage();
  const t = Translations[language];

  const items = getSitemapItems(t);

  const renderItems = (items, depth = 0) => (
    <ul className={`sitemap__list depth-${depth}`}>
      {items.map((item, index) => (
        <li key={index}>
          {item.to ? (
            <Link to={item.to} title={item.title}>
              {item.label}
            </Link>
          ) : (
            <span title={item.title}>{item.label}</span>
          )}
          {item.children && renderItems(item.children, depth + 1)}
        </li>
      ))}
    </ul>
  );

  return (
    <div className="sitemap">
      <h1>{t.sitemap || 'Mapa del sitio'}</h1>
      {renderItems(items)}
    </div>
  );
}