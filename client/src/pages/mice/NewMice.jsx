import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function NewMice() {
  const { id } = useParams();
  const [mouseData, setMouseData] = useState({
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
    sampling_results: [],
    litter: "",
    on_shelf: "在架上",
    note: "",
  });

  const [samplingResults, setSamplingResults] = useState([]);
  const [validated, setValidated] = useState(false);
  const [samplingGeneList, setSamplingGeneList] = useState([]);

  useEffect(() => {
    async function FetchData() {
      try {
        const res = await axios.get(`/api/strains/${id}`);
        setSamplingGeneList(res.data.strain.genes);

        setMouseData((prevData) => ({
          ...prevData,
          sampling_results: samplingGeneList.map(
            (_, index) => prevData.sampling_results[index] || "檢測中"
          ),
        }));
      } catch (error) {
        console.error("Error fetching strains data:", error);
      }
    }
    FetchData();
  }, [samplingGeneList]);

  const navigate = useNavigate();
  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "father" || name === "mother") {
      setMouseData((prev) => ({
        ...prev,
        parents: {
          ...prev.parents,
          [name]: value,
        },
      }));
    } else {
      setMouseData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    console.log(mouseData);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    setValidated(true);

    const updatedFormData = {
      mouse: {
        ...mouseData,
      },
    };
    console.log(updatedFormData);

    try {
      const res = await axios.post(
        `/api/strains/${id}/mice/new`,
        updatedFormData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.redirect) {
        navigate(res.data.redirect);
      } else {
        console.log("資料送出成功:", res.data);
      }
    } catch (error) {
      if (error.response) {
        console.error("伺服器返回錯誤:", error.response.data);
        console.error("HTTP 狀態碼:", error.response.status);
      } else if (error.request) {
        console.error("沒有收到伺服器回應:", error.request);
      } else {
        console.error("發送失敗:", error.message);
      }
    }
  };

  return (
    <>
      <h1>新增小鼠資料</h1>
      <div className="row">
        <div className="col-12">
          <form
            onSubmit={handleSubmit}
            noValidate
            className={`validated-form ${validated ? "was-validated" : ""}`}
          >
            <table className="table table-striped">
              <thead>
                <tr>
                  <th scope="col" className="col-1">
                    No
                  </th>
                  <th scope="col" className="col-1">
                    父
                  </th>
                  <th scope="col" className="col-1">
                    母
                  </th>
                  <th scope="col" className="col-1">
                    胎次
                  </th>
                  <th scope="col" className="col-1">
                    性別
                  </th>
                  <th scope="col" className="col-1">
                    出生日期
                  </th>
                  <th scope="col" className="col-1">
                    採樣日期
                  </th>
                  <th scope="col" className="col-1">
                    趾號
                  </th>
                  {samplingGeneList?.map((gene) => (
                    <th scope="col" className="col-1" key={gene}>
                      {gene}
                    </th>
                  ))}
                  <th scope="col" className="col-1">
                    狀態
                  </th>
                  <th scope="col" className="col-1">
                    備註
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td className="col-1">
                    <input
                      className="form-control"
                      type="number"
                      name="no"
                      value={mouseData.no}
                      onChange={handleChange}
                      required
                    />
                  </td>
                  <td className="col-1">
                    <input
                      className="form-control"
                      type="text"
                      name="father"
                      onChange={handleChange}
                      value={mouseData.parents.father}
                      required
                    />
                  </td>
                  <td className="col-1">
                    <input
                      className="form-control"
                      type="text"
                      name="mother"
                      onChange={handleChange}
                      value={mouseData.parents.mother}
                      required
                    />
                  </td>
                  <td className="col-1">
                    <input
                      className="form-control"
                      type="number"
                      name="litter"
                      onChange={handleChange}
                      value={mouseData.litter}
                      required
                    />
                  </td>
                  <td className="col-1">
                    <select
                      className="form-control"
                      name="gender"
                      onChange={handleChange}
                      value={mouseData.gender}
                    >
                      <option value="M">M</option>
                      <option value="F">F</option>
                    </select>
                  </td>
                  <td className="col-1">
                    <input
                      className="form-control"
                      type="date"
                      name="birth_date"
                      onChange={handleChange}
                      value={mouseData.birth_date}
                      required
                    />
                  </td>
                  <td className="col-1">
                    <input
                      className="form-control"
                      type="date"
                      name="sampling_date"
                      onChange={handleChange}
                      value={mouseData.sampling_date}
                      required
                    />
                  </td>
                  <td className="col-1">
                    <input
                      className="form-control"
                      type="text"
                      name="toeNumber"
                      onChange={handleChange}
                      value={mouseData.toeNumber}
                      required
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
                            const newResults = [
                              ...(mouseData.sampling_results || []),
                            ];
                            newResults[index] = event.target.value;
                            setMouseData({
                              ...mouseData,
                              sampling_results: newResults,
                            });
                          }}
                          value={mouseData.sampling_results[index]}
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
                      value={mouseData.on_shelf}
                    >
                      <option value="在架上">在架上</option>
                      <option value="已移出">已移出</option>
                      <option value="已犧牲">已犧牲</option>
                      <option value="自然死亡">自然死亡</option>
                    </select>
                  </td>
                  <td className="col-1">
                    <input
                      className="form-control"
                      type="text"
                      name="note"
                      onChange={handleChange}
                      value={mouseData.note}
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
