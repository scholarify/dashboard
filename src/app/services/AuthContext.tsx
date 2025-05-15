'use client';
import Cookies from "js-cookie";
import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { getCurrentUser } from "./UserServices";
import { UserSchema } from "../models/UserModel";

export const BASE_API_URL = "https://scolarify.onrender.com/api";



// Context for authentication and user data

interface AuthContextType {
    user: UserSchema | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (email: string, password: string, rememberMe: boolean, redirectUrl?: string) => Promise<void>;
    logout: () => Promise<void>;
    redirectAfterLogin: string | null;
    setRedirectAfterLogin: (url: string) => void;
}

// Create a context for authentication
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Interface for the provider props
interface AuthProviderProps {
    children: React.ReactNode;
}

// composant AuthProvider qui fournit le contexte d'authentification

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<UserSchema | null>(null);
    const [loading, setLoading] = useState(true);
    const [redirectAfterLogin, setRedirectAfterLogin] = useState<string | null>(null);

    // vérifier si un utilisateur est déja connecté
    useEffect(() => {
        const checkUserLoggedIn = async () => {
            try {
                const user: UserSchema | null = await getCurrentUser();
                if (user) {
                    setUser(user);
                }else{
                    Cookies.remove("idToken");
                    setUser(null);
                }

            } catch (error) {
                console.error("Error verifying token:", error);
            }
            finally {
                setLoading(false);
            }
        };
        checkUserLoggedIn();
    }, []);

    const login = async (email: string, password: string, rememberMe: boolean, redirectUrl?: string) => {
        try {
            const response = await fetch(`${BASE_API_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            });

            const data = await response.json();
            if (!response.ok) {
                console.error("Login error:", data.message || "Unknown error");
                throw new Error(data.message || "Login failed");
            }

            const { idToken } = data;
            if (!idToken) {
                throw new Error("No idToken received");
            }

            // Stocker le token dans les cookies
            Cookies.set("idToken", idToken, { expires: rememberMe ? 30 : 7 }); // Expire dans 7 jours

            const user: UserSchema | null = await getCurrentUser(); // Vérifier si l'utilisateur est connecté à nouveau après la connexion réussie
            if (user) {
                setUser(user);
            }

            // Si une URL de redirection est fournie, stocke-la
            if (redirectUrl) {
                setRedirectAfterLogin(redirectUrl);
            }
            
        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        }
    };

    const logout = async () => {
        setUser(null);
        Cookies.remove("idToken"); // Supprimer le token des cookies
        setRedirectAfterLogin(null); // Réinitialiser l'URL de redirection
        return Promise.resolve();
    };

    const isAuthentiacted = !!user; // Vérifier si l'utilisateur est authentifié

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: isAuthentiacted, loading, setRedirectAfterLogin, redirectAfterLogin, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}