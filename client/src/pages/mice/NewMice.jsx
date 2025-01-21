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
    <>
      <h1>新增小鼠資料</h1>
      <div className="row mb-3">
        <div className="col-12">
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
                  {samplingGeneList?.map((gene) => (
                    <TableHeaderItem key={gene} title={gene} />
                  ))}
                  <TableHeaderItem title="狀態" />
                  <TableHeaderItem title="備註" />
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td className="col-1">
                    <InputField
                      type="number"
                      name="no"
                      onChange={handleChange}
                      value={formData.no}
                    />
                  </td>
                  <td className="col-1">
                    <InputField
                      name="parents.father"
                      onChange={handleChange}
                      value={formData.parents.father}
                    />
                  </td>
                  <td className="col-1">
                    <InputField
                      name="parents.mother"
                      onChange={handleChange}
                      value={formData.parents.mother}
                    />
                  </td>
                  <td className="col-1">
                    <InputField
                      type="number"
                      name="litter"
                      onChange={handleChange}
                      value={formData.litter}
                    />
                  </td>
                  <td className="col-1">
                    <select
                      className="form-control"
                      name="gender"
                      onChange={handleChange}
                      value={formData.gender}
                    >
                      <option value="M">M</option>
                      <option value="F">F</option>
                    </select>
                  </td>
                  <td className="col-1">
                    <InputField
                      type="date"
                      id="birth_date"
                      name="birth_date"
                      onChange={handleChange}
                      value={formData.birth_date}
                    />
                  </td>
                  <td className="col-1">
                    <InputField
                      type="date"
                      id="sampling_date"
                      name="sampling_date"
                      onChange={handleChange}
                      value={formData.sampling_date}
                    />
                  </td>
                  <td className="col-1">
                    <InputField
                      name="toeNumber"
                      onChange={handleChange}
                      value={formData.toeNumber}
                    />
                  </td>
                  {samplingGeneList?.length > 0 ? (
                    samplingGeneList.map((gene, index) => (
                      <td className="col-1" key={gene}>
                        <select
                          className="form-control"
                          name="sampling_results"
                          id={`sampling_results_${index}`}
                          onChange={(event) => {
                            const newResults = [...formData.sampling_results];
                            newResults[index] = event.target.value || "檢測中";
                            setFormData({
                              ...formData,
                              sampling_results: newResults,
                            });
                          }}
                          value={formData.sampling_results[index] || "檢測中"}
                        >
                          <option value="WT">WT</option>
                          <option value="HT">HT</option>
                          <option value="KO">KO</option>
                          <option value="檢測中">檢測中</option>
                        </select>
                      </td>
                    ))
                  ) : (
                    <td value="檢測中">檢測中</td>
                  )}
                  <td className="col-1">
                    <select
                      className="form-control"
                      name="on_shelf"
                      onChange={handleChange}
                      value={formData.on_shelf}
                    >
                      <option value="在架上">在架上</option>
                      <option value="已移出">已移出</option>
                      <option value="已犧牲">已犧牲</option>
                      <option value="自然死亡">自然死亡</option>
                    </select>
                  </td>
                  <td className="col-1">
                    <InputField
                      name="note"
                      onChange={handleChange}
                      value={formData.note}
                      required={false}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <button className="btn btn-success">新增繁殖資料</button>
          </form>
        </div>
      </div>
      <Link to={`/strains/${id}`}>返回小鼠品系資訊</Link>
    </>
  );
}
