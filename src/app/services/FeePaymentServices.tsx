import { BASE_API_URL } from "./AuthContext";
import { getTokenFromCookie } from "./UserServices";
import {
  FeePaymentSchema,
  FeePaymentCreateSchema,
  FeePaymentUpdateSchema,
} from "../models/FeePayment";

// Get all fee payments
export async function getFeePayments(): Promise<FeePaymentSchema[]> {
  const token = getTokenFromCookie("idToken");
  const response = await fetch(`${BASE_API_URL}/fee-payments/get-fee-payments`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Failed to fetch fee payments");

  return await response.json();
}

// Get fee payment by ID
export async function getFeePaymentById(id: string): Promise<FeePaymentSchema> {
  const token = getTokenFromCookie("idToken");
  const response = await fetch(`${BASE_API_URL}/fee-payments/get-fee-payment/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Failed to fetch fee payment");

  return await response.json();
}

// Create fee payment
export async function createFeePayment(data: FeePaymentCreateSchema): Promise<FeePaymentSchema> {
  const token = getTokenFromCookie("idToken");

  const response = await fetch(`${BASE_API_URL}/fee-payment/create-fee-payment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.message || "Failed to create fee payment");
  }

  return await response.json();
}

// Update fee payment
export async function updateFeePayment(id: string, data: FeePaymentUpdateSchema): Promise<FeePaymentSchema> {
  const token = getTokenFromCookie("idToken");

  const response = await fetch(`${BASE_API_URL}/fee-payment/update-fee-payment/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.message || "Failed to update fee payment");
  }

  return await response.json();
}

// Delete fee payment
export async function deleteFeePayment(id: string): Promise<{ message: string }> {
  const token = getTokenFromCookie("idToken");

  const response = await fetch(`${BASE_API_URL}/fee-payment/delete-fee-payment/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.message || "Failed to delete fee payment");
  }

  return await response.json();
}

// Get fee payments by school ID
export async function getFeePaymentsBySchoolId(schoolId: string): Promise<FeePaymentSchema[]> {
  const token = getTokenFromCookie("idToken");

  const response = await fetch(`${BASE_API_URL}/fee-payment/get-fee-payments-by-school/${schoolId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Failed to fetch payments for school");

  return await response.json();
}

// Get fee payments by student ID
export async function getFeePaymentsByStudentId(studentId: string): Promise<FeePaymentSchema[]> {
  const token = getTokenFromCookie("idToken");

  const response = await fetch(`${BASE_API_URL}/fee-payment/get-fee-payments-by-student/${studentId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Failed to fetch payments for student");

  return await response.json();
}
