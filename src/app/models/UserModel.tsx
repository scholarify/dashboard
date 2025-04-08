export interface UserSchema {
    user_id: string;
    name: string;
    email: string;
    role: "super" | "admin" | "teacher" | "parent";
    phone: string;
    address: string;
    school_ids: string[];
    isVerified: boolean;
    lastActive: string;
}