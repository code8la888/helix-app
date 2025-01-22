import axios from "axios";
import React from "react";
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchUser } from "../../actions/index";
import { sendFormData } from "../../utils/sendFormData";
import { fetchData } from "../../utils/fetchData";
import { toast } from "react-toastify";

export default function StrainDetails() {
  const { id } = useParams();
  const [strain, setStrain] = useState(null);
  const [breedingRecord, setBreedingRecord] = useState([]);
  const [mice, setMice] = useState([]);
  const [users, setUsers] = useState([]);
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(null);
  const loadData = async () => {
    try {
      const res = await fetchData(`/api/strains/${id}`);
      setStrain(res.strain);
      setMice(res.mice);
      setBreedingRecord(res.breedingRecord);
      setUsers(res.users);
      console.log(res);
    } catch (error) {
      console.error("Error fetching strains data:", error);
    }
  };

  useEffect(() => {
    dispatch(fetchUser());
    const fetchPermission = async () => {
      try {
        await axios.get(`/api/strains/${id}/browse-permission`);
        setIsAuthorized(true);
        loadData();
      } catch (error) {
        setIsAuthorized(false);
        navigate("/error", {
          state: {
            error: error.response?.data?.message || "您沒有權限訪問此頁面。",
            stack: error.response?.data?.stack || "XXX",
          },
        });
      }
    };

    fetchPermission();
  }, [dispatch, navigate, id]);

  const handleDeleteStrain = async (event) => {
    event.preventDefault();
    await sendFormData(`/api/strains/${id}`, undefined, navigate, "DELETE");
    await loadData();
    toast.success("成功刪除品系資料！");
  };

  const handleDeleteMice = async (miceId, event) => {
    event.preventDefault();
    await sendFormData(
      `/api/strains/${id}/mice/${miceId}`,
      undefined,
      navigate,
      "DELETE"
    );
    await loadData();
    toast.success("成功刪除採樣記錄！");
  };

  const handleDeleteBreedingRecord = async (breedingRecordId, event) => {
    event.preventDefault();
    await sendFormData(
      `/api/strains/${id}/breedingRecord/${breedingRecordId}`,
      undefined,
      navigate,
      "DELETE"
    );
    await loadData();
    toast.success("成功刪除繁殖紀錄！");
  };

  return (
    <div>
      <h1>NTUMC-LAC 基因改造小鼠採樣記錄</h1>
      <br />
      {currentUser &&
      strain?.users?.includes(currentUser.username) &&
      currentUser.role === "品系管理人" ? (
        <div className="mb-3 d-flex">
          <h3>品系資訊:</h3>
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
      {strain ? (
        <div className="row g-3 mouse.-2">
          <div className="col-mouse.-3">品系名稱: {strain.strain}</div>
          <div className="col-mouse.-2">品系簡稱: {strain.abbr}</div>
          <div className="col-mouse.-2">單位: {strain.dept}</div>
          <div className="col-mouse.-2">IACUC編號: {strain.iacuc_no}</div>
          <div className="col-mouse.-2">
            計畫期限: {new Date(strain.EXP).toLocaleDateString("zh-TW")}
          </div>
        </div>
      ) : (
        ""
      )}
      <br />
      <h3>使用者資訊:</h3>
      <table className="table table-striped mouse.-2">
        <thead>
          <tr>
            <th scope="col">姓名:</th>
            <th scope="col">職稱:</th>
            <th scope="col">聯絡信箱:</th>
            <th scope="col">聯絡電話:</th>
          </tr>
        </thead>
        <tbody>
          {users
            ? users
                .filter((user) => user.role !== "獸醫")
                .map((user) => (
                  <tr key={user._id}>
                    <td>{user.username}</td>
                    <td>{user.role}</td>
                    <td>{user.email}</td>
                    <td>{user.tel}</td>
                  </tr>
                ))
            : "loading"}
        </tbody>
      </table>
      <br />
      <h3>小鼠採樣記錄:</h3>
      {currentUser &&
      strain?.users?.includes(currentUser.username) &&
      currentUser.role === "品系管理人" ? (
        <Link to={`/strains/${id}/mice/new`}>新增採樣記錄</Link>
      ) : (
        ""
      )}
      <table className="table table-striped mouse.-2">
        <thead>
          <tr>
            <th scope="col">No</th>
            <th scope="col">父母</th>
            <th scope="col">胎次</th>
            <th scope="col">性別</th>
            <th scope="col">出生日期</th>
            <th scope="col">採樣日期</th>
            <th scope="col">趾號</th>
            {strain
              ? strain.genes.map((gene) => (
                  <th scope="col" key={gene}>
                    {gene}
                  </th>
                ))
              : ""}
            <th scope="col">狀態</th>
            <th scope="col">備註</th>
            {currentUser &&
            strain?.users?.includes(currentUser.username) &&
            currentUser.role === "品系管理人" ? (
              <>
                <th scope="col">編輯</th>
                <th scope="col">刪除</th>
              </>
            ) : (
              ""
            )}
          </tr>
        </thead>
        <tbody>
          {mice.map((mouse) => (
            <tr key={mouse._id}>
              <td scope="row">{mouse.no}</td>
              <td>
                {mouse.parents.father} x {mouse.parents.mother}
              </td>
              <td>{mouse.litter}</td>
              <td>{mouse.gender}</td>
              <td>{new Date(mouse.birth_date).toLocaleDateString("zh-TW")}</td>
              <td>
                {new Date(mouse.sampling_date).toLocaleDateString("zh-TW")}
              </td>
              <td>{mouse.toeNumber}</td>
              {mouse?.sampling_results?.length > 0 ? (
                mouse.sampling_results.map((result, index) => (
                  <td key={index}>{result}</td>
                ))
              ) : (
                <td value="檢測中">檢測中</td>
              )}
              <td>{mouse.on_shelf}</td>
              <td>{mouse.note ? mouse.note : "-"}</td>
              {currentUser &&
              strain?.users?.includes(currentUser.username) &&
              currentUser.role === "品系管理人" ? (
                <>
                  <td>
                    <button className="btn btn-warning">
                      <Link
                        to={`/strains/${id}/mice/${mouse._id}/edit`}
                        style={{ textDecoration: "none", color: "black" }}
                      >
                        編輯
                      </Link>
                    </button>
                  </td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={(event) => {
                        handleDeleteMice(mouse._id, event);
                      }}
                    >
                      刪除
                    </button>
                  </td>
                </>
              ) : (
                ""
              )}
            </tr>
          ))}
        </tbody>
      </table>
      <br />
      <h3>繁殖記錄表:</h3>
      {currentUser &&
      strain?.users.includes(currentUser.username) &&
      currentUser.role === "品系管理人" ? (
        <Link to={`/strains/${id}/breedingRecord/new`}>新增繁殖資料</Link>
      ) : (
        ""
      )}
      <table className="table table-striped mouse.-2">
        <thead>
          <tr>
            <th scope="col">繁殖籠編號</th>
            <th scope="col">父母</th>
            <th scope="col">配種日期</th>
            <th scope="col">繁殖籠狀態</th>
            {currentUser &&
            strain?.users?.includes(currentUser.username) &&
            currentUser.role === "品系管理人" ? (
              <>
                <th scope="col">編輯</th>
                <th scope="col">刪除</th>
              </>
            ) : (
              ""
            )}
          </tr>
        </thead>
        <tbody>
          {breedingRecord
            ? breedingRecord.map((b) => (
                <tr key={b._id}>
                  <th scope="row">{b.cage_no}</th>
                  <td>
                    {b.parents.father} 配 {b.parents.mother}
                  </td>
                  <td>
                    {new Date(b.pairing_date).toLocaleDateString("zh-TW")}
                  </td>
                  <td>{b.on_shelf}</td>
                  {currentUser &&
                  strain?.users?.includes(currentUser.username) &&
                  currentUser.role === "品系管理人" ? (
                    <>
                      <td>
                        <button className="btn btn-warning">
                          <Link
                            to={`/strains/${id}/breedingRecord/${b._id}/edit`}
                            style={{ textDecoration: "none", color: "black" }}
                          >
                            編輯
                          </Link>
                        </button>
                      </td>
                      <td>
                        <button
                          className="btn btn-danger"
                          onClick={(event) => {
                            handleDeleteBreedingRecord(b._id, event);
                          }}
                        >
                          刪除
                        </button>
                      </td>
                    </>
                  ) : (
                    ""
                  )}
                </tr>
              ))
            : ""}
        </tbody>
      </table>
    </div>
  );
}
