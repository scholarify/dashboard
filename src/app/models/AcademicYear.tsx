export interface AcademicYearSchema extends Record<string, unknown> {
    _id: string;                     // MongoDB ObjectId as string
    academic_year: string;          // e.g. "2024/2025"
    start_date: string;             // e.g. "2024-09-01"
    end_date: string;               // e.g. "2025-06-30"
}
