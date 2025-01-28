import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchData } from "../../utils/fetchData";
import TableHeaderItem from "../../components/TableHeaderItem";
import ReactPaginate from "react-paginate";

function Index() {
  const [strains, setStrains] = useState([]);
  const [filteredStrains, setFilteredStrains] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    const loadData = async () => {
      const res = await fetchData("/api/strains");
      setStrains(res.strains);
      setFilteredStrains(res.strains);
    };
    loadData();
  }, []);

  useEffect(() => {
    const filtered = strains.filter((strain) =>
      strain.strain.toLowerCase().includes(keyword.toLowerCase())
    );
    setFilteredStrains(filtered);
    setCurrentPage(0);
  }, [keyword, strains]);

  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredStrains.slice(startIndex, endIndex);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };
  console.log(keyword);
  return (
    <div>
      <h1 className="text-center">List of Strain</h1>
      <form className="mb-3" onSubmit={handleSubmit}>
        <div className="row justify-content-center">
          <div className="col-4 mb-2">
            <input
              className="form-control"
              type="search"
              placeholder="請輸入關鍵字..."
              value={keyword}
              onChange={(event) => {
                setKeyword(event.target.value);
              }}
            />
          </div>
        </div>
      </form>

      <div className="shadow-lg mb-3 p-4 rounded-3 table-responsive">
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
                  <Link to={`/strains/${strain._id}`} className="custom-color">
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
          pageCount={Math.ceil(filteredStrains.length / itemsPerPage)}
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
