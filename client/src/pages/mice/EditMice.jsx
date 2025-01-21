import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { fetchData } from "../../utils/fetchData";
import { useCheckPermission } from "../../hooks/useCheckPermission";
import { useFormValidation } from "../../hooks/useFormValidation";
import { sendFormData } from "../../utils/sendFormData";
import TableHeaderItem from "../../components/TableHeaderItem";
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
    <>
      <h1 className="text-center">修改小鼠資料</h1>
      <form
        onSubmit={handleSubmit}
        noValidate
        className={`validated-form ${validated ? "was-validated" : ""}`}
      >
        <table className="table table-striped">
          <thead>
            <tr>
              <TableHeaderItem title="編號" />
              <TableHeaderItem title="父" />
              <TableHeaderItem title="母" />
              <TableHeaderItem title="胎次" />
              <TableHeaderItem title="性別" />
              <TableHeaderItem title="出生日期" />
              <TableHeaderItem title="採樣日期" />
              <TableHeaderItem title="趾號" />
              {genes?.map((gene) => (
                <TableHeaderItem key={gene} title={gene} />
              ))}
              <TableHeaderItem title="狀態" />
              <TableHeaderItem title="備註" />
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <InputField
                  type="number"
                  name="no"
                  value={mouseData.no}
                  onChange={handleChange}
                />
              </td>
              <td>
                <InputField
                  name="parents.father"
                  value={mouseData?.parents?.father}
                  onChange={handleChange}
                />
              </td>
              <td>
                <InputField
                  name="parents.mother"
                  value={mouseData?.parents?.mother}
                  onChange={handleChange}
                />
              </td>
              <td>
                <InputField
                  name="litter"
                  value={mouseData.litter}
                  onChange={handleChange}
                />
              </td>
              <td>
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
              </td>
              <td>
                <InputField
                  type="date"
                  name="birth_date"
                  value={
                    mouseData?.birth_date
                      ? new Date(mouseData.birth_date)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                  onChange={handleChange}
                />
              </td>
              <td>
                <InputField
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
                />
              </td>
              <td>
                <InputField
                  name="toeNumber"
                  value={mouseData.toeNumber}
                  onChange={handleChange}
                />
              </td>
              {genes?.map((_, index) => (
                <td>
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
                </td>
              ))}
              <td>
                <select
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
              </td>
              <td>
                <InputField
                  required={false}
                  name="note"
                  value={mouseData.note}
                  onChange={handleChange}
                />
              </td>
            </tr>
          </tbody>
        </table>
        <button className="btn btn-success">修改小鼠資料</button>
      </form>
      <Link to={`/strains/${strainId}`}>返回小鼠品系資訊</Link>
    </>
  );
}
