import SeoContentPage from '../../src/components/SeoContentPage.jsx';
import { seoPages } from '../../src/data/seoPages.js';

export const metadata = {
  title: 'Как выбрать школу в Астане — чек-лист для родителей | School Choice KZ',
  description: 'Практический гид по выбору школы: район, язык обучения, программа, стоимость, отзывы, безопасность и вопросы на день открытых дверей.'
};

export default function Page() {
  return <SeoContentPage page={seoPages['how-to-choose-school']} />;
}
