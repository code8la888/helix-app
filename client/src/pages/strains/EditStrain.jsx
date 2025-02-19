import { useParams, useNavigate, Link } from "react-router-dom";
import InputField from "../../components/InputField";
import FieldList from "../../components/FieldList";
import { useForm } from "../../hooks/useForm";
import { useFormValidation } from "../../hooks/useFormValidation";
import { useStrain } from "../../hooks/useStrain";
import { useUpdateStrain } from "../../hooks/useStrainMutation";
import { useHandleError } from "../../hooks/useHandleError";
import { useSelector } from "react-redux";
import { useEffect } from "react";

export default function EditStrain() {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth);
  const { data, isLoading, error } = useStrain(id);
  const strain = data?.strain;
  const hasEditPermission =
    currentUser &&
    strain?.users.includes(currentUser.username) &&
    currentUser.role === "品系管理人";
  const updateStrainMutation = useUpdateStrain(id);
  useEffect(() => {
    if (!hasEditPermission) {
      navigate("/error", {
        state: {
          error: "您不具有編輯權限",
        },
      });
    }
  }, [hasEditPermission, navigate]);
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

  if (strain && !isLoading && formData.strain === "") {
    setFormData({ ...strain });
  }

  currentUser &&
    strain?.users.includes(currentUser.username) &&
    currentUser.role === "品系管理人";

  useHandleError(error);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm(event)) return;
    const { _id, mice, breedingRecords, __v, ...rest } = formData;
    const strain = {
      ...rest,
    };
    await updateStrainMutation.mutateAsync(strain);
  };

  return (
    <div className="row">
      <h1 className="text-center">編輯小鼠品系</h1>
      <div className="col-8 offset-2">
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
              value={formData?.dept}
              onChange={handleChange}
              className="col"
            />
            <InputField
              label="品系名稱"
              id="strain"
              name="strain"
              value={formData?.strain}
              onChange={handleChange}
              className="col"
            />
            <InputField
              label="品系縮寫"
              id="abbr"
              name="abbr"
              value={formData?.abbr}
              onChange={handleChange}
              className="col"
            />
          </div>
          <div className="row">
            <InputField
              label="IACUC編號"
              id="iacuc_no"
              name="iacuc_no"
              value={formData?.iacuc_no}
              onChange={handleChange}
              className="col"
            />
            <InputField
              type="date"
              label="計畫期限"
              id="EXP"
              name="EXP"
              value={
                formData?.EXP
                  ? new Date(formData.EXP).toISOString().split("T")[0]
                  : ""
              }
              onChange={handleChange}
              className="col"
            />
          </div>

          <FieldList
            FieldListName="採樣基因"
            fields={
              formData.genes?.map((gene, index) => ({
                id: index,
                name: gene,
              })) || []
            }
            onFieldChange={(updatedFields) => {
              const updatedGenes = updatedFields.map((field) => field.name);
              setFormData((prev) => ({
                ...prev,
                genes: updatedGenes,
              }));
            }}
          />

          <FieldList
            FieldListName="計畫相關人員"
            fields={
              formData.users?.map((user, index) => ({
                id: index,
                name: user,
              })) || []
            }
            onFieldChange={(updatedFields) => {
              const updatedUsers = updatedFields.map((field) => field.name);
              setFormData((prev) => ({
                ...prev,
                users: updatedUsers,
              }));
            }}
          />
          <div className="mt-5 d-flex justify-content-end">
            <button className=" warning">更新小鼠品系</button>
            <button className=" danger ms-2 border-2">
              <Link to={`/strains/${id}`} className="link">
                取消，返回品系資訊
              </Link>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
