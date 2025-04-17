import { BASE_API_URL } from "./AuthContext";
import { getTokenFromCookie } from "./UserServices";
import {
  ClassLevelSchema,
  ClassLevelCreateSchema,
  ClassLevelUpdateSchema,
} from "../models/ClassLevel";

// Get all class levels
export async function getClassLevels(): Promise<ClassLevelSchema[]> {
  try {
    const token = getTokenFromCookie("idToken");
    const response = await fetch(`${BASE_API_URL}/class-level/get-class-levels`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch class levels");
    }

    const data = await response.json();
    return data.map((level: any) => ({
      _id: level._id,
      school_id: level.school_id,
      name: level.name,
      createdAt: level.createdAt,
      updatedAt: level.updatedAt,
    })) as ClassLevelSchema[];
  } catch (error) {
    console.error("Error fetching class levels:", error);
    throw new Error("Failed to fetch class levels");
  }
}

// Get single class level by ID
export async function getClassLevelById(id: string): Promise<ClassLevelSchema> {
  const response = await fetch(`${BASE_API_URL}/class-level/get-class-level/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getTokenFromCookie("idToken")}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch class level");
  }

  return await response.json();
}

// Create a new class level
export async function createClassLevel(data: ClassLevelCreateSchema) {
  const response = await fetch(`${BASE_API_URL}/class-level/create-class-level`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getTokenFromCookie("idToken")}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    let message = "Failed to create class level";
    try {
      const error = await response.json();
      message = error.message || message;
    } catch {}
    throw new Error(message);
  }

  return await response.json();
}

// Update class level
export async function updateClassLevel(id: string, data: ClassLevelUpdateSchema) {
  const response = await fetch(`${BASE_API_URL}/class-level/update-class-level/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getTokenFromCookie("idToken")}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    let message = "Failed to update class level";
    try {
      const error = await response.json();
      message = error.message || message;
    } catch {}
    throw new Error(message);
  }

  return await response.json();
}

// Delete a class level
export async function deleteClassLevel(id: string) {
  const response = await fetch(`${BASE_API_URL}/class-level/delete-class-level/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getTokenFromCookie("idToken")}`,
    },
  });

  if (!response.ok) {
    let message = "Failed to delete class level";
    try {
      const error = await response.json();
      message = error.message || message;
    } catch {}
    throw new Error(message);
  }

  return await response.json();
}

// Delete multiple class levels
export async function deleteMultipleClassLevels(ids: string[]) {
  const response = await fetch(`${BASE_API_URL}/class-level/delete-class-levels`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getTokenFromCookie("idToken")}`,
    },
    body: JSON.stringify({ ids }),
  });

  if (!response.ok) {
    let message = "Failed to delete class levels";
    try {
      const error = await response.json();
      message = error.message || message;
    } catch {}
    throw new Error(message);
  }

  return await response.json();
}
