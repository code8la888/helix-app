import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useCheckPermission } from "../../hooks/useCheckPermission";
import InputField from "../../components/InputField";
import FieldList from "../../components/FieldList";
import { fetchData } from "../../utils/fetchData";
import { useForm } from "../../hooks/useForm";
import { useFormValidation } from "../../hooks/useFormValidation";
import { sendFormData } from "../../utils/sendFormData";

export default function EditStrain() {
  const { id } = useParams();
  const isAuthorized = useCheckPermission(id);
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

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetchData(`/api/strains/${id}`);
        setFormData((prevData) => ({
          ...prevData,
          ...res.strain,
        }));
      } catch (error) {
        console.error("Error fetching strains data:", error);
      }
    };

    if (isAuthorized) {
      loadData();
    }
  }, [id]);

  console.log(formData);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm(event)) return;

    const { _id, mice, breedingRecords, __v, ...rest } = formData;

    const updatedFormData = {
      strain: {
        ...rest,
      },
    };
    console.log(updatedFormData);
    sendFormData(`/api/strains/${id}`, updatedFormData, navigate, "PUT");
  };

  if (isAuthorized === null) {
    return <div>正在檢查權限...</div>;
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <>
      <div className="row">
        <h1 className="text-center">編輯小鼠品系:</h1>
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
              value={formData?.dept}
              onChange={handleChange}
            />
            <InputField
              label="品系名稱"
              id="strain"
              name="strain"
              value={formData?.strain}
              onChange={handleChange}
            />
            <InputField
              label="品系縮寫"
              id="abbr"
              name="abbr"
              value={formData?.abbr}
              onChange={handleChange}
            />
            <InputField
              label="IACUC編號"
              id="iacuc_no"
              name="iacuc_no"
              value={formData?.iacuc_no}
              onChange={handleChange}
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
            />

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
            <div className="mb-3">
              <button className="btn btn-success">更新小鼠品系</button>
            </div>
          </form>
        </div>
      </div>
      <Link to={`/strains/${id}`}>返回小鼠品系資訊</Link>
    </>
  );
}
