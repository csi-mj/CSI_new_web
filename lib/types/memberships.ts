export interface CsiMembership {
  id: string;
  email: string;
  name: string;
  contact: string | null;
  roll_no: string | null;
  branch: string | null;
  year: string | null;
  about_yourself: string | null;
  queries: string | null;
  payment_mode: 'online' | 'cash';
  payment_screenshot_url: string | null;
  status: 'pending' | 'verified' | 'rejected';
  created_at: string;
  updated_at: string;
}
