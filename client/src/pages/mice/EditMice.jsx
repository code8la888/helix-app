import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { fetchData } from "../../utils/fetchData";
import { useCheckPermission } from "../../hooks/useCheckPermission";
import { useFormValidation } from "../../hooks/useFormValidation";
import { sendFormData } from "../../utils/sendFormData";

export default function EditMice() {
  const { strainId, mouseId } = useParams();
  const navigate = useNavigate();
  const [mouseData, setMouseData] = useState({});
  const [genes, setGenes] = useState([]);
  const { validated, validateForm } = useFormValidation();
  // const [isAuthorized, setIsAuthorized] = useState(null);
  const isAuthorized = useCheckPermission(strainId);

  // const fetchStrainData = async () => {
  //   try {
  //     const res = await axios.get(
  //       `/api/strains/${strainId}/mice/${mouseId}/edit`
  //     );

  //     mouse = res.data.mouse;
  //     setMouseData(mouse);
  //     strain = res.data.strain;
  //   } catch (error) {
  //     console.error("Error fetching strain data:", error);
  //   }
  // };

  useEffect(() => {
    // async function checkPermission() {
    //   try {
    //     await axios.get(`/api/strains/${strainId}/check-permission`);
    //     setIsAuthorized(true);
    //   } catch (error) {
    //     setIsAuthorized(false);
    //     navigate("/error", {
    //       state: {
    //         error: error.response?.data?.message || "您沒有權限訪問此頁面。",
    //         stack: error.response?.data?.stack || "XXX",
    //       },
    //     });
    //   }
    // }
    // checkPermission();
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

    // fetchStrainData();
  }, [strainId, navigate]);

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
    // try {
    //   const res = await axios.put(
    //     `/api/strains/${strainId}/mice/${mouseId}`,
    //     updatedFormData,
    //     {
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //     }
    //   );

    //   if (res.data.redirect) {
    //     navigate(res.data.redirect);
    //   } else {
    //     console.log("資料送出成功:", res.data);
    //   }
    // } catch (error) {
    //   let errorMessage = "提交失敗，請稍後再試。";
    //   let errorStack = "";
    //   console.log(error.response);
    //   if (error.response) {
    //     errorMessage = error.response.data.message || "伺服器錯誤。";
    //     errorStack = error.response.data.stack || "XXX";
    //   } else if (error.request) {
    //     errorMessage = "伺服器未響應，請稍後再試。";
    //   } else {
    //     errorMessage = error.message;
    //     errorStack = error.stack;
    //   }
    //   navigate("/error", { state: { error: errorMessage, stack: errorStack } });
    // }
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
              {genes?.map((gene) => (
                <th key={gene} scope="col" className="col-1">
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
              <td>
                <input
                  className="form-control"
                  type="number"
                  name="no"
                  required
                  value={mouseData.no}
                  onChange={handleChange}
                />
              </td>
              <td>
                <input
                  className="form-control"
                  type="text"
                  name="parents.father"
                  required
                  value={mouseData?.parents?.father}
                  onChange={handleChange}
                />
              </td>
              <td>
                <input
                  className="form-control"
                  type="text"
                  name="parents.mother"
                  required
                  value={mouseData?.parents?.mother}
                  onChange={handleChange}
                />
              </td>
              <td>
                <input
                  className="form-control"
                  type="number"
                  name="litter"
                  required
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
                <input
                  className="form-control"
                  type="date"
                  name="birth_date"
                  required
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
                <input
                  className="form-control"
                  type="date"
                  name="sampling_date"
                  required
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
                <input
                  className="form-control"
                  type="text"
                  name="toeNumber"
                  required
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
                <input
                  className="form-control"
                  type="text"
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
