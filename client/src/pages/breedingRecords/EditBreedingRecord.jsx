import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function EditBreedingRecord() {
  const { strainId, breedingRecordId } = useParams();
  const navigate = useNavigate();
  const [breedingRecord, setBreedingRecord] = useState({
    strain: strainId,
    cage_no: "",
    parents: {
      father: "",
      mother: "",
    },
    pairing_date: "",
    on_shelf: "在架上",
  });
  const [validated, setValidated] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(null);

  const fetchStrainData = async () => {
    try {
      const res = await axios.get(
        `/api/strains/${strainId}/breedingRecord/${breedingRecordId}/edit`
      );

      console.log(res.data);
      setBreedingRecord(res.data.breedingRecord);
    } catch (error) {
      console.error("Error fetching strain data:", error);
    }
  };

  async function checkPermission() {
    try {
      await axios.get(`/api/strains/${strainId}/check-permission`);
      setIsAuthorized(true);
    } catch (error) {
      console.log(error);
      setIsAuthorized(false);
      navigate("/error", {
        state: {
          error: error.response?.data?.message || "您沒有權限訪問此頁面。",
          stack: error.response?.data?.stack || "XXX",
        },
      });
    }
  }

  useEffect(() => {
    checkPermission();
    fetchStrainData();
  }, [strainId, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name.includes(".")) {
      const [parentKey, childKey] = name.split(".");
      setBreedingRecord((prev) => ({
        ...prev,
        [parentKey]: {
          ...prev[parentKey],
          [childKey]: value,
        },
      }));
    } else {
      setBreedingRecord((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  console.log(breedingRecord);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    setValidated(true);

    const { _id, __v, ...rest } = breedingRecord;

    const updatedFormData = {
      breedingRecord: {
        ...rest,
      },
    };
    console.log(updatedFormData);

    try {
      const res = await axios.put(
        `/api/strains/${strainId}/breedingRecord/${breedingRecordId}`,
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
      <div className="row">
        <h1 className="text-center">編輯繁殖籠表:</h1>
        <div className="col-md-6 offset-md-3">
          <form
            onSubmit={handleSubmit}
            noValidate
            className={`validated-form ${validated ? "was-validated" : ""}`}
          >
            <div className="mb-3">
              <label className="form-label" for="cage_no">
                繁殖籠編號:
              </label>
              <input
                className="form-control"
                type="text"
                id="cage_no"
                name="cage_no"
                onChange={handleChange}
                value={breedingRecord.cage_no}
                required
              />
              <div className="valid-feedback">looks good!</div>
            </div>
            <div className="mb-3">
              <label className="form-label" for="father">
                父:
              </label>
              <input
                className="form-control"
                type="text"
                id="father"
                name="parents.father"
                onChange={handleChange}
                value={breedingRecord.parents.father}
                required
              />
              <div className="valid-feedback">looks good!</div>
            </div>
            <div className="mb-3">
              <label className="form-label" for="abbr">
                母:
              </label>
              <input
                className="form-control"
                type="text"
                id="mother"
                name="parents.mother"
                onChange={handleChange}
                value={breedingRecord.parents.mother}
                required
              />
              <div className="valid-feedback">looks good!</div>
            </div>
            <div className="mb-3">
              <label className="form-label" for="pairing_date">
                配種日期:
              </label>
              <input
                className="form-control"
                type="date"
                id="pairing_date"
                name="pairing_date"
                onChange={handleChange}
                value={
                  breedingRecord?.pairing_date
                    ? new Date(breedingRecord.pairing_date)
                        .toISOString()
                        .split("T")[0]
                    : ""
                }
                required
              />
              <div className="valid-feedback">looks good!</div>
            </div>
            <div className="mb-3">
              <label className="form-label" for="on_shelf">
                繁殖籠狀態:
              </label>
              <select
                name="on_shelf"
                id="on_shelf"
                className="form-select"
                onChange={handleChange}
              >
                <option value="在架上">在架上</option>
                <option value="已關閉">已關閉</option>
              </select>
              <div className="valid-feedback">looks good!</div>
            </div>

            <div className="mb-3">
              <button className="btn btn-success">修改繁殖籠資料</button>
            </div>
          </form>
        </div>
      </div>
      <a href={`/strains/${strainId}`}>返回小鼠品系資訊</a>
    </>
  );
}
