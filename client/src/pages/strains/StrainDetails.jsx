import axios from "axios";
import React from "react";
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchUser } from "../../actions/index";
import { sendFormData } from "../../utils/sendFormData";
import { fetchData } from "../../utils/fetchData";
import ReactPaginate from "react-paginate";
import Loader from "../../components/Loader";

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
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 10;
  const [mouseOffset, setMouseOffset] = useState(0);
  const [breedingOffset, setBreedingOffset] = useState(0);

  const loadData = async () => {
    try {
      const data = await fetchData(`/api/strains/${id}`);
      setStrain(data.strain);
      setMice(data.mice);
      setBreedingRecord(data.breedingRecord);
      setUsers(data.users);
    } catch (error) {
      console.error("error fetching strain data", error);
      navigate("/error", {
        state: {
          error: error.response?.data?.message || "無法載入品系資料",
          stack: error.response?.data?.stack || "伺服器未提供詳細資訊",
          statusCode: error.response?.status || 500,
        },
      });
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
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
            stack: error.response?.data?.stack || "權限錯誤",
          },
        });
      }
    };

    fetchPermission();
  }, [dispatch, navigate, id]);

  const paginate = (items, offset, itemsPerPage) => {
    const endOffset = offset + itemsPerPage;
    return items.slice(offset, endOffset);
  };

  const getPageCount = (items) => Math.ceil(items.length / itemsPerPage);

  const paginatedMice = paginate(mice, mouseOffset, itemsPerPage);

  const paginatedBreedingRecords = paginate(
    breedingRecord,
    breedingOffset,
    itemsPerPage
  );

  const handleDeleteStrain = async (event) => {
    event.preventDefault();
    await sendFormData(`/api/strains/${id}`, undefined, navigate, "DELETE");
    await loadData();
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
  };

  return (
    <>
      {isLoading ? (
        <Loader content="資料載入中..." />
      ) : (
        <>
          <h1 className="text-center">NTUMC-LAC 基因改造小鼠採樣記錄</h1>
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
          <h3>品系資訊</h3>
          {strain ? (
            <div className="shadow-lg mt-3 mb-5 p-3 rounded-3">
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
                {new Date(strain.EXP).toLocaleDateString("zh-TW")}
              </p>
            </div>
          ) : (
            ""
          )}
          <h3>使用者資訊</h3>
          {users.length > 0 ? (
            <div className="shadow-lg mt-3 mb-5 p-3 rounded-3 table-responsive">
              <table className="table table-striped table-hover custom-striped">
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
                    .filter((user) => user.role !== "獸醫")
                    .map((user) => (
                      <tr key={user._id}>
                        <td>{user.username}</td>
                        <td>{user.role}</td>
                        <td>{user.email}</td>
                        <td>{user.tel}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          ) : (
            ""
          )}
          <h3>小鼠採樣記錄</h3>
          {currentUser &&
          strain?.users?.includes(currentUser.username) &&
          currentUser.role === "品系管理人" ? (
            <button className="btn btn-success">
              <Link
                to={`/strains/${id}/mice/new`}
                style={{ textDecoration: "none", color: "white" }}
              >
                新增採樣記錄
              </Link>
            </button>
          ) : (
            ""
          )}
          {paginatedMice ? (
            <div className="shadow-lg mt-3 mb-5 p-3 rounded-3 table-responsive">
              <table className="table table-striped table-hover custom-striped">
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
                  {paginatedMice.length > 0 ? (
                    paginatedMice.map((mouse) => (
                      <tr key={mouse._id}>
                        <td>{mouse.no}</td>
                        <td>
                          {mouse.parents.father} x {mouse.parents.mother}
                        </td>
                        <td>{mouse.litter}</td>
                        <td>{mouse.gender}</td>
                        <td>
                          {new Date(mouse.birth_date).toLocaleDateString(
                            "zh-TW"
                          )}
                        </td>
                        <td>
                          {new Date(mouse.sampling_date).toLocaleDateString(
                            "zh-TW"
                          )}
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
                        <td>{mouse.note || "-"}</td>
                        {currentUser &&
                        strain?.users?.includes(currentUser.username) &&
                        currentUser.role === "品系管理人" ? (
                          <>
                            <td>
                              <button className="btn btn-warning">
                                <Link
                                  to={`/strains/${id}/mice/${mouse._id}/edit`}
                                  style={{
                                    textDecoration: "none",
                                    color: "black",
                                  }}
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
                    ))
                  ) : (
                    <p>尚無採樣記錄</p>
                  )}
                </tbody>
              </table>

              <ReactPaginate
                breakLabel="..."
                nextLabel="下一頁 >"
                previousLabel="< 上一頁"
                onPageChange={(event) =>
                  setMouseOffset(event.selected * itemsPerPage)
                }
                pageCount={getPageCount(mice)}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                containerClassName="pagination justify-content-center"
                pageClassName="page-item"
                pageLinkClassName="page-link"
                previousClassName="page-item"
                previousLinkClassName="page-link"
                nextClassName="page-item"
                nextLinkClassName="page-link"
                activeClassName="active"
              />
            </div>
          ) : (
            ""
          )}
          <h3>繁殖記錄表</h3>
          {currentUser &&
          strain?.users.includes(currentUser.username) &&
          currentUser.role === "品系管理人" ? (
            <button className="btn btn-success">
              <Link
                to={`/strains/${id}/breedingRecord/new`}
                style={{ textDecoration: "none", color: "white" }}
              >
                新增繁殖資料
              </Link>
            </button>
          ) : (
            ""
          )}
          {paginatedBreedingRecords ? (
            <div className="shadow-lg mt-3 mb-5 p-3 rounded-3 table-responsive">
              <table className="table table-striped table-hover custom-striped">
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
                  {paginatedBreedingRecords.length > 0 ? (
                    paginatedBreedingRecords.map((record) => (
                      <tr key={record._id}>
                        <td>{record.cage_no}</td>
                        <td>
                          {record.parents.father} 配 {record.parents.mother}
                        </td>
                        <td>
                          {new Date(record.pairing_date).toLocaleDateString(
                            "zh-TW"
                          )}
                        </td>
                        <td>{record.on_shelf}</td>
                        {currentUser &&
                        strain?.users?.includes(currentUser.username) &&
                        currentUser.role === "品系管理人" ? (
                          <>
                            <td>
                              <button className="btn btn-warning">
                                <Link
                                  to={`/strains/${id}/breedingRecord/${record._id}/edit`}
                                  style={{
                                    textDecoration: "none",
                                    color: "black",
                                  }}
                                >
                                  編輯
                                </Link>
                              </button>
                            </td>
                            <td>
                              <button
                                className="btn btn-danger"
                                onClick={(event) => {
                                  handleDeleteBreedingRecord(record._id, event);
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
                  ) : (
                    <p>尚無採樣記錄</p>
                  )}
                </tbody>
              </table>
              <ReactPaginate
                breakLabel="..."
                nextLabel="下一頁 >"
                previousLabel="< 上一頁"
                onPageChange={(event) =>
                  setBreedingOffset(event.selected * itemsPerPage)
                }
                pageCount={getPageCount(breedingRecord)}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                containerClassName="pagination justify-content-center"
                pageClassName="page-item"
                pageLinkClassName="page-link"
                previousClassName="page-item"
                previousLinkClassName="page-link"
                nextClassName="page-item"
                nextLinkClassName="page-link"
                activeClassName="active"
              />
            </div>
          ) : (
            ""
          )}
        </>
      )}
    </>
  );
}
