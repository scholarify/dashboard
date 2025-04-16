import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { BASE_API_URL } from "./AuthContext";
import { getTokenFromCookie } from "./UserServices";
import { StudentSchema } from "../models/StudentModel";


export async function getStudentById(studentId: string) {
    const response = await fetch(`${BASE_API_URL}/student/get-student/${studentId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getTokenFromCookie("idToken")}`,
        },
    });

    if (!response.ok) {
        console.error("Error fetching student:", response.statusText);
        throw new Error("Failed to fetch student data");
    }
    const data = await response.json();
    const student = {
        _id: data._id,
        student_id: data.student_id,
        guardian_id: data.guardian_id,
        school_id: data.school_id,
        name: data.name,
        date_of_birth: data.date_of_birth,
        fees: data.fees,
        class_id: data.class_id,
        age: data.age,
        gender: data.gender,
        enrollement_date: data.enrollement_date,
        status: data.status,
        non_compulsory_sbj: data.non_compulsory_sbj,
    } as StudentSchema
    return student;
}