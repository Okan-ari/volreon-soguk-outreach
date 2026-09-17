/**
 * 20 İşletme Kategorisi ve Google Haritalar Arama Sorguları
 */

const CATEGORIES = {
  dis_klinigi: {
    name: 'Diş Hekimi & Poliklinikleri',
    icon: '🦷',
    queries: (city) => [
      `${city} diş polikliniği`,
      `${city} diş hekimi kliniği`
    ]
  },
  estetik_merkezi: {
    name: 'Estetik & Plastik Cerrahi',
    icon: '✨',
    queries: (city) => [
      `${city} estetik cerrahi kliniği`,
      `${city} saç ekim merkezi`
    ]
  },
  butik_otel: {
    name: 'Butik Otel & Konaklama',
    icon: '🏨',
    queries: (city) => [
      `${city} butik otel`,
      `${city} otel konaklama`
    ]
  },
  restoran_kafe: {
    name: 'Restoran & Kafe & Bistro',
    icon: '🍽️',
    queries: (city) => [
      `${city} restoran`,
      `${city} bistro kafe`
    ]
  },
  hukuk_burosu: {
    name: 'Hukuk Bürosu & Avukatlık',
    icon: '⚖️',
    queries: (city) => [
      `${city} hukuk bürosu avukatlık`,
      `${city} avukatlık ofisi`
    ]
  },
  gayrimenkul_emlak: {
    name: 'Gayrimenkul & Emlak Ofisleri',
    icon: '🏢',
    queries: (city) => [
      `${city} gayrimenkul emlak ofisi`,
      `${city} emlak danışmanlığı`
    ]
  },
  guzellik_kuafor: {
    name: 'Güzellik Merkezi & Kuaför',
    icon: '💇‍♀️',
    queries: (city) => [
      `${city} güzellik merkezi`,
      `${city} kuaför güzellik salonu`
    ]
  },
  ozel_okul_kurs: {
    name: 'Özel Okul, Kolej & Kurslar',
    icon: '🎓',
    queries: (city) => [
      `${city} özel okul kolej`,
      `${city} yabancı dil kursu`
    ]
  },
  oto_servis_ekspertiz: {
    name: 'Oto Servis & Ekspertiz',
    icon: '🚗',
    queries: (city) => [
      `${city} oto servis bakım`,
      `${city} oto ekspertiz`
    ]
  },
  mimarlik_ofisi: {
    name: 'Mimarlık & İç Mimarlık',
    icon: '📐',
    queries: (city) => [
      `${city} mimarlık ofisi`,
      `${city} iç mimarlık tasarım`
    ]
  },
  psikolog_klinik: {
    name: 'Psikolog & Terapi Merkezleri',
    icon: '🧠',
    queries: (city) => [
      `${city} psikoloji danışmanlık merkezi`,
      `${city} psikolog klinik`
    ]
  },
  diyetisyen: {
    name: 'Diyetisyen & Beslenme Kliniği',
    icon: '🥗',
    queries: (city) => [
      `${city} diyetisyen kliniği`,
      `${city} beslenme danışmanlığı`
    ]
  },
  veteriner_klinigi: {
    name: 'Veteriner Klinikleri',
    icon: '🐾',
    queries: (city) => [
      `${city} veteriner kliniği`,
      `${city} hayvan hastanesi`
    ]
  },
  spor_salonu_fitness: {
    name: 'Spor Salonu & Pilates / Fitness',
    icon: '🏋️‍♂️',
    queries: (city) => [
      `${city} spor salonu fitness`,
      `${city} pilates stüdyosu`
    ]
  },
  dugun_organizasyon: {
    name: 'Düğün Salonu & Organizasyon',
    icon: '💍',
    queries: (city) => [
      `${city} düğün davet salonu`,
      `${city} organizasyon firması`
    ]
  },
  rent_a_car: {
    name: 'Rent a Car / Araç Kiralama',
    icon: '🔑',
    queries: (city) => [
      `${city} rent a car araç kiralama`,
      `${city} oto kiralama`
    ]
  },
  mali_musavir: {
    name: 'Mali Müşavirlik & Muhasebe',
    icon: '📊',
    queries: (city) => [
      `${city} serbest muhasebeci mali müşavir`,
      `${city} mali müşavirlik ofisi`
    ]
  },
  sigorta_acentesi: {
    name: 'Sigorta Acenteleri',
    icon: '🛡️',
    queries: (city) => [
      `${city} sigorta acentesi`,
      `${city} sigorta aracılık`
    ]
  },
  turizm_seyahat: {
    name: 'Turizm & Vize Danışmanlığı',
    icon: '✈️',
    queries: (city) => [
      `${city} seyahat turizm acentesi`,
      `${city} vize danışmanlık`
    ]
  },
  lojistik_nakliyat: {
    name: 'Lojistik & Evden Eve Nakliyat',
    icon: '🚚',
    queries: (city) => [
      `${city} evden eve nakliyat`,
      `${city} nakliye taşımacılık`
    ]
  }
};

const CITIES = [
  'İstanbul', 'Ankara', 'İzmir', 'Antalya', 'Bursa', 'Muğla', 'Adana', 'Gaziantep',
  'Konya', 'Kocaeli', 'Mersin', 'Kayseri', 'Eskişehir', 'Denizli', 'Samsun',
  'Trabzon', 'Aydın', 'Balıkesir', 'Sakarya', 'Tekirdağ', 'Çanakkale', 'Yalova'
];

module.exports = { CATEGORIES, CITIES };
