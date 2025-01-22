import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchData } from "../../utils/fetchData";
import TableHeaderItem from "../../components/TableHeaderItem";

function Index() {
  const [strains, setStrains] = useState([]);
  useEffect(() => {
    const loadData = async () => {
      const res = await fetchData("/api/strains");
      setStrains(res.strains);
    };
    loadData();
  }, []);

  return (
    <div>
      <h1 className="text-center mb-5">所有品系</h1>
      <table class="table table-striped table-hover">
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
          {strains.map((strain) => (
            <tr key={strain._id}>
              <td>
                <Link to={`/strains/${strain._id}`}>{strain.strain}</Link>
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
    </div>
  );
}
export default Index;
