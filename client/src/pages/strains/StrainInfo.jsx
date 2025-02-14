import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { sendFormData } from "../../utils/sendFormData";

export default function StrainInfo({ strain, currentUser, id }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 刪除品系
  const handleDeleteStrain = async (event) => {
    event.preventDefault();
    dispatch({ type: "DELETE_STRAIN", payload: id });

    try {
      await sendFormData(`/api/strains/${id}`, undefined, navigate, "DELETE");
    } catch (error) {
      console.error("刪除品系失敗:", error);
      dispatch({ type: "RESTORE_STRAIN", payload: id });
    }
  };

  const expirationDate = new Date(strain?.EXP);
  const today = new Date();
  const timeDiff = expirationDate - today;
  const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  const isUrgent = daysRemaining <= 90;

  if (!strain) return null;

  return (
    <>
      {currentUser &&
      strain?.users?.includes(currentUser.username) &&
      currentUser.role === "品系管理人" ? (
        <div className="mb-3 d-flex justify-content-center">
          <button className="btn btn-warning text-white mx-2">
            <Link
              to={`/strains/${id}/edit`}
              style={{ textDecoration: "none", color: "black" }}
            >
              編輯品系資料
            </Link>
          </button>

          <button className="btn btn-danger" onClick={handleDeleteStrain}>
            刪除品系資料
          </button>
        </div>
      ) : (
        ""
      )}

      <div className="shadow-lg mt-3 mb-5 p-3 rounded-3">
        <h3 className="my-2">品系資訊</h3>
        <p>
          <b>品系名稱:</b> {strain.strain}
        </p>
        <p>
          <b>品系簡稱:</b> {strain.abbr}
        </p>
        <p>
          <b>單位: </b>
          {strain.dept}
        </p>
        <p>
          <b>IACUC編號:</b> {strain.iacuc_no}
        </p>
        <p>
          <b>計畫期限:</b>{" "}
          <span
            style={{
              color: isUrgent ? "red" : "",
            }}
          >
            {expirationDate.toLocaleDateString("zh-TW")}
          </span>
          {isUrgent && " ⚠️ 計畫即將或已經到期，請盡快展延計畫！"}
        </p>
      </div>
    </>
  );
}
