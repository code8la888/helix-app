import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function NewBreedingRecord() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [validated, setValidated] = useState(false);
  const [formData, setFormData] = useState({
    strain: id,
    cage_no: "",
    parents: {
      father: "",
      mother: "",
    },
    pairing_date: "",
    on_shelf: "在架上",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name.includes(".")) {
      const [parentKey, childKey] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parentKey]: {
          ...prev[parentKey],
          [childKey]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  console.log(formData);

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
      breedingRecord: {
        ...formData,
      },
    };
    console.log(updatedFormData);

    try {
      const res = await axios.post(
        `/api/strains/${id}/breedingRecord`,
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
    <div>
      <div className="row">
        <h1 className="text-center">新增繁殖籠表:</h1>
        <div className="col-md-6 offset-md-3">
          <form
            onSubmit={handleSubmit}
            noValidate
            className={`validated-form ${validated ? "was-validated" : ""}`}
          >
            <div className="mb-3">
              <label className="form-label" htmlFor="cage_no">
                繁殖籠編號:
              </label>
              <input
                className="form-control"
                type="text"
                id="cage_no"
                name="cage_no"
                value={formData.cage_no}
                onChange={handleChange}
                required
              />
              <div className="valid-feedback">looks good!</div>
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="father">
                父:
              </label>
              <input
                className="form-control"
                type="text"
                id="father"
                name="parents.father"
                value={formData.parents.father}
                onChange={handleChange}
                required
              />
              <div className="valid-feedback">looks good!</div>
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="mother">
                母:
              </label>
              <input
                className="form-control"
                type="text"
                id="mother"
                name="parents.mother"
                value={formData.parents.mother}
                onChange={handleChange}
                required
              />
              <div className="valid-feedback">looks good!</div>
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="pairing_date">
                配種日期:
              </label>
              <input
                className="form-control"
                type="date"
                id="pairing_date"
                name="pairing_date"
                value={formData.pairing_date}
                onChange={handleChange}
                required
              />
              <div className="valid-feedback">looks good!</div>
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="on_shelf">
                繁殖籠狀態:
              </label>
              <select
                name="on_shelf"
                id="on_shelf"
                value={formData.on_shelf}
                onChange={handleChange}
                className="form-select"
              >
                <option value="在架上">在架上</option>
                <option value="已關閉">已關閉</option>
              </select>
              <div className="valid-feedback">looks good!</div>
            </div>

            <div className="mb-3">
              <button className="btn btn-success">新增繁殖籠</button>
            </div>
          </form>
        </div>
      </div>
      <Link to={`/strains/${id}`}>返回小鼠品系資訊</Link>
    </div>
  );
}
