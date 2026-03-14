import {
  Property,
  Booking,
  AIAction,
  MonthlyRevenue,
  Deposit,
  ExtraCharge,
  PricingRecommendation,
  PayoutSummary,
} from "./types";

// ============================================================
// OPENCLAW_HOOK: Live property data
// Integration: GET ${NEXT_PUBLIC_OPENCLAW_URL}/properties
// Current behavior: Returns hard-coded property list
// ============================================================
export const properties: Property[] = [
  {
    id: "prop-1",
    name: "Waikiki Beachfront Condo",
    type: "beachfront-condo",
    location: { lat: 21.2766, lng: -157.8272 },
    address: "2161 Kalia Rd, Honolulu, HI 96815",
    rate: 320,
    color: "#3B82F6",
    occupancy: 92,
    nextBooking: "2026-03-16",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=640&h=360&fit=crop&auto=format",
  },
  {
    id: "prop-2",
    name: "Diamond Head Ocean Suite",
    type: "beachfront-condo",
    location: { lat: 21.2614, lng: -157.8078 },
    address: "3045 Monsarrat Ave, Honolulu, HI 96815",
    rate: 285,
    color: "#8B5CF6",
    occupancy: 88,
    nextBooking: "2026-03-18",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=640&h=360&fit=crop&auto=format",
  },
  {
    id: "prop-3",
    name: "Kailua Beach House",
    type: "house",
    location: { lat: 21.3969, lng: -157.726 },
    address: "438 Kawailoa Rd, Kailua, HI 96734",
    rate: 450,
    color: "#10B981",
    occupancy: 78,
    nextBooking: "2026-03-20",
    image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=640&h=360&fit=crop&auto=format",
  },
  {
    id: "prop-4",
    name: "Waikiki Studio Retreat",
    type: "studio",
    location: { lat: 21.2819, lng: -157.8311 },
    address: "2330 Kuhio Ave, Honolulu, HI 96815",
    rate: 175,
    color: "#F59E0B",
    occupancy: 95,
    nextBooking: "2026-03-15",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=640&h=360&fit=crop&auto=format",
  },
  {
    id: "prop-5",
    name: "Manoa Valley Townhouse",
    type: "townhouse",
    location: { lat: 21.3156, lng: -157.8042 },
    address: "3142 Manoa Rd, Honolulu, HI 96822",
    rate: 225,
    color: "#EF4444",
    occupancy: 82,
    nextBooking: "2026-03-22",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=640&h=360&fit=crop&auto=format",
  },
];

// ============================================================
// OPENCLAW_HOOK: Live booking data
// Integration: GET ${NEXT_PUBLIC_OPENCLAW_URL}/bookings
// Current behavior: Returns hard-coded booking list
// ============================================================
export const bookings: Booking[] = [
  {
    id: "bk-1",
    propertyId: "prop-1",
    guestName: "Sarah Chen",
    guestEmail: "sarah.chen@email.com",
    guestPhone: "+1 (808) 555-0142",
    guestAvatar: "https://i.pravatar.cc/64?img=47",
    checkIn: "2026-03-10",
    checkOut: "2026-03-15",
    nightlyRate: 320,
    totalAmount: 1600,
    source: "airbnb",
    status: "checked-in",
    guests: 2,
  },
  {
    id: "bk-2",
    propertyId: "prop-1",
    guestName: "Michael Torres",
    guestEmail: "m.torres@email.com",
    checkIn: "2026-03-16",
    checkOut: "2026-03-21",
    nightlyRate: 340,
    totalAmount: 1700,
    source: "vrbo",
    status: "confirmed",
    guests: 3,
  },
  {
    id: "bk-3",
    propertyId: "prop-2",
    guestName: "Emily Watson",
    guestEmail: "emily.w@email.com",
    guestPhone: "+1 (415) 555-0289",
    guestAvatar: "https://i.pravatar.cc/64?img=5",
    checkIn: "2026-03-08",
    checkOut: "2026-03-14",
    nightlyRate: 285,
    totalAmount: 1710,
    source: "airbnb",
    status: "checked-in",
    guests: 2,
  },
  {
    id: "bk-4",
    propertyId: "prop-2",
    guestName: "James Park",
    guestEmail: "j.park@email.com",
    checkIn: "2026-03-18",
    checkOut: "2026-03-24",
    nightlyRate: 300,
    totalAmount: 1800,
    source: "direct",
    status: "confirmed",
    guests: 4,
  },
  {
    id: "bk-5",
    propertyId: "prop-3",
    guestName: "Lisa Nakamura",
    guestEmail: "lisa.n@email.com",
    checkIn: "2026-03-05",
    checkOut: "2026-03-12",
    nightlyRate: 450,
    totalAmount: 3150,
    source: "airbnb",
    status: "completed",
    guests: 6,
  },
  {
    id: "bk-6",
    propertyId: "prop-3",
    guestName: "Robert Kim",
    guestEmail: "r.kim@email.com",
    checkIn: "2026-03-20",
    checkOut: "2026-03-27",
    nightlyRate: 475,
    totalAmount: 3325,
    source: "vrbo",
    status: "confirmed",
    guests: 5,
  },
  {
    id: "bk-7",
    propertyId: "prop-4",
    guestName: "Amanda Liu",
    guestEmail: "a.liu@email.com",
    guestPhone: "+1 (213) 555-0374",
    guestAvatar: "https://i.pravatar.cc/64?img=9",
    checkIn: "2026-03-12",
    checkOut: "2026-03-16",
    nightlyRate: 175,
    totalAmount: 700,
    source: "airbnb",
    status: "checked-in",
    guests: 1,
  },
  {
    id: "bk-8",
    propertyId: "prop-4",
    guestName: "David Brown",
    guestEmail: "d.brown@email.com",
    checkIn: "2026-03-17",
    checkOut: "2026-03-20",
    nightlyRate: 185,
    totalAmount: 555,
    source: "direct",
    status: "confirmed",
    guests: 2,
  },
  {
    id: "bk-9",
    propertyId: "prop-5",
    guestName: "Jennifer Huang",
    guestEmail: "j.huang@email.com",
    checkIn: "2026-03-09",
    checkOut: "2026-03-13",
    nightlyRate: 225,
    totalAmount: 900,
    source: "vrbo",
    status: "completed",
    guests: 3,
  },
  {
    id: "bk-10",
    propertyId: "prop-5",
    guestName: "Chris Martinez",
    guestEmail: "c.martinez@email.com",
    guestPhone: "+1 (310) 555-0517",
    guestAvatar: "https://i.pravatar.cc/64?img=12",
    checkIn: "2026-03-14",
    checkOut: "2026-03-18",
    nightlyRate: 225,
    totalAmount: 900,
    source: "airbnb",
    status: "checked-in",
    guests: 2,
  },
  {
    id: "bk-11",
    propertyId: "prop-1",
    guestName: "Anna Schmidt",
    guestEmail: "a.schmidt@email.com",
    checkIn: "2026-03-24",
    checkOut: "2026-03-29",
    nightlyRate: 350,
    totalAmount: 1750,
    source: "airbnb",
    status: "confirmed",
    guests: 2,
  },
  {
    id: "bk-12",
    propertyId: "prop-2",
    guestName: "Tom Wilson",
    guestEmail: "t.wilson@email.com",
    checkIn: "2026-02-25",
    checkOut: "2026-03-02",
    nightlyRate: 285,
    totalAmount: 1425,
    source: "vrbo",
    status: "completed",
    guests: 2,
  },
  {
    id: "bk-13",
    propertyId: "prop-3",
    guestName: "Kate Johnson",
    guestEmail: "k.johnson@email.com",
    checkIn: "2026-02-20",
    checkOut: "2026-02-28",
    nightlyRate: 430,
    totalAmount: 3440,
    source: "direct",
    status: "completed",
    guests: 4,
  },
  {
    id: "bk-14",
    propertyId: "prop-4",
    guestName: "Ryan Patel",
    guestEmail: "r.patel@email.com",
    checkIn: "2026-03-22",
    checkOut: "2026-03-26",
    nightlyRate: 190,
    totalAmount: 760,
    source: "airbnb",
    status: "confirmed",
    guests: 2,
  },
  {
    id: "bk-15",
    propertyId: "prop-5",
    guestName: "Maria Garcia",
    guestEmail: "m.garcia@email.com",
    checkIn: "2026-03-22",
    checkOut: "2026-03-28",
    nightlyRate: 240,
    totalAmount: 1440,
    source: "vrbo",
    status: "confirmed",
    guests: 3,
  },
  {
    id: "bk-16",
    propertyId: "prop-1",
    guestName: "Kevin Tanaka",
    guestEmail: "k.tanaka@email.com",
    checkIn: "2026-02-15",
    checkOut: "2026-02-20",
    nightlyRate: 310,
    totalAmount: 1550,
    source: "airbnb",
    status: "completed",
    guests: 2,
  },
  {
    id: "bk-17",
    propertyId: "prop-4",
    guestName: "Sophie Lee",
    guestEmail: "s.lee@email.com",
    checkIn: "2026-03-02",
    checkOut: "2026-03-07",
    nightlyRate: 175,
    totalAmount: 875,
    source: "vrbo",
    status: "completed",
    guests: 1,
  },
];

// ============================================================
// OPENCLAW_HOOK: Real-time AI action feed
// Integration: WebSocket ${NEXT_PUBLIC_OPENCLAW_URL}/ws/actions
// Current behavior: Returns hard-coded action list
// ============================================================
export const aiActions: AIAction[] = [
  {
    id: "act-1",
    propertyId: "prop-1",
    category: "cleaning",
    title: "Scheduled turnover cleaning",
    description:
      "Booked Sparkle Clean Co. for March 15 checkout. Deep clean + linen change.",
    timestamp: "2026-03-14T09:30:00Z",
    status: "completed",
    cost: 185,
  },
  {
    id: "act-2",
    propertyId: "prop-3",
    category: "amazon",
    title: "Restocked kitchen supplies",
    description:
      "Ordered dish soap, sponges, paper towels, and trash bags via Amazon. Delivery by March 13.",
    timestamp: "2026-03-13T22:15:00Z",
    status: "completed",
    cost: 47,
  },
  {
    id: "act-3",
    propertyId: "prop-4",
    category: "pricing",
    title: "Adjusted weekend rate",
    description:
      "Increased nightly rate from $175 to $195 for March 20-22 weekend based on demand surge.",
    timestamp: "2026-03-13T18:00:00Z",
    status: "completed",
  },
  {
    id: "act-4",
    propertyId: "prop-2",
    category: "messaging",
    title: "Sent check-in instructions",
    description:
      "Auto-sent check-in guide with door code, WiFi, and parking info to Emily Watson.",
    timestamp: "2026-03-13T14:00:00Z",
    status: "completed",
  },
  {
    id: "act-5",
    propertyId: "prop-5",
    category: "repair",
    title: "Submitted maintenance request",
    description:
      "Guest reported AC making noise. Contacted Island HVAC for inspection on March 15.",
    timestamp: "2026-03-13T11:30:00Z",
    status: "in-progress",
    cost: 150,
  },
  {
    id: "act-6",
    propertyId: "prop-1",
    category: "calendar",
    title: "Synced Airbnb calendar",
    description:
      "Updated availability on Airbnb and VRBO. Blocked March 15 for cleaning buffer.",
    timestamp: "2026-03-13T08:00:00Z",
    status: "completed",
  },
  {
    id: "act-7",
    propertyId: "prop-3",
    category: "cleaning",
    title: "Mid-stay towel refresh",
    description:
      "Arranged fresh towel delivery for Kailua Beach House. Guest requested extra bath towels.",
    timestamp: "2026-03-12T16:45:00Z",
    status: "completed",
    cost: 45,
  },
  {
    id: "act-8",
    propertyId: "prop-2",
    category: "amazon",
    title: "Ordered replacement pillows",
    description:
      "2x king-size hypoallergenic pillows ordered. Previous set showing wear after 6 months.",
    timestamp: "2026-03-12T10:20:00Z",
    status: "completed",
    cost: 89,
  },
  {
    id: "act-9",
    propertyId: "prop-4",
    category: "messaging",
    title: "Responded to guest inquiry",
    description:
      'Auto-replied to Amanda Liu asking about late checkout. Offered 1pm checkout for $25 fee.',
    timestamp: "2026-03-12T08:15:00Z",
    status: "completed",
  },
  {
    id: "act-10",
    propertyId: "prop-5",
    category: "pricing",
    title: "Lowered midweek rate",
    description:
      "Reduced Tuesday-Thursday rate by 12% to fill gap. Competitor analysis showed lower demand.",
    timestamp: "2026-03-11T20:00:00Z",
    status: "completed",
  },
  {
    id: "act-11",
    propertyId: "prop-1",
    category: "messaging",
    title: "Sent checkout reminder",
    description:
      "Reminded Sarah Chen about March 15 checkout. Included trash/linens instructions.",
    timestamp: "2026-03-11T17:00:00Z",
    status: "completed",
  },
  {
    id: "act-12",
    propertyId: "prop-3",
    category: "repair",
    title: "Fixed leaking faucet",
    description:
      "Plumber completed kitchen faucet repair at Kailua Beach House. Washer replacement.",
    timestamp: "2026-03-10T14:30:00Z",
    status: "completed",
    cost: 120,
  },
  {
    id: "act-13",
    propertyId: "prop-2",
    category: "calendar",
    title: "Blocked dates for maintenance",
    description:
      "Reserved March 25-26 for deep cleaning and AC filter replacement at Diamond Head Suite.",
    timestamp: "2026-03-10T09:00:00Z",
    status: "pending",
  },
  {
    id: "act-14",
    propertyId: "prop-4",
    category: "cleaning",
    title: "Emergency spot clean",
    description:
      "Guest reported coffee spill on carpet. Arranged same-day spot cleaning service.",
    timestamp: "2026-03-09T19:00:00Z",
    status: "completed",
    cost: 75,
  },
  {
    id: "act-15",
    propertyId: "prop-5",
    category: "amazon",
    title: "Restocked bathroom amenities",
    description:
      "Ordered shampoo, conditioner, body wash, and hand soap refills for Manoa Townhouse.",
    timestamp: "2026-03-08T11:00:00Z",
    status: "completed",
    cost: 62,
  },
];

// ============================================================
// OPENCLAW_HOOK: Revenue analytics
// Integration: GET ${NEXT_PUBLIC_OPENCLAW_URL}/analytics/revenue
// Current behavior: Returns hard-coded monthly revenue data
// ============================================================
export const monthlyRevenue: MonthlyRevenue[] = [
  { month: "Apr 2025", revenue: 18200, expenses: 4800 },
  { month: "May 2025", revenue: 21500, expenses: 5200 },
  { month: "Jun 2025", revenue: 26800, expenses: 5900 },
  { month: "Jul 2025", revenue: 31200, expenses: 6800 },
  { month: "Aug 2025", revenue: 29400, expenses: 6200 },
  { month: "Sep 2025", revenue: 22100, expenses: 5100 },
  { month: "Oct 2025", revenue: 19800, expenses: 4600 },
  { month: "Nov 2025", revenue: 23500, expenses: 5400 },
  { month: "Dec 2025", revenue: 32100, expenses: 7200 },
  { month: "Jan 2026", revenue: 27300, expenses: 6100 },
  { month: "Feb 2026", revenue: 25800, expenses: 5700 },
  { month: "Mar 2026", revenue: 28450, expenses: 6300 },
];

// ============================================================
// OPENCLAW_HOOK: Deposit tracking
// Integration: GET ${NEXT_PUBLIC_OPENCLAW_URL}/finances/deposits
// Current behavior: Returns hard-coded deposit list
// ============================================================
export const deposits: Deposit[] = [
  { id: "dep-1", date: "2026-03-14", guestName: "Sarah Chen", propertyId: "prop-1", source: "airbnb", amount: 1600 },
  { id: "dep-2", date: "2026-03-12", guestName: "Emily Watson", propertyId: "prop-2", source: "airbnb", amount: 1710 },
  { id: "dep-3", date: "2026-03-10", guestName: "Lisa Nakamura", propertyId: "prop-3", source: "airbnb", amount: 3150 },
  { id: "dep-4", date: "2026-03-09", guestName: "Jennifer Huang", propertyId: "prop-5", source: "vrbo", amount: 900 },
  { id: "dep-5", date: "2026-03-07", guestName: "Sophie Lee", propertyId: "prop-4", source: "vrbo", amount: 875 },
  { id: "dep-6", date: "2026-03-02", guestName: "Tom Wilson", propertyId: "prop-2", source: "vrbo", amount: 1425 },
  { id: "dep-7", date: "2026-02-28", guestName: "Kate Johnson", propertyId: "prop-3", source: "direct", amount: 3440 },
  { id: "dep-8", date: "2026-02-20", guestName: "Kevin Tanaka", propertyId: "prop-1", source: "airbnb", amount: 1550 },
  { id: "dep-9", date: "2026-03-13", guestName: "Amanda Liu", propertyId: "prop-4", source: "airbnb", amount: 700 },
  { id: "dep-10", date: "2026-03-13", guestName: "Chris Martinez", propertyId: "prop-5", source: "airbnb", amount: 900 },
];

// ============================================================
// OPENCLAW_HOOK: Expense tracking
// Integration: GET ${NEXT_PUBLIC_OPENCLAW_URL}/finances/charges
// Current behavior: Returns hard-coded charge list
// ============================================================
export const extraCharges: ExtraCharge[] = [
  { id: "chg-1", date: "2026-03-14", propertyId: "prop-1", category: "Cleaning", description: "Turnover deep clean - Sparkle Clean Co.", amount: 185, aiInitiated: true },
  { id: "chg-2", date: "2026-03-13", propertyId: "prop-3", category: "Supplies", description: "Kitchen supplies restock via Amazon", amount: 47, aiInitiated: true },
  { id: "chg-3", date: "2026-03-13", propertyId: "prop-5", category: "Repair", description: "AC inspection - Island HVAC", amount: 150, aiInitiated: true },
  { id: "chg-4", date: "2026-03-12", propertyId: "prop-3", category: "Cleaning", description: "Mid-stay towel refresh service", amount: 45, aiInitiated: true },
  { id: "chg-5", date: "2026-03-12", propertyId: "prop-2", category: "Supplies", description: "Replacement pillows (2x king)", amount: 89, aiInitiated: true },
  { id: "chg-6", date: "2026-03-10", propertyId: "prop-3", category: "Repair", description: "Kitchen faucet repair - plumber", amount: 120, aiInitiated: false },
  { id: "chg-7", date: "2026-03-09", propertyId: "prop-4", category: "Cleaning", description: "Emergency carpet spot clean", amount: 75, aiInitiated: true },
  { id: "chg-8", date: "2026-03-08", propertyId: "prop-5", category: "Supplies", description: "Bathroom amenity restock", amount: 62, aiInitiated: true },
];

// ============================================================
// OPENCLAW_HOOK: AI pricing recommendations
// Integration: GET ${NEXT_PUBLIC_OPENCLAW_URL}/pricing/recommendations
// Current behavior: Returns hard-coded recommendations
// ============================================================
export const pricingRecommendations: PricingRecommendation[] = [
  {
    id: "rec-1",
    propertyId: "prop-1",
    currentRate: 320,
    suggestedRate: 380,
    reason: "Spring break demand surge detected. Competitor rates up 15-20% for beachfront units.",
    dateRange: { start: "2026-03-28", end: "2026-04-05" },
    status: "pending",
  },
  {
    id: "rec-2",
    propertyId: "prop-3",
    currentRate: 450,
    suggestedRate: 520,
    reason: "Easter weekend premium. Kailua Beach House historically books at 95%+ during holidays.",
    dateRange: { start: "2026-04-03", end: "2026-04-06" },
    status: "pending",
  },
  {
    id: "rec-3",
    propertyId: "prop-5",
    currentRate: 225,
    suggestedRate: 195,
    reason: "Low demand week detected. Reducing rate to improve fill rate and avoid vacancy.",
    dateRange: { start: "2026-04-07", end: "2026-04-11" },
    status: "pending",
  },
];

// ============================================================
// OPENCLAW_HOOK: Financial summary
// Integration: GET ${NEXT_PUBLIC_OPENCLAW_URL}/finances/summary
// Current behavior: Returns hard-coded payout summary
// ============================================================
export const payoutSummary: PayoutSummary = {
  totalRevenue: 28450,
  totalExpenses: 6300,
  netIncome: 22150,
};

export function getPropertyById(id: string): Property | undefined {
  return properties.find((p) => p.id === id);
}

export function getBookingsForProperty(propertyId: string): Booking[] {
  return bookings.filter((b) => b.propertyId === propertyId);
}

export function getActionsForProperty(propertyId: string): AIAction[] {
  return aiActions.filter((a) => a.propertyId === propertyId);
}
