import React, { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useCheckPermission } from "../../hooks/useCheckPermission";
import { useFormValidation } from "../../hooks/useFormValidation";
import { useForm } from "../../hooks/useForm";
import { sendFormData } from "../../utils/sendFormData";
import { fetchData } from "../../utils/fetchData";
import InputField from "../../components/InputField";
import Loader from "../../components/Loader";

export default function EditBreedingRecord() {
  const { strainId, breedingRecordId } = useParams();
  const navigate = useNavigate();
  const isAuthorized = useCheckPermission(strainId);
  const [formData, handleChange, setFormData] = useForm({
    strain: strainId,
    cage_no: "",
    parents: {
      father: "",
      mother: "",
    },
    pairing_date: "",
    on_shelf: "在架上",
  });
  const { validated, validateForm } = useFormValidation();

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetchData(
          `/api/strains/${strainId}/breedingRecord/${breedingRecordId}/edit`
        );

        setFormData((prev) => ({
          ...prev,
          ...res.breedingRecord,
        }));
        console.log(res);
      } catch (error) {
        console.error("Error fetching strains data:", error);
      }
    };

    if (isAuthorized) {
      loadData();
    }
  }, [strainId, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm(event)) return;

    const { _id, __v, ...rest } = formData;

    const updatedFormData = {
      breedingRecord: {
        ...rest,
      },
    };
    // console.log(updatedFormData)

    sendFormData(
      `/api/strains/${strainId}/breedingRecord/${breedingRecordId}`,
      updatedFormData,
      navigate,
      "PUT"
    );
  };

  if (isAuthorized === null) {
    return <Loader>正在檢查權限...</Loader>;
  }

  if (!isAuthorized) {
    navigate("/error");
  }

  return (
    <div className="row">
      <h1 className="text-center">編輯繁殖籠表:</h1>
      <div className="col-md-8 offset-md-2">
        <form
          onSubmit={handleSubmit}
          noValidate
          className={`validated-form ${
            validated ? "was-validated" : ""
          } shadow-lg mb-3 p-4 rounded-3`}
        >
          <div className="row">
            <InputField
              label="繁殖籠編號"
              id="cage_no"
              name="cage_no"
              onChange={handleChange}
              className="col"
              value={formData.cage_no}
            />
            <InputField
              label="父"
              id="father"
              name="parents.father"
              onChange={handleChange}
              className="col"
              value={formData.parents.father}
            />

            <InputField
              label="母"
              id="mother"
              name="parents.mother"
              onChange={handleChange}
              className="col"
              value={formData.parents.mother}
            />
          </div>
          <div className="row">
            <InputField
              label="配種日期"
              type="date"
              id="pairing_date"
              name="pairing_date"
              onChange={handleChange}
              className="col"
              value={
                formData?.pairing_date
                  ? new Date(formData.pairing_date).toISOString().split("T")[0]
                  : ""
              }
            />

            <div className="mb-3 col">
              <label className="form-label" for="on_shelf">
                繁殖籠狀態:
              </label>
              <select
                name="on_shelf"
                id="on_shelf"
                className="form-select "
                onChange={handleChange}
                value={formData?.on_shelf}
              >
                <option value="在架上">在架上</option>
                <option value="已關閉">已關閉</option>
              </select>
            </div>
          </div>

          <div className="mt-5 d-flex justify-content-end">
            <button className="btn btn-warning">修改繁殖籠資料</button>
            <button className="btn btn-danger ms-2 border-2">
              <Link
                to={`/strains/${strainId}`}
                style={{ textDecoration: "none", color: "white" }}
              >
                取消，返回品系資訊
              </Link>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
