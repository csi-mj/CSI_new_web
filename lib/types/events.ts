// export interface Event {
//     id: string;
//     title: string;
//     description: string | null;
//     poster_url: string;
//     status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
//     event_date: string;
//     event_end_date: string | null;
//     venue: string | null;
//     category: string | null;
//     is_registration_open: boolean;
//     registration_start_date: string | null;
//     registration_end_date: string | null;
//     max_participants: number | null;
//     current_participants: number | null;
//     tags: string[];
//     created_at: string;
//     updated_at: string;
// }

// export interface CompletedEvent {
//     id: string;
//     title: string;
//     description: string | null;
//     poster_url: string;
//     status: 'completed';
//     event_date: string;
//     event_end_date: string | null;
//     venue: string | null;
//     category: string | null;
//     current_participants: number | null;
//     max_participants: number | null;
//     tags: string[];
//     completed_at: string;
//     days_since_completed: number;
// }

// export interface UpcomingEvent {
//     id: string;
//     title: string;
//     description: string | null;
//     poster_url: string;
//     status: 'upcoming';
//     event_date: string;
//     event_end_date: string | null;
//     venue: string | null;
//     category: string | null;
//     is_registration_open: boolean;
//     registration_start_date: string | null;
//     registration_end_date: string | null;
//     max_participants: number | null;
//     current_participants: number | null;
//     tags: string[];
//     spots_remaining: number | null;
//     days_until_event: number;
// }

// export interface OngoingEvent {
//     id: string;
//     title: string;
//     description: string | null;
//     poster_url: string;
//     status: 'ongoing';
//     event_date: string;
//     event_end_date: string | null;
//     venue: string | null;
//     category: string | null;
//     current_participants: number | null;
//     max_participants: number | null;
//     tags: string[];
//     started_at: string;
//     ends_at: string | null;
//     hours_remaining: number | null;
//     registration_status: 'closed';
//     try_on_spot: boolean;
// }

// export interface EventMetadata {
//   total_events: number;
//   upcoming_count: number;
//   completed_count: number;
//   ongoing_count: number;
//   cancelled_count: number;
//   total_registrations: number;
//   upcoming_with_registration_open: number;
//   last_updated: string;
// }

// export interface EventRegistration {
//     id: string;
//     event_id: string;
//     user_name: string;
//     user_email: string;
//     user_phone: string | null;
//     user_college: string | null;
//     user_year: string | null;
//     additional_info: Record<string, unknown> | null;
//     registration_status: 'pending' | 'confirmed' | 'rejected' | 'waitlisted';
//     created_at: string;
//     updated_at: string;
// }

// export interface RegistrationFormField {
//     name: string;
//     label: string;
//     type: 'text' | 'email' | 'tel' | 'select' | 'textarea';
//     required: boolean;
//     options?: string[];
//     placeholder?: string;
// }

// export interface RegistrationForm {
//     event_id: string;
//     form_fields: RegistrationFormField[];
// }

// export interface RegistrationRequest {
//     user_name: string;
//     user_email: string;
//     user_phone?: string;
//     user_college?: string;
//     user_year?: string;
//     additional_info?: Record<string, unknown>;
// }

// export interface RegistrationResponse {
//     registration_id: string;
//     status: 'pending' | 'confirmed' | 'rejected' | 'waitlisted';
//     message: string;
// }

// export interface ApiResponse<T> {
//     success: boolean;
//     data?: T;
//     error?: {
//         code: string;
//         message: string;
//         details?: Record<string, unknown>;
//     };
// }

export type ISODateString = string;

export interface BaseEvent {
  id: string;
  title: string;
  description?: string | null;
  poster_url?: string | null;
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  event_date: ISODateString;
  event_end_date?: ISODateString | null;
  venue?: string | null;
  category?: string | null;
  current_participants?: number | null;
  max_participants?: number | null;
  tags?: string[] | null;
  // common admin fields
  is_active?: boolean;
  created_at?: ISODateString;
  updated_at?: ISODateString;
}

export interface UpcomingEvent extends BaseEvent {
  status: "upcoming";
  is_registration_open?: boolean | null;
  registration_start_date?: ISODateString | null;
  registration_end_date?: ISODateString | null;
  spots_remaining?: number | null;
  days_until_event?: number | null;
}

export interface OngoingEvent extends BaseEvent {
  status: "ongoing";
  started_at?: ISODateString | null;
  ends_at?: ISODateString | null;
  hours_remaining?: number | null;
  registration_status?: "open" | "closed";
  try_on_spot?: boolean;
}

export interface CompletedEvent extends BaseEvent {
  status: "completed";
  completed_at?: ISODateString | null;
  days_since_completed?: number | null;
}

export type Event = UpcomingEvent | OngoingEvent | CompletedEvent;

// Generic API response wrapper used by API route helpers
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

// Registration form types
export interface RegistrationFormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'select' | 'textarea';
  required: boolean;
  options?: string[];
  placeholder?: string;
}

export interface RegistrationForm {
  event_id: string;
  form_fields: RegistrationFormField[];
}

// Registration responses
export interface RegistrationResponse {
  registration_id: string;
  status: 'pending' | 'confirmed' | 'rejected' | 'waitlisted';
  message: string;
}

// Metadata for /api/events summary endpoint
export interface EventMetadata {
  total_events: number;
  upcoming_count: number;
  completed_count: number;
  ongoing_count: number;
  cancelled_count: number;
  total_registrations: number;
  upcoming_with_registration_open: number;
  last_updated: string;
}
