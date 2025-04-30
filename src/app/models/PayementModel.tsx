
export interface PayementSchema extends Record<string, unknown> {
    _id?: string;
    userId: string,
    amount: number,
    name: string,
    email: string,
    externalId:string,
    redirectUrl: string
}