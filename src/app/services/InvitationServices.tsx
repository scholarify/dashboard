import { BASE_API_URL } from "./AuthContext";
import { getTokenFromCookie } from "./UserServices";
import { InvitationCreateSchema, InvitationSchema, InvitationUpdateSchema } from "../models/Invitation";

// Get all invitations
export async function getInvitations(): Promise<InvitationSchema[]> {
    try {
        const token = getTokenFromCookie("idToken");
        const response = await fetch(`${BASE_API_URL}/invitation/get-invitations`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch invitation data");
        }

        const invitationsList = await response.json();
        return invitationsList.map((invitation: any) => ({
            _id: invitation._id,
            email: invitation.email,
            phone: invitation.phone,
            name: invitation.name,
            childrenIds: invitation.childrenIds,
            token: invitation.token,
            status: invitation.status,
            invitedAt: invitation.invitedAt,
        })) as InvitationSchema[];

    } catch (error) {
        console.error("Error fetching invitations:", error);
        throw new Error("Failed to fetch invitation data");
    }
}

// Get single invitation by ID
export async function getInvitationById(invitationId: string): Promise<InvitationSchema> {
    const response = await fetch(`${BASE_API_URL}/invitation/get-invitation/${invitationId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getTokenFromCookie("idToken")}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch invitation");
    }

    const data = await response.json();
    return {
        _id: data._id,
        email: data.email,
        phone: data.phone,
        name: data.name,
        childrenIds: data.childrenIds,
        token: data.token,
        status: data.status,
        invitedAt: data.invitedAt,
    } as InvitationSchema;
}

// Create invitation
export async function createInvitation(invitationData: InvitationCreateSchema) {
    try {
        const response = await fetch(`${BASE_API_URL}/invitation/create-invitation`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getTokenFromCookie("idToken")}`,
            },
            body: JSON.stringify(invitationData),
        });

        if (!response.ok) {
            let errorMessage = "Failed to create invitation";
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
        console.error("Error creating invitation:", error);
        throw new Error(error instanceof Error ? error.message : "Failed to create invitation");
    }
}

// Update invitation
export async function updateInvitation(invitationId: string, invitationData: InvitationUpdateSchema) {
    try {
        const response = await fetch(`${BASE_API_URL}/invitation/update-invitation/${invitationId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getTokenFromCookie("idToken")}`,
            },
            body: JSON.stringify(invitationData),
        });

        if (!response.ok) {
            let errorMessage = "Failed to update invitation";
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
        console.error("Error updating invitation:", error);
        throw new Error(error instanceof Error ? error.message : "Failed to update invitation");
    }
}

// Delete invitation
export async function deleteInvitation(invitationId: string) {
    try {
        const response = await fetch(`${BASE_API_URL}/invitation/delete-invitation/${invitationId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getTokenFromCookie("idToken")}`,
            },
        });

        if (!response.ok) {
            let errorMessage = "Failed to delete invitation";
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
        console.error("Error deleting invitation:", error);
        throw new Error(error instanceof Error ? error.message : "Failed to delete invitation");
    }
}

// Delete multiple invitations
export async function deleteMultipleInvitations(invitationIds: string[]) {
    try {
        const response = await fetch(`${BASE_API_URL}/invitation/delete-invitations`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getTokenFromCookie("idToken")}`,
            },
            body: JSON.stringify({ invitation_ids: invitationIds }),
        });

        if (!response.ok) {
            let errorMessage = "Failed to delete multiple invitations";
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
        console.error("Error deleting multiple invitations:", error);
        throw new Error(error instanceof Error ? error.message : "Failed to delete multiple invitations");
    }
}
