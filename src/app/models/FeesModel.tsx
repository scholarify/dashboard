// fee.model.ts

export interface FeeSchema extends Record<string, unknown> {
    _id: string;                  // MongoDB ObjectId as string
    school_id: string;           // MongoDB ObjectId of the school (as string)
    fee_type: string;            // Type of fee (e.g., Tuition, Bus)
    amount: number;              // Fee amount
    createdAt?: string;          // ISO timestamp
    updatedAt?: string;          // ISO timestamp
  }
  
  export interface FeeCreateSchema extends Record<string, unknown> {
    school_id: string;           // Required school ID
    fee_type: string;            // Required fee type
    amount: number;              // Required fee amount
  }
  
  export interface FeeUpdateSchema extends Record<string, unknown> {
    _id: string;                 // Required for identifying the fee
    school_id?: string;          // Optional updated school ID
    fee_type?: string;           // Optional updated fee type
    amount?: number;             // Optional updated amount
  }
  
  export interface FeeDeleteSchema extends Record<string, unknown> {
    _id: string;                 // Required to identify the fee to delete
  }
  