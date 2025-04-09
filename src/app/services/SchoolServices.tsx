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

export async function getSchoolById(schoolId: string) {
    const response = await fetch(`${BASE_API_URL}/school/get-school/${schoolId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getTokenFromCookie("idToken")}`,
        },
    });
    if (!response.ok) {
        console.error("Error fetching school:", response.statusText);
        throw new Error("Failed to fetch school data");
    }
    const data = await response.json();

    const school = {
        school_id: data.school_id,
        name: data.name,
        email: data.email,
        address: data.address,
        website: data.website,
        phone_number: data.phone_number,
        principal_name: data.principal_name,
        established_year: data.established_year,
        description: data.description,
    } as SchoolSchema;
    return school;
}