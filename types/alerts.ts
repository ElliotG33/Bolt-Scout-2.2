export interface Alert {
  _id: string;
  userEmail?: string;
  email: string;
  keywords: string[];
  frequency: number;
  active: boolean;
  createdAt: string;
  lastRun?: string;
}

export interface AlertParams {
  id: string;
}
