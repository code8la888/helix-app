import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { fetchData } from "../../utils/fetchData";
import { useCheckPermission } from "../../hooks/useCheckPermission";
import { useFormValidation } from "../../hooks/useFormValidation";
import { sendFormData } from "../../utils/sendFormData";
import TableHeaderItem from "../../components/TableHeaderItem";
import InputField from "../../components/InputField";
import { useForm } from "../../hooks/useForm";

export default function EditMice() {
  const { strainId, mouseId } = useParams();
  const navigate = useNavigate();
  const isAuthorized = useCheckPermission(strainId);
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
  const [genes, setGenes] = useState([]);
  const { validated, validateForm } = useFormValidation();

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetchData(
          `/api/strains/${strainId}/mice/${mouseId}/edit`
        );
        console.log(res);
        setFormData((prev) => ({ ...prev, ...res.mouse }));
        setGenes(res.strain.genes);
      } catch (error) {
        console.error("Error fetching strains data:", error);
      }
    };

    if (isAuthorized) {
      loadData();
    }
  }, []);

  console.log(formData);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm(event)) return;

    const { _id, __v, ...rest } = formData;

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
                  value={formData?.no}
                  onChange={handleChange}
                />
              </td>
              <td>
                <InputField
                  name="parents.father"
                  value={formData?.parents?.father}
                  onChange={handleChange}
                />
              </td>
              <td>
                <InputField
                  name="parents.mother"
                  value={formData?.parents?.mother}
                  onChange={handleChange}
                />
              </td>
              <td>
                <InputField
                  name="litter"
                  value={formData?.litter}
                  onChange={handleChange}
                />
              </td>
              <td>
                <select
                  className="form-control"
                  name="gender"
                  id="gender"
                  value={formData?.gender}
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
                    formData?.birth_date
                      ? new Date(formData.birth_date)
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
                    formData?.sampling_date
                      ? new Date(formData.sampling_date)
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
                  value={formData?.toeNumber}
                  onChange={handleChange}
                />
              </td>
              {genes?.map((_, index) => (
                <td key={index}>
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
                </td>
              ))}
              <td>
                <select
                  className="form-control"
                  name="on_shelf"
                  id="on_shelf"
                  value={formData?.on_shelf}
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
                  value={formData?.note}
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
