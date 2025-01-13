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

  useEffect(() => {
    fetchStrainData();
  }, []);

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
