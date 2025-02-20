import InputField from "./InputField";

export default function FieldList({
  FieldListName = "請填寫欄位列表名稱",
  fields = [{ id: Date.now(), name: "" }],
  onFieldChange,
}) {
  // 新增欄位
  const addField = () => {
    const newField = { id: Date.now(), name: "" };
    const updatedFields = [...fields, newField];
    onFieldChange?.(updatedFields);
  };
  // 刪除欄位
  const deleteField = (id) => {
    const updatedFields = fields.filter((field) => field.id !== id);
    onFieldChange?.(updatedFields);
  };

  // 更新欄位的值
  const handleFieldInputChange = (index, event) => {
    const { value } = event.target;
    const updatedFields = fields.map((field, idx) =>
      idx === index ? { ...field, name: value } : field
    );
    onFieldChange?.(updatedFields);
  };

  return (
    <div className="my-3">
      <p className="mb-2 fieldListName">{FieldListName}</p>
      <div>
        {fields.map((field, index) => (
          <div key={field.id} className="d-flex align-items-center mb-3">
            <InputField
              id={field.id}
              name={`list[${index}]`}
              value={field.name}
              onChange={(event) => {
                handleFieldInputChange(index, event);
              }}
            />
            <button
              className="ms-2 danger"
              onClick={() => {
                deleteField(field.id);
              }}
            >
              刪除此{FieldListName}
            </button>
          </div>
        ))}
      </div>
      <button type="button" className="button info" onClick={addField}>
        新增{FieldListName}
      </button>
    </div>
  );
}
