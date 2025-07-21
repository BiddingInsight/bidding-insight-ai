
import { Tender, TenderStatus, NewsArticle, SuspendedEntity, ProcurementPlan, Company, User, SignUpDetails } from '../types';
import { REGIONS, INDUSTRIES } from '../constants';

// --- WARNING: DEVELOPMENT ONLY ---
// This entire file is a MOCK DATABASE for development and demonstration purposes.
// For a production deployment on your domain, you MUST replace this with a real
// backend API connected to a persistent database (e.g., PostgreSQL, MongoDB, etc.).
// All functions in `db` should be replaced with `fetch` calls to your API endpoints.
// ---

// --- DATABASE SIMULATION ---
// In a real application, this would be a backend connected to a database.
// We use async functions with a slight delay to mimic network latency.

const simulateDelay = (ms: number = 50) => new Promise(res => setTimeout(res, ms));

const getRandomElement = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const generateDate = (status: TenderStatus): string => {
    const now = new Date();
    const offset = Math.floor(Math.random() * 60) + 1; // days
    if (status === TenderStatus.Open) {
        const futureDate = new Date();
        futureDate.setDate(now.getDate() + offset);
        return futureDate.toISOString();
    } else {
        const pastDate = new Date();
        pastDate.setDate(now.getDate() - offset);
        return pastDate.toISOString();
    }
};

const statusMap: { [key: string]: TenderStatus } = {
    'OPEN': TenderStatus.Open,
    'CLOSED': TenderStatus.Closed,
    'AWARDED': TenderStatus.Awarded,
    'CANCELLED': TenderStatus.Cancelled,
};

const ADMIN_EMAIL = 'admin_bi@biddinginsight.ai';

// --- "TABLES" ---

const _companies: Company[] = [
    { id: 'c1', name: 'MUNICIPALITY OF SWAKOPMUND', type: 'public_entity' },
    { id: 'c2', name: 'OFFICE OF THE JUDICIARY', type: 'public_entity' },
    { id: 'c3', name: 'OMUSATI REGIONAL COUNCIL', type: 'public_entity' },
    { id: 'c4', name: 'MINISTRY OF AGRICULTURE, WATER & FORESTRY', type: 'public_entity' },
    { id: 'c5', name: 'GAME PRODUCTS TRUST FUND', type: 'public_entity' },
    { id: 'c6', name: 'NAMIBIAN AGRONOMIC BOARD', type: 'public_entity' },
    { id: 'c7', name: 'NAMIBIA INSTITUTE OF PUBLIC ADMINISTRATION & MANAGEMENT', type: 'public_entity' },
    { id: 'c8', name: 'AGRO-MARKETING AND TRADE AGENCY', type: 'public_entity' },
    { id: 'c9', name: 'BUSINESS & INTELLECTUAL PROPERTY AUTHORITY', type: 'public_entity' },
    { id: 'c10', name: 'MINISTRY OF EDUCATION, ARTS & CULTURE', type: 'public_entity' },
    { id: 'c11', name: 'NAMIBIAN COLLEGE OF OPEL LEARNING', type: 'public_entity' },
    { id: 'c12', name: 'MINISTRY OF LABOUR, INDUSTRIAL RELATIONS AND EMPLOYMENT CREATION', type: 'public_entity' },
    { id: 'c13', name: 'OUTAPI TOWN COUNCIL', type: 'public_entity' },
    { id: 'c14', name: 'MINISTRY OF INTERNATIONAL RELATIONS & CO-OPERATION', type: 'public_entity' },
    { id: 'c15', name: 'UNIVERSITY OF NAMIBIA', type: 'public_entity' },
    { id: 'c16', name: 'MINISTRY OF HEALTH AND SOCIAL SERVICES', type: 'public_entity' },
    { id: 'c17', name: 'TELECOM', type: 'public_entity' },
    { id: 'c18', name: 'NAMIBIA FINANCIAL INSTITUTIONS SUPERVISORY AUTHORITY', type: 'public_entity' },
    { id: 'c19', name: 'NATIONAL ROAD SAFETY COUNCIL', type: 'public_entity' },
    { id: 'c20', name: 'ROADS CONTRACTOR COMPANY', type: 'public_entity' },
    { id: 'c21', name: 'KAVANGO WEST REGIONAL COUNCIL', type: 'public_entity' },
    { id: 'c22', name: 'NKURENKURU TOWN COUNCIL', type: 'public_entity' },
    { id: 'c23', name: 'DIVUNDU VILLAGE COUNCIL', type: 'public_entity' },
    { id: 'c24', name: 'MINISTRY OF WORKS & TRANSPORT', type: 'public_entity' },
    { id: 'c25', name: 'NAMIBIAN COMPETITION COMMISSION', type: 'public_entity' },
    { id: 'c26', name: 'DEVELOPMENT BANK OF NAMIBIA', type: 'public_entity' },
    { id: 'c27', name: 'NAMIBIA QUALIFICATIONS AUTHORITY', type: 'public_entity' },
    { id: 'c28', name: 'MUNICIPALITY OF KEETMANSHOOP', type: 'public_entity' },
    { id: 'c29', name: 'MINISTRY OF FINANCE AND PUBLIC ENTERPRISES', type: 'public_entity' },
    { id: 'c30', name: 'NAMIBIA UNIVERSITY OF SCIENCE & TECHNOLOGY', type: 'public_entity' },
    { id: 'c31', name: 'OHANGWENA REGIONAL COUNCIL', type: 'public_entity' },
    { id: 'c32', name: 'RUNDU TOWN COUNCIL', type: 'public_entity' },
    { id: 'c33', name: 'MUNICIPALITY OF OMARURU', type: 'public_entity' },
    { id: 'c34', name: 'ELECTORAL COMMISSION OF NAMIBIA', type: 'public_entity' },
    { id: 'c35', name: 'OFFICE OF THE PRIME MINISTER', type: 'public_entity' },
    { id: 'c36', name: 'TRANSNAMIB HOLDINGS', type: 'public_entity' },
    { id: 'c37', name: 'COMMUNICATIONS REGULATORY AUTHORITY OF NAMIBIA', type: 'public_entity' },
    { id: 'c38', name: 'ROADS AUTHORITY', type: 'public_entity' },
    { id: 'c39', name: 'KHOMAS REGIONAL COUNCIL', type: 'public_entity' },
    { id: 'c40', name: 'MEAT CORPORATION OF NAMIBIA', type: 'public_entity' },
    { id: 'c41', name: 'HELAONAFIDI TOWN COUNCIL', type: 'public_entity' },
    { id: 'c42', name: 'City of Windhoek', type: 'public_entity'},
    { id: 'c43', name: 'NamPower', type: 'public_entity'},
    { id: 'c44', name: 'Admin Company', type: 'private_company'}
];

const companyNameToIdMap = new Map(_companies.map(c => [c.name, c.id]));

let _users: User[] = [
    { id: 'u0', email: ADMIN_EMAIL, password: 'N3wble$$ing@25', name: 'Admin', surname: 'BI', companyId: 'c44', isAdmin: true, status: 'active', createdAt: new Date('2024-01-01T00:00:00Z').toISOString(), interestedEntityIds: [] }
];

const rawTenderData = [
    { no: 1, title: 'CCTV SYSTEM INSTALLATION AT MUNICIPAL WORKS SECTION', entity: 'MUNICIPALITY OF SWAKOPMUND', ref: 'NCS/RFQ/SM-003/2024', status: 'CLOSED', imageUrl: '', description: 'Seeking bids for the supply, installation, and commissioning of a comprehensive CCTV surveillance system for the Municipal Works Section premises. Experience with similar municipal installations is required.' },
    { no: 2, title: 'SUPPLY AND DELIVERY OF REFRESHMENTS AND CUTLERY/TABLEWARE FOR A PERIOD OF 24 MONTHS', entity: 'OFFICE OF THE JUDICIARY', ref: 'G/RFQ/21-03/2024/25', status: 'CLOSED', imageUrl: '', description: 'The Office of the Judiciary requires a two-year contract for the regular supply of refreshments (tea, coffee, water) and disposable cutlery for meetings and official functions.' },
    { no: 3, title: 'PURCHASING OF TYRES FOR GRN 81069', entity: 'OMUSATI REGIONAL COUNCIL', ref: 'G/RFQ/ORC-76/2023/24', status: 'CLOSED', imageUrl: '', description: 'Request for quotations for the supply and delivery of a specific set of heavy-duty vehicle tyres for the government vehicle with registration GRN 81069.' },
    { no: 4, title: 'PURCHASING OF VEHICLE BATTERIES FOR OMUSATI REGIONAL COUNCIL', entity: 'OMUSATI REGIONAL COUNCIL', ref: 'G/IQ/ORC-06/2024/25', status: 'CLOSED', imageUrl: '', description: 'Invitation for quotes for the supply and delivery of various vehicle batteries for the Omusati Regional Council\'s fleet. Specifications for different vehicle models are provided in the bidding document.' },
    { no: 5, title: 'PROCUREMENT OF LABORATORY CONSUMABLES FOR THE PERIOD OF 36 MONTHS', entity: 'MINISTRY OF AGRICULTURE, WATER & FORESTRY', ref: 'G/RFQ/37-12/2024', status: 'CLOSED', imageUrl: '', description: 'A 36-month contract for the procurement and delivery of various laboratory consumables, including reagents, glassware, and testing kits for the Central Veterinary Laboratory.' },
    { no: 6, title: 'CONSTRUCTION OF CULVERT CROSS-OVER ACCESS POINTS AND BASIC EARTH WORKS', entity: 'GAME PRODUCTS TRUST FUND', ref: 'W/ONB/GPTF-06/2024/2025', status: 'CLOSED', imageUrl: 'https://images.unsplash.com/photo-1532092718199-36b375893551?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', description: 'Bids are invited for the construction of several culvert cross-over access points and associated earthworks within various national parks to improve patrol vehicle access.' },
    { no: 7, title: 'SUPPLY AND DELIVERY OF VEHICLE TYRES AND BATTERIES FOR A PERIOD OF 3 YEARS', entity: 'NAMIBIAN AGRONOMIC BOARD', ref: 'G/RFQ/NAB-009/2024/25', status: 'CLOSED', imageUrl: '', description: 'Framework agreement for the supply and delivery of vehicle tyres and batteries for the Namibian Agronomic Board\'s fleet over a three-year period. Bidders must be able to supply a range of brands.' },
    { no: 8, title: 'SUPPLY AND DELIVERY OF: OFFICE STATIONERY TO NIPAM OFFICE FOR A PERIOD OF THREE (3) YEARS', entity: 'NAMIBIA INSTITUTE OF PUBLIC ADMINISTRATION & MANAGEMENT', ref: 'G/ONB/NPM-02/2024/2025', status: 'CLOSED', imageUrl: '', description: 'NIPAM seeks a reliable supplier for a three-year contract to provide office stationery, including paper, toner cartridges, and other general office supplies.' },
    { no: 9, title: 'VEEAM BACKUP SOFTWARE RENEWAL - ONE (1) YEAR LICENSE RENEWAL', entity: 'NAMIBIA INSTITUTE OF PUBLIC ADMINISTRATION & MANAGEMENT', ref: 'NCS/ONB/NPM-02/2024-2025', status: 'CLOSED', imageUrl: '', description: 'Renewal of existing Veeam Backup & Replication software licenses for a period of one year. Bidders must be authorized Veeam resellers.' },
    { no: 10, title: 'SUPPLY ROAD MAKING SPRAYER', entity: 'MUNICIPALITY OF SWAKOPMUND', ref: 'G/RFQ/SM-045/2024', status: 'OPEN', imageUrl: '', description: 'Request for quotations for the supply and delivery of one (1) new road making sprayer (bitumen sprayer). Technical specifications are detailed in the bid document.' },
    { no: 11, title: 'PROVISION OF INTERNAL AUDIT SERVICES FOR THREE (3) YEARS', entity: 'NAMIBIA INSTITUTE OF PUBLIC ADMINISTRATION & MANAGEMENT', ref: 'CS/ONB/NPM-01/2024', status: 'OPEN', imageUrl: '', description: 'NIPAM invites proposals from qualified auditing firms to provide internal audit services for a three-year term, in accordance with IIA standards.' },
    { no: 12, title: 'PROVISION OF CLEANING SERVICES AT HEAD OFFICE', entity: 'UNIVERSITY OF NAMIBIA', ref: 'NCS/ONB/UNAM-05/2024', status: 'OPEN', imageUrl: '', description: 'The University of Namibia is seeking a contractor for the provision of professional cleaning and hygiene services at its Windhoek main campus head office buildings.' },
    { no: 13, title: 'SUPPLY AND DELIVERY OF PROTECTIVE CLOTHING', entity: 'RUNDU TOWN COUNCIL', ref: 'G/RFQ/RTC-15/2024', status: 'CLOSED', imageUrl: '', description: 'Supply and delivery of personal protective equipment (PPE), including overalls, safety boots, and gloves for the Rundu Town Council technical staff.' },
    { no: 14, title: 'MAINTENANCE OF AIR-CONDITIONING SYSTEMS', entity: 'MINISTRY OF HEALTH AND SOCIAL SERVICES', ref: 'W/ONB/MOHSS-08/2024', status: 'OPEN', imageUrl: 'https://images.unsplash.com/photo-1629013239274-45377199c03b?q=80&w=2866&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', description: 'Service and maintenance contract for air-conditioning units at various clinics and health centers within the Khomas region. Bidders must have certified HVAC technicians.' },
    { no: 15, title: 'CONSULTANCY FOR A NATIONAL ICT SURVEY', entity: 'COMMUNICATIONS REGULATORY AUTHORITY OF NAMIBIA', ref: 'CS/ICB/CRAN-01/2024', status: 'AWARDED', imageUrl: '', description: 'CRAN requires consultancy services to conduct a nationwide survey on ICT access, usage, and skills to inform national broadband policy. Strong experience in statistical analysis is required.' },
    { no: 16, title: 'UPGRADING OF THE NETWORK INFRASTRUCTURE', entity: 'TELECOM', ref: 'G/ICB/TEL-N01/2024', status: 'OPEN', imageUrl: 'https://images.unsplash.com/photo-1581094794329-c8112a89af10?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', description: 'This project involves the supply, installation, and configuration of core network routers and switches to upgrade Telecom Namibia\'s backbone infrastructure. Bidders must be certified partners of major network equipment vendors.' },
    { no: 17, title: 'PROCUREMENT OF 10,000 TABLETS FOR SCHOOLS', entity: 'MINISTRY OF EDUCATION, ARTS & CULTURE', ref: 'G/ONB/MEAC-22/2024', status: 'OPEN', imageUrl: 'https://images.unsplash.com/photo-1534665482403-a909d0d97c67?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', description: 'The Ministry invites bids for the procurement of 10,000 educational tablets pre-loaded with approved software for distribution to schools in rural areas.' },
    { no: 18, title: 'CONSTRUCTION OF A NEW OFFICE BLOCK IN KATIMA MULILO', entity: 'KHOMAS REGIONAL COUNCIL', ref: 'W/NCB/KRC-02/2024', status: 'CLOSED', imageUrl: '', description: 'Construction of a three-story office block for the Ministry of Home Affairs in Katima Mulilo. The project involves all civil, structural, electrical, and mechanical works.' },
    { no: 19, title: 'LEASING OF OFFICE SPACE IN WINDHOEK', entity: 'DEVELOPMENT BANK OF NAMIBIA', ref: 'NCS/RFQ/DBN-04/2024', status: 'CANCELLED', imageUrl: '', description: 'The DBN sought to lease approximately 500 square meters of A-grade office space in Windhoek\'s central business district. This tender has been cancelled.' },
    { no: 20, title: 'SUPPLY AND DELIVERY OF VETERINARY MEDICINE', entity: 'MEAT CORPORATION OF NAMIBIA', ref: 'G/RFQ/MEATCO-31/2024', status: 'OPEN', imageUrl: '', description: 'Request for quotes for a list of specified veterinary medicines and vaccines for livestock. Bidders must be registered with the Namibian Veterinary Council.' },
    { no: 21, title: 'PROVISION OF CATERING SERVICES FOR THE ECN', entity: 'ELECTORAL COMMISSION OF NAMIBIA', ref: 'NCS/ONB/ECN-03/2024', status: 'AWARDED', imageUrl: '', description: 'Contract for the provision of catering services (meals and refreshments) for election officials and staff during the upcoming national elections period.' },
    { no: 22, title: 'INSTALLATION OF SOLAR PANELS AT RUNDU CAMPUS', entity: 'NAMIBIA UNIVERSITY OF SCIENCE & TECHNOLOGY', ref: 'W/RFQ/NUST-11/2024', status: 'OPEN', imageUrl: 'https://images.unsplash.com/photo-1508515053969-7b94594e62c1?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', description: 'NUST invites bids for the design, supply, and installation of a grid-tied solar PV system at its Rundu Campus to reduce electricity costs.' },
    { no: 23, title: 'DEVELOPMENT OF A 5-YEAR STRATEGIC PLAN', entity: 'NATIONAL ROAD SAFETY COUNCIL', ref: 'CS/RFQ/NRSC-01/2024', status: 'CLOSED', imageUrl: '', description: 'The NRSC requires a consultant to facilitate workshops and develop its five-year strategic plan, including a monitoring and evaluation framework.' },
    { no: 24, title: 'REPAIR AND MAINTENANCE OF THE VEHICLE FLEET', entity: 'OFFICE OF THE PRIME MINISTER', ref: 'W/ONB/OPM-07/2024', status: 'OPEN', imageUrl: '', description: 'A three-year contract for the repair and maintenance services for the OPM\'s diverse vehicle fleet. Bidders must operate a certified garage in Windhoek.' },
    { no: 25, title: 'PRINTING AND DELIVERY OF ANNUAL REPORTS', entity: 'NAMIBIA QUALIFICATIONS AUTHORITY', ref: 'G/RFQ/NQA-02/2024', status: 'CLOSED', imageUrl: '', description: 'Printing, binding, and delivery of 1000 copies of the NQA Annual Report for 2023. High-quality color printing and finishing are required.' },
    { no: 26, title: 'PROVISION OF LEGAL ADVISORY SERVICES', entity: 'MINISTRY OF FINANCE AND PUBLIC ENTERPRISES', ref: 'CS/NCB/MOF-09/2024', status: 'OPEN', imageUrl: '', description: 'The Ministry is creating a panel of pre-qualified law firms to provide legal advisory services on public finance, procurement, and commercial law on an as-needed basis.' },
    { no: 27, title: 'GRAVELING OF RURAL ROADS IN OSHIKOTO', entity: 'ROADS AUTHORITY', ref: 'W/ICB/RA-45/2024', status: 'OPEN', imageUrl: 'https://images.unsplash.com/photo-1599421493390-016499801538?q=80&w=2952&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', description: 'Invitation for bids for the re-gravelling and maintenance of approximately 80km of specified rural roads in the Oshikoto region. Bidders must have appropriate road construction machinery.' },
    { no: 28, title: 'SUPPLY OF SEWER PIPES AND FITTINGS', entity: 'MUNICIPALITY OF OMARURU', ref: 'G/ONB/MUNOM-01/2024', status: 'CANCELLED', imageUrl: '', description: 'Tender for the supply of various sizes of uPVC sewer pipes and related fittings for municipal infrastructure upgrades. This tender has been cancelled and will be re-advertised.' },
    { no: 29, title: 'PROVISION OF DEBT COLLECTION SERVICES', entity: 'HELAONAFIDI TOWN COUNCIL', ref: 'CS/RFQ/HTC-03/2024', status: 'CLOSED', imageUrl: '', description: 'The Town Council seeks to appoint a debt collection agency to recover outstanding municipal rates and taxes. Bidders must be registered with the relevant authorities.' },
    { no: 30, title: 'CONSTRUCTION OF A COMMUNITY MARKET', entity: 'DIVUNDU VILLAGE COUNCIL', ref: 'W/ONB/DVC-02/2024', status: 'AWARDED', imageUrl: '', description: 'This project involved the construction of a new community market with vendor stalls, ablution facilities, and an administrative office in Divundu.' },
];

let _tenders: Tender[] = rawTenderData.map((t, index): Tender => {
    const status = statusMap[t.status] || TenderStatus.Closed;
    const companyId = companyNameToIdMap.get(t.entity);
    if (!companyId) {
        console.warn(`Company not found for tender: ${t.title}`);
    }
    return {
        id: (index + 1).toString(),
        referenceNumber: t.ref,
        title: t.title,
        description: t.description,
        status: status,
        entityId: companyId || 'unknown',
        entity: t.entity,
        closingDate: generateDate(status),
        region: getRandomElement(REGIONS),
        industry: getRandomElement(INDUSTRIES),
        imageUrl: t.imageUrl || undefined,
    };
});

const _newsArticles: NewsArticle[] = [
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

const _suspendedEntities: SuspendedEntity[] = [
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

let _procurementPlans: ProcurementPlan[] = [
    {
        id: '1',
        entity: 'MINISTRY OF HEALTH AND SOCIAL SERVICES',
        title: 'Annual Procurement Plan 2024/2025',
        period: '2024-04-01 to 2025-03-31',
        link: '#'
    },
    {
        id: '2',
        entity: 'NAMIBIA UNIVERSITY OF SCIENCE & TECHNOLOGY',
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
        entity: 'ROADS AUTHORITY',
        title: 'Annual Procurement Plan 2024/2025',
        period: '2024-04-01 to 2025-03-31',
        link: '#'
    }
];


// --- DB_SERVICE ---

export const db = {
    // READ
    async getTenders(filters?: { region?: string, industry?: string }): Promise<Tender[]> {
        await simulateDelay();
        let tenders = [..._tenders];
        if (filters) {
            if (filters.region && filters.region !== 'All') {
                tenders = tenders.filter(t => t.region === filters.region);
            }
            if (filters.industry && filters.industry !== 'All') {
                tenders = tenders.filter(t => t.industry === filters.industry);
            }
        }
        return tenders.sort((a, b) => new Date(b.closingDate).getTime() - new Date(a.closingDate).getTime());
    },
    async getNews(): Promise<NewsArticle[]> {
        await simulateDelay();
        return _newsArticles;
    },
    async getSuspendedEntities(): Promise<SuspendedEntity[]> {
        await simulateDelay();
        return _suspendedEntities;
    },
    async getProcurementPlans(): Promise<ProcurementPlan[]> {
        await simulateDelay();
        return [..._procurementPlans];
    },
    async getUsers(): Promise<User[]> {
        await simulateDelay();
        return [..._users];
    },
    async getCompanies(): Promise<Company[]> {
        await simulateDelay();
        return [..._companies].filter(c => c.type === 'public_entity').sort((a, b) => a.name.localeCompare(b.name));
    },

    // USER MANAGEMENT
    async addUser(details: SignUpDetails, isAdminAdd: boolean = false): Promise<User> {
        await simulateDelay(200);

        const existingUser = _users.find(u => u.email.toLowerCase() === details.email.toLowerCase());
        if (existingUser) {
            throw new Error("User with this email already exists.");
        }

        let company = _companies.find(c => c.name.toLowerCase() === details.companyName.toLowerCase());
        if (!company) {
            const newCompany: Company = {
                id: `c${_companies.length + 1}`,
                name: details.companyName,
                type: 'private_company',
                industry: details.industry,
                region: details.region
            };
            _companies.push(newCompany);
            companyNameToIdMap.set(newCompany.name, newCompany.id);
            company = newCompany;
        }
        
        const nameParts = details.companyRepresentativeName.split(' ');
        const name = nameParts.shift() || '';
        const surname = nameParts.join(' ') || '';

        const newUser: User = {
            id: `u${_users.length + 1}`,
            email: details.email,
            password: details.password,
            name: name,
            surname: surname,
            companyId: company.id,
            status: 'active',
            createdAt: new Date().toISOString(),
            isAdmin: isAdminAdd ? details.email.toLowerCase() === ADMIN_EMAIL : false,
            interestedEntityIds: details.interestedEntityIds || [],
        };
        _users.push(newUser);
        return newUser;
    },
    async loginUser(email: string, password: string): Promise<User> {
        await simulateDelay(200);
        const user = _users.find(u => u.email.toLowerCase() === email.toLowerCase());
        
        if (!user || user.password !== password) {
            throw new Error("Invalid email or password.");
        }
        
        return user;
    },
    async updateUser(userId: string, updates: Partial<User>): Promise<User> {
        await simulateDelay();
        const userIndex = _users.findIndex(u => u.id === userId);
        if (userIndex === -1) throw new Error("User not found");
        _users[userIndex] = { ..._users[userIndex], ...updates };
        return _users[userIndex];
    },
    async deleteUser(userId: string): Promise<void> {
        await simulateDelay();
        _users = _users.filter(u => u.id !== userId);
    },
    
    // TENDER MANAGEMENT
    async addTender(tender: Omit<Tender, 'id'>): Promise<Tender> {
        await simulateDelay();
        const newTender: Tender = { ...tender, id: `t${Date.now()}` };
        _tenders.unshift(newTender);
        return newTender;
    },
    async updateTender(tenderId: string, updates: Partial<Tender>): Promise<Tender> {
        await simulateDelay();
        const tenderIndex = _tenders.findIndex(t => t.id === tenderId);
        if (tenderIndex === -1) throw new Error("Tender not found");
        _tenders[tenderIndex] = { ..._tenders[tenderIndex], ...updates };
        return _tenders[tenderIndex];
    },
    async deleteTender(tenderId: string): Promise<void> {
        await simulateDelay();
        _tenders = _tenders.filter(t => t.id !== tenderId);
    },

    // PROCUREMENT PLAN MANAGEMENT
    async addProcurementPlan(plan: Omit<ProcurementPlan, 'id'>): Promise<ProcurementPlan> {
        await simulateDelay();
        const newPlan: ProcurementPlan = { ...plan, id: `p${Date.now()}`};
        _procurementPlans.push(newPlan);
        return newPlan;
    },
    async deleteProcurementPlan(planId: string): Promise<void> {
        await simulateDelay();
        _procurementPlans = _procurementPlans.filter(p => p.id !== planId);
    }
};