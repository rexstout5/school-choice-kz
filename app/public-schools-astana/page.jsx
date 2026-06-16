import SeoContentPage from '../../src/components/SeoContentPage.jsx';
import { seoPages } from '../../src/data/seoPages.js';

export const metadata = {
  title: 'Государственные школы Астаны — районы и языки | BilimChoice',
  description: 'Подборка государственных школ Астаны с районами, языками обучения, контактами и критериями выбора рядом с домом.'
};

export default function Page() {
  return <SeoContentPage page={seoPages['public-schools-astana']} />;
}
