
export interface StudentSchema extends Record<string, unknown> {
    _id :string;
    student_id: string;
    guardian_id: string[];
    school_id : string;
    name: string;
    date_of_birth: string;
    fees: number;
    class_id: string;
    age : number;
    gender : string;
    enrollement_date : string;
    status: string;
    non_compulsory_sbj: string;
}// student.model.ts (Frontend TypeScript Interfaces for Student Management)

export interface StudentSchema extends Record<string, unknown> {
    _id: string;
    student_id: string;                // Unique student ID
    guardian_id: string[];            // Array of User IDs (guardians)
    school_id: string;                // ID of the school
    name: string;                     // Full name
    date_of_birth?: string;           // Optional DOB (string format e.g. YYYY-MM-DD)
    fees: number;                     // Fee amount
    class_id: string;                 // ID of the class
    age: number;                      // Age
    gender?: string;                  // Gender (optional)
    enrollement_date?: string;        // ISO Date string (optional)
    non_compulsory_sbj?: string[];    // Array of Subject IDs (optional)
    status?: 'enrolled' | 'graduated' | 'dropped' | 'not enrolled'; // Current status
    createdAt?: string;               // Auto-generated timestamp
    updatedAt?: string;               // Auto-generated timestamp
  }
  
  export interface StudentCreateSchema extends Record<string, unknown> {
    student_id?: string;
    guardian_id: string[];
    school_id: string;
    name: string;
    date_of_birth?: string;
    fees: number;
    class_id: string;
    age: number;
    gender?: string;
    enrollement_date?: string;
    non_compulsory_sbj?: string[];
    status?: 'enrolled' | 'graduated' | 'dropped' | 'not enrolled';
  }
  
  export interface StudentUpdateSchema extends Record<string, unknown> {
    _id: string;                       // Required to identify which student to update
    student_id?: string;
    guardian_id?: string[];
    school_id?: string;
    name?: string;
    date_of_birth?: string;
    fees?: number;
    class_id?: string;
    age?: number;
    gender?: string;
    enrollement_date?: string;
    non_compulsory_sbj?: string[];
    status?: 'enrolled' | 'graduated' | 'dropped' | 'not enrolled';
    updatedAt?: string;
  }
  
  export interface StudentDeleteSchema extends Record<string, unknown> {
    _id?: string;
    student_id: string;
    name: string;
  }
  