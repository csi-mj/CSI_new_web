import { z } from 'zod';

// Standard fields that map directly to database columns
const standardFields = {
  user_name: z.string().min(1, 'Name is required').max(200, 'Name is too long'),
  user_email: z.string().email('Invalid email address'),
  user_phone: z.string().optional(),
  user_college: z.string().optional(),
  user_year: z.string().optional()
};

// Schema for event registration request
// Allows standard fields + any additional fields (which will be stored in additional_info)
export const registrationRequestSchema = z
  .object(standardFields)
  .passthrough(); // Allows extra fields beyond the defined schema

