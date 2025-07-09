import { Icons } from '@/components/icons';

export interface NavItem {
  title: string;
  url: string;
  disabled?: boolean;
  external?: boolean;
  shortcut?: [string, string];
  icon?: keyof typeof Icons;
  label?: string;
  description?: string;
  isActive?: boolean;
  items?: NavItem[];
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}

export interface NavItemWithOptionalChildren extends NavItem {
  items?: NavItemWithChildren[];
}

export interface FooterItem {
  title: string;
  items: {
    title: string;
    href: string;
    external?: boolean;
  }[];
}

export type MainNavItem = NavItemWithOptionalChildren;

export type SidebarNavItem = NavItemWithChildren;

// Procurement Types
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

export interface ProcurementTicket {
  id?: string;
  ticketId: string;
  title?: string;
  requester?: string;
  department?: string;
  amount?: number;
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'in-progress';
  priority?: 'low' | 'medium' | 'high';
  date: string;
  createdDate?: string;
  createdAt: string;
  description?: string;
  
  // Basic Information
  salesManager: string;
  personnelNumber?: string;
  telefon: string;
  profitcenter: string;
  euTaxonomy?: string;
  
  // Customer Information
  customerName: string;
  customerCVR: string;
  customerOrderNumber: string;
  portfolioElement?: string;
  
  // Sales Information
  salesOrg: string;
  distributionChannel: string;
  salesOffice: string;
  salesGroup: string;
  localReportingCode: string;
  prodHierarchy: string;
  
  // Delivery Information
  company: string;
  attention: string;
  department: string;
  roadNumber: string;
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
  
  // Comments/Notes
  comments: Array<{
    id: string;
    text: string;
    author: string;
    timestamp: string;
  }>;
}
