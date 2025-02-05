import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import ReactPaginate from "react-paginate";
import { sendFormData } from "../../utils/sendFormData";
import { fetchStrain } from "../../actions/strainActions";

export default function MouseSamplingRecords({
  mice,
  strain,
  currentUser,
  id,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const itemsPerPage = 10; // 每頁顯示 10 筆
  const [mouseOffset, setMouseOffset] = useState(0);

  // 計算分頁數量
  const getPageCount = (items) => Math.ceil(items.length / itemsPerPage);
  const paginatedMice = mice.slice(mouseOffset, mouseOffset + itemsPerPage);

  // 刪除小鼠
  const handleDeleteMice = async (miceId, event) => {
    event.preventDefault();
    dispatch({ type: "DELETE_MOUSE", payload: miceId });

    try {
      await sendFormData(
        `/api/strains/${id}/mice/${miceId}`,
        undefined,
        navigate,
        "DELETE"
      );
      dispatch(fetchStrain(id));
    } catch (error) {
      console.error("刪除小鼠失敗", error);
      dispatch({ type: "RESTORE_MOUSE", payload: miceId });
    }
  };

  return (
    <>
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
          <table className="table table-striped table-hover custom-striped caption-top">
            <caption className="fs-3 fw-bold">小鼠採樣記錄</caption>
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
                      {new Date(mouse.birth_date).toLocaleDateString("zh-TW")}
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
    </>
  );
}
