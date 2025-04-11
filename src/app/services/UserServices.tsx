
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { BASE_API_URL } from "./AuthContext";

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