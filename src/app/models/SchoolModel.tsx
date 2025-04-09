

export interface SchoolSchema extends Record<string, unknown> {
    school_id: string;
    name: string;
    email?: string;
    address?: string;
    website?: string;
    phone_numer?: string;
    principal_name: string;
    established_year: string;
    description?: string;
}