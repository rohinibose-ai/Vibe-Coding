
export interface Listing {
  id: string;
  title: string;
  location: string;
  price: string;
  beds: number;
  baths: number;
  sqft: number;
  image: string;
  agentName: string;
  status: 'available' | 'sold' | 'rented';
  type: string;
  tags: string[];
  viewers: number;
  postedTime: string;
  trustScore: number;
  developer: string;
  completion: string;
  paymentPlan: string;
  referenceNumber: string;
  amenities: string[];
  description: string;
}
