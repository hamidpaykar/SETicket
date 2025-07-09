export type TicketStatus =
  | "pending"
  | "in-progress"
  | "approved"
  | "rejected"
  | "completed"
  | "closed"

export interface MaterialItem {
  id: string;
  position: string;
  description: string;
  materialNumber: string;
  quantity: string;
  currency: string;
  costPrice: string;
  salesCurrency: string;
  salesPrice: string;
  vendor: string;
  vendorNumber: string;
  offerNumber: string;
  requestedDeliveryDate: string;
  confirmedDeliveryDate: string;
  purchaseOrderNo: string;
}

export interface Comment {
  id: string;
  author: string;
  role: 'admin' | 'user' | 'system';
  message: string;
  timestamp: string;
  edited?: boolean;
  editedAt?: string;
}

export interface ProcurementTicket {
  id: string;
  ticketId: string;
  title: string;
  description: string;
  requester: string;
  department: string;
  amount: number;
  priority: 'low' | 'medium' | 'high';
  status: TicketStatus;
  createdDate: string;
  createdAt?: string;
  date?: string;

  // Sales Manager Information
  salesManager?: string;
  personnelNumber?: string;
  telefon?: string;
  profitcenter?: string;
  euTaxonomy?: string;

  // Customer Information
  customerName?: string;
  customerCVR?: string;
  customerOrderNumber?: string;
  portfolioElement?: string;

  // Sales Information
  salesOrg?: string;
  distributionChannel?: string;
  salesOffice?: string;
  salesGroup?: string;
  localReportingCode?: string;
  prodHierarchy?: string;

  // Delivery Information
  company?: string;
  attention?: string;
  roadNumber?: string;
  postcode?: string;
  cityLand?: string;
  contactEmail?: string;
  incoterms?: string;

  // Invoice Address
  invoiceAddress?: string;

  // Materials
  materials: MaterialItem[];

  // Additional Information
  headerText?: string;
  confirmationText?: string;
  deliveryNote?: string;
  purchaseMessage?: string;

  // Comments
  comments: Comment[];

  // File attachments
  attachments?: File[];
}

export interface StatusCounts {
  all: number;
  pending: number;
  'in-progress': number;
  approved: number;
  rejected: number;
  completed: number;
  closed: number;
  [key: string]: number;
}
