export interface StudentSchema extends Record<string, unknown> {
  _id: string;
  student_id: string;
  guardian_id?: string[];
  school_id: string;
  class_id: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  name: string;
  gender?: "Male" | "Female" | "Other";
  nationality?: string;
  place_of_birth?: string;
  address?: string;
  phone?: string;
  date_of_birth?: Date;
  guardian_name?: string;
  guardian_phone?: string;
  guardian_email?: string;
  guardian_relationship?: "Mother" | "Father" | "Brother" | "Sister" | "Aunty" | "Uncle" | "Grand Mother" | "Grand Father" | "Other";
  guardian_occupation?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relationship?: "Mother" | "Father" | "Brother" | "Sister" | "Aunty" | "Uncle" | "Grand Mother" | "Grand Father" | "Other";
  previous_school?: string;
  transcript_reportcard?: boolean;
  health_condition?: string;
  doctors_name?: string;
  doctors_contact?: string;
  doctors_phone?: string;

  selectedFees: string[];                // Fee IDs
  selectedResources: string[];           // Resource IDs
  applyScholarship: boolean;
  scholarshipAmount: number;
  scholarshipPercentage: number;
  paymentMode: "full" | "installment";
  installments: number;
  installmentDates: string[];
  fees: number;

  non_compulsory_sbj?: string[];
  enrollement_date: string;
  status?: "enrolled" | "graduated" | "dropped" | "not enrolled";
  guardian_agreed_to_terms?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface StudentCreateSchema extends Record<string, unknown> {
  student_id?: string;
  guardian_id?: string[];
  school_id: string;
  class_id: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  date_of_birth?: string;
  guardian_name?: string;
  guardian_phone?: string;
  guardian_email?: string;
  guardian_relationship?: "Mother" | "Father" | "Brother" | "Sister" | "Aunty" | "Uncle" | "Grand Mother" | "Grand Father" | "Other";
  guardian_occupation?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relationship?: "Mother" | "Father" | "Brother" | "Sister" | "Aunty" | "Uncle" | "Grand Mother" | "Grand Father" | "Other";
  previous_school?: string;
  transcript_reportcard?: boolean;
  health_condition?: string;
  doctors_name?: string;
  doctors_contact?: string;
  doctors_phone?: string;

  selectedFees: string[];
  selectedResources: string[];
  applyScholarship: boolean;
  scholarshipAmount: number;
  scholarshipPercentage: number;
  paymentMode: "full" | "installment";
  installments: number;
  installmentDates: string[];
  fees: number;

  non_compulsory_sbj?: string[];
  enrollement_date?: string;
  status?: "enrolled" | "graduated" | "dropped" | "not enrolled";
  guardian_agreed_to_terms?: boolean;
}

export interface StudentUpdateSchema extends Record<string, unknown> {
  _id: string;
  student_id?: string;
  guardian_id?: string[];
  school_id?: string;
  class_id?: string;
  first_name?: string;
  last_name?: string;
  middle_name?: string;
  date_of_birth?: string;
  guardian_name?: string;
  guardian_phone?: string;
  guardian_email?: string;
  guardian_relationship?: "Mother" | "Father" | "Brother" | "Sister" | "Aunty" | "Uncle" | "Grand Mother" | "Grand Father" | "Other";
  guardian_occupation?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relationship?: "Mother" | "Father" | "Brother" | "Sister" | "Aunty" | "Uncle" | "Grand Mother" | "Grand Father" | "Other";
  previous_school?: string;
  transcript_reportcard?: boolean;
  health_condition?: string;
  doctors_name?: string;
  doctors_contact?: string;
  doctors_phone?: string;

  selectedFees?: string[];
  selectedResources?: string[];
  applyScholarship?: boolean;
  scholarshipAmount?: number;
  scholarshipPercentage?: number;
  paymentMode?: "full" | "installment";
  installments?: number;
  installmentDates?: string[];
  fees?: number;

  non_compulsory_sbj?: string[];
  enrollement_date?: string;
  status?: "enrolled" | "graduated" | "dropped" | "not enrolled";
  guardian_agreed_to_terms?: boolean;
  updatedAt?: string;
}

export interface StudentDeleteSchema extends Record<string, unknown> {
  _id?: string;
  student_id: string;
  name: string;
}
