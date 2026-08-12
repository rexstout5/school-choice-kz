const schools = [
  {
    id: 'bilim-astana',
    name: 'Bilim Astana School',
    rating: 4.8,
    language: 'Kazakh, Russian, English',
    monthlyPrice: 185000,
    classSize: 18,
    programs: ['STEM lab', 'Robotics', 'Debate club', 'IELTS preparation'],
    district: 'Astana, Yesil District'
  },
  {
    id: 'almaty-international',
    name: 'Almaty International Academy',
    rating: 4.6,
    language: 'English, Russian',
    monthlyPrice: 240000,
    classSize: 16,
    programs: ['International Baccalaureate', 'Arts studio', 'Model UN'],
    district: 'Almaty, Bostandyk District'
  },
  {
    id: 'shanyrak-lyceum',
    name: 'Shanyrak Lyceum',
    rating: 4.4,
    language: 'Kazakh, Russian',
    monthlyPrice: 120000,
    classSize: 22,
    programs: ['Olympiad math', 'Chess', 'National arts'],
    district: 'Shymkent, Al-Farabi District'
  },
  {
    id: 'nurly-zhol',
    name: 'Nurly Zhol Gymnasium',
    rating: 4.7,
    language: 'Kazakh, English',
    monthlyPrice: 160000,
    classSize: 20,
    programs: ['Coding', 'Entrepreneurship', 'Environmental science'],
    district: 'Karaganda, Kazybek bi District'
  },
  {
    id: 'caspian-school',
    name: 'Caspian Future School',
    rating: 4.5,
    language: 'Russian, English',
    monthlyPrice: 145000,
    classSize: 19,
    programs: ['Marine science', 'Football academy', 'Creative writing'],
    district: 'Aktau, Microdistrict 14'
  }
];

const schoolHelpers = {
  maxComparisonSchools: 3,
  storageKey: 'school-choice-comparison',
  formatPrice(value) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'KZT',
      maximumFractionDigits: 0
    }).format(value);
  },
  getSelectedIds() {
    try {
      return JSON.parse(localStorage.getItem(this.storageKey)) || [];
    } catch (error) {
      return [];
    }
  },
  saveSelectedIds(ids) {
    localStorage.setItem(this.storageKey, JSON.stringify(ids));
  },
  getSelectedSchools() {
    const selectedIds = this.getSelectedIds();
    return selectedIds
      .map((id) => schools.find((school) => school.id === id))
      .filter(Boolean);
  }
};
