
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { BASE_API_URL } from "./AuthContext";
import { UserCreateSchema, UserSchema, UserUpdateSchema } from "../models/UserModel";

export function getTokenFromCookie(name: string) {
    const token = Cookies.get(name);
    return token;
}

export async function getCurrentUser(){
    const token = getTokenFromCookie("idToken");
    if (token) {
        const decodedUser: any = jwtDecode(token);
        const email = decodedUser.email as string;
        const response = await fetch(`${BASE_API_URL}/user/get-user-email/${email}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            console.error("Error fetching user:", response.statusText);
            throw new Error("Failed to fetch user data");
        }
        const user = await response.json();
        return user;
    }
}

export async function getUsers() {
    try {
        const token = getTokenFromCookie("idToken"); // Assuming this function gets the token from cookies
        const response = await fetch(`${BASE_API_URL}/user/get-users`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, // Authorization header with Bearer token
            },
        });

        if (!response.ok) {
            console.error("Error fetching users:", response.statusText);
            throw new Error("Failed to fetch users data");
        }

        const usersList = await response.json();
        const users = usersList.map((user: any) => {
            return {
                user_id: user.user_id,
                firebaseUid: user.firebaseUid,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                avatar: user.avatar,
                address: user.address,
                school_ids: user.school_ids,
                isVerified: user.isVerified,
                verificationCode: user.verificationCode,
                verificationCodeExpires: user.verificationCodeExpires,
                lastActive: user.lastActive,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            } as UserSchema;
        });

        return users;

    } catch (error) {
        console.error("Error fetching users:", error);
        throw new Error("Failed to fetch users data");
    }
}

export async function createUser(userData: UserCreateSchema) {
    try {
        const response = await fetch(`${BASE_API_URL}/user/register-user`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getTokenFromCookie("idToken")}`, // Add the Bearer token for authorization
            },
            body: JSON.stringify(userData), // Send the user data in the body of the request
        });

        if (!response.ok) {
            let errorMessage = "Failed to create user data";
      
            try {
              const errorBody = await response.json();
              errorMessage = errorBody?.message || errorMessage;
            } catch (parseError) {
              // If parsing the error body fails, use default message
              console.warn("Could not parse error response:", parseError);
            }
      
            console.error("Error creating user:", errorMessage);
            throw new Error(errorMessage);
          }

        const data = await response.json(); // Parse the response as JSON
        return data; // Return the response data (usually the created user object)
        
    } catch (error) {
        console.error("Error creating user:", error);
        throw new Error(error instanceof Error ? error.message : "Failed to create user data");
    }
}

export async function updateUser(user_id: string, userData: UserUpdateSchema) {
    try {
        const response = await fetch(`${BASE_API_URL}/user/update-user/${user_id}`, {
            method: "PUT", // Using PUT method to update the user
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getTokenFromCookie("idToken")}`, // Add Bearer token for authorization
            },
            body: JSON.stringify(userData), // Send the updated user data in the body of the request
        });

        if (!response.ok) {
            console.error("Error updating user:", response.statusText);
            throw new Error("Failed to update user data");
        }

        const data = await response.json(); // Parse the response as JSON
        return data; // Return the updated user data (this could be the user object with updated fields)
        
    } catch (error) {
        console.error("Error updating user:", error);
        throw new Error("Failed to update user data");
    }
}

export async function getUserById(userId: string) {
    const response = await fetch(`${BASE_API_URL}/user/get-user/${userId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getTokenFromCookie("idToken")}`,
        },
    });

    if (!response.ok) {
        console.error("Error fetching user:", response.statusText);
        throw new Error("Failed to fetch user data");
    }

    const data = await response.json();

    const user = {
        user_id: data.user_id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role,
        address: data.address,
        school_ids: data.school_ids, // List of school IDs if applicable
        isVerified: data.isVerified, // Assuming there is an 'isVerified' field
        description: data.description, // Assuming users can have a description
        firebaseUid: data.firebaseUid, // Add firebaseUid if available
        createdAt: data.createdAt, // Add createdAt if available
        updatedAt: data.updatedAt, // Add updatedAt if available
    } as UserSchema;

    return user;
}

export async function deleteUser(user_id: string) {
    try {
        const response = await fetch(`${BASE_API_URL}/user/delete-user/${user_id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getTokenFromCookie("idToken")}`,
            },
        });

        if (!response.ok) {
            let errorMessage = "Failed to delete user";

            try {
                const errorBody = await response.json();
                errorMessage = errorBody?.message || errorMessage;
            } catch (parseError) {
                console.warn("Could not parse error response:", parseError);
            }

            console.error("Error deleting user:", errorMessage);
            throw new Error(errorMessage);
        }

        const result = await response.json();
        return result; // Might return a success message or deleted user data
        
    } catch (error) {
        console.error("Error deleting user:", error);
        throw new Error(error instanceof Error ? error.message : "Failed to delete user");
    }
}
