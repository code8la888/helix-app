import { Link } from "react-router-dom";
import { useDeleteStrain } from "../../hooks/useStrainMutation";

export default function StrainInfo({ strain, currentUser, id }) {
  const deleteStrainMutation = useDeleteStrain(id);

  // 刪除品系
  const handleDeleteStrain = async (event) => {
    event.preventDefault();
    await deleteStrainMutation.mutateAsync(id);
  };

  // 計算到期日
  const expirationDate = new Date(strain?.EXP);
  const today = new Date();
  const timeDiff = expirationDate - today;
  const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  const isUrgent = daysRemaining <= 90;

  if (!strain) return null;

  return (
    <>
      {currentUser &&
      strain?.users?.includes(currentUser?.name) &&
      currentUser?.role === "計畫管理人" ? (
        <div className="mb-3 d-flex justify-content-center">
          <button className=" warning text-white mx-2">
            <Link to={`/strains/${id}/edit`} className="link">
              編輯計畫資訊
            </Link>
          </button>

          <button className=" danger" onClick={handleDeleteStrain}>
            刪除計畫資訊
          </button>
        </div>
      ) : (
        ""
      )}
      <div className="shadow-lg mt-3 mb-5 p-3 rounded-3">
        <p className="table-title p-0 m-0">實驗動物資訊</p>
        <p>
          <b>品系名稱：</b> {strain.strain}
        </p>
        <p>
          <b>品系簡稱：</b> {strain.abbr}
        </p>
        <p>
          <b>單位：</b>
          {strain.dept}
        </p>
        <p>
          <b>IACUC編號：</b> {strain.iacuc_no}
        </p>
        <p>
          <b>計畫期限：</b>
          <span className={isUrgent ? "text-danger fw-bold" : ""}>
            {expirationDate.toLocaleDateString("zh-TW")}
          </span>
          {isUrgent && (
            <span className="text-danger fw-bold">
              ⚠️計畫即將或已經到期，請盡快展延計畫！
            </span>
          )}
        </p>
      </div>
    </>
  );
}
