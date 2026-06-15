'use client';

import { useEffect, useMemo, useState } from 'react';
import FavoriteButton from '../../src/components/FavoriteButton.jsx';
import { getLocalizedEnumLabel, getLocalizedSchoolValue, schools } from '../../src/data/schools.js';
import { favoritesChangedEventName, getStoredFavoriteSchoolIds } from '../../src/lib/favorites.js';

const defaultLanguage = 'ru';
const languageStorageKey = 'school-choice-kz-language';

const languageOptions = [
  { code: 'ru', label: 'RU' },
  { code: 'kz', label: 'KZ' },
  { code: 'en', label: 'EN' }
];

const translations = {
  ru: {
    languageSwitcherLabel: 'Выберите язык интерфейса',
    backToCatalog: 'Назад к каталогу',
    pageKicker: 'Избранное',
    pageTitle: 'Сохраненные школы',
    pageDescription: 'Здесь отображаются школы, которые вы отметили сердцем. Список сохраняется только в этом браузере.',
    savedCount: (count) => `${count} ${count === 1 ? 'школа сохранена' : count > 1 && count < 5 ? 'школы сохранены' : 'школ сохранено'}`,
    emptyTitle: 'В избранном пока нет школ',
    emptyDescription: 'Вернитесь в каталог и нажмите кнопку с сердцем на карточке школы, чтобы сохранить ее здесь.',
    details: 'Подробнее',
    district: 'Район',
    schoolType: 'Тип школы',
    language: 'Язык',
    tuitionFee: 'Стоимость обучения',
    freePublicSchool: 'Бесплатная государственная школа',
    priceUnknown: 'Стоимость уточняется',
    perMonth: 'в месяц',
    favorite: {
      add: 'Добавить в избранное',
      remove: 'В избранном'
    }
  },
  kz: {
    languageSwitcherLabel: 'Интерфейс тілін таңдаңыз',
    backToCatalog: 'Каталогқа оралу',
    pageKicker: 'Таңдаулылар',
    pageTitle: 'Сақталған мектептер',
    pageDescription: 'Мұнда жүрек белгісімен сақтаған мектептер көрсетіледі. Тізім тек осы браузерде сақталады.',
    savedCount: (count) => `${count} мектеп сақталды`,
    emptyTitle: 'Таңдаулыларда әзірге мектеп жоқ',
    emptyDescription: 'Каталогқа оралып, мектепті осында сақтау үшін карточкадағы жүрек түймесін басыңыз.',
    details: 'Толығырақ',
    district: 'Аудан',
    schoolType: 'Мектеп түрі',
    language: 'Тілі',
    tuitionFee: 'Оқу ақысы',
    freePublicSchool: 'Тегін мемлекеттік мектеп',
    priceUnknown: 'Құны нақтыланады',
    perMonth: 'айына',
    favorite: {
      add: 'Таңдаулыға қосу',
      remove: 'Таңдаулыда'
    }
  },
  en: {
    languageSwitcherLabel: 'Choose interface language',
    backToCatalog: 'Back to catalog',
    pageKicker: 'Favorites',
    pageTitle: 'Saved schools',
    pageDescription: 'Schools you marked with the heart button appear here. The list is stored only in this browser.',
    savedCount: (count) => `${count} saved ${count === 1 ? 'school' : 'schools'}`,
    emptyTitle: 'No favorite schools yet',
    emptyDescription: 'Return to the catalog and press the heart button on a school card to save it here.',
    details: 'Details',
    district: 'District',
    schoolType: 'School type',
    language: 'Language',
    tuitionFee: 'Tuition fee',
    freePublicSchool: 'Free public school',
    priceUnknown: 'Tuition to be confirmed',
    perMonth: 'month',
    favorite: {
      add: 'Add to favorites',
      remove: 'Saved to favorites'
    }
  }
};

const getLanguage = (language) => (language && translations[language] ? language : defaultLanguage);

const getMoneyFormatter = (language) =>
  new Intl.NumberFormat(language === 'en' ? 'en-US' : language === 'kz' ? 'kk-KZ' : 'ru-RU', {
    style: 'currency',
    currency: 'KZT',
    currencyDisplay: 'narrowSymbol',
    maximumFractionDigits: 0
  });

const formatPrice = (price, formatter, t) => {
  if (price === null || price === undefined) {
    return t.priceUnknown;
  }

  return price === 0 ? t.freePublicSchool : `${formatter.format(price)} / ${t.perMonth}`;
};

function LanguageSwitcher({ currentLanguage, onLanguageChange, t }) {
  return (
    <div className="language-switcher" aria-label={t.languageSwitcherLabel}>
      {languageOptions.map(({ code, label }) => (
        <button
          key={code}
          type="button"
          className={currentLanguage === code ? 'language-switcher__button language-switcher__button--active' : 'language-switcher__button'}
          aria-pressed={currentLanguage === code}
          onClick={() => onLanguageChange(code)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export default function FavoritesPage() {
  const [currentLanguage, setCurrentLanguage] = useState(defaultLanguage);
  const [favoriteSchoolIds, setFavoriteSchoolIds] = useState([]);

  useEffect(() => {
    const syncFavoriteSchools = () => setFavoriteSchoolIds(getStoredFavoriteSchoolIds());

    try {
      const urlLanguage = new URLSearchParams(window.location.search).get('lang');
      const storedLanguage = window.localStorage.getItem(languageStorageKey);
      setCurrentLanguage(getLanguage(urlLanguage || storedLanguage));
    } catch {
      setCurrentLanguage(defaultLanguage);
    }

    syncFavoriteSchools();
    window.addEventListener('storage', syncFavoriteSchools);
    window.addEventListener(favoritesChangedEventName, syncFavoriteSchools);

    return () => {
      window.removeEventListener('storage', syncFavoriteSchools);
      window.removeEventListener(favoritesChangedEventName, syncFavoriteSchools);
    };
  }, []);

  const t = translations[currentLanguage];
  const moneyFormatter = useMemo(() => getMoneyFormatter(currentLanguage), [currentLanguage]);
  const favoriteSchools = favoriteSchoolIds.map((schoolId) => schools.find((school) => school.id === schoolId)).filter(Boolean);

  const updateLanguage = (language) => {
    setCurrentLanguage(language);

    try {
      window.localStorage.setItem(languageStorageKey, language);
      window.history.replaceState(null, '', `/favorites?lang=${language}`);
    } catch {
      // Language still changes for the current session if localStorage is unavailable.
    }
  };

  return (
    <main>
      <nav className="school-detail__topbar" aria-label={t.languageSwitcherLabel}>
        <a className="back-link" href={`/?lang=${currentLanguage}`}>
          ← {t.backToCatalog}
        </a>
        <LanguageSwitcher currentLanguage={currentLanguage} onLanguageChange={updateLanguage} t={t} />
      </nav>

      <section className="compare-hero" aria-labelledby="favorites-title">
        <p className="hero__kicker">{t.pageKicker}</p>
        <h1 id="favorites-title">{t.pageTitle}</h1>
        <p>{t.pageDescription}</p>
        <strong>{t.savedCount(favoriteSchools.length)}</strong>
      </section>

      {favoriteSchools.length > 0 ? (
        <section className="school-grid" aria-label={t.pageTitle}>
          {favoriteSchools.map((school) => {
            const localizedName = getLocalizedSchoolValue(school.name, currentLanguage);

            return (
              <article className="school-card school-card--compact" key={school.id}>
                <div className="school-card__header">
                  <div>
                    <p className="school-card__eyebrow">{getLocalizedEnumLabel('districts', school.district, currentLanguage)}</p>
                    <h2>{localizedName}</h2>
                  </div>
                  <div className="school-card__header-actions">
                    <FavoriteButton schoolId={school.id} labels={t.favorite} />
                    <span className={`badge badge--${school.type}`}>{getLocalizedEnumLabel('schoolTypes', school.type, currentLanguage)}</span>
                  </div>
                </div>
                <dl className="school-card__facts school-card__facts--compact">
                  {[
                    [t.district, getLocalizedEnumLabel('districts', school.district, currentLanguage)],
                    [t.schoolType, getLocalizedSchoolValue(school.school_type, currentLanguage)],
                    [t.language, getLocalizedSchoolValue(school.languages, currentLanguage)],
                    [t.tuitionFee, formatPrice(school.tuition_fee, moneyFormatter, t)]
                  ].map(([term, detail]) => (
                    <div key={term}>
                      <dt>{term}</dt>
                      <dd>{detail}</dd>
                    </div>
                  ))}
                </dl>
                <div className="school-card__contact school-card__contact--details-only">
                  <a className="button-link" href={`/schools/${school.slug ?? school.id}?lang=${currentLanguage}`}>{t.details}</a>
                </div>
              </article>
            );
          })}
        </section>
      ) : (
        <section className="empty-state" aria-live="polite">
          <h2>{t.emptyTitle}</h2>
          <p>{t.emptyDescription}</p>
          <a className="button-link" href={`/?lang=${currentLanguage}`}>
            {t.backToCatalog}
          </a>
        </section>
      )}
    </main>
  );
}
