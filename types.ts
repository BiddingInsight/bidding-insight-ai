
export enum TenderStatus {
  Open = 'Open',
  Awarded = 'Awarded',
  Closed = 'Closed',
  Cancelled = 'Cancelled'
}

export interface Company {
  id: string;
  name:string;
  type: 'public_entity' | 'private_company';
  region?: string;
  industry?: string;
}

export interface Tender {
  id: string;
  referenceNumber: string;
  title: string;
  description: string;
  status: TenderStatus;
  entityId: string; // Foreign Key to Company
  entity: string; // Denormalized name for display
  closingDate: string;
  region: string;
  industry: string;
  imageUrl?: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  source: string;
  date: string;
  snippet: string;
  link: string;
}

export interface SuspendedEntity {
  id: string;
  name: string;
  reason: string;
  suspendedFrom: string;
  suspendedTo: string;
}

export interface ProcurementPlan {
  id: string;
  entity: string;
  title: string;
  period: string;
  link: string;
}

export interface NavLink {
    name: string;
    path: string;
    authRequired: boolean;
}

export interface SignUpDetails {
    companyName: string;
    companyRepresentativeName: string;
    email: string;
    industry: string;
    region: string;
    password: string;
    interestedEntityIds: string[];
}

export interface User {
    id: string;
    email: string;
    password: string;
    name: string;
    surname: string;
    companyId: string; // Foreign Key to Company
    isAdmin?: boolean;
    status: 'active' | 'suspended';
    createdAt: string;
    interestedEntityIds: string[];
}