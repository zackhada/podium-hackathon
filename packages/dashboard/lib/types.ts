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
