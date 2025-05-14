import { BASE_API_URL } from "./AuthContext";
import { getTokenFromCookie } from "./UserServices";
import { FeeSchema, FeeCreateSchema, FeeUpdateSchema } from "../models/FeesModel";

// Get all fees
export async function getFees(): Promise<FeeSchema[]> {
  try {
    const token = getTokenFromCookie("idToken");
    const response = await fetch(`${BASE_API_URL}/fees/get-fees`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch fees");
    }

    const feesList = await response.json();
    return feesList.map((fee: any) => ({
      _id: fee._id,
      school_id: fee.school_id,
      fee_type: fee.fee_type,
      amount: fee.amount,
      createdAt: fee.createdAt,
      updatedAt: fee.updatedAt,
    })) as FeeSchema[];
  } catch (error) {
    console.error("Error fetching fees:", error);
    throw new Error("Failed to fetch fee data");
  }
}

// Get a single fee by ID
export async function getFeeById(feeId: string): Promise<FeeSchema> {
  const token = getTokenFromCookie("idToken");

  const response = await fetch(`${BASE_API_URL}/fees/get-fee/${feeId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch fee");
  }

  const fee = await response.json();
  return {
    _id: fee._id,
    school_id: fee.school_id,
    fee_type: fee.fee_type,
    amount: fee.amount,
    createdAt: fee.createdAt,
    updatedAt: fee.updatedAt,
  };
}

// Create a new fee
export async function createFee(feeData: FeeCreateSchema) {
  try {
    const response = await fetch(`${BASE_API_URL}/fees/create-fee`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getTokenFromCookie("idToken")}`,
      },
      body: JSON.stringify(feeData),
    });

    if (!response.ok) {
      const errorBody = await response.json();
      throw new Error(errorBody.message || "Failed to create fee");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating fee:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to create fee");
  }
}

// Update a fee
export async function updateFee(feeId: string, feeData: FeeUpdateSchema) {
  try {
    const response = await fetch(`${BASE_API_URL}/fees/update-fee/${feeId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getTokenFromCookie("idToken")}`,
      },
      body: JSON.stringify(feeData),
    });

    if (!response.ok) {
      const errorBody = await response.json();
      throw new Error(errorBody.message || "Failed to update fee");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating fee:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to update fee");
  }
}

// Delete a fee
export async function deleteFee(feeId: string) {
  try {
    const response = await fetch(`${BASE_API_URL}/fees/delete-fee/${feeId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getTokenFromCookie("idToken")}`,
      },
    });

    if (!response.ok) {
      const errorBody = await response.json();
      throw new Error(errorBody.message || "Failed to delete fee");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting fee:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to delete fee");
  }
}

export async function getFeesBySchoolId(schoolId: string): Promise<FeeSchema[]> {
    try {
      const token = getTokenFromCookie("idToken");
      const response = await fetch(`${BASE_API_URL}/fees/get-fees-by-school/${schoolId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch fees for the school");
      }
  
      const fees = await response.json();
      return fees.map((fee: any) => ({
        _id: fee._id,
        school_id: fee.school_id,
        fee_type: fee.fee_type,
        amount: fee.amount,
        createdAt: fee.createdAt,
        updatedAt: fee.updatedAt,
      })) as FeeSchema[];
    } catch (error) {
      console.error("Error fetching fees by school ID:", error);
      throw new Error("Failed to fetch fees by school ID");
    }
  }
