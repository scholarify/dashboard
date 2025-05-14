import React from "react";
import { FeeSchema } from "@/app/models/FeesModel";

interface ApplicableFeesSectionProps {
  feeList: FeeSchema[];
  formData: { selectedFees: string[] };
  feeLoading: boolean;
  handleChange: (e: React.ChangeEvent<any>) => void;
}

const ApplicableFeesSection: React.FC<ApplicableFeesSectionProps> = ({
  feeList,
  formData,
  feeLoading,
  handleChange,
}) => {
  return (
    <div className="w-full rounded-lg border border-gray-300 dark:border-gray-700 shadow-sm p-4 bg-white dark:bg-gray-900 space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Select Applicable Fees</h3>

      <div className="max-h-32 overflow-y-auto p-2 space-y-3 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-foreground dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-teal custom-scrollbar">
        {feeLoading ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading fees...</p>
        ) : feeList.length > 0 ? (
          feeList.map((fee) => (
            <div key={fee._id} className="flex items-center gap-3">
              <input
                type="checkbox"
                id={`fee-${fee._id}`}
                name="selectedFees"
                value={fee._id}
                checked={formData.selectedFees.includes(fee._id)}
                onChange={handleChange}
                className="w-4 h-4 text-teal-600 accent-teal-600"
              />
              <label
                htmlFor={`fee-${fee._id}`}
                className="text-sm text-gray-700 dark:text-gray-200"
              >
                {fee.fee_type} —{" "}
                <strong className="text-gray-900 dark:text-white">
                  {fee.amount.toLocaleString()} XAF
                </strong>
              </label>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">No applicable fees available.</p>
        )}
      </div>
    </div>
  );
};

export default ApplicableFeesSection;
