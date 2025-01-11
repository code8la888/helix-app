import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function EditStrain() {
  const { id } = useParams();
  const [strain, setStrain] = useState();
  const [validated, setValidated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(`/api/strains/${id}`);
        const strainData = res.data.strain;
        setStrain(strainData);
      } catch (error) {
        console.error("Error fetching strains data:", error);
      }
    }
    fetchData();
  }, []);

  const addUserField = () => {
    setStrain((prev) => ({ ...prev, users: [...prev.users, ""] }));
  };

  const handleDeleteUser = (index) => {
    setStrain((prev) => ({
      ...prev,
      users: prev?.users.filter((_, i) => i !== index),
    }));
  };

  const updateUsername = (index, newUser) => {
    setStrain((prev) => ({
      ...prev,
      users: prev.users.map((username, i) =>
        i === index ? newUser : username
      ),
    }));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setStrain({
      ...strain,
      [name]: name === "EXP" ? new Date(value).toISOString() : value,
    });
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

    const { _id, mice, breedingRecords, __v, ...rest } = strain;

    const updatedData = {
      strain: { ...rest },
    };

    try {
      const res = await axios.put(`/api/strains/${id}`, updatedData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.data.redirect) {
        navigate(res.data.redirect);
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
        <h2 className="text-center">編輯{strain?.strain || ""}小鼠品系資訊:</h2>
        <div className="col-md-8 offset-md-2">
          <form
            noValidate
            className={`validated-form ${validated ? "was-validated" : ""}`}
            onSubmit={handleSubmit}
          >
            <div className="row g-3 rounded-2 my-5">
              <div className="col-md-4">
                <label className="form-label" htmlFor="strain">
                  品系名稱:
                </label>
                <input
                  className="form-control"
                  type="text"
                  id="strain"
                  name="strain"
                  value={strain?.strain || ""}
                  onChange={handleChange}
                  required
                />
                <div className="valid-feedback">looks good!</div>
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label" htmlFor="abbr">
                  品系縮寫:
                </label>
                <input
                  className="form-control"
                  type="text"
                  id="abbr"
                  name="abbr"
                  value={strain?.abbr || ""}
                  onChange={handleChange}
                  required
                />
                <div className="valid-feedback">looks good!</div>
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label" htmlFor="dept">
                  單位:
                </label>
                <input
                  className="form-control"
                  type="text"
                  id="dept"
                  name="dept"
                  value={strain?.dept || ""}
                  onChange={handleChange}
                  required
                />
                <div className="valid-feedback">looks good!</div>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label" htmlFor="iacuc_no">
                  IACUC編號:
                </label>
                <input
                  className="form-control"
                  type="text"
                  id="iacuc_no"
                  name="iacuc_no"
                  value={strain?.iacuc_no || ""}
                  onChange={handleChange}
                  required
                />
                <div className="valid-feedback">looks good!</div>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label" htmlFor="EXP">
                  計畫期限:
                </label>
                <input
                  className="form-control"
                  type="date"
                  id="EXP"
                  name="EXP"
                  value={
                    strain?.EXP
                      ? new Date(strain.EXP).toISOString().split("T")[0]
                      : ""
                  }
                  onChange={handleChange}
                  required
                />
                <div className="valid-feedback">looks good!</div>
              </div>
            </div>
            <hr />
            <h2 className="text-center mt-3">編輯使用者資訊:</h2>
            {strain?.users.map((username, index) => {
              return (
                <div className="mb-3" key={index}>
                  <div className="mb-3">
                    <input
                      className="form-control"
                      type="text"
                      value={username || ""}
                      onChange={(event) =>
                        updateUsername(index, event.target.value)
                      }
                      required
                    />
                  </div>
                  <button
                    className="btn btn-danger"
                    onClick={() => {
                      handleDeleteUser(index);
                    }}
                  >
                    刪除使用者
                  </button>
                </div>
              );
            })}
            <div className="mb-3">
              <div id="user-fields"></div>
              <button
                type="button"
                className="btn btn-info"
                onClick={addUserField}
              >
                新增使用者
              </button>
            </div>
            <div className="mb-3">
              <button className="btn btn-success">提交更新</button>
            </div>
          </form>
        </div>
      </div>
      <a href={`/strains/${id}`}>返回小鼠品系資訊</a>
    </>
  );
}
