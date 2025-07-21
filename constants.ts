import { NavLink } from './types';

export const REGIONS = [
  "Erongo", "Hardap", "Karas", "Kavango East", "Kavango West", "Khomas", "Kunene", "Ohangwena", "Omaheke", "Omusati", "Oshana", "Oshikoto", "Otjozondjupa", "Zambezi"
];

export const INDUSTRIES = [
  "Agriculture", "Mining", "Tourism", "Manufacturing", "Fishing", "Food Processing", "Mineral Beneficiation", 
  "Steel Manufacturing", "Automotive Parts Manufacturing", "Jewellery Industry", "Chemical Production", 
  "Aerospace Product and Parts Manufacturing", "Construction", "Financial Services", 
  "Retail", "Transportation", "Telecommunications", "Apparel", "Cement", "Electrical Equipment"
];

export const MAIN_NAV_LINKS: NavLink[] = [
    { name: 'News', path: '/news', authRequired: true },
    { name: 'Act', path: '/procurement-act', authRequired: false },
    { name: 'Suspended', path: '/debarment', authRequired: true },
    { name: 'Cancelled', path: '/cancelled-tenders', authRequired: true },
    { name: 'Plans', path: '/procurement-plans', authRequired: true },
    { name: 'Ping', path: '/contact', authRequired: false },
];