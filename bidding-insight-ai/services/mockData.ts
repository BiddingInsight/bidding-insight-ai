
import { Tender, TenderStatus, NewsArticle, SuspendedEntity, ProcurementPlan } from '../types';
import { REGIONS, INDUSTRIES } from '../constants';

const getRandomElement = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const MOCK_TENDERS: Tender[] = [
  {
    id: '1',
    referenceNumber: 'G/ONB/01-2024',
    title: 'Supply and Delivery of IT Equipment',
    description: 'The Ministry of Information and Communication Technology invites bids for the supply and delivery of laptops, desktops, and printers for its various offices across the country. The equipment must meet the specifications outlined in the bidding document. Bidders must have a proven track record of supplying IT equipment to government entities.',
    status: TenderStatus.Open,
    entity: 'Ministry of ICT',
    closingDate: '2024-08-30T12:00:00Z',
    region: 'Khomas',
    industry: 'Telecommunications'
  },
  {
    id: '2',
    referenceNumber: 'W/RFQ/05-2024',
    title: 'Construction of a Community Hall in Keetmanshoop',
    description: 'The Karas Regional Council requires the services of a qualified construction company to build a new community hall. The project includes foundation work, bricklaying, roofing, plumbing, and electrical installations. Preference will be given to local contractors from the Karas region.',
    status: TenderStatus.Open,
    entity: 'Karas Regional Council',
    closingDate: '2024-09-15T12:00:00Z',
    region: 'Karas',
    industry: 'Construction'
  },
  {
    id: '3',
    referenceNumber: 'CS/NCB/02-2024',
    title: 'Consultancy Services for Environmental Impact Assessment',
    description: 'NamPower seeks a consultancy firm to conduct a comprehensive Environmental Impact Assessment (EIA) for a proposed solar power plant project in the Erongo Region. The firm must be registered with the Environmental Commissioner.',
    status: TenderStatus.Awarded,
    entity: 'NamPower',
    closingDate: '2024-06-20T12:00:00Z',
    region: 'Erongo',
    industry: 'Mining'
  },
    {
    id: '4',
    referenceNumber: 'G/OIB/NAM-002',
    title: 'Procurement of Agricultural Machinery',
    description: 'The Ministry of Agriculture, Water and Land Reform is seeking bids for the supply of tractors, planters, and harvesters to support small-scale farmers in the Kavango West region. International bidders are welcome but must partner with a local entity.',
    status: TenderStatus.Open,
    entity: 'Ministry of Agriculture',
    closingDate: '2024-09-25T17:00:00Z',
    region: 'Kavango West',
    industry: 'Agriculture'
  },
  {
    id: '5',
    referenceNumber: 'NCS/ONB/03-2024',
    title: 'Provision of Security Services for Government Buildings',
    description: 'The Office of the Prime Minister invites bids from reputable security companies for the provision of 24/7 security services at various government buildings in Windhoek for a period of 3 years.',
    status: TenderStatus.Closed,
    entity: 'Office of the Prime Minister',
    closingDate: '2024-07-10T12:00:00Z',
    region: 'Khomas',
    industry: 'Retail'
  },
  {
    id: '6',
    referenceNumber: 'W/ICB/DEBT-101',
    title: 'Re-gravelling of District Road DR3617',
    description: 'The Roads Authority of Namibia invites bids for the re-gravelling of a 45km stretch of district road DR3617 in the Oshana Region. Bidders must be registered with the Roads Authority and have the necessary equipment and experience.',
    status: TenderStatus.Open,
    entity: 'Roads Authority',
    closingDate: '2024-08-22T12:00:00Z',
    region: 'Oshana',
    industry: 'Construction'
  }
];

export const MOCK_NEWS_ARTICLES: NewsArticle[] = [
    {
        id: '1',
        title: 'Govt awards N$2.3 billion in tenders for Q1 2024',
        source: 'The Namibian',
        date: '2024-07-25',
        snippet: 'The Central Procurement Board of Namibia (CPBN) announced that tenders worth N$2.3 billion were awarded in the first quarter of 2024, with a significant portion going to the construction and IT sectors.',
        link: 'https://www.namibian.com.na'
    },
    {
        id: '2',
        title: 'CPBN calls for transparency in bidding process',
        source: 'New Era',
        date: '2024-07-22',
        snippet: 'The head of the CPBN has reiterated the importance of transparency and fairness in the public procurement process, urging all public entities to adhere strictly to the Procurement Act.',
        link: 'https://neweralive.na'
    },
    {
        id: '3',
        title: 'Suspension of bidders on the rise due to non-compliance',
        source: 'Namibian Sun',
        date: '2024-07-19',
        snippet: 'An increasing number of companies are being suspended from participating in public tenders due to failure to comply with tax and social security regulations, a new report reveals.',
        link: 'https://www.namibiansun.com'
    },
    {
        id: '4',
        title: 'SME preference system under review',
        source: 'Economist Namibia',
        date: '2024-07-15',
        snippet: 'The Ministry of Finance is reviewing the preference system for Small and Medium Enterprises (SMEs) in public procurement to ensure it achieves its intended goal of empowering local businesses.',
        link: 'https://economist.com.na/'
    }
];

export const MOCK_SUSPENDED_ENTITIES: SuspendedEntity[] = [
    {
        id: '1',
        name: 'QuickBuild Construction CC',
        reason: 'Non-compliance with Social Security Act',
        suspendedFrom: '2024-05-01',
        suspendedTo: '2025-04-30'
    },
    {
        id: '2',
        name: 'General Supplies Ltd',
        reason: 'Submission of fraudulent documents',
        suspendedFrom: '2024-03-15',
        suspendedTo: '2026-03-14'
    },
    {
        id: '3',
        name: 'Coastal Logistics',
        reason: 'Failure to declare conflict of interest',
        suspendedFrom: '2024-06-20',
        suspendedTo: '2024-12-19'
    },
    {
        id: '4',
        name: 'Desert IT Solutions',
        reason: 'Failure to deliver on a previous contract',
        suspendedFrom: '2023-11-10',
        suspendedTo: '2025-11-09'
    }
];

export const MOCK_PROCUREMENT_PLANS: ProcurementPlan[] = [
    {
        id: '1',
        entity: 'Ministry of Health and Social Services',
        title: 'Annual Procurement Plan 2024/2025',
        period: '2024-04-01 to 2025-03-31',
        link: '#'
    },
    {
        id: '2',
        entity: 'Namibia University of Science and Technology (NUST)',
        title: 'Annual Procurement Plan 2024/2025',
        period: '2024-04-01 to 2025-03-31',
        link: '#'
    },
    {
        id: '3',
        entity: 'City of Windhoek',
        title: 'Annual Procurement Plan 2024/2025',
        period: '2024-04-01 to 2025-03-31',
        link: '#'
    },
    {
        id: '4',
        entity: 'Roads Authority',
        title: 'Annual Procurement Plan 2024/2025',
        period: '2024-04-01 to 2025-03-31',
        link: '#'
    }
];
