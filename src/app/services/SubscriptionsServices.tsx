import { SubscriptionSchema } from "../models/SubscriptionModel";
import { BASE_API_URL } from "./AuthContext";
import { getTokenFromCookie } from "./UserServices";


export async function getSubscriptions() {
    const response = await fetch(`${BASE_API_URL}/subscription/get-subscriptions`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getTokenFromCookie("idToken")}`,
        },
    });
    if (!response.ok) {
        console.error("Error  fetching subscriptions:", response.statusText);
        throw new Error("Failed to fetch subscriptions data");
    }
    const data = await response.json();
    const subscriptions = data.map((subscription: any) =>{
        return {
            _id: subscription._id,
            subscription_id: subscription.subscription_id,
            transaction_id: subscription.transaction_id,
            guardian_id: subscription.guardian_id,
            student_id: subscription.student_id,
            amount: subscription.amount,
            email: subscription.email,
            status: subscription.status,
            expiryDate: subscription.expiryDate,
            createdAt: subscription.createdAt,
            updatedAt: subscription.updatedAt

        } as SubscriptionSchema
    })
    return subscriptions
}
