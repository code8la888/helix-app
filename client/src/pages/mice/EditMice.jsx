import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useFormValidation } from "../../hooks/useFormValidation";
import { useForm } from "../../hooks/useForm";
import { fetchData } from "../../utils/fetchData";
import { useCheckPermission } from "../../hooks/useCheckPermission";

export default function EditMice() {
  const { strainId, mouseId } = useParams();
  const navigate = useNavigate();
  const [FormData, handleChange, setFormData] = useForm({});
  const { validated, setValidated } = useFormValidation();
  const isAuthorized = useCheckPermission(strainId);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetchData(strainId);
        // setFormData((prevData) => ({
        //   ...prevData,
        //   ...res.strain,
        // }));
        console.log(res);
      } catch (error) {
        console.error("Error fetching strains data:", error);
      }
    };
    if (isAuthorized) {
      loadData();
    }
  }, []);

  // const handleChange = (event) => {
  //   const { name, value } = event.target;
  //   if (name.includes(".")) {
  //     const [parentKey, childKey] = name.split(".");
  //     setMouseData((prev) => ({
  //       ...prev,
  //       [parentKey]: {
  //         ...prev[parentKey],
  //         [childKey]: value,
  //       },
  //     }));
  //   } else {
  //     setMouseData((prev) => ({
  //       ...prev,
  //       [name]: value,
  //     }));
  //   }
  // };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    setValidated(true);

    const { _id, __v, ...rest } = mouseData;

    const updatedFormData = {
      mouse: {
        ...rest,
      },
    };
    console.log(updatedFormData);

    try {
      const res = await axios.put(
        `/api/strains/${strainId}/mice/${mouseId}`,
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
      let errorMessage = "提交失敗，請稍後再試。";
      let errorStack = "";
      console.log(error.response);

      if (error.response) {
        errorMessage = error.response.data.message || "伺服器錯誤。";
        errorStack = error.response.data.stack || "XXX";
      } else if (error.request) {
        errorMessage = "伺服器未響應，請稍後再試。";
      } else {
        errorMessage = error.message;
        errorStack = error.stack;
      }

      navigate("/error", { state: { error: errorMessage, stack: errorStack } });
    }
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
      {/* <form
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
              {strain?.genes?.map((gene) => (
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
              {strain?.genes?.map((_, index) => (
                <td>
                  <select
                    className="form-control"
                    name={`sampling_results_${index}`}
                    id={`sampling_results_${index}`}
                    value={mouseData.sampling_results?.[index]}
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
      </form> */}
      <Link to={`/strains/${strainId}`}>返回小鼠品系資訊</Link>
    </>
  );
}
