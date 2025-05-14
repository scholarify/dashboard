import { BASE_API_URL } from "./AuthContext";
import { getTokenFromCookie } from "./UserServices";
import {
  SchoolResourceSchema,
  SchoolResourceCreateSchema,
  SchoolResourceUpdateSchema,
} from "../models/SchoolResources";

// Get all school resources
export async function getSchoolResources(): Promise<SchoolResourceSchema[]> {
  try {
    const token = getTokenFromCookie("idToken");
    const response = await fetch(`${BASE_API_URL}/school-resources/get-resources`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch school resources");
    }

    const resources = await response.json();
    return resources.map((res: any) => ({
      _id: res._id,
      name: res.name,
      school_id: res.school_id,
      type: res.type,
      description: res.description,
      price: res.price,
      stock: res.stock,
      class_level: res.class_level,
      createdAt: res.createdAt,
      updatedAt: res.updatedAt,
    })) as SchoolResourceSchema[];
  } catch (error) {
    console.error("Error fetching school resources:", error);
    throw new Error("Failed to fetch school resources");
  }
}

// Get a single resource by ID
export async function getSchoolResourceById(resourceId: string): Promise<SchoolResourceSchema> {
  const token = getTokenFromCookie("idToken");

  const response = await fetch(`${BASE_API_URL}/school-resources/get-resource/${resourceId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch school resource");
  }

  const res = await response.json();
  return {
    _id: res._id,
    name: res.name,
    school_id: res.school_id,
    type: res.type,
    description: res.description,
    price: res.price,
    stock: res.stock,
    class_level: res.class_level,
    createdAt: res.createdAt,
    updatedAt: res.updatedAt,
  };
}

// Create a new school resource
export async function createSchoolResource(resourceData: SchoolResourceCreateSchema) {
  try {
    const response = await fetch(`${BASE_API_URL}/school-resources/create-resource`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getTokenFromCookie("idToken")}`,
      },
      body: JSON.stringify(resourceData),
    });

    if (!response.ok) {
      const errorBody = await response.json();
      throw new Error(errorBody.message || "Failed to create resource");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating resource:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to create resource");
  }
}

// Update a resource
export async function updateSchoolResource(resourceId: string, resourceData: SchoolResourceUpdateSchema) {
  try {
    const response = await fetch(`${BASE_API_URL}/school-resources/update-resource/${resourceId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getTokenFromCookie("idToken")}`,
      },
      body: JSON.stringify(resourceData),
    });

    if (!response.ok) {
      const errorBody = await response.json();
      throw new Error(errorBody.message || "Failed to update resource");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating resource:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to update resource");
  }
}

// Delete a resource
export async function deleteSchoolResource(resourceId: string) {
  try {
    const response = await fetch(`${BASE_API_URL}/school-resources/delete-resource/${resourceId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getTokenFromCookie("idToken")}`,
      },
    });

    if (!response.ok) {
      const errorBody = await response.json();
      throw new Error(errorBody.message || "Failed to delete resource");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting resource:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to delete resource");
  }
}

// Get all resources by School ID
export async function getSchoolResourcesBySchoolId(schoolId: string): Promise<SchoolResourceSchema[]> {
  try {
    const token = getTokenFromCookie("idToken");
    const response = await fetch(`${BASE_API_URL}/school-resources/get-resources-by-school/${schoolId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch resources for the school");
    }

    const resources = await response.json();
    return resources.map((res: any) => ({
      _id: res._id,
      name: res.name,
      school_id: res.school_id,
      type: res.type,
      description: res.description,
      price: res.price,
      stock: res.stock,
      class_level: res.class_level,
      createdAt: res.createdAt,
      updatedAt: res.updatedAt,
    })) as SchoolResourceSchema[];
  } catch (error) {
    console.error("Error fetching resources by school ID:", error);
    throw new Error("Failed to fetch school resources by school ID");
  }
}
