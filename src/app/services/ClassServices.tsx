import { BASE_API_URL } from "./AuthContext";
import { getTokenFromCookie } from "./UserServices";
import { ClassCreateSchema, ClassSchema, ClassUpdateSchema } from "../models/ClassModel";

// Get all classes
export async function getClasses(): Promise<ClassSchema[]> {
    try {
        const token = getTokenFromCookie("idToken");
        const response = await fetch(`${BASE_API_URL}/class/get-classes`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch class data");
        }

        const classesList = await response.json();
        return classesList.map((cls: any) => ({
            _id: cls._id,
            class_id: cls.class_id,
            name: cls.name,
            school_id: cls.school_id,
            class_level: cls.class_level,
            class_code: cls.class_code,
            createdAt: cls.createdAt,
            updatedAt: cls.updatedAt,
        })) as ClassSchema[];

    } catch (error) {
        console.error("Error fetching classes:", error);
        throw new Error("Failed to fetch class data");
    }
}

// Get single class by ID
export async function getClassById(classId: string): Promise<ClassSchema> {
    const response = await fetch(`${BASE_API_URL}/class/get-class/${classId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getTokenFromCookie("idToken")}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch class");
    }

    const data = await response.json();
    return {
        _id: data._id,
        class_id: data.class_id,
        name: data.name,
        school_id: data.school_id,
        class_level: data.class_level,
        class_code: data.class_code,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
    } as ClassSchema;
}

// Create class
export async function createClass(classData: ClassCreateSchema) {
    try {
        const response = await fetch(`${BASE_API_URL}/class/create-class`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getTokenFromCookie("idToken")}`,
            },
            body: JSON.stringify(classData),
        });

        if (!response.ok) {
            let errorMessage = "Failed to create class";
            try {
                const errorBody = await response.json();
                errorMessage = errorBody?.message || errorMessage;
            } catch (parseError) {
                console.warn("Could not parse error response:", parseError);
            }
            throw new Error(errorMessage);
        }

        return await response.json();
    } catch (error) {
        console.error("Error creating class:", error);
        throw new Error(error instanceof Error ? error.message : "Failed to create class");
    }
}

// Update class
export async function updateClass(classId: string, classData: ClassUpdateSchema) {
    try {
        const response = await fetch(`${BASE_API_URL}/class/update-class/${classId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getTokenFromCookie("idToken")}`,
            },
            body: JSON.stringify(classData),
        });

        if (!response.ok) {
            let errorMessage = "Failed to update class";
            try {
                const errorBody = await response.json();
                errorMessage = errorBody?.message || errorMessage;
            } catch (parseError) {
                console.warn("Could not parse error response:", parseError);
            }
            throw new Error(errorMessage);
        }

        return await response.json();
    } catch (error) {
        console.error("Error updating class:", error);
        throw new Error(error instanceof Error ? error.message : "Failed to update class");
    }
}

// Delete class
export async function deleteClass(classId: string) {
    try {
        const response = await fetch(`${BASE_API_URL}/class/delete-class/${classId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getTokenFromCookie("idToken")}`,
            },
        });

        if (!response.ok) {
            let errorMessage = "Failed to delete class";
            try {
                const errorBody = await response.json();
                errorMessage = errorBody?.message || errorMessage;
            } catch (parseError) {
                console.warn("Could not parse error response:", parseError);
            }
            throw new Error(errorMessage);
        }

        return await response.json();
    } catch (error) {
        console.error("Error deleting class:", error);
        throw new Error(error instanceof Error ? error.message : "Failed to delete class");
    }
}

// Delete multiple classes
export async function deleteMultipleClasses(classIds: string[]) {
    try {
        const response = await fetch(`${BASE_API_URL}/class/delete-classes`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getTokenFromCookie("idToken")}`,
            },
            body: JSON.stringify({ class_ids: classIds }),
        });

        if (!response.ok) {
            let errorMessage = "Failed to delete multiple classes";
            try {
                const errorBody = await response.json();
                errorMessage = errorBody?.message || errorMessage;
            } catch (parseError) {
                console.warn("Could not parse error response:", parseError);
            }
            throw new Error(errorMessage);
        }

        return await response.json();
    } catch (error) {
        console.error("Error deleting multiple classes:", error);
        throw new Error(error instanceof Error ? error.message : "Failed to delete multiple classes");
    }
}
