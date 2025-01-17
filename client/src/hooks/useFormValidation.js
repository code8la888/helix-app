import { useState } from "react";

export const useFormValidation = () => {
  const [validated, setValidated] = useState(false);

  const validateForm = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return false;
    }
    setValidated(true);
    return true;
  };

  return { validated, setValidated, validateForm };
};
