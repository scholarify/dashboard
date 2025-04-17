// classLevel.model.ts

export interface ClassLevelSchema extends Record<string, unknown> {
    _id: string;
    school_id: string;         // MongoDB ObjectId as string
    name: string;              // e.g. "Class 1", "Form 2"
    createdAt?: string;        // Auto-generated timestamp
    updatedAt?: string;        // Auto-generated timestamp
  }
  
  export interface ClassLevelCreateSchema extends Record<string, unknown> {
    school_id: string;         // Required
    name: string;              // Required
  }
  
  export interface ClassLevelUpdateSchema extends Record<string, unknown> {
    _id: string;               // Required to identify which class level to update
    name?: string;             // Optional updated name
    school_id?: string;        // Optional updated school reference
  }
  
  export interface ClassLevelDeleteSchema extends Record<string, unknown> {
    _id: string;               // Required MongoDB ID to delete
  }
  