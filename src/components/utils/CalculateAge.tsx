// utils/calculateAge.ts

export const calculateAge = (date_of_birth?: string | Date): number => {
    if (!date_of_birth) return 0;
  
    const birthDate = new Date(date_of_birth);
  
    if (isNaN(birthDate.getTime())) return 0;
  
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
  
    const m = today.getMonth();
    const d = today.getDate();
  
    if (m < birthDate.getMonth() || (m === birthDate.getMonth() && d < birthDate.getDate())) {
      age--;
    }
  
    return age;
  };
  