import { Link, useParams } from "react-router-dom";
import { useForm } from "../../hooks/useForm";
import { useFormValidation } from "../../hooks/useFormValidation";
import InputField from "../../components/InputField";
import { useCreateBreedingRecord } from "../../hooks/useBreedingRecordMutation";
import Loader from "../../components/Loader";
import { useCheckEditPermission } from "../../hooks/useCheckEditPermission";
import { useHandleError } from "../../hooks/useHandleError";

export default function NewBreedingRecord() {
  const { id } = useParams();
  console.log(id);
  const {
    data: hasEditPermission,
    isLoading: editPermissionLoading,
    error: editPermissionError,
  } = useCheckEditPermission(id);
  useHandleError(editPermissionError, hasEditPermission === false);

  const { validated, validateForm } = useFormValidation();
  const [formData, handleChange] = useForm({
    strain: id,
    cage_no: "",
    parents: {
      father: "",
      mother: "",
    },
    pairing_date: "",
    on_shelf: "在架上",
  });

  // console.log(formData);
  const createBreedingRecordMutation = useCreateBreedingRecord();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm(event)) return;

    const updatedFormData = {
      strainId: id,
      breedingRecord: {
        ...formData,
      },
    };
    console.log(updatedFormData);

    await createBreedingRecordMutation.mutateAsync(updatedFormData);
  };

  if (editPermissionLoading) {
    return <Loader />;
  }

  return (
    <div className="row">
      <h1 className="text-center">新增繁殖籠表:</h1>
      <div className="col-10 offset-1 shadow-lg mb-3 p-4 rounded-3">
        <form
          onSubmit={handleSubmit}
          noValidate
          className={`validated-form ${validated ? "was-validated" : ""}`}
        >
          <InputField
            label="繁殖籠編號"
            id="cage_no"
            name="cage_no"
            value={formData.cage_no}
            onChange={handleChange}
          />
          <InputField
            label="父"
            id="father"
            name="parents.father"
            value={formData.parents.father}
            onChange={handleChange}
            placeholder="請輸入父親的編號"
          />
          <InputField
            label="母"
            id="mother"
            name="parents.mother"
            value={formData.parents.mother}
            onChange={handleChange}
            placeholder="請輸入母親的編號"
          />
          <InputField
            label="配種日期"
            type="date"
            id="pairing_date"
            name="pairing_date"
            value={formData.pairing_date}
            onChange={handleChange}
          />
          <div className="mb-3">
            <label className="form-label" htmlFor="on_shelf">
              繁殖籠狀態
            </label>
            <select
              name="on_shelf"
              id="on_shelf"
              value={formData.on_shelf}
              onChange={handleChange}
              className="form-select"
            >
              <option value="在架上">在架上</option>
              <option value="已關閉">已關閉</option>
            </select>
          </div>
          <div className="mt-5 d-flex justify-content-end">
            <button className=" warning">新增繁殖籠</button>
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
