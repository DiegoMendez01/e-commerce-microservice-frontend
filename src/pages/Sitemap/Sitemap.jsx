import './Sitemap.css';
import { useLanguage } from '../../hooks/useLanguage';
import Translations from '../../Translations/Translations';
import { Link } from 'react-router-dom';
import getSitemapItems from '../../data/navbarItems';
import { useState } from 'react';
import Button from '../../components/Button/Button';

export default function Sitemap() {
  const { language } = useLanguage();
  const t = Translations[language];

  const items = getSitemapItems(t);
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (key) => {
    setOpenItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const generateSitemapXML = (items, baseUrl = window.location.origin) => {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    const addUrls = (items) => {
      items.forEach((item) => {
        if (item.to) {
          xml += `  <url>\n`;
          xml += `    <loc>${baseUrl}${item.to}</loc>\n`;
          xml += `  </url>\n`;
        }
        if (item.children) {
          addUrls(item.children);
        }
      });
    };

    addUrls(items);
    xml += `</urlset>`;
    return xml;
  };

  const downloadSitemap = () => {
    const xml = generateSitemapXML(items);
    const blob = new Blob([xml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'sitemap.xml';
    link.click();

    URL.revokeObjectURL(url);
  };

  const renderItems = (items, depth = 0, parentKey = '') => (
    <ul className={`sitemap__list depth-${depth}`}>
      {items.map((item, index) => {
        const key = `${parentKey}${index}`;
        const isOpen = openItems[key] ?? false;
        const hasChildren = item.children && item.children.length > 0;

        return (
          <li key={key} className={`sitemap__item ${hasChildren ? 'has-children' : ''}`}>
            <div className="sitemap__item-header">
              {item.to ? (
                <Link to={item.to} title={item.title}>
                  {item.label}
                  {hasChildren && <span className="sitemap__underline" />}
                </Link>
              ) : (
                <span title={item.title}>
                  {item.label}
                  {hasChildren && <span className="sitemap__underline" />}
                </span>
              )}
              {hasChildren && (
                <button
                  className="sitemap__toggle"
                  onClick={() => toggleItem(key)}
                  aria-label="Toggle submenu"
                >
                  <i className={`fas fa-chevron-${isOpen ? 'down' : 'right'}`}></i>
                </button>
              )}
            </div>
            {hasChildren && isOpen && renderItems(item.children, depth + 1, `${key}-`)}
          </li>
        );
      })}
    </ul>
  );

  return (
    <div className="sitemap">
      <h1>{t.sitemap || 'Mapa del sitio'}</h1>
      <Button onClick={downloadSitemap} variant="outline" size="md" title={t.downloadSitemap}>
        {t.downloadSitemap}
      </Button>
      {renderItems(items)}
    </div>
  );
}