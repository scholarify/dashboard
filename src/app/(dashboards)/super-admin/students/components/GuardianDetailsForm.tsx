import React, { useState } from "react";
import CustomInput from "../../../../../components/inputs/CustomInput";
import CustomSelect from "../../../../../components/inputs/CustomSelect";
import CustomCheckboxInput from "@/components/inputs/CustomCheckBoxInput";
import CustomPhoneInput from "../../../../../components/inputs/CustomPhoneInput";
import AsyncSelect from "react-select/async";
import { handleUserSearch } from "@/app/services/UserServices";
import { components } from 'react-select';


interface GuardianDetailsFormProps {
  formData: { [key: string]: any };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  sameAddressAsChild: boolean;
  setSameAddressAsChild: (checked: boolean) => void;
  countryCode: string;
  setCountryCode: (code: string) => void;
}

const GuardianDetailsForm: React.FC<GuardianDetailsFormProps> = ({
  formData,
  handleChange,
  sameAddressAsChild,
  setSameAddressAsChild,
  countryCode,
  setCountryCode,
}) => {
  const [selectedGuardian, setSelectedGuardian] = useState<any>(null);

  const customSelectStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      borderColor: state.isFocused ? '#14b8a6' : '#d1d5db', // teal ring vs gray-300
      boxShadow: state.isFocused ? '0 0 0 2px #14b8a6' : 'none',
      padding: '2px 8px',
      borderRadius: '0.375rem', // rounded-md = 6px
      minHeight: '38px',
      backgroundColor: state.isDisabled ? '#f3f4f6' : 'bg-gray-100', // bg-gray-100
      color: state.isDisabled ? '#9ca3af' : 'inherit',
    }),
    input: (provided: any) => ({
      ...provided,
      margin: 0,
      padding: 0,
      color: 'inherit',
      fontSize: '0.875rem', // text-sm
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: '#4b5563', // gray-600
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: 'inherit',
    }),
    dropdownIndicator: (provided: any, state: any) => ({
      ...provided,
      color: state.isFocused ? '#14b8a6' : '#9ca3af',
      padding: 4,
    }),
    clearIndicator: (provided: any) => ({
      ...provided,
      padding: 4,
    }),
    menu: (provided: any) => ({
      ...provided,
      borderRadius: '0.375rem',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isFocused ? '#14b8a6' : 'bg-background',
      color: state.isFocused ? 'white' : 'black',
      padding: '8px 12px',
      cursor: 'pointer',
    }),
  };

  const loadOptions = async (inputValue: string) => {
    if (!inputValue) return [];
    try {
      const results = await handleUserSearch(inputValue);
      // Filter only those with role === 'parent'
      const filtered = results.filter((guardian: any) => guardian.role === 'parent');
      return filtered.map((guardian: any) => ({
        label: `${guardian.name} (${guardian.email} | ${guardian.phone})`,
        value: guardian._id,
        data: guardian,
      }));
    } catch (error) {
      console.error(error);
      return [];
    }
  };


  const handleGuardianSelect = (option: any) => {
    setSelectedGuardian(option);

    if (option?.data) {
      const g = option.data;

      handleChange({ target: { name: "guardian_name", value: g.name || "" } } as React.ChangeEvent<HTMLInputElement>);
      handleChange({ target: { name: "guardian_email", value: g.email || "" } } as React.ChangeEvent<HTMLInputElement>);
      handleChange({ target: { name: "guardian_phone", value: g.phone || "" } } as React.ChangeEvent<HTMLInputElement>);
      handleChange({ target: { name: "guardian_address", value: g.address || "" } } as React.ChangeEvent<HTMLInputElement>);
    } else {
      // Clear fields on deselect
      handleChange({ target: { name: "guardian_name", value: "" } } as React.ChangeEvent<HTMLInputElement>);
      handleChange({ target: { name: "guardian_email", value: "" } } as React.ChangeEvent<HTMLInputElement>);
      handleChange({ target: { name: "guardian_phone", value: "" } } as React.ChangeEvent<HTMLInputElement>);
      handleChange({ target: { name: "guardian_address", value: "" } } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (selectedGuardian) {
      setSelectedGuardian(null);
    }
    handleChange(e);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="col-span-2">
        <label className="block text-sm font-medium text-foreground mb-1">
          Search Guardian in the system
        </label>
        <AsyncSelect
          cacheOptions
          loadOptions={loadOptions}
          onChange={handleGuardianSelect}
          placeholder="Type name or email..."
          defaultOptions
          value={selectedGuardian}
          isClearable
          styles={customSelectStyles}
          components={{
            Input: (props) => (
              <components.Input
                {...props}
                // 👇 Prevent browser autocomplete
                autoComplete="off"
                aria-autocomplete="none"
              />
            ),
          }}
        />
      </div>

      <CustomInput
        label="Parent/Guardian Name"
        id="guardian_name"
        name="guardian_name"
        value={formData.guardian_name || ""}
        onChange={handleFormChange}
      />

      <CustomSelect
        label="Relationship With Student"
        id="guardian_relationship"
        name="guardian_relationship"
        value={formData.guardian_relationship || ""}
        onChange={handleFormChange}
        required
        options={[
          { label: "Mother", value: "Mother" },
          { label: "Father", value: "Father" },
          { label: "Brother", value: "Brother" },
          { label: "Sister", value: "Sister" },
          { label: "Aunty", value: "Aunty" },
          { label: "Uncle", value: "Uncle" },
          { label: "Grand Mother", value: "Grand Mother" },
          { label: "Grand Father", value: "Grand Father" },
          { label: "Other", value: "Other" },
        ]}
        placeholder="Select Relationship"
      />

      <CustomCheckboxInput
        label="Same address as student"
        id="sameAddressAsChild"
        name="sameAddressAsChild"
        checked={sameAddressAsChild}
        onChange={(e) => setSameAddressAsChild(e.target.checked)}
      />

      <CustomInput
        label="Address"
        id="guardian_address"
        placeholder="(Required)"
        name="guardian_address"
        value={formData.guardian_address || ""}
        onChange={handleFormChange}
      />

      <CustomPhoneInput
        label="Phone Number (Required)"
        id="guardian_phone"
        name="guardian_phone"
        value={formData.guardian_phone || ""}
        onChange={handleFormChange}
        countryCode={countryCode}
        onCountryCodeChange={(e) => setCountryCode(e.target.value)}
        required
      />

      <CustomInput
        label="Occupation"
        id="guardian_occupation"
        placeholder="(Optional)"
        name="guardian_occupation"
        value={formData.guardian_occupation || ""}
        onChange={handleFormChange}
      />

      <CustomInput
        label="Email"
        id="guardian_email"
        placeholder="(Optional)"
        name="guardian_email"
        value={formData.guardian_email || ""}
        onChange={handleFormChange}
      />
    </div>
  );
};

export default GuardianDetailsForm;
