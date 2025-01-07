import Table from "react-bootstrap/Table";

function Index() {
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
          {/* <% for(let s of strains){ %>
      <tr>
        <td><a href="/strains/<%= s._id %>"><%= s.strain %></a></td>
        <td><%= s.abbr %></td>
        <td><%= s.dept %></td>
        <td><%= s.iacuc_no %></td>
        <td><%= new Date(s.EXP).toLocaleDateString('zh-TW') %></td>
        <% s.users.forEach(function(user) { %> <%if(user.role === "計畫主持人"){%>
        <td><%= user.username%></td>
        <% } %> <% }); %> <% s.users.forEach(function(user) { %> <%if(user.role
        === "品系管理人"){%>
        <td><%= user.username%></td>
        <% } %> <% }); %>
      </tr>
      <% } %> */}
        </tbody>
      </Table>
    </div>
  );
}
export default Index;
