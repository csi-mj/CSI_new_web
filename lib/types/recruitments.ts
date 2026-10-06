export interface Recruitment {
  id: string;
  name: string;
  email: string;
  phone: string;
  roll_no: string;
  branch: string;
  year: string;
  team: string; // 'Execom' or 'Core'
  portfolio_1: string;
  portfolio_2: string | null;
  resume_url: string | null;
  is_csi_member: boolean;
  other_clubs: string | null;
  status: 'pending' | 'shortlisted' | 'rejected' | 'interviewed' | 'selected';
  is_email_sent: boolean;
  interview_time: string | null; // ISO string
  interview_venue: string | null;
  created_at: string;
  updated_at: string;
}
