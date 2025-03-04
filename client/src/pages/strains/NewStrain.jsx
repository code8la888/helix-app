import { Link } from "react-router-dom";
import { useForm } from "../../hooks/useForm";
import InputField from "../../components/InputField";
import FieldList from "../../components/FieldList";
import { useFormValidation } from "../../hooks/useFormValidation";
import { useCreateStrain } from "../../hooks/useStrainMutation";

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
  const createStrainMutation = useCreateStrain();

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
    console.log("新增資訊：", updatedFormData);

    await createStrainMutation.mutateAsync(updatedFormData);
  };

  return (
    <div className="row">
      <h1 className="text-center">特殊品系實驗動物繁殖計畫申請</h1>
      <div className="col-10 offset-1">
        <form
          noValidate
          onSubmit={handleSubmit}
          className={`validated-form ${
            validated ? "was-validated" : ""
          } shadow-lg mb-3 p-4 rounded-3`}
        >
          <InputField
            label="計畫單位(必填)"
            id="dept"
            name="dept"
            value={formData.dept}
            onChange={handleChange}
            className="col"
          />

          <InputField
            label="品系名稱(必填)"
            id="strain"
            name="strain"
            value={formData.strain}
            onChange={handleChange}
            className="col"
          />

          <InputField
            label="品系縮寫(必填)"
            id="abbr"
            name="abbr"
            value={formData.abbr}
            onChange={handleChange}
            className="col"
          />

          <InputField
            label="IACUC編號(必填)"
            id="iacuc_no"
            name="iacuc_no"
            value={formData.iacuc_no}
            onChange={handleChange}
            className="col"
          />

          <InputField
            type="date"
            label="計畫期限(必填)"
            id="EXP"
            name="EXP"
            value={formData.EXP}
            onChange={handleChange}
            className="col"
          />

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
            FieldListName="計畫人員"
            fields={formData.users || []}
            onFieldChange={(updatedFields) =>
              setFormData((prev) => ({
                ...prev,
                users: updatedFields,
              }))
            }
          />
          <div className="mt-5 mb-3 d-flex justify-content-end">
            <button className="warning">新增實驗計畫</button>
          </div>
          <div className="d-flex justify-content-end">
            <button className="danger">
              <Link to={"/dashboard"} className="link">
                返回儀錶板
              </Link>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewStrain;
