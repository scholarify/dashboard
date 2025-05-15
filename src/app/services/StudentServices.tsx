import Cookies from "js-cookie";
import { BASE_API_URL } from "./AuthContext";
import {
  StudentSchema,
  StudentCreateSchema,
  StudentUpdateSchema,
} from "../models/StudentModel";

export function getTokenFromCookie(name: string) {
  return Cookies.get(name);
}

export async function getStudents(): Promise<StudentSchema[]> {
  const token = getTokenFromCookie("idToken");

  try {
    const response = await fetch(`${BASE_API_URL}/student/get-students`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error("Error fetching students:", response.statusText);
      throw new Error("Failed to fetch students");
    }

    const data = await response.json();
    return data as StudentSchema[];
  } catch (error) {
    console.error("Error fetching students:", error);
    throw new Error("Failed to fetch students");
  }
}

export async function getStudentById(studentId: string): Promise<StudentSchema> {
  const token = getTokenFromCookie("idToken");

  const response = await fetch(`${BASE_API_URL}/student/get-student/${studentId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    console.error("Error fetching student:", response.statusText);
    throw new Error("Failed to fetch student");
  }

  const data = await response.json();
  return data as StudentSchema;
}

export async function createStudent(studentData: StudentCreateSchema): Promise<StudentSchema> {
  const token = getTokenFromCookie("idToken");

  const response = await fetch(`${BASE_API_URL}/student/create-student`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(studentData),
  });

  if (!response.ok) {
    let errorMessage = "Failed to create student";
    try {
      const errorBody = await response.json();
      errorMessage = errorBody?.message || errorMessage;
    } catch (parseError) {
      console.warn("Could not parse error response:", parseError);
    }
    console.error("Error creating student:", errorMessage);
    throw new Error(errorMessage);
  }

  const data = await response.json();
  return data as StudentSchema;
}

export async function updateStudent(id: string, studentData: StudentUpdateSchema): Promise<StudentSchema> {
  const token = getTokenFromCookie("idToken");

  const response = await fetch(`${BASE_API_URL}/student/update-student/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(studentData),
  });

  if (!response.ok) {
    let errorMessage = "Failed to update student";
    try {
      const errorBody = await response.json();
      errorMessage = errorBody?.message || errorMessage;
    } catch (parseError) {
      console.warn("Could not parse error response:", parseError);
    }
    console.error("Error updating student:", errorMessage);
    throw new Error(errorMessage);
  }

  const data = await response.json();
  return data as StudentSchema;
}

export async function deleteStudent(id: string): Promise<{ message: string }> {
  const token = getTokenFromCookie("idToken");

  const response = await fetch(`${BASE_API_URL}/student/delete-student/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    let errorMessage = "Failed to delete student";
    try {
      const errorBody = await response.json();
      errorMessage = errorBody?.message || errorMessage;
    } catch (parseError) {
      console.warn("Could not parse error response:", parseError);
    }
    console.error("Error deleting student:", errorMessage);
    throw new Error(errorMessage);
  }

  const result = await response.json();
  return result;
}

export async function getStudentsByClassAndSchool(
    classId: string,
    schoolId: string
  ): Promise<StudentSchema[]> {
    const token = getTokenFromCookie("idToken");
  
    try {
      const response = await fetch(
        `${BASE_API_URL}/student/class/${classId}/school/${schoolId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (!response.ok) {
        console.error("Error fetching students by class and school:", response.statusText);
        throw new Error("Failed to fetch filtered students");
      }
  
      const data = await response.json();
      return data as StudentSchema[];
    } catch (error) {
      console.error("Fetch error (filtered students):", error);
      throw new Error("Failed to fetch filtered students");
    }
  }

  export async function getStudentsBySchool(schoolId: string): Promise<StudentSchema[]> {
    const token = getTokenFromCookie("idToken");
  
    try {
      const response = await fetch(
        `${BASE_API_URL}/student/get-students-by-school?schoolId=${schoolId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (!response.ok) {
        console.error("Error fetching students by school:", response.statusText);
        throw new Error("Failed to fetch students by school");
      }
  
      const data = await response.json();
      return data as StudentSchema[];
    } catch (error) {
      console.error("Fetch error (students by school):", error);
      throw new Error("Failed to fetch students by school");
    }
  }
  
  
