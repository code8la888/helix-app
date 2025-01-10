import Table from "react-bootstrap/Table";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
function Index() {
  const [strains, setStrains] = useState([]);
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get("/api/strains");
        const { strains } = res.data;
        setStrains(strains);
      } catch (error) {
        console.error("Error fetching strains data:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <div>
      <h1 className="text-center mb-5">所有品系</h1>
      <Table striped hover>
        <thead>
          <tr>
            <th scope="col">品系名稱</th>
            <th scope="col">品系縮寫</th>
            <th scope="col">單位</th>
            <th scope="col">IACUC編號</th>
            <th scope="col">計畫期限</th>
            <th scope="col">PI</th>
            <th scope="col">品系管理人</th>
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
      </Table>
    </div>
  );
}
export default Index;
