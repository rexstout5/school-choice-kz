import SeoContentPage from '../../src/components/SeoContentPage.jsx';
import { seoPages } from '../../src/data/seoPages.js';

export const metadata = {
  title: 'Готовность к школе — чек-лист для родителей | BilimChoice',
  description: 'Проверьте готовность ребенка к школе: самостоятельность, речь, социальные навыки, режим дня и адаптация к первому классу.'
};

export default function Page() {
  return <SeoContentPage page={seoPages['school-readiness']} />;
}
