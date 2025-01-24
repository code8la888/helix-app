import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { fetchData } from "../../utils/fetchData";
import { useCheckPermission } from "../../hooks/useCheckPermission";
import { useFormValidation } from "../../hooks/useFormValidation";
import { sendFormData } from "../../utils/sendFormData";
import InputField from "../../components/InputField";

export default function EditMice() {
  const { strainId, mouseId } = useParams();
  const navigate = useNavigate();
  const [mouseData, setMouseData] = useState({});
  const [genes, setGenes] = useState([]);
  const { validated, validateForm } = useFormValidation();

  const isAuthorized = useCheckPermission(strainId);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetchData(
          `/api/strains/${strainId}/mice/${mouseId}/edit`
        );
        console.log(res);
        setMouseData(res.mouse);
        setGenes(res.strain.genes);
      } catch (error) {
        console.error("Error fetching strains data:", error);
      }
    };

    if (isAuthorized) {
      loadData();
    }
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name.includes(".")) {
      const [parentKey, childKey] = name.split(".");
      setMouseData((prev) => ({
        ...prev,
        [parentKey]: {
          ...prev[parentKey],
          [childKey]: value,
        },
      }));
    } else {
      setMouseData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  console.log(mouseData);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm(event)) return;

    const { _id, __v, ...rest } = mouseData;

    const updatedFormData = {
      mouse: {
        ...rest,
      },
    };
    console.log(updatedFormData);

    sendFormData(
      `/api/strains/${strainId}/mice/${mouseId}`,
      updatedFormData,
      navigate,
      "PUT"
    );
  };
  if (isAuthorized === null) {
    return <div>正在檢查權限...</div>;
  }
  if (!isAuthorized) {
    return null;
  }
  return (
    <div className="row">
      <h1 className="text-center">修改小鼠資料</h1>
      <div className="col-md-8 offset-md-2 shadow-lg mb-3 p-4 rounded-3">
        <form
          onSubmit={handleSubmit}
          noValidate
          className={`validated-form ${validated ? "was-validated" : ""}`}
        >
          <div className="row">
            <InputField
              label="編號"
              type="number"
              name="no"
              value={mouseData.no}
              onChange={handleChange}
              className="col"
            />

            <InputField
              label="父"
              name="parents.father"
              value={mouseData?.parents?.father}
              onChange={handleChange}
              className="col"
            />

            <InputField
              label="母"
              name="parents.mother"
              value={mouseData?.parents?.mother}
              onChange={handleChange}
              className="col"
            />
          </div>
          <div className="row">
            <InputField
              label="胎次"
              name="litter"
              value={mouseData.litter}
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
                value={mouseData.gender}
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
                mouseData?.birth_date
                  ? new Date(mouseData.birth_date).toISOString().split("T")[0]
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
                mouseData.sampling_date
                  ? new Date(mouseData.sampling_date)
                      .toISOString()
                      .split("T")[0]
                  : ""
              }
              onChange={handleChange}
              className="col"
            />

            <InputField
              label="趾號"
              name="toeNumber"
              value={mouseData.toeNumber}
              onChange={handleChange}
              className="col"
            />
          </div>

          <div className="row">
            {" "}
            {genes?.map((gene, index) => (
              <div className="col mb-2">
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
                  value={mouseData.sampling_results[index] || "檢測中"}
                  onChange={(event) => {
                    {
                      const newResults = [...mouseData.sampling_results];
                      newResults[index] = event.target.value || "檢測中";
                      setMouseData({
                        ...mouseData,
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
                value={mouseData.on_shelf}
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
              value={mouseData.note}
              onChange={handleChange}
              className="col"
            />
          </div>
          <div className="mt-5 d-flex justify-content-end">
            <button className="btn btn-warning">修改小鼠資料</button>
            <button className="btn btn-danger ms-2">
              <Link
                to={`/strains/${strainId}`}
                style={{ textDecoration: "none", color: "white" }}
              >
                返回小鼠品系資訊
              </Link>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
