export type InvestmentStatus =
  | 'active'
  | 'pending'
  | 'completed'
  | 'cancelled'
  | 'expired'
  | 'defaulted';

export type InvestmentReturn = {
  id: string;
  return_period: string | null;
  points_returned: number;
  distribution_date: string | null;
  return_rate_actual: number | null;
  notes?: string | null;
  created_at: string | null;
};

export type InvestmentProject = {
  id: string;
  name: string | null;
  slug: string | null;
  type: string | null;
  status: string | null;
  cover_image: string | null;
  producer: {
    id: string;
    name: string | null;
  } | null;
} | null;

export type InvestmentUser = {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
} | null;

export type Investment = {
  id: string;
  status: InvestmentStatus;
  investment_type: string | null;
  amount_eur: number;
  amount_points: number;
  expected_return_rate: number | null;
  returns_received_points: number;
  outstanding_points: number;
  last_return_date: string | null;
  maturity_date: string | null;
  created_at: string | null;
  updated_at: string | null;
  notes: string | null;
  investment_terms: Record<string, unknown> | null;
  user: InvestmentUser;
  project: InvestmentProject;
  returns_count: number;
  returns?: InvestmentReturn[];
};
