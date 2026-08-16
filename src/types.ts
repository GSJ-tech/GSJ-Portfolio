export interface ProjectTimelineMilestone {
  date: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'planned';
}

export interface Project {
  id: string;
  title: string;
  category: string;
  tagline: string;
  description: string;
  imageColor: string;
  iconType: 'restaurant' | 'gym' | 'creator' | 'coaching' | 'game' | 'code';
  technologies: string[];
  features: string[];
  demoUrl: string;
  githubUrl: string;
  isGame?: boolean;
  timeline: ProjectTimelineMilestone[];
  duration: string;
  status: 'Completed' | 'In Development' | 'Planned';
}

export interface InquiryMessage {
  id: string;
  name: string;
  email: string;
  service: string;
  timeline: string;
  message: string;
  date: string;
  read: boolean;
}

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'gym',
    title: 'IronForge Fitness & Performance',
    category: 'Gym & Athletic Portal',
    tagline: 'High-energy fitness website with membership tiers, workout schedules, and trainer booking',
    description:
      'A full-featured athletic hub built for high conversions. Includes dynamic membership tier comparisons, live workout class schedules, certified personal trainer rosters with direct booking, an integrated BMI & macro calculator, and a free 1-day pass claim system.',
    imageColor: 'from-red-600/40 via-orange-600/20 to-slate-950',
    iconType: 'gym',
    technologies: ['HTML5', 'Modern CSS3', 'JavaScript ES6+', 'Firebase Firestore', 'Responsive Grid'],
    features: [
      'Interactive Tiered Membership Matrix with Monthly/Annual toggle',
      'Certified Trainer Rosters with specialty tags & direct consultation modal',
      'Integrated BMI, Calorie & Macro calculator tool',
      'Free 1-Day Trial Pass claim system with instant validation'
    ],
    duration: '5 Days Dev Time',
    status: 'Completed',
    demoUrl: '#demo-gym',
    githubUrl: 'https://github.com/GSJ-Dev/ironforge-gym-portal',
    timeline: [
      { date: 'Day 1', title: 'UX Architecture & Wireframing', description: 'Defined membership tiers, booking funnel, and athletic dark theme aesthetics.', status: 'completed' },
      { date: 'Day 2', title: 'Hero & Membership Comparison Matrix', description: 'Engineered responsive pricing switchers and high-impact hero visual hierarchy.', status: 'completed' },
      { date: 'Day 3', title: 'Trainer Profiles & Class Schedule Grid', description: 'Built dynamic filterable trainer cards and interactive weekly schedule calendar.', status: 'completed' },
      { date: 'Day 4', title: 'Interactive Health Calculators', description: 'Developed client-side BMI and daily caloric target calculation engines.', status: 'completed' },
      { date: 'Day 5', title: 'Pass Claim Logic & Mobile QA', description: 'Integrated form validation and cross-device testing on mobile, tablet, and desktop.', status: 'completed' }
    ]
  },
  {
    id: 'restaurant',
    title: 'Aura & Flame Bistro',
    category: 'Restaurant & Hospitality',
    tagline: 'Modern restaurant website with filterable menu, table booking and 1-click WhatsApp ordering',
    description:
      'An elegant culinary digital storefront with category-based menu filtering, dietary indicators (Vegan, Gluten-Free, Chef Special), instant online table reservation system, and a live WhatsApp checkout cart builder for quick takeout orders.',
    imageColor: 'from-amber-600/40 via-yellow-600/20 to-slate-950',
    iconType: 'restaurant',
    technologies: ['HTML5', 'CSS3 Glassmorphism', 'JavaScript ES6+', 'WhatsApp Business API', 'LocalStorage'],
    features: [
      'Categorized interactive culinary menu with dietary tags & search',
      'Live 1-Click WhatsApp Takeout Cart builder with price summary',
      'Smart table reservation booking system with time slot picker',
      'Chef signature dishes showcase and guest reviews slider'
    ],
    duration: '4 Days Dev Time',
    status: 'Completed',
    demoUrl: '#demo-restaurant',
    githubUrl: 'https://github.com/GSJ-Dev/aura-flame-bistro',
    timeline: [
      { date: 'Day 1', title: 'Menu Architecture & Visual Layout', description: 'Organized food sections, dietary icons, and luxury dark gold aesthetic.', status: 'completed' },
      { date: 'Day 2', title: 'Interactive Menu & Category Filters', description: 'Coded real-time item search, pricing tabs, and dietary badge toggles.', status: 'completed' },
      { date: 'Day 3', title: 'WhatsApp Cart Generator & Checkout', description: 'Created cart state management and automatic WhatsApp formatted order links.', status: 'completed' },
      { date: 'Day 4', title: 'Table Reservation Flow & Launch', description: 'Built reservation modal, validation, and Lighthouse 99+ speed optimization.', status: 'completed' }
    ]
  },
  {
    id: 'creator',
    title: 'Kairo Media | Creator & Influencer Hub',
    category: 'Creator & Personal Brand',
    tagline: 'High-converting media kit, video showcase, brand sponsorship inquiry & merch portal',
    description:
      'A sleek, futuristic personal brand portal built for a content creator / YouTuber. Features a live YouTube video gallery preview, verified audience demographics & statistics media kit for brands, direct sponsorship inquiry workflow, and digital product / merch showcase.',
    imageColor: 'from-purple-600/40 via-pink-600/20 to-slate-950',
    iconType: 'creator',
    technologies: ['HTML5', 'Modern CSS', 'JavaScript ES6+', 'YouTube Embed API', 'Media Kit Grid'],
    features: [
      'Interactive Media Kit with verified audience stats (Subscribers, Views, Demographics)',
      'Featured Video Grid with responsive popup player previews',
      'Dedicated Brand Sponsorship & Collaboration proposal form',
      'Digital products, presets & creator newsletter sign-up'
    ],
    duration: '4 Days Dev Time',
    status: 'Completed',
    demoUrl: '#demo-creator',
    githubUrl: 'https://github.com/GSJ-Dev/kairo-creator-hub',
    timeline: [
      { date: 'Day 1', title: 'Brand Identity & Media Kit Layout', description: 'Structured creator analytics, channel stats, and brand partner logos.', status: 'completed' },
      { date: 'Day 2', title: 'Video Portfolio & Showcase Grid', description: 'Constructed responsive video tiles, category badges, and watch triggers.', status: 'completed' },
      { date: 'Day 3', title: 'Sponsorship Inquiry Funnel', description: 'Built tailored brand booking form with budget selectors and deliverables list.', status: 'completed' },
      { date: 'Day 4', title: 'Merch / Digital Downloads & SEO', description: 'Added digital presets showcase, social links hub, and lightning speed polish.', status: 'completed' }
    ]
  },
  {
    id: 'game',
    title: 'Shadow Jump: Neon Odyssey',
    category: 'Browser Game',
    tagline: 'Cyber neon browser platformer game with live Canvas physics and leaderboard',
    description:
      'A fast-paced endless cyber platformer running on HTML5 Canvas and vanilla JavaScript. Features dynamic obstacle generation, collision physics, high score persistence, and keyboard/touch controls.',
    imageColor: 'from-cyan-600/40 via-blue-600/20 to-slate-950',
    iconType: 'game',
    technologies: ['HTML5 Canvas', 'Vanilla JavaScript', 'Audio API', 'LocalStorage'],
    features: [
      'Smooth 60 FPS Canvas rendering with neon cyber shaders',
      'Dynamic obstacles and increasing speed physics',
      'Local high score tracking and restart loop',
      'Mobile touch & desktop spacebar controls'
    ],
    duration: '6 Days Dev Time',
    status: 'Completed',
    demoUrl: '#play-game',
    githubUrl: 'https://github.com/GSJ-Dev/shadow-jump-neon',
    isGame: true,
    timeline: [
      { date: 'Day 1-2', title: 'Canvas Physics & 60 FPS Game Loop', description: 'Built gravity simulation, jump impulses, and obstacle bounding boxes.', status: 'completed' },
      { date: 'Day 3-4', title: 'Neon Visuals & Shaders', description: 'Engineered glowing player trails, cyber grid floors, and hazard styles.', status: 'completed' },
      { date: 'Day 5-6', title: 'Score Persistence & Mobile Touch', description: 'Added localStorage high-score saver and responsive touch-jump handlers.', status: 'completed' }
    ]
  }
];
