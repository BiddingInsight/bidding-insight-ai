
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
    { name: 'Home', path: '/', authRequired: false },
    { name: 'News', path: '/news', authRequired: true },
    { name: 'Procurement Act', path: '/procurement-act', authRequired: false },
];

export const DROPDOWN_NAV_LINKS: NavLink[] = [
    { name: 'Debarment/Suspension', path: '/debarment', authRequired: true },
    { name: 'Annual Procurement Plans', path: '/procurement-plans', authRequired: true },
    { name: 'Contact Us', path: '/contact', authRequired: false },
];
