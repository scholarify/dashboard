
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { BASE_API_URL } from "./AuthContext";
import { UserCreateSchema, UserSchema, UserUpdateSchema } from "../models/UserModel";

export function getTokenFromCookie(name: string) {
    const token = Cookies.get(name);
    return token;
}

export async function getCurrentUser() {
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
                _id: user._id,
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
                lastLogin: user.lastLogin,
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
        _id: data._id,
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

export async function verifyPassword(password: string, email: string): Promise<boolean> {
    const response = await fetch(`${BASE_API_URL}/auth/verify-password`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: email,
            password: password,
        }),
    });

    if (!response.ok) {
        console.error("Error fetching user:", response.statusText);
        return false;
    }

    return true;
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

export async function getUserBy_id(_id: string) {
    const response = await fetch(`${BASE_API_URL}/user/get-user-by-id/${_id}`, {
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
        _id: data._id,
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

export async function forget_password(email: string) {
    try {
        const response = await fetch(`${BASE_API_URL}/auth/forgot-password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
            }),
        });

        if (!response.ok) {
            let errorMessage = "Failed to send reset password email: check your email";
            try {
                const errorBody = await response.json();
                errorMessage = errorBody?.message || errorMessage;
            } catch (parseError) {
                console.warn("Could not parse error response:", parseError);
            }
            throw new Error(errorMessage);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Error sending reset password email:", error);
        throw new Error("Failed to send reset password email");
    }
}

export async function verify_otp(code: string, email: string) {
    try {
        const response = await fetch(`${BASE_API_URL}/auth/verify-code`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                code: code,
                email: email,
            }),
        });

        if (!response.ok) {
            let errorMessage = "Failed to verify OTP";
            try {
                const errorBody = await response.json();
                errorMessage = errorBody?.message || errorMessage;
            } catch (parseError) {
                console.warn("Could not parse error response:", parseError);
            }
            throw new Error(errorMessage);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Error verifying OTP:", error);
        throw new Error("Failed to verify OTP");
    }
}


export async function resend_Code(email: string) {
    try {
        const response = await fetch(`${BASE_API_URL}/auth/resend-code`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
            }),
        });

        if (!response.ok) {
            let errorMessage = "Failed to resend code";
            try {
                const errorBody = await response.json();
                errorMessage = errorBody?.message || errorMessage;
            } catch (parseError) {
                console.warn("Could not parse error response:", parseError);
            }
            throw new Error(errorMessage);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Error resending code:", error);
        throw new Error("Failed to resend code");
    }
}

export async function reset_password(newPassword: string, email: string, code: string) {
    try {
        const response = await fetch(`${BASE_API_URL}/auth/reset-password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                code: code,
                newPassword: newPassword,
            }),
        });

        if (!response.ok) {
            let errorMessage = "Failed to reset password";
            try {
                const errorBody = await response.json();
                errorMessage = errorBody?.message || errorMessage;
            } catch (parseError) {
                console.warn("Could not parse error response:", parseError);
            }
            throw new Error(errorMessage);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Error resetting password:", error);
        throw new Error("Failed to reset password");
    }
}

export async function handleUserSearch(query: string): Promise<UserSchema[]> {
    try {
        const token = getTokenFromCookie("idToken");
        const response = await fetch(`${BASE_API_URL}/user/search-users?query=${encodeURIComponent(query)}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            console.error("Error searching users:", response.statusText);
            throw new Error("Failed to search users");
        }

        const results = await response.json();

        const users = results.map((user: any) => {
            return {
                _id: user._id,
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
                lastLogin: user.lastLogin,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            } as UserSchema;
        });

        return users;
    } catch (error) {
        console.error("Error searching users:", error);
        throw new Error("Failed to search users");
    }
}

export async function registerParent(parentData: any) {
    try {
        const response = await fetch(`${BASE_API_URL}/user/register-parent`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getTokenFromCookie("idToken")}`, // Assuming Firebase or similar token auth
            },
            body: JSON.stringify(parentData),
        });

        if (!response.ok) {
            let errorMessage = "Failed to register parent";

            try {
                const errorBody = await response.json();
                errorMessage = errorBody?.message || errorMessage;
            } catch (parseError) {
                console.warn("Could not parse error response:", parseError);
            }

            console.error("Error registering parent:", errorMessage);
            throw new Error(errorMessage);
        }

        const data = await response.json();
        return data; // This includes user object and generatedPassword (if new)
        
    } catch (error) {
        console.error("Error in registerParent service:", error);
        throw new Error(error instanceof Error ? error.message : "Failed to register parent");
    }
}


