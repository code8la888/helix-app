import React, { useState } from "react";
import InputField from "./InputField";

export default function FieldList({
  FieldListName = "欄位列表",
  initialField = [],
  onFieldChange,
}) {
  const [fieldsList, setFeildsList] = useState(initialField);

  // 新增欄位
  const addField = () => {
    const newField = { id: Date.now(), name: "" };
    const updatedFields = [...fieldsList, newField];
    setFeildsList(updatedFields);
    onFieldChange?.(updatedFields);
  };
  // 刪除欄位
  const deleteField = (id) => {
    const updatedFields = fieldsList.filter((field) => field.id !== id);
    setFeildsList(updatedFields);
    onFieldChange?.(updatedFields);
  };

  // 更新欄位值
  const handleFieldInputChange = (index, event) => {
    const { value } = event.target;
    const updatedFields = [...fieldsList];
    updatedFields[index].name = value;
    setFeildsList(updatedFields);
    onFieldChange?.(updatedFields);
  };

  return (
    <div className="my-3">
      <h5>{FieldListName}</h5>
      <div>
        {fieldsList.map((field, index) => (
          <div key={field.id} className="d-flex align-items-center">
            <InputField
              id={field.id}
              name={`list[${index}]`}
              value={field.name}
              onChange={(event) => {
                handleFieldInputChange(index, event);
              }}
            />
            <button
              className="btn btn-danger ms-2"
              onClick={() => {
                deleteField(field.id);
              }}
            >
              刪除此{FieldListName}
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        className="btn btn-outline-primary"
        onClick={addField}
      >
        新增{FieldListName}
      </button>
    </div>
  );
}
