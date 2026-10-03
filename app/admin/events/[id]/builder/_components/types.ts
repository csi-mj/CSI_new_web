export type FieldType = 'text' | 'email' | 'tel' | 'number' | 'url' | 'textarea' | 'radio' | 'checkbox' | 'select' | 'file';

export interface FormField {
  id: string;
  name: string;        // auto-generated machine-readable key e.g. "full_name"
  type: FieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];  // Used for radio/checkbox/select types
  isBaseField?: boolean; // True if it corresponds to a built-in DB column (e.g. user_phone)
  lockedRequired?: boolean; // True if admin cannot delete it or change its required status (e.g. Name, Email)
}
