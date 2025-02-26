import axios from "axios";
import React, { useEffect, useState } from "react";
import InputField from "../components/InputField";
import { sendFormData } from "../utils/sendFormData";
import { useNavigate, Link } from "react-router-dom";
import { useFormValidation } from "../hooks/useFormValidation";
import { useDispatch, useSelector } from "react-redux";
import { deleteAccount } from "../redux/auth/authActions";

export default function ProfilePage() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    _id: "",
    username: "",
    dept: "",
    tel: "",
    role: "計畫主持人",
    name: "",
  });
  const navigate = useNavigate();
  const { validated, validateForm } = useFormValidation();
  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get("/api/current_user");
      if (res.data) {
        setFormData((prevData) => ({
          ...prevData,
          _id: res?.data?._id,
          username: res?.data?.username,
          dept: res?.data?.dept || "",
          tel: res?.data?.tel || "",
          role: res?.data?.role || "計畫主持人",
          name: res?.data?.name,
          googleId: res?.data?.googleId || "",
        }));
      }
    };
    fetchData();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validateForm(event)) return;

    const { username, name, ...rest } = formData;

    const updatedFormData = {
      ...rest,
    };
    console.log(updatedFormData);

    sendFormData("/api/users", updatedFormData, navigate, "PUT");
  };

  const handleDeleteAccount = (event) => {
    event.preventDefault();
    if (window.confirm("確定要刪除帳戶嗎？此操作無法恢復！")) {
      dispatch(deleteAccount(user._id, navigate));
    }
  };

  return (
    <div className="row">
      <h1 className="text-center">編輯使用者資料</h1>
      <div className="col-md-8 offset-md-2">
        <form
          noValidate
          onSubmit={handleSubmit}
          className={`validated-form ${
            validated ? "was-validated" : ""
          } shadow-lg mb-3 p-4 rounded-3`}
        >
          <div className="row">
            <InputField
              label="使用者名稱"
              id="name"
              name="name"
              value={formData?.name}
              onChange={handleChange}
              className="col"
            />
            <InputField
              label="使用者信箱"
              id="username"
              name="username"
              value={formData?.username}
              onChange={handleChange}
              className="col"
              readOnly={!!formData.googleId}
            />
          </div>
          <div className="row">
            <InputField
              className="col"
              label="計畫單位"
              id="dept"
              name="dept"
              value={formData?.dept || ""}
              onChange={handleChange}
            />

            <InputField
              className="col"
              label="連絡電話"
              id="tel"
              name="tel"
              value={formData?.tel}
              onChange={handleChange}
            />
            <div className="mb-2 col">
              <label className="form-label" htmlFor="role">
                <b>職稱</b>
              </label>
              <select
                className="form-select"
                aria-label="Default select example"
                name="role"
                id="role"
                value={formData?.role}
                onChange={handleChange}
              >
                <option value="計畫主持人">計畫主持人</option>
                <option value="學生">學生</option>
                <option value="研究助理">研究助理</option>
                <option value="品系管理人">品系管理人</option>
                <option value="獸醫">獸醫</option>
              </select>
            </div>
          </div>
          <div className="mt-5 d-flex justify-content-end">
            <button type="submit" className=" warning">
              更新使用者資料
            </button>
            <button className=" danger ms-2" onClick={handleDeleteAccount}>
              刪除使用者資料
            </button>
            <button className=" info ms-2">
              <Link to={"/strains/index"} className="link">
                取消，返回品系資訊
              </Link>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
