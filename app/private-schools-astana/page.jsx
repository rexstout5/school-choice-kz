import SeoContentPage from '../../src/components/SeoContentPage.jsx';
import { seoPages } from '../../src/data/seoPages.js';

export const metadata = {
  title: 'Частные школы Астаны — стоимость и программы | School Choice KZ',
  description: 'Каталог частных школ Астаны: стоимость, языки обучения, программы полного дня, районы и ссылки на профили школ.'
};

export default function Page() {
  return <SeoContentPage page={seoPages['private-schools-astana']} />;
}
