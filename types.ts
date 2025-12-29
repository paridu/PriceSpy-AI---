
export interface PriceHistory {
  date: string;
  price: number;
}

export interface Competitor {
  id: string;
  name: string;
  url: string;
  currentPrice: number;
  lastPrice: number;
  lastUpdated: string;
  history: PriceHistory[];
  status: 'active' | 'error' | 'syncing';
}

export interface Product {
  id: string;
  name: string;
  myPrice: number;
  competitors: Competitor[];
}

export type ViewType = 'dashboard' | 'products' | 'alerts' | 'settings';
