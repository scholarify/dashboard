export interface InstallmentSchema {
    amount: number;
    dueDate: string; // ISO string
    paid: boolean;
    paidAt?: string;
    transactionRef?: string;
  }
  
  export interface FeePaymentSchema extends Record<string, unknown> {
    _id: string;
    student_id: string;
    school_id: string;
    class_level: string;
    academic_year: string;
    selectedFees: string[];
    selectedResources: string[];
    paymentMode: "full" | "installment";
    totalAmount: number;
    installments?: InstallmentSchema[];
    transactionRef?: string;
    status: "pending" | "partially_paid" | "paid" | "cancelled";
    createdAt?: string;
    updatedAt?: string;
  }
  
  export interface FeePaymentCreateSchema extends Record<string, unknown> {
    student_id: string;
    school_id: string;
    class_level: string;
    academic_year: string;
    selectedFees: string[];
    selectedResources: string[];
    paymentMode: "full" | "installment";
    totalAmount: number;
    installments?: InstallmentSchema[];
  }
  
  export interface FeePaymentUpdateSchema extends Partial<FeePaymentCreateSchema> {
    _id: string;
  }
  