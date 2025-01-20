import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "../../hooks/useForm";
import InputField from "../../components/InputField";
import FieldList from "../../components/FieldList";
import { useFormValidation } from "../../hooks/useFormValidation";
import { sendFormData } from "../../utils/sendFormData";

function NewStrain() {
  const [formData, handleChange] = useForm({
    strain: "",
    dept: "",
    abbr: "",
    iacuc_no: "",
    EXP: "",
    genes: [],
    users: [],
  });

  const [geneFields, setGeneField] = useState([{ id: 1, name: "" }]);
  const [userFields, setUserField] = useState([{ id: 1, name: "" }]);
  const { validated, validateForm } = useFormValidation();
  const navigate = useNavigate();

  const handleFieldInputChange = (fieldType, updatedFields) => {
    if (fieldType === "genes") {
      setGeneField(updatedFields);
    } else if (fieldType === "users") {
      setUserField(updatedFields);
    }
    console.log(fieldType, updatedFields);
  };

  console.log(formData);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm(event)) return;

    const updatedFormData = {
      strain: {
        ...formData,
        genes: geneFields.map((field) => field.name),
        users: userFields.map((field) => field.name),
      },
    };
    console.log(updatedFormData);

    sendFormData("/api/strains", updatedFormData, navigate);
  };

  return (
    <>
      <div className="row">
        <h1 className="text-center">新增小鼠品系:</h1>
        <div className="col-md-6 offset-md-3">
          <form
            noValidate
            onSubmit={handleSubmit}
            className={`validated-form ${validated ? "was-validated" : ""}`}
          >
            <InputField
              label="計畫單位"
              id="dept"
              name="dept"
              value={formData.dept}
              onChange={handleChange}
            />
            <InputField
              label="品系名稱"
              id="strain"
              name="strain"
              value={formData.strain}
              onChange={handleChange}
            />
            <InputField
              label="品系縮寫"
              id="abbr"
              name="abbr"
              value={formData.abbr}
              onChange={handleChange}
            />
            <InputField
              label="IACUC編號"
              id="iacuc_no"
              name="iacuc_no"
              value={formData.iacuc_no}
              onChange={handleChange}
            />
            <InputField
              type="date"
              label="計畫期限"
              id="EXP"
              name="EXP"
              value={formData.EXP}
              onChange={handleChange}
            />

            <FieldList
              FieldListName="採樣基因"
              fields={geneFields}
              onFieldChange={(updatedFields) =>
                handleFieldInputChange("genes", updatedFields)
              }
            />

            <FieldList
              FieldListName="計畫相關人員"
              fields={userFields}
              onFieldChange={(updatedFields) =>
                handleFieldInputChange("users", updatedFields)
              }
            />
            <div className="mb-3">
              <button className="btn btn-success">新增小鼠品系</button>
            </div>
          </form>
        </div>
      </div>
      <Link to="/strains/index">返回所有品系資訊</Link>
    </>
  );
}

export default NewStrain;
