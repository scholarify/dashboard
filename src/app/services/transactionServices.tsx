import { BASE_API_URL } from "./AuthContext";
import { getTokenFromCookie } from "./UserServices";
import { PayementSchema } from "../models/PayementModel";
import { redirect } from "next/dist/server/api-utils";

const ApiInfo = {
    "apikey": "2012514707662f5414681471.02765824",
    "site_id": "105892957",
}
export async function initiateTransaction(payementData: PayementSchema) {

    try {
        const response = await fetch(`${BASE_API_URL}/payment/Initiatepay`,
            {
                method: 'POST',
                body: JSON.stringify(payementData),
                headers: {
                    'Content-Type': 'application/json'
                },
            }
        )
        if (!response.ok) {
            throw new Error("Failed to initiate transaction");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error initiating transaction:", error);
        throw new Error("Failed to initiate transaction");
    }
}   