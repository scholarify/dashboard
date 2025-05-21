import React from "react";
import CustomInput from "../../../../../components/inputs/CustomInput";
import CustomSelect from "../../../../../components/inputs/CustomSelect";
import CustomDateInput from "../../../../../components/inputs/CustomDateInput";
import CustomNationalitySelect from "../../../../../components/inputs/CustomNationalitySelect";

interface StudentDetailsFormProps {
  formData: {
    firstName: string;
    lastName: string;
    middleName?: string;
    dateOfBirth?: string;
    nationality?: string;
    gender?: string;
    place_of_birth?: string;
    [key: string]: any;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const StudentDetailsForm: React.FC<StudentDetailsFormProps> = ({ formData, handleChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <CustomInput
        label="First Name"
        id="firstName"
        name="firstName"
        value={formData.firstName}
        onChange={handleChange}
        required
      />

      <CustomInput
        label="Last Name"
        id="lastName"
        name="lastName"
        value={formData.lastName}
        onChange={handleChange}
        required
      />

      <CustomInput
        label="Middle Name"
        id="middleName"
        placeholder="(Optional)"
        name="middleName"
        value={formData.middleName || ""}
        onChange={handleChange}
      />

      <CustomDateInput
        label="Date of Birth"
        id="dateOfBirth"
        name="dateOfBirth"
        value={formData.dateOfBirth || ""}
        onChange={handleChange}
      />

      <CustomNationalitySelect
        label="Nationality"
        id="nationality"
        name="nationality"
        value={formData.nationality || ""}
        onChange={handleChange}
        required
      />

      <CustomSelect
        label="Gender"
        id="gender"
        name="gender"
        value={formData.gender || ""}
        onChange={handleChange}
        required
        options={[
          { label: "Male", value: "Male" },
          { label: "Female", value: "Female" },
        ]}
        placeholder="Select gender"
      />

      <CustomInput
        label="Place Of Birth"
        id="place_of_birth"
        name="place_of_birth"
        value={formData.place_of_birth || ""}
        onChange={handleChange}
      />
    </div>
  );
};

export default StudentDetailsForm;
