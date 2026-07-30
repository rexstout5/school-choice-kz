import { schools } from '../src/data/schools.js';

export default function sitemap() {
  const base = 'https://bilimchoice.kz';
  const routes = ['', '/catalog', '/quiz', '/school-readiness', '/favorites', '/compare', '/contacts', '/contribute'];
  return [...routes.map((route) => ({ url: `${base}${route}`, changeFrequency: 'weekly' })), ...schools.map((school) => ({ url: `${base}/schools/${school.slug ?? school.id}`, changeFrequency: 'monthly' }))];
}
