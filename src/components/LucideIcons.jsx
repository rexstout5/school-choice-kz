const paths = {
  heart: <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" />,
  globe: <><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 0 20M12 2a15.3 15.3 0 0 0 0 20" /></>,
  star: <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />,
  banknote: <><rect width="20" height="12" x="2" y="6" rx="2" /><circle cx="12" cy="12" r="2" /><path d="M6 10h.01M18 14h.01" /></>,
  sparkles: <><path d="m12 3-1.9 5.1L5 10l5.1 1.9L12 17l1.9-5.1L19 10l-5.1-1.9Z" /><path d="M5 3v4M3 5h4M19 17v4M17 19h4" /></>,
  checkCircle: <><path d="M22 11.1V12a10 10 0 1 1-5.9-9.1" /><path d="m9 11 3 3L22 4" /></>,
  instagram: <><rect width="20" height="20" x="2" y="2" rx="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37ZM17.5 6.5h.01" /></>,
  send: <><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></>,
  messageCircle: <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z" />
};

export default function LucideIcon({ name, size = 20, className = '', fill = 'none' }) {
  return (
    <svg className={`lucide-icon ${className}`.trim()} width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {paths[name]}
    </svg>
  );
}
