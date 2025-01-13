import axios from "axios";
import React from "react";
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchUser } from "../../actions/index";

export default function StrainDetails() {
  const { id } = useParams();
  const [strain, setStrain] = useState(null);
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const fetchStrainData = async () => {
    try {
      const res = await axios.get(`/api/strains/${id}`);
      setStrain(res.data);
    } catch (error) {
      console.error("Error fetching strain data:", error);
    }
  };

  useEffect(() => {
    dispatch(fetchUser());
    fetchStrainData();
    // console.log(currentUser);
  }, [dispatch]);

  const handleDeleteStrain = async (event) => {
    event.preventDefault();
    try {
      const res = await axios.delete(`/api/strains/${id}`);
      // console.log(res.data);
      if (res.data.redirect) {
        navigate(res.data.redirect);
      }
    } catch (error) {
      console.error("刪除失敗：", error);
    }
  };

  const handleDeleteMice = async (miceId, event) => {
    event.preventDefault();
    try {
      const res = await axios.delete(`/api/strains/${id}/mice/${miceId}`);
      if (res.status === 200) {
        await fetchStrainData(); // 刪除成功後重新加載數據
      }
    } catch (error) {
      console.error("刪除失敗：", error);
    }
  };

  const handleDeleteBreedingRecord = async (breedingRecordId, event) => {
    event.preventDefault();
    try {
      const res = await axios.delete(
        `/api/strains/${id}/breedingRecord/${breedingRecordId}`
      );
      if (res.status === 200) {
        await fetchStrainData(); // 刪除成功後重新加載數據
      }
    } catch (error) {
      console.error("刪除失敗：", error);
    }
  };

  console.log(strain || "");

  return (
    <div>
      <h1>NTUMC-LAC 基因改造小鼠採樣記錄</h1>
      <br />
      {currentUser &&
      strain?.strain?.users?.includes(currentUser.username) &&
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
          <div className="col-mouse.-3">品系名稱: {strain.strain.strain}</div>
          <div className="col-mouse.-2">品系簡稱: {strain.strain.abbr}</div>
          <div className="col-mouse.-2">單位: {strain.strain.dept}</div>
          <div className="col-mouse.-2">
            IACUC編號: {strain.strain.iacuc_no}
          </div>
          <div className="col-mouse.-2">
            計畫期限: {new Date(strain.strain.EXP).toLocaleDateString("zh-TW")}
          </div>
        </div>
      ) : (
        "loading"
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
          {strain
            ? strain.users
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
      strain?.strain?.users?.includes(currentUser.username) &&
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
              ? strain.strain.genes.map((gene, index) => (
                  <th scope="col" key={index}>
                    {gene}
                  </th>
                ))
              : "loading"}
            <th scope="col">狀態</th>
            <th scope="col">備註</th>
            {currentUser &&
            strain?.strain?.users?.includes(currentUser.username) &&
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
          {strain?.mice.map((mouse) => (
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
              strain?.strain?.users?.includes(currentUser.username) &&
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
      strain?.strain?.users.includes(currentUser.username) &&
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
            strain?.strain?.users?.includes(currentUser.username) &&
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
          {strain
            ? strain.breedingRecord.map((b) => (
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
                  strain?.strain?.users?.includes(currentUser.username) &&
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
