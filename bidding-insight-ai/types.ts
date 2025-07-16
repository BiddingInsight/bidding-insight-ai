
export enum TenderStatus {
  Open = 'Open',
  Awarded = 'Awarded',
  Closed = 'Closed',
  Cancelled = 'Cancelled'
}

export interface Tender {
  id: string;
  referenceNumber: string;
  title: string;
  description: string;
  status: TenderStatus;
  entity: string;
  closingDate: string;
  region: string;
  industry: string;
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
