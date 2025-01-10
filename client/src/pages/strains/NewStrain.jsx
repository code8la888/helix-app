import { useState } from "react";
import axios from "axios";

function NewStrain() {
  const [formData, setFormData] = useState({
    strain: "",
    dept: "",
    abbr: "",
    iacuc_no: "",
    EXP: "",
    genes: [],
    users: [],
  });

  const [geneFields, setGeneField] = useState([]);
  const [userFields, setUserField] = useState([]);
  const [validated, setValidated] = useState(false);

  const addGeneField = () => {
    setGeneField((prev) => [...prev, { id: `gene-${prev.length}`, name: "" }]);
  };
  const addUserField = () => {
    setUserField((prev) => [...prev, { id: `user-${prev.length}`, name: "" }]);
  };
  const removeGeneField = (id) => {
    setGeneField(
      geneFields.filter((filed) => {
        return filed.id !== id;
      })
    );
  };
  const removeUserField = (id) => {
    setUserField(
      userFields.filter((filed) => {
        return filed.id !== id;
      })
    );
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
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
    const updatedFormData = {
      strain: {
        ...formData,
        genes: geneFields.map((field) => field.name),
        users: userFields.map((field) => field.name),
      },
    };
    // console.log(updatedFormData);

    try {
      const res = await axios.post("/api/strains", updatedFormData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.data.redirect) {
        window.location.href = res.data.redirect; // 導航到伺服器指定的頁面
      } else {
        console.log("資料送出成功:", res.data);
      }
    } catch (error) {
      if (error.response) {
        // 如果伺服器返回錯誤響應
        console.error("伺服器返回錯誤:", error.response.data);
        console.error("HTTP 狀態碼:", error.response.status);
      } else if (error.request) {
        // 請求已發送但沒有收到回應
        console.error("沒有收到伺服器回應:", error.request);
      } else {
        // 請求設置錯誤
        console.error("發送失敗:", error.message);
      }
    }
  };

  return (
    <>
      <div className="row">
        <h1 className="text-center">新增小鼠品系:</h1>
        <div className="col-md-6 offset-md-3">
          <form
            noValidate
            onSubmit={handleSubmit}
            className={`validated-form ${validated ? "was-validated" : ""}`}
          >
            <div className="mb-3">
              <label className="form-label" htmlFor="dept">
                單位:
              </label>
              <input
                className="form-control"
                type="text"
                id="dept"
                name="dept"
                value={formData.dept}
                onChange={handleChange}
                required
              />
              <div className="valid-feedback">看起來不錯</div>
              <div className="invalid-feedback">請輸入單位名稱</div>
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="strain">
                品系名稱:
              </label>
              <input
                className="form-control"
                type="text"
                id="strain"
                name="strain"
                value={formData.strain}
                onChange={handleChange}
                required
              />
              <div className="valid-feedback">看起來不錯</div>
              <div className="invalid-feedback">請輸入品系名稱</div>
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="abbr">
                品系縮寫:
              </label>
              <input
                className="form-control"
                type="text"
                id="abbr"
                name="abbr"
                value={formData.abbr}
                onChange={handleChange}
                required
              />
              <div className="valid-feedback">看起來不錯</div>
              <div className="invalid-feedback">請輸入品系縮寫</div>
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="iacuc_no">
                IACUC編號:
              </label>
              <input
                className="form-control"
                type="text"
                id="iacuc_no"
                name="iacuc_no"
                value={formData.iacuc_no}
                onChange={handleChange}
                required
              />
              <div className="valid-feedback">看起來不錯</div>
              <div className="invalid-feedback">請輸入IACUC編號</div>
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="EXP">
                計畫期限:
              </label>
              <input
                className="form-control"
                type="date"
                id="EXP"
                name="EXP"
                value={formData.EXP}
                onChange={handleChange}
                required
              />
              <div className="valid-feedback">看起來不錯</div>
              <div className="invalid-feedback">請選擇計畫期限</div>
            </div>
            <div className="mb-3">
              <h5 className="form-label">採樣基因列表:</h5>
              <div id="gene-fields">
                {geneFields.map((field, index) => (
                  <div key={field.id} className="mb-3">
                    <label className="form-label" htmlFor={field.id}>
                      採樣基因
                    </label>
                    <input
                      className="form-control"
                      type="text"
                      id={field.id}
                      name={`genes[${index}]`}
                      value={field.name}
                      onChange={(e) => {
                        const newGeneFields = [...geneFields];
                        newGeneFields[index].name = e.target.value;
                        console.log(newGeneFields);
                        setGeneField(newGeneFields);
                      }}
                      required
                    />
                    <button
                      type="button"
                      className="btn"
                      onClick={() => removeGeneField(field.id)}
                    >
                      刪除
                    </button>
                    <div className="valid-feedback">看起來不錯</div>
                    <div className="invalid-feedback">請輸入採樣基因名稱</div>
                  </div>
                ))}
              </div>
              <button
                id="add-gene-btn"
                type="button"
                className="btn btn-outline-primary"
                onClick={addGeneField}
              >
                新增採樣基因
              </button>
            </div>
            <div className="mb-3">
              <label className="form-label">使用者列表:</label>
              <div id="user-fields">
                {userFields.map((field, index) => (
                  <div key={field.id} className="mb-3">
                    <label className="form-label" htmlFor={field.id}>
                      使用者
                    </label>
                    <input
                      className="form-control"
                      type="text"
                      id={field.id}
                      name={`users[${index}]`}
                      value={field.name}
                      onChange={(e) => {
                        const newUserFields = [...userFields];
                        newUserFields[index].name = e.target.value;
                        console.log(newUserFields);
                        setUserField(newUserFields);
                      }}
                      required
                    />
                    <button
                      type="button"
                      className="btn"
                      onClick={() => removeUserField(field.id)}
                    >
                      刪除
                    </button>
                    <div className="valid-feedback">看起來不錯</div>
                    <div className="invalid-feedback">請輸入使用者名稱</div>
                  </div>
                ))}
              </div>
              <button
                id="add-user-btn"
                type="button"
                className="btn btn-outline-primary"
                onClick={addUserField}
              >
                新增使用者
              </button>
            </div>
            <div className="mb-3">
              <button className="btn btn-success">新增小鼠品系</button>
            </div>
          </form>
        </div>
      </div>
      <a href="/strains">返回所有品系資訊</a>
    </>
  );
}

export default NewStrain;
