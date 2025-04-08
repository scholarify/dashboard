import { BASE_API_URL } from "./AuthContext";
import { getTokenFromCookie } from "./UserServices";
import { SchoolSchema } from "../models/SchoolModel";
export async function getSchools() {
    try {
        const token = getTokenFromCookie("idToken");
        const response = await fetch(`${BASE_API_URL}/school/get-schools`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            console.error("Error fetching schools:", response.statusText);
            throw new Error("Failed to fetch schools data");
        }
        const schoolsList = await response.json();
        const schools = schoolsList.map((school: any) => {
            return {
                school_id: school.school_id,
                name: school.name,
                email: school.email,
                address: school.address,
                website: school.website,
                phone_numer: school.phone_number,
                principal_name: school.principal_name,
                established_year: school.established_year,
                description: school.description,

            } as SchoolSchema;
        })
        return  schools;
        
    } catch (error) {
        console.error("Error fetching schools:", error);
        throw new Error("Failed to fetch schools data");
        
    }
}