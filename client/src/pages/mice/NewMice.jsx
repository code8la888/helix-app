import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useForm } from "../../hooks/useForm";
import { fetchData } from "../../utils/fetchData";
import { useCheckPermission } from "../../hooks/useCheckPermission";
import TableHeaderItem from "../../components/TableHeaderItem";
import InputField from "../../components/InputField";
import { useFormValidation } from "../../hooks/useFormValidation";
import { sendFormData } from "../../utils/sendFormData";

export default function NewMice() {
  const { id } = useParams();
  const isAuthorized = useCheckPermission(id);
  const [samplingGeneList, setSamplingGeneList] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetchData(`/api/strains/${id}`);
        setSamplingGeneList(res.strain.genes);
        setFormData((prev) => ({
          ...prev,
          sampling_results: new Array(samplingGeneList.length).fill("檢測中"),
        }));
      } catch (error) {
        console.error("Error fetching strains data:", error);
      }
    };

    if (isAuthorized) {
      loadData();
    }
  }, [id, samplingGeneList]);

  const [formData, handleChange, setFormData] = useForm({
    no: "",
    strain: `${id}`,
    toeNumber: "",
    birth_date: "",
    gender: "M",
    parents: {
      father: "",
      mother: "",
    },
    sampling_date: "",
    sampling_results: new Array(samplingGeneList.length).fill("檢測中"),
    litter: "",
    on_shelf: "在架上",
    note: "",
  });

  const { validated, validateForm } = useFormValidation();

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm(event)) return;

    const updatedFormData = {
      mouse: {
        ...formData,
      },
    };

    sendFormData(`/api/strains/${id}/mice/new`, updatedFormData, navigate);
  };

  return (
    <div className="row">
      <h1 className="text-center">新增小鼠資料</h1>
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
            {samplingGeneList?.map((gene, index) => (
              <div className="col mb-2" key={gene}>
                <label
                  htmlFor={`sampling_results_${index}`}
                  className="fw-bold mb-2"
                >
                  {gene}採樣結果
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
            <button className="btn btn-warning">新增小鼠資料</button>
            <button className="btn btn-danger ms-2 border-2">
              <Link
                to={`/strains/${id}`}
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
