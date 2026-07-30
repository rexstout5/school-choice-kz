export default function robots() {
  return { rules: [{ userAgent: '*', allow: '/', disallow: ['/admin/', '/submissions/'] }], sitemap: 'https://bilimchoice.kz/sitemap.xml' };
}
