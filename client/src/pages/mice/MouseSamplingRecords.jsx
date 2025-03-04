import { useState } from "react";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { useDeleteSamplingRecord } from "../../hooks/useSamplingRecordMutation";

export default function MouseSamplingRecords({
  mice,
  strain,
  currentUser,
  id,
}) {
  const itemsPerPage = 10; // 每頁顯示 10 筆
  const [mouseOffset, setMouseOffset] = useState(0);

  // 計算分頁數量
  const getPageCount = (items) => Math.ceil(items.length / itemsPerPage);
  const paginatedMice = mice?.slice(mouseOffset, mouseOffset + itemsPerPage);

  const deleteSamplingRecordMutation = useDeleteSamplingRecord();
  // 刪除小鼠
  const handleDeleteMice = async (miceId, event) => {
    event.preventDefault();
    const data = {
      strainId: id,
      mouseId: miceId,
    };
    await deleteSamplingRecordMutation.mutateAsync(data);
  };

  return (
    <>
      {currentUser &&
      strain?.users?.includes(currentUser.name) &&
      currentUser?.role === "品系管理人" ? (
        <button className=" success">
          <Link to={`/strains/${id}/mice/new`} className="link">
            新增採樣紀錄
          </Link>
        </button>
      ) : (
        ""
      )}
      {paginatedMice ? (
        <div className="shadow-lg mt-3 mb-5 p-3 rounded-3 table-responsive">
          <table className="table table-striped table-hover custom-striped caption-top">
            <caption className="table-title p-0">小鼠採樣紀錄</caption>
            <thead>
              <tr>
                <th scope="col">No</th>
                <th scope="col">父母</th>
                <th scope="col">胎次</th>
                <th scope="col">性別</th>
                <th scope="col">出生日期</th>
                {strain.gene ? (
                  <>
                    <th scope="col">採樣日期</th>
                    <th scope="col">趾號</th>
                  </>
                ) : (
                  ""
                )}
                {strain
                  ? strain.genes.map((gene) => (
                      <th scope="col" key={gene}>
                        {gene}
                      </th>
                    ))
                  : ""}
                <th scope="col">狀態</th>
                <th scope="col">移出日期</th>
                <th scope="col">備註</th>
                {currentUser &&
                strain?.users?.includes(currentUser.name) &&
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
                    {strain.gene ? (
                      <>
                        <td>
                          {new Date(mouse.sampling_date).toLocaleDateString(
                            "zh-TW"
                          )}
                        </td>
                        <td>{mouse.toeNumber}</td>
                      </>
                    ) : (
                      ""
                    )}
                    {mouse?.sampling_results?.length > 0
                      ? mouse.sampling_results.map((result, index) => (
                          <td key={index}>{result}</td>
                        ))
                      : ""}
                    <td>{mouse.on_shelf}</td>
                    <td>
                      {mouse.exit_date
                        ? new Date(mouse.exit_date).toLocaleDateString("zh-TW")
                        : "-"}
                    </td>
                    <td>{mouse.note || "-"}</td>
                    {currentUser &&
                    strain?.users?.includes(currentUser.name) &&
                    currentUser.role === "品系管理人" ? (
                      <>
                        <td>
                          <button className=" warning">
                            <Link
                              to={`/strains/${id}/mice/${mouse._id}/edit`}
                              className="link"
                            >
                              編輯
                            </Link>
                          </button>
                        </td>
                        <td>
                          <button
                            className=" danger"
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
                <tr>
                  <td
                    className="py-2 fw-bold"
                    colSpan={11 + strain.genes.length}
                  >
                    尚無採樣紀錄
                  </td>
                </tr>
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
