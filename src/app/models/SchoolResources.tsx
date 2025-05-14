// Base Interface
export interface SchoolResourceSchema extends Record<string, unknown> {
    _id: string;
    name: string;
    school_id?: string; // Reference to School
    type: SchoolResourceType; // Corrected field for enum
    description?: string;
    price: number;
    stock: number;
    class_level?: string; // Reference to ClassLevel
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  // Enum for resource types
  export type SchoolResourceType =
    | 'Textbook'
    | 'Lab Material'
    | 'Notebook'
    | 'Uniform'
    | 'Stationery'
    | 'Sports Equipment'
    | 'Arts & Crafts'
    | 'Electronics'
    | 'Exam Material'
    | 'Miscellaneous'
    | 'Other';
  
  // For creating a resource
  export interface SchoolResourceCreateSchema extends Record<string, unknown> {
    name: string;
    school_id?: string;
    type: SchoolResourceType;
    description?: string;
    price: number;
    stock: number;
    class_level?: string;
  }
  
  // For updating a resource
  export interface SchoolResourceUpdateSchema extends Record<string, unknown> {
    name?: string;
    school_id?: string;
    type?: SchoolResourceType;
    description?: string;
    price?: number;
    stock?: number;
    class_level?: string;
  }
  
  // For deleting a resource
  export interface SchoolResourceDeleteSchema extends Record<string, unknown> {
    _id: string;
  }
  