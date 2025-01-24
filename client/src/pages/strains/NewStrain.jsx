import { Link, useNavigate } from "react-router-dom";
import { useForm } from "../../hooks/useForm";
import InputField from "../../components/InputField";
import FieldList from "../../components/FieldList";
import { useFormValidation } from "../../hooks/useFormValidation";
import { sendFormData } from "../../utils/sendFormData";

function NewStrain() {
  const [formData, handleChange, setFormData] = useForm({
    strain: "",
    dept: "",
    abbr: "",
    iacuc_no: "",
    EXP: "",
    genes: [],
    users: [],
  });

  const { validated, validateForm } = useFormValidation();
  const navigate = useNavigate();

  console.log(formData);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm(event)) return;

    const updatedFormData = {
      strain: {
        ...formData,
        genes: formData.genes.map((field) => field.name),
        users: formData.users.map((field) => field.name),
      },
    };
    console.log(updatedFormData);

    sendFormData("/api/strains", updatedFormData, navigate);
  };

  return (
    <div className="row">
      <h1 className="text-center">新增小鼠品系:</h1>
      <div className="col-md-8 offset-md-2">
        <form
          noValidate
          onSubmit={handleSubmit}
          className={`validated-form ${
            validated ? "was-validated" : ""
          } shadow-lg mb-3 p-4 rounded-3`}
        >
          <div className="row">
            <InputField
              label="計畫單位"
              id="dept"
              name="dept"
              value={formData.dept}
              onChange={handleChange}
              className="col"
            />
            <InputField
              label="品系名稱"
              id="strain"
              name="strain"
              value={formData.strain}
              onChange={handleChange}
              className="col"
            />
            <InputField
              label="品系縮寫"
              id="abbr"
              name="abbr"
              value={formData.abbr}
              onChange={handleChange}
              className="col"
            />
          </div>
          <div className="row">
            <InputField
              label="IACUC編號"
              id="iacuc_no"
              name="iacuc_no"
              value={formData.iacuc_no}
              onChange={handleChange}
              className="col"
            />
            <InputField
              type="date"
              label="計畫期限"
              id="EXP"
              name="EXP"
              value={formData.EXP}
              onChange={handleChange}
              className="col"
            />
          </div>

          <FieldList
            FieldListName="採樣基因"
            fields={formData.genes || []}
            onFieldChange={(updatedFields) =>
              setFormData((prev) => ({
                ...prev,
                genes: updatedFields,
              }))
            }
          />

          <FieldList
            FieldListName="計畫相關人員"
            fields={formData.users || []}
            onFieldChange={(updatedFields) =>
              setFormData((prev) => ({
                ...prev,
                users: updatedFields,
              }))
            }
          />
          <div className="mt-5 d-flex justify-content-end">
            <button className="btn btn-warning">新增小鼠品系</button>
            <button className="btn btn-danger ms-2 border-2">
              <Link
                to={"/strains/index"}
                style={{ textDecoration: "none", color: "white" }}
              >
                取消，返回所有品系資訊
              </Link>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewStrain;
