

export interface SchoolSchema extends Record<string, unknown> {
    school_id?: string;
    name: string;
    email?: string;
    address?: string;
    website?: string;
    phone_number?: string;
    principal_name: string;
    established_year: string;
    description?: string;
}

export interface SchoolCreateSchema extends Record<string, unknown> {
    name: string;
    email: string;
    address: string;
    website: string;
    phone_number: string;
    principal_name: string;
    established_year: string;
    description: string;
}

export interface SchoolUpdateSchema extends Record<string, unknown> {
    school_id?: string;
    name?: string;
    email?: string;
    address?: string;
    website?: string;
    phone_number?: string;
    principal_name?: string;
    established_year?: string;
    description?: string;
}