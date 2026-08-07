export interface SihSettings {
  title: string;
  intro: string;
  details: string;
  contact: string;
  template_url: string;
  is_open: boolean;
}

export const SIH_DEFAULTS: SihSettings = {
  title: 'Smart India Hackathon — Registration',
  intro:
    'Students interested in participating in the national-level Smart India Hackathon can form a team of six students, including at least one female student, and register below. Only the team leader should fill this form, using their college email ID (…@mjcollege.ac.in).',
  details:
    'Once the problem statements are uploaded on the SIH website, prepare your abstract and a 15-minute presentation. Winning teams from Hack Revolution (conducted by CSI & E-Cell on 08-11-25) receive direct entry — they can update their teams to a total of six students and submit before the deadline.',
  contact: 'Md Zainuddin Naveed · Assistant Professor, CSED · +91 80191 77889',
  template_url: '/forms/Team-Details.docx',
  is_open: true
};
