import { getLocalizedSchoolValue, schools } from '../data/schools.js';
import { seoFooterLinks } from '../data/seoPages.js';
import { brand } from '../data/brand.js';

const languages = [
  { code: 'ru', label: 'Русский' },
  { code: 'kk', label: 'Қазақша' },
  { code: 'en', label: 'English' }
];

const pickSchools = (types) => schools.filter((school) => types.includes(school.type)).slice(0, 6);

const buildStructuredData = (page) => ({
  '@context': 'https://schema.org',
  '@type': page.schemaType,
  name: page.h1.ru,
  description: page.intro.ru,
  url: `${brand.url}/${page.slug}`,
  inLanguage: ['ru', 'kk', 'en'],
  isPartOf: { '@type': 'WebSite', name: brand.name },
  about: pickSchools(page.featuredTypes).map((school) => ({
    '@type': 'School',
    name: getLocalizedSchoolValue(school.name, 'en'),
    url: `/schools/${school.slug ?? school.id}`,
    address: getLocalizedSchoolValue(school.address, 'en')
  }))
});

export default function SeoContentPage({ page }) {
  const featuredSchools = pickSchools(page.featuredTypes);
  const structuredData = buildStructuredData(page);

  return (
    <main className="seo-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <a className="back-link" href="/">← Каталог / Catalog</a>
      <section className="seo-hero">
        {languages.map(({ code, label }) => (
          <div key={code} lang={code === 'kk' ? 'kk' : code}>
            <p className="hero__kicker">{label}</p>
            <h1>{page.h1[code]}</h1>
            <p>{page.intro[code]}</p>
          </div>
        ))}
        <a className="hero__cta" href="/catalog">{page.cta.ru} / {page.cta.kk} / {page.cta.en}</a>
      </section>

      {languages.map(({ code, label }) => (
        <section key={code} className="seo-section" lang={code === 'kk' ? 'kk' : code}>
          <p className="hero__kicker">{label}</p>
          {page.sections.map((section) => (
            <article key={section.title[code]} className="seo-card">
              <h2>{section.title[code]}</h2>
              <p>{section.body[code]}</p>
            </article>
          ))}
        </section>
      ))}

      <section className="seo-section">
        <h2>Релевантные школы / Байланысты мектептер / Relevant schools</h2>
        <div className="seo-school-links">
          {featuredSchools.map((school) => (
            <a key={school.id} href={`/schools/${school.slug ?? school.id}`}>
              <strong>{getLocalizedSchoolValue(school.name, 'ru')}</strong>
              <span>{getLocalizedSchoolValue(school.name, 'kk')}</span>
              <span>{getLocalizedSchoolValue(school.name, 'en')}</span>
            </a>
          ))}
        </div>
      </section>

      <footer className="site-footer">
        <p>{brand.name}: SEO navigation</p>
        <nav className="footer-links" aria-label="SEO pages">
          {seoFooterLinks.map((link) => (
            <a key={link.href} href={link.href}>{link.label.ru} / {link.label.kk} / {link.label.en}</a>
          ))}
        </nav>
      </footer>
    </main>
  );
}
