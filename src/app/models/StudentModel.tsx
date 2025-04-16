
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
}