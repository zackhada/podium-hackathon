export interface Property {
  id: string;
  name: string;
  type: "beachfront-condo" | "house" | "studio" | "townhouse";
  location: { lat: number; lng: number };
  address: string;
  rate: number;
  color: string;
  occupancy: number;
  nextBooking?: string;
  image?: string;
}

export interface Booking {
  id: string;
  propertyId: string;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  guestAvatar?: string;
  checkIn: string;
  checkOut: string;
  nightlyRate: number;
  totalAmount: number;
  source: "airbnb" | "vrbo" | "direct";
  status: "confirmed" | "checked-in" | "completed" | "cancelled";
  guests: number;
  notes?: string;
}

export type AIActionCategory =
  | "cleaning"
  | "amazon"
  | "repair"
  | "pricing"
  | "messaging"
  | "calendar";

export type AIActionStatus =
  | "completed"
  | "pending"
  | "in-progress"
  | "overridden"
  | "failed";

export interface AIAction {
  id: string;
  propertyId: string;
  category: AIActionCategory;
  title: string;
  description: string;
  timestamp: string;
  status: AIActionStatus;
  cost?: number;
  details?: string;
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
  expenses: number;
}

export interface Deposit {
  id: string;
  date: string;
  guestName: string;
  propertyId: string;
  source: "airbnb" | "vrbo" | "direct";
  amount: number;
}

export interface ExtraCharge {
  id: string;
  date: string;
  propertyId: string;
  category: string;
  description: string;
  amount: number;
  aiInitiated: boolean;
}

export interface PricingRecommendation {
  id: string;
  propertyId: string;
  currentRate: number;
  suggestedRate: number;
  reason: string;
  dateRange: { start: string; end: string };
  status: "pending" | "approved" | "rejected";
}

export interface PayoutSummary {
  totalRevenue: number;
  totalExpenses: number;
  netIncome: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface GuestMessage {
  id: string;
  role: "guest" | "agent";
  content: string;
  timestamp: string;
}

export interface GuestConversation {
  id: string;
  bookingId: string;
  guestName: string;
  guestAvatar?: string;
  propertyId: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: GuestMessage[];
}

export interface ZillowPropertyData {
  estimatedValue: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  yearBuilt: number;
  propertyType: string;
  suggestedNightlyRate: number;
  projectedAnnualRevenue: number;
  occupancyEstimate: number;
}

export interface ComparableListing {
  id: string;
  name: string;
  nightlyRate: number;
  occupancy: number;
  source: "airbnb" | "vrbo";
  distanceMiles: number;
  rating: number;
  reviewCount: number;
}

export interface NearbyAttraction {
  name: string;
  category: "beach" | "restaurant" | "activity" | "shopping" | "landmark";
  distanceMiles: number;
  rating: number;
}

export interface CleaningService {
  id: string;
  name: string;
  pricePerTurnover: number;
  rating: number;
  reviewCount: number;
  turnaroundHours: number;
  badge?: "Recommended" | "Budget" | "Premium";
}

export interface QuickbooksConnection {
  status: "connected";
  companyName: string;
  accountsLinked: number;
  lastSync: string;
}

export interface PropertySetupResult {
  address: string;
  displayName: string;
  location: { lat: number; lng: number };
  zillowData: ZillowPropertyData;
  comparables: ComparableListing[];
  attractions: NearbyAttraction[];
  cleaningServices: CleaningService[];
  quickbooks: QuickbooksConnection;
}
