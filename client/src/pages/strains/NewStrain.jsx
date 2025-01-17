import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm } from "../../hooks/useForm";
import InputField from "../../components/InputField";
import FieldList from "../../components/FieldList";
import { useFormValidation } from "../../hooks/useFormValidation";

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

    try {
      const res = await axios.post("/api/strains", updatedFormData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.data.redirect) {
        window.location.href = res.data.redirect;
      } else {
        console.log("資料送出成功:", res.data);
      }
    } catch (error) {
      let errorMessage = "提交失敗，請稍後再試。";
      let errorStack = "";
      console.log(error.response);

      if (error.response) {
        errorMessage = error.response.data.message || "伺服器錯誤。";
        errorStack = error.response.data.stack || "XXX";
      } else if (error.request) {
        errorMessage = "伺服器未響應，請稍後再試。";
      } else {
        errorMessage = error.message;
        errorStack = error.stack;
      }

      navigate("/error", { state: { error: errorMessage, stack: errorStack } });
    }
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
              initialField={geneFields}
              onFieldChange={(updatedFields) =>
                handleFieldInputChange("genes", updatedFields)
              }
            />

            <FieldList
              FieldListName="計畫相關人員"
              initialField={userFields}
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
