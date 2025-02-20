import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { fetchData } from "../../utils/fetchData";
import { useCheckPermission } from "../../hooks/useCheckPermission";
import { useFormValidation } from "../../hooks/useFormValidation";
import { useForm } from "../../hooks/useForm";
import InputField from "../../components/InputField";
import Loader from "../../components/Loader";
import { useStrain } from "../../hooks/useStrain";
import { useUpdateSamplingRecord } from "../../hooks/useSamplingRecordMutation";

export default function EditMice() {
  const { strainId, mouseId } = useParams();
  const { data, isLoading, error } = useStrain(strainId);
  const [genes, setGenes] = useState([]); // Label標題
  const { validated, validateForm } = useFormValidation();
  const [formData, handleChange, setFormData] = useForm({
    no: "",
    strain: strainId,
    toeNumber: "",
    birth_date: "",
    gender: "M",
    parents: {
      father: "",
      mother: "",
    },
    sampling_date: "",
    sampling_results: [],
    litter: "",
    on_shelf: "在架上",
    note: "",
  });
  const mouse = data?.mice.filter((mouse) => mouse._id === mouseId); // 採樣記錄

  if (data && !isLoading && formData.no === "") {
    setFormData(...mouse);
    setGenes(data.strain.genes);
  }

  const updateSamplingRecordMutation = useUpdateSamplingRecord();
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm(event)) return;

    const { _id, __v, ...rest } = formData;

    const updatedFormData = {
      strainId,
      mouseId,
      mouse: {
        ...rest,
      },
    };
    console.log(updatedFormData);
    await updateSamplingRecordMutation.mutateAsync(updatedFormData);
  };

  return (
    <div className="row">
      <h1 className="text-center">編輯採樣記錄</h1>
      <div className="col-md-8 offset-md-2 shadow-lg mb-3 p-4 rounded-3">
        <form
          onSubmit={handleSubmit}
          noValidate
          className={`validated-form ${validated ? "was-validated" : ""}`}
        >
          <div className="row">
            <InputField
              label="編號"
              name="no"
              value={formData.no}
              onChange={handleChange}
              className="col"
            />

            <InputField
              label="父"
              name="parents.father"
              value={formData?.parents?.father}
              onChange={handleChange}
              className="col"
            />

            <InputField
              label="母"
              name="parents.mother"
              value={formData?.parents?.mother}
              onChange={handleChange}
              className="col"
            />
          </div>
          <div className="row">
            <InputField
              label="胎次"
              name="litter"
              value={formData.litter}
              onChange={handleChange}
              className="col"
            />

            <div className="col">
              <label htmlFor="gender" className="fw-bold mb-2">
                性別
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

            <InputField
              label="出生日期"
              type="date"
              name="birth_date"
              value={
                formData?.birth_date
                  ? new Date(formData.birth_date).toISOString().split("T")[0]
                  : ""
              }
              onChange={handleChange}
              className="col"
            />

            <InputField
              label="採樣日期"
              type="date"
              name="sampling_date"
              value={
                formData.sampling_date
                  ? new Date(formData.sampling_date).toISOString().split("T")[0]
                  : ""
              }
              onChange={handleChange}
              className="col"
            />

            <InputField
              label="趾號"
              name="toeNumber"
              value={formData.toeNumber}
              onChange={handleChange}
              className="col"
            />
          </div>

          <div className="row">
            {genes?.map((gene, index) => (
              <div className="col mb-2" key={gene}>
                <label
                  htmlFor={`sampling_results_${index}`}
                  className="fw-bold mb-2"
                >
                  {gene}
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
          <div className="row">
            <div className="mb-2 col">
              <label htmlFor="on_shelf" className="fw-bold mb-2">
                狀態
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
              label="備註"
              required={false}
              name="note"
              value={formData.note}
              onChange={handleChange}
              className="col"
            />
          </div>
          <div className="mt-5 d-flex justify-content-end">
            <button className=" warning">修改小鼠資料</button>
            <button className=" danger ms-2">
              <Link to={`/strains/${strainId}`} className="link">
                返回小鼠品系資訊
              </Link>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
