"use client";

import React from "react";

interface ConsentDeclarationProps {
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  id?: string;
}

const ConsentDeclaration: React.FC<ConsentDeclarationProps> = ({
  checked,
  onChange,
  name = "guardian_agreed_to_terms",
  id = "guardian_agreed_to_terms",
}) => {
  return (
    <div className="mt-6 space-y-4 p-4 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-200">
      <div className="max-h-64 overflow-y-auto px-2 py-3 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900">
        <h2 className="font-semibold mb-2 text-base">Consent Declaration</h2>
        <p>
          The parent or guardian present confirms that they are the lawful guardian of the student named in this application. They affirm that all provided information is true and accurate to the best of their knowledge.
        </p>
        <p className="mt-2">They understand and accept that:</p>
        <ul className="list-disc list-inside ml-4 space-y-1">
          <li>
            The school may collect, store, and process personal and student data in accordance with data protection laws.
          </li>
          <li>
            They are financially responsible for the fees and agree to the selected mode of payment (full or installment).
          </li>
          <li>
            If paying by installments, they agree to pay by the specified due dates. Failure to do so may lead to penalties or access restrictions.
          </li>
          <li>
            The school may amend schedules, fees, or policies with due notice.
          </li>
          <li>
            The school may seek emergency medical treatment if the guardian cannot be reached.
          </li>
          <li>
            They have read and agree to follow the school’s academic, behavioral, and safety policies.
          </li>
        </ul>
        <p className="mt-2">
          The admin is confirming below that the parent/guardian has reviewed this declaration and given verbal consent.
        </p>
      </div>

      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          id={id}
          name={name}
          checked={checked}
          onChange={onChange}
          className="mt-1 accent-teal-600"
          required
        />
        <span className="text-sm">
          I confirm that the parent/guardian present has given verbal consent to the declaration above.
        </span>
      </label>
    </div>
  );
};

export default ConsentDeclaration;
