// student.model.ts

export interface StudentSchema extends Record<string, unknown> {
  _id: string;                             // MongoDB generated _id
  student_id: string;                      // Unique student ID
  guardian_id: string[];                   // Array of User IDs (guardians)
  school_id: string;                       // ID of the school
  class_id: string;                        // ID of the class
  first_name: string;                      // First Name
  last_name: string;                       // Last Name
  middle_name?: string;                    // Optional middle name
  name: string;                            // Full name (computed from first_name + last_name)
  gender?: "Male" | "Female" | "Other";    // Gender (optional)
  nationality?: string;                    // Nationality (optional)
  place_of_birth?: string;                 // Place of birth (optional)
  address?: string;                        // Address (optional)
  phone?: string;                          // Phone number (optional)
  date_of_birth?: Date;                  // Date of birth (string format e.g. YYYY-MM-DD)
  guardian_name?: string;                  // Guardian's name (optional)
  guardian_phone?: string;                 // Guardian's phone (optional)
  guardian_email?: string;                 // Guardian's email (optional)
  guardian_relationship?: "Mother" | "Father" | "Brother" | "Sister" | "Aunty" | "Uncle" | "Grand Mother" | "Grand Father" | "Other";  // Guardian relationship
  guardian_occupation?: string;            // Guardian's occupation (optional)
  emergency_contact_name?: string;         // Emergency contact name (optional)
  emergency_contact_phone?: string;        // Emergency contact phone (optional)
  emergency_contact_relationship?: "Mother" | "Father" | "Brother" | "Sister" | "Aunty" | "Uncle" | "Grand Mother" | "Grand Father" | "Other";  // Emergency contact relationship
  previous_school?: string;                // Previous school name (optional)
  transcript_reportcard?: boolean;         // Whether transcript/report card exists (optional)
  health_condition?: string;               // Health condition (optional)
  doctors_name?: string;                   // Doctor's name (optional)
  doctors_contact?: string;                // Doctor's contact (optional)
  doctors_phone?: string;                  // Doctor's phone number (optional)
  fees: number;                            // Fee amount
  non_compulsory_sbj?: string[];           // Array of Subject IDs (optional, electives)
  enrollement_date: string;                // Enrollment date (ISO string)
  status?: "enrolled" | "graduated" | "dropped" | "not enrolled";  // Current enrollment status
  guardian_agreed_to_terms?: boolean;      // Whether guardian agreed to terms (optional)
  createdAt?: string;                      // Auto-generated timestamp
  updatedAt?: string;                      // Auto-generated timestamp
}

export interface StudentCreateSchema extends Record<string, unknown> {
  student_id?: string;                     // Optional student ID for creation, will be auto-generated
  guardian_id: string[];                   // Array of User IDs (guardians)
  school_id: string;                       // ID of the school
  class_id: string;                        // ID of the class
  first_name: string;                      // First Name
  last_name: string;                       // Last Name
  middle_name?: string;                    // Optional middle name
  date_of_birth?: string;                  // Optional DOB (string format e.g. YYYY-MM-DD)
  guardian_name?: string;                  // Guardian's name (optional)
  guardian_phone?: string;                 // Guardian's phone (optional)
  guardian_email?: string;                 // Guardian's email (optional)
  guardian_relationship?: "Mother" | "Father" | "Brother" | "Sister" | "Aunty" | "Uncle" | "Grand Mother" | "Grand Father" | "Other";  // Guardian relationship
  guardian_occupation?: string;            // Guardian's occupation (optional)
  emergency_contact_name?: string;         // Emergency contact name (optional)
  emergency_contact_phone?: string;        // Emergency contact phone (optional)
  emergency_contact_relationship?: "Mother" | "Father" | "Brother" | "Sister" | "Aunty" | "Uncle" | "Grand Mother" | "Grand Father" | "Other";  // Emergency contact relationship
  previous_school?: string;                // Previous school name (optional)
  transcript_reportcard?: boolean;         // Whether transcript/report card exists (optional)
  health_condition?: string;               // Health condition (optional)
  doctors_name?: string;                   // Doctor's name (optional)
  doctors_contact?: string;                // Doctor's contact (optional)
  doctors_phone?: string;                  // Doctor's phone number (optional)
  fees: number;                            // Fee amount
  non_compulsory_sbj?: string[];           // Array of Subject IDs (optional, electives)
  enrollement_date?: string;               // Enrollment date (ISO string)
  status?: "enrolled" | "graduated" | "dropped" | "not enrolled";  // Current enrollment status
  guardian_agreed_to_terms?: boolean;      // Whether guardian agreed to terms (optional)
}

export interface StudentUpdateSchema extends Record<string, unknown> {
  _id: string;                             // Required to identify which student to update
  student_id?: string;                     // Optional student ID
  guardian_id?: string[];                  // Optional array of User IDs (guardians)
  school_id?: string;                      // Optional ID of the school
  class_id?: string;                       // Optional class ID
  first_name?: string;                     // Optional first name
  last_name?: string;                      // Optional last name
  middle_name?: string;                    // Optional middle name
  date_of_birth?: string;                  // Optional DOB (string format e.g. YYYY-MM-DD)
  guardian_name?: string;                  // Guardian's name (optional)
  guardian_phone?: string;                 // Guardian's phone (optional)
  guardian_email?: string;                 // Guardian's email (optional)
  guardian_relationship?: "Mother" | "Father" | "Brother" | "Sister" | "Aunty" | "Uncle" | "Grand Mother" | "Grand Father" | "Other";  // Guardian relationship
  guardian_occupation?: string;            // Guardian's occupation (optional)
  emergency_contact_name?: string;         // Emergency contact name (optional)
  emergency_contact_phone?: string;        // Emergency contact phone (optional)
  emergency_contact_relationship?: "Mother" | "Father" | "Brother" | "Sister" | "Aunty" | "Uncle" | "Grand Mother" | "Grand Father" | "Other";  // Emergency contact relationship
  previous_school?: string;                // Previous school name (optional)
  transcript_reportcard?: boolean;         // Whether transcript/report card exists (optional)
  health_condition?: string;               // Health condition (optional)
  doctors_name?: string;                   // Doctor's name (optional)
  doctors_contact?: string;                // Doctor's contact (optional)
  doctors_phone?: string;                  // Doctor's phone number (optional)
  fees?: number;                           // Optional fee amount
  non_compulsory_sbj?: string[];           // Optional array of Subject IDs (electives)
  enrollement_date?: string;               // Optional enrollment date (ISO string)
  status?: "enrolled" | "graduated" | "dropped" | "not enrolled";  // Optional status
  guardian_agreed_to_terms?: boolean;      // Optional guardian agreed to terms field
  updatedAt?: string;                      // Auto-generated timestamp on update
}

export interface StudentDeleteSchema extends Record<string, unknown> {
  _id?: string;                            // Optional _id to delete a student by
  student_id: string;                      // Student ID (required to identify the student)
  name: string;                            // Full name of the student (required for deletion confirmation)
}
