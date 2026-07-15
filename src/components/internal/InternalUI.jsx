'use client';

import { brand } from '../../data/brand.js';

export const languageOptions = [{ code: 'ru', label: 'RU' }, { code: 'kz', label: 'KZ' }, { code: 'en', label: 'EN' }];

export function AppShell({ children }) { return <div className="app-shell">{children}</div>; }
export function PageContainer({ children, flow = false }) { return <main className={flow ? 'flow-container' : 'internal-page-container'}>{children}</main>; }
export function InternalHeader({ lang = 'ru', onLanguageChange, favoriteCount = 0, labels = {} }) {
  const l = { catalog: 'Каталог', recommendation: 'Подбор', readiness: 'Готовность', contribute: 'Добавить школу', favorites: 'Мой выбор', ...labels };
  const suffix = `?lang=${lang}`;
  return <header className="internal-header">
    <a className="internal-header__brand" href={`/${suffix}`}>{brand.name}</a>
    <nav className="internal-header__nav" aria-label={l.nav ?? 'Навигация'}>
      <a href={`/catalog${suffix}`}>{l.catalog}</a><a href={`/recommendation${suffix}`}>{l.recommendation}</a><a href={`/school-readiness${suffix}`}>{l.readiness}</a><a href={`/contribute${suffix}`}>{l.contribute}</a>
    </nav>
    <div className="internal-header__actions"><a className="internal-header__choice" href={`/my-choice${suffix}`}>♡ {l.favorites} {favoriteCount ? `(${favoriteCount})` : ''}</a><LanguageSwitcher currentLanguage={lang} onLanguageChange={onLanguageChange} /></div>
  </header>;
}
export function LanguageSwitcher({ currentLanguage, onLanguageChange }) { return <div className="language-switcher" aria-label="Language">{languageOptions.map((l) => <button type="button" key={l.code} onClick={() => onLanguageChange?.(l.code)} className={currentLanguage === l.code ? 'language-switcher__button language-switcher__button--active' : 'language-switcher__button'} aria-pressed={currentLanguage === l.code}>{l.label}</button>)}</div>; }
export function PageIntro({ eyebrow, title, description, secondary, actions }) { return <section className="page-intro"><p className="hero__kicker">{eyebrow}</p><h1>{title}</h1>{description ? <p>{description}</p> : null}{secondary ? <p className="page-intro__secondary">{secondary}</p> : null}{actions ? <div className="page-intro__actions">{actions}</div> : null}</section>; }
export function FormCard({ children, className = '' }) { return <section className={`form-card ${className}`}>{children}</section>; }
export function SelectField({ label, value, onChange, children, id }) { return <label className="field" htmlFor={id}><span>{label}</span><select id={id} value={value} onChange={(e) => onChange(e.target.value)}>{children}</select></label>; }
export function SelectionCard({ selected, children, onClick }) { return <button type="button" className={selected ? 'selection-card selection-card--selected' : 'selection-card'} onClick={onClick}>{selected ? <span aria-hidden="true">✓</span> : null}{children}</button>; }
export function SelectionGrid({ children }) { return <div className="selection-grid">{children}</div>; }
export function ProgressHeader({ label, progress }) { return <div className="progress-header"><span>{label}</span><div className="progress-bar"><i style={{ width: `${progress}%` }} /></div></div>; }
export function GuidedFlowShell({ children, backHref, backLabel }) { return <><a className="back-link guided-back" href={backHref}>← {backLabel}</a><FormCard className="guided-flow-card">{children}</FormCard></>; }
export function BottomActions({ children }) { return <div className="bottom-actions">{children}</div>; }
export function InfoCard({ children, className = '' }) { return <section className={`info-card ${className}`}>{children}</section>; }
export function EmptyState({ title, children }) { return <section className="empty-state"><h2>{title}</h2>{children}</section>; }
export function LoadingState({ children }) { return <section className="loading-state">{children}</section>; }
export function Pagination({ currentPage, totalPages, onPageChange, labels = {} }) { if (totalPages <= 1) return null; return <nav className="pagination" aria-label={labels.aria ?? 'Pagination'}><button type="button" className="button-secondary" disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}>{labels.previous ?? 'Назад'}</button><span>{labels.status ? labels.status(currentPage, totalPages) : `${currentPage} / ${totalPages}`}</span><button type="button" className="button-secondary" disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)}>{labels.next ?? 'Вперед'}</button></nav>; }
