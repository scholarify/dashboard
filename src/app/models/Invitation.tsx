// models/invitation.model.ts

export interface InvitationSchema extends Record<string, unknown> {
    _id: string;
    email: string;
    phone?: string;
    name?: string;
    school_ids: string[]; // MongoDB ObjectIds as strings
    childrenIds: string[]; // MongoDB ObjectIds as strings
    token: string;
    status: "pending" | "accepted" | "expired";
    invitedAt?: string; // ISO date string
    expiresAt: string; // ISO date string
  }
  
  export interface InvitationCreateSchema extends Record<string, unknown> {
    email: string;
    phone?: string;
    name?: string;
    school_ids?: string[];
    childrenIds?: string[];
    token: string;
    status?: "pending" | "accepted" | "expired"; // defaults to "pending"
  }
  
  export interface InvitationUpdateSchema extends Record<string, unknown> {
    _id: string;
    status?: "pending" | "accepted" | "expired";
    childrenIds?: string[];
    school_ids?: string[];
    token?: string;
    email?: string;
    phone?: string;
    name?: string;
    expiresAt?: string; // ISO date string
  }
  
  export interface InvitationDeleteSchema extends Record<string, unknown> {
    _id: string;
  }
  