import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchData } from "../../utils/fetchData";
import TableHeaderItem from "../../components/TableHeaderItem";
import ReactPaginate from "react-paginate";

function Index() {
  const [strains, setStrains] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    const loadData = async () => {
      const res = await fetchData("/api/strains");
      setStrains(res.strains);
    };
    loadData();
  }, []);

  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = strains.slice(startIndex, endIndex);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected); // React Paginate 提供的 selected 參數
  };

  return (
    <div>
      <h1 className="text-center mb-3">List of Strain</h1>
      <div className="shadow-lg mb-3 p-4 rounded-3">
        <table className="table table-striped table-hover custom-striped">
          <thead>
            <tr>
              <TableHeaderItem title="品系名稱" />
              <TableHeaderItem title="品系縮寫" />
              <TableHeaderItem title="單位" />
              <TableHeaderItem title="IACUC編號" />
              <TableHeaderItem title="計畫期限" />
              <TableHeaderItem title="PI" />
              <TableHeaderItem title="品系管理人" />
            </tr>
          </thead>
          <tbody>
            {currentData.map((strain) => (
              <tr key={strain._id}>
                <td colSpan={1}>
                  <Link to={`/strains/${strain._id}`} className="link-dark">
                    {strain.strain}
                  </Link>
                </td>
                <td>{strain.abbr}</td>
                <td>{strain.dept}</td>
                <td>{strain.iacuc_no}</td>
                <td>{new Date(strain.EXP).toLocaleDateString("zh-TW")}</td>
                <td>
                  {strain.users
                    .filter((user) => user.role === "計畫主持人")
                    .map((user) => user.username)
                    .join(", ")}
                </td>
                <td>
                  {strain.users
                    .filter((user) => user.role === "品系管理人")
                    .map((user) => user.username)
                    .join(", ")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <ReactPaginate
          previousLabel={"上一頁"}
          nextLabel={"下一頁"}
          breakLabel={"..."}
          pageCount={Math.ceil(strains.length / itemsPerPage)}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageChange}
          containerClassName={"pagination justify-content-center"}
          activeClassName={"active"}
          previousClassName={"page-item"}
          nextClassName={"page-item"}
          pageClassName={"page-item"}
          pageLinkClassName={"page-link"}
          previousLinkClassName={"page-link"}
          nextLinkClassName={"page-link"}
          breakClassName={"page-item"}
          breakLinkClassName={"page-link"}
        />
      </div>
    </div>
  );
}
export default Index;
