import React from "react";

const InputField = ({
  label,
  type = "text",
  id,
  name,
  value,
  onChange,
  required = true,
  validFeedback,
  invalidFeedback = "此欄位為必填",
  autoComplete,
  readOnly = false,
  placeholder,
  className,
}) => {
  return (
    <div className={` ${className}`}>
      {label ? (
        <label className="form-label fw-bold" htmlFor={id}>
          {label}
        </label>
      ) : (
        ""
      )}
      <input
        className="form-control"
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        autoComplete={autoComplete}
        readOnly={readOnly}
        placeholder={placeholder}
      />
      <div className="valid-feedback">{validFeedback}</div>
      <div className="invalid-feedback">{invalidFeedback}</div>
    </div>
  );
};

export default InputField;
