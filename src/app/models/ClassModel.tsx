// class.model.ts

export interface ClassSchema extends Record<string, unknown> {
    _id: string;
    class_id: string;            // Unique identifier for the class
    school_id: string;           // ID of the associated school (ObjectId as string)
    class_level: string;         // Level of the class (e.g., "Primary", "Secondary")
    class_code: string;          // Class code (e.g., "JSS1-A", "SS3-Blue")
    createdAt?: string;          // Timestamp of creation (auto-generated)
    updatedAt?: string;          // Timestamp of last update (auto-generated)
  }
  
  export interface ClassCreateSchema extends Record<string, unknown> {
    class_id: string;            // Required class identifier
    school_id: string;           // Required school ID
    class_level: string;         // Required level of the class
    class_code: string;          // Required class code
  }
  
  export interface ClassUpdateSchema extends Record<string, unknown> {
    class_id: string;            // Required to identify which class to update
    school_id?: string;          // Optional updated school ID
    class_level?: string;        // Optional updated level
    class_code?: string;         // Optional updated class code
  }
  
  export interface ClassDeleteSchema extends Record<string, unknown> {
    _id?: string;                // Optional MongoDB ObjectId
    class_id: string;            // Required class ID to delete
    class_level: string;         // Optional, maybe used for confirmation
  }
  