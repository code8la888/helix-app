import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import ReactPaginate from "react-paginate";
import { sendFormData } from "../../utils/sendFormData";
import { fetchStrain } from "../../actions/strainActions";

export default function BreedingRecords({
  strain,
  breedingRecords,
  currentUser,
  id,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const itemsPerPage = 10;
  const [breedingOffset, setBreedingOffset] = useState(0);

  // 計算分頁數量
  const getPageCount = (items) => Math.ceil(items.length / itemsPerPage);
  const paginatedBreedingRecords = breedingRecords.slice(
    breedingOffset,
    breedingOffset + itemsPerPage
  );

  // 刪除繁殖紀錄
  const handleDeleteBreedingRecord = async (recordId, event) => {
    event.preventDefault();
    dispatch({ type: "DELETE_BREEDINGRECORD", payload: recordId });

    try {
      await sendFormData(
        `/api/strains/${id}/breedingRecord/${recordId}`,
        undefined,
        navigate,
        "DELETE"
      );
      dispatch(fetchStrain(id));
    } catch (error) {
      console.error("刪除繁殖紀錄失敗", error);
      dispatch({ type: "RESTORE_BREEDINGRECORD", payload: recordId });
    }
  };

  return (
    <>
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
          <table className="table table-striped table-hover custom-striped caption-top">
            <caption className="fs-3 fw-bold">繁殖記錄表</caption>
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
                <p>尚無繁殖記錄</p>
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
            pageCount={getPageCount(breedingRecords)}
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
  );
}
