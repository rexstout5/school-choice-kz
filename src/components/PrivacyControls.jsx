'use client';

import { useState } from 'react';
import { clearBilimChoiceStorage } from '../lib/browserStorage.js';

export default function PrivacyControls() {
  const [cleared, setCleared] = useState(false);
  const clear = () => {
    clearBilimChoiceStorage();
    setCleared(true);
    window.dispatchEvent(new Event('bilimchoice:data-cleared'));
    window.setTimeout(() => window.location.reload(), 800);
  };
  return <aside className="privacy-controls" aria-label="Сохранённые данные">
    <button type="button" className="privacy-controls__button" onClick={clear}>Удалить мои сохранённые данные</button>
    <span role="status" aria-live="polite">{cleared ? 'Данные BilimChoice в этом браузере удалены.' : ''}</span>
  </aside>;
}
