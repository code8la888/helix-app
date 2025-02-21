import { useParams, Link } from "react-router-dom";
import { useFormValidation } from "../../hooks/useFormValidation";
import { useForm } from "../../hooks/useForm";
import InputField from "../../components/InputField";
import { useStrain } from "../../hooks/useStrain";
import { useEditBreedingRecord } from "../../hooks/useBreedingRecordMutation";
import { useCheckEditPermission } from "../../hooks/useCheckEditPermission";
import { useHandleError } from "../../hooks/useHandleError";
import Loader from "../../components/Loader";
import { useEffect } from "react";

export default function EditBreedingRecord() {
  const { strainId, breedingRecordId } = useParams();
  console.log(strainId);
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
  const { data, isLoading, error } = useStrain(strainId);
  const {
    data: hasEditPermission,
    isLoading: editPermissionLoading,
    error: editPermissionError,
  } = useCheckEditPermission(strainId);
  useHandleError(error);
  useHandleError(editPermissionError, hasEditPermission === false);

  const breedingRecord = data.breedingRecords.filter(
    (record) => record._id === breedingRecordId
  );

  useEffect(() => {
    if (data) {
      setFormData(...breedingRecord);
    }
  }, [data]);

  const editBreedingRecordMutation = useEditBreedingRecord();
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm(event)) return;

    const { _id, __v, ...rest } = formData;

    const updatedFormData = {
      strainId,
      breedingRecordId,
      breedingRecord: {
        ...rest,
      },
    };
    await editBreedingRecordMutation.mutateAsync(updatedFormData);
  };

  if (isLoading || editPermissionLoading) {
    return <Loader />;
  }

  return (
    <div className="row">
      <h1 className="text-center">編輯繁殖籠表</h1>
      <div className="col-10 offset-1">
        <form
          onSubmit={handleSubmit}
          noValidate
          className={`validated-form ${
            validated ? "was-validated" : ""
          } shadow-lg mb-3 p-4 rounded-3`}
        >
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
            <label className="form-label" htmlFor="on_shelf">
              繁殖籠狀態
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

          <div className="mt-5 d-flex justify-content-end">
            <button className="warning">修改繁殖籠資料</button>
            <button className="danger ms-2 border-2">
              <Link to={`/strains/${strainId}`} className="link">
                取消，返回品系資訊
              </Link>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
