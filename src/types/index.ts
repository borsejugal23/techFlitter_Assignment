export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface SpendMetric {
  current: number;
  reference: number;
  absoluteChange: number;
  percentChange: number;
}

export interface DataItem {
  country: string;
  state: string;
  city: string;
  sector: string;
  category: string;
  startDate: string;
  endDate: string;
  mySpend: SpendMetric;
  sameStoreSpend: SpendMetric;
  newStoreSpend: SpendMetric;
  lostStoreSpend: SpendMetric;
}

export interface UserData {
  userId: number;
  items: DataItem[];
}

export type MetricType = 'mySpend' | 'sameStoreSpend' | 'newStoreSpend' | 'lostStoreSpend';
export type AttributeType = 'country' | 'state' | 'city' | 'sector' | 'category';

export interface FilterState {
  startDate: Date | null;
  endDate: Date | null;
  sector: string[];
  category: string[];
  attributes: AttributeType[];
  metrics: MetricType[];
}

export interface GroupedData {
  [key: string]: {
    [metricType: string]: {
      current: number;
      reference: number;
      absoluteChange: number;
      percentChange: number;
    };
  };
}