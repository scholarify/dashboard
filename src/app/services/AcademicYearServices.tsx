import { BASE_API_URL } from "./AuthContext";
import { getTokenFromCookie } from "./UserServices";
import { AcademicYearSchema } from "../models/AcademicYear";

// Get all academic years
export async function getAcademicYears(): Promise<AcademicYearSchema[]> {
    try {
        const token = getTokenFromCookie("idToken");
        const response = await fetch(`${BASE_API_URL}/academic-years/get-academic-years`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch academic year data");
        }

        const academicYearsList = await response.json();

        return academicYearsList.map((item: any) => ({
            _id: item._id,
            academic_year: item.academic_year,
            start_date: item.start_date,
            end_date: item.end_date,
        })) as AcademicYearSchema[];

    } catch (error) {
        console.error("Error fetching academic years:", error);
        throw new Error("Failed to fetch academic year data");
    }
}
