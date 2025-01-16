import { useState } from "react";

export const useForm = (initialState) => {
  const [formdata, setFormData] = useState(initialState);

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name.includes(".")) {
      const [parentKey, childKey] = name.split(".");
      setFormData((prevData) => ({
        ...prevData,
        [parentKey]: {
          ...prevData[parentKey],
          [childKey]: value,
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  return [formdata, handleChange];
};
