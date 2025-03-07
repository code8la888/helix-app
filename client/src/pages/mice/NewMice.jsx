import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useForm } from "../../hooks/useForm";
import InputField from "../../components/InputField";
import { useFormValidation } from "../../hooks/useFormValidation";
import { useStrain } from "../../hooks/useStrain";
import { useCreateSamplingRecord } from "../../hooks/useSamplingRecordMutation";
import { useCheckEditPermission } from "../../hooks/useCheckEditPermission";
import { useHandleError } from "../../hooks/useHandleError";
import Loader from "../../components/Loader";

export default function NewMice() {
  const { id } = useParams();
  console.log(id);
  const { data, isLoading, error } = useStrain(id);
  const {
    data: hasEditPermission,
    isLoading: editPermissionLoading,
    error: editPermissionError,
  } = useCheckEditPermission(id);
  useHandleError(error);
  useHandleError(editPermissionError, hasEditPermission === false);

  const [samplingGeneList, setSamplingGeneList] = useState([]);
  const geneList = data?.strain?.genes || [];
  useEffect(() => {
    if (geneList) {
      setSamplingGeneList(geneList);
    }
  }, []);

  console.log(geneList);

  const [formData, handleChange, setFormData] = useForm({
    no: "",
    strain: id,
    toeNumber: "",
    birth_date: "",
    gender: "M",
    parents: {
      father: "",
      mother: "",
    },
    sampling_date: "",
    sampling_results: new Array(geneList.length).fill("檢測中"),
    litter: "",
    on_shelf: "在架上",
    exit_date: "",
    note: "",
  });
  const { validated, validateForm } = useFormValidation();
  const createSamplingRecordMutation = useCreateSamplingRecord();
  console.log(formData);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm(event)) return;
    const updatedFormData = {
      strainId: id,
      mouse: {
        ...formData,
      },
    };
    console.log(updatedFormData);

    await createSamplingRecordMutation.mutateAsync(updatedFormData);
  };
  if (isLoading || editPermissionLoading) {
    return <Loader />;
  }

  return (
    <div className="row">
      <h1 className="text-center">新增小鼠資料</h1>
      <div className="col-10 offset-1 shadow-lg mb-3 p-4 rounded-3">
        <form
          onSubmit={handleSubmit}
          noValidate
          className={`validated-form ${validated ? "was-validated" : ""}`}
        >
          <div className="row">
            <InputField
              label="編號(必填)"
              name="no"
              value={formData.no}
              onChange={handleChange}
              className="col-12 col-md-9"
              placeholder="請輸入 M 或 F 開頭，後面接數字的編號，例如： M123 或 F456"
            />

            <div className="col-12 col-md-3">
              <label htmlFor="gender" className="fw-bold">
                性別(必填)
              </label>
              <select
                className="form-control"
                name="gender"
                id="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="M">M</option>
                <option value="F">F</option>
              </select>
            </div>
          </div>
          <div className="row">
            <InputField
              label="父(必填)"
              name="parents.father"
              value={formData?.parents?.father}
              onChange={handleChange}
              className="col-12 col-md-6"
              placeholder="請輸入父親的編號"
            />

            <InputField
              label="母(必填)"
              name="parents.mother"
              value={formData?.parents?.mother}
              onChange={handleChange}
              className="col-12 col-md-6"
              placeholder="請輸入母親的編號"
            />
          </div>
          <div className="row">
            <InputField
              label="胎次(必填)"
              name="litter"
              value={formData.litter}
              onChange={handleChange}
              className="col-12 col-md-6"
            />

            <InputField
              label="出生日期(必填)"
              type="date"
              name="birth_date"
              value={
                formData?.birth_date
                  ? new Date(formData.birth_date).toISOString().split("T")[0]
                  : ""
              }
              onChange={handleChange}
              className="col-12 col-md-6"
            />
          </div>
          {samplingGeneList.length > 0 ? (
            <div className="row">
              <InputField
                label="趾號(必填)"
                name="toeNumber"
                value={formData.toeNumber}
                onChange={handleChange}
                className="col-12 col-md-6"
              />
              <InputField
                label="採樣日期(必填)"
                type="date"
                name="sampling_date"
                value={
                  formData.sampling_date
                    ? new Date(formData.sampling_date)
                        .toISOString()
                        .split("T")[0]
                    : ""
                }
                onChange={handleChange}
                className="col-12 col-md-6"
              />
            </div>
          ) : (
            ""
          )}
          {samplingGeneList.length > 0 ? (
            <div className="row">
              {samplingGeneList?.map((gene, index) => (
                <div className="col-12 col-md-6" key={gene}>
                  <label
                    htmlFor={`sampling_results_${index}`}
                    className="fw-bold"
                  >
                    {gene}採樣結果(必填)
                  </label>
                  <select
                    className="form-control"
                    name={`sampling_results_${index}`}
                    id={`sampling_results_${index}`}
                    value={formData.sampling_results[index] || "檢測中"}
                    onChange={(event) => {
                      {
                        const newResults = [...formData.sampling_results];
                        newResults[index] = event.target.value || "檢測中";
                        setFormData({
                          ...formData,
                          sampling_results: newResults,
                        });
                      }
                    }}
                  >
                    <option value="WT">WT</option>
                    <option value="HT">HT</option>
                    <option value="KO">KO</option>
                    <option value="檢測中">檢測中</option>
                  </select>
                </div>
              ))}
            </div>
          ) : (
            ""
          )}
          <div className="row">
            <div className="col-12 col-md-6">
              <label htmlFor="on_shelf" className="fw-bold">
                狀態(必填)
              </label>
              <select
                label="狀態"
                className="form-control"
                name="on_shelf"
                id="on_shelf"
                value={formData.on_shelf}
                onChange={handleChange}
              >
                <option value="在架上">在架上</option>
                <option value="已移出">已移出</option>
                <option value="已犧牲">已犧牲</option>
                <option value="自然死亡">自然死亡</option>
              </select>
            </div>
            <InputField
              label="移出日期"
              type="date"
              required={false}
              name="exit_date"
              value={formData.exit_date}
              onChange={handleChange}
              className="col-12 col-md-6"
            />
          </div>
          <div className="row">
            <InputField
              label="備註"
              required={false}
              name="note"
              value={formData.note}
              onChange={handleChange}
              className="col-12"
            />
          </div>
          <div className="mt-5 mb-3 d-flex justify-content-end">
            <button className=" warning">提交表單</button>
          </div>
          <div className="d-flex justify-content-end">
            <button className="danger">
              <Link to={`/strains/${id}`} className="link">
                取消，返回實驗計畫
              </Link>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
