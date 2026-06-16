import SeoContentPage from '../../src/components/SeoContentPage.jsx';
import { seoPages } from '../../src/data/seoPages.js';

export const metadata = {
  title: 'Лучшие школы Астаны — рейтинг, отзывы и подбор | School Choice KZ',
  description: 'Сравните лучшие школы Астаны по рейтингу, районам, языкам обучения, стоимости и отзывам родителей.'
};

export default function Page() {
  return <SeoContentPage page={seoPages['best-schools-astana']} />;
}
