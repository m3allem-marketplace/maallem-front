export interface WorkerSummary {
  id:          string;
  name:        string;
  avatar:      string;
  category:    string;
  rating:      number; // 0-5
  tier:        'bronze' | 'silver' | 'gold' | 'master';
  ratePerHour: number;
}