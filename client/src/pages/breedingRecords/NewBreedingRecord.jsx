import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "../../hooks/useForm";
import { useFormValidation } from "../../hooks/useFormValidation";
import { sendFormData } from "../../utils/sendFormData";
import InputField from "../../components/InputField";

export default function NewBreedingRecord() {
  const { id } = useParams();
  const navigate = useNavigate();
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

  console.log(formData);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm(event)) return;

    const updatedFormData = {
      breedingRecord: {
        ...formData,
      },
    };
    console.log(updatedFormData);

    sendFormData(
      `/api/strains/${id}/breedingRecord`,
      updatedFormData,
      navigate
    );
  };

  return (
    <div>
      <div className="row">
        <h1 className="text-center">新增繁殖籠表:</h1>
        <div className="col-md-6 offset-md-3">
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
            />
            <InputField
              label="母"
              id="mother"
              name="parents.mother"
              value={formData.parents.mother}
              onChange={handleChange}
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
                繁殖籠狀態:
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
              <div className="valid-feedback">looks good!</div>
            </div>
            <div className="mb-3">
              <button className="btn btn-success">新增繁殖籠</button>
            </div>
          </form>
        </div>
      </div>
      <Link to={`/strains/${id}`}>返回小鼠品系資訊</Link>
    </div>
  );
}
