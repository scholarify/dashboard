
export interface SubscriptionSchema extends Record<string, unknown> {
    _id: string;
    subscription_id: string;
    transaction_id: string;
    guardian_id: string;
    student_id?: string[];
    amount: number;
    email: string;
    status: boolean;
    expiryDate?: Date;
    createdAt?: Date;
    updatedAt?: Date;

}