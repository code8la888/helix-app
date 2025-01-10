import React from "react";

export default function NewMice() {
  return (
    <>
      <h1>新增小鼠資料</h1>
      <div className="row">
        <div className="col-12">
          <form
            action="/strains/<%=strainId%>/mice/new"
            method="POST"
            noValidate
            className="validated-form col-12"
          >
            <table className="table table-striped">
              <thead>
                <tr>
                  <th scope="col" className="col-1">
                    No
                  </th>
                  <th scope="col" className="col-1">
                    父
                  </th>
                  <th scope="col" className="col-1">
                    母
                  </th>
                  <th scope="col" className="col-1">
                    胎次
                  </th>
                  <th scope="col" className="col-1">
                    性別
                  </th>
                  <th scope="col" className="col-1">
                    出生日期
                  </th>
                  <th scope="col" className="col-1">
                    採樣日期
                  </th>
                  <th scope="col" className="col-1">
                    趾號
                  </th>
                  {/* <% strain.genes.forEach(function(g){%>
                <th scope="col" className="col-1"><%= g%></th>
                <% }) %> */}
                  <th scope="col" classNameName="col-1">
                    狀態
                  </th>
                  <th scope="col" className="col-1">
                    備註
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td className="col-1">
                    <input
                      className="form-control"
                      type="number"
                      name="mouse[no]"
                      required
                    />
                  </td>
                  <td className="col-1">
                    <input
                      className="form-control"
                      type="text"
                      name="mouse[parents][father]"
                      required
                    />
                  </td>
                  <td className="col-1">
                    <input
                      className="form-control"
                      type="text"
                      name="mouse[parents][mother]"
                      required
                    />
                  </td>
                  <td className="col-1">
                    <input
                      className="form-control"
                      type="number"
                      name="mouse[litter]"
                      required
                    />
                  </td>
                  <td className="col-1">
                    <select
                      className="form-control"
                      name="mouse[gender]"
                      id="gender"
                    >
                      <option value="M">M</option>
                      <option value="F">F</option>
                    </select>
                  </td>
                  <td className="col-1">
                    <input
                      className="form-control"
                      type="date"
                      name="mouse[birth_date]"
                      required
                    />
                  </td>
                  <td className="col-1">
                    <input
                      className="form-control"
                      type="date"
                      name="mouse[sampling_date]"
                      required
                    />
                  </td>
                  <td className="col-1">
                    <input
                      className="form-control"
                      type="text"
                      name="mouse[toeNumber]"
                      required
                    />
                  </td>
                  {/* <% htmlFor(let i = 0 ;i < strain.genes.length; i++){ %>
                <td className="col-1">
                  <select
                    className="form-control"
                    name="mouse[sampling_results][]"
                    id="sampling_results"
                  >
                    <option value="WT">WT</option>
                    <option value="HT">HT</option>
                    <option value="KO">KO</option>
                    <option value="檢測中">檢測中</option>
                  </select>
                </td>
                <% } %> */}
                  <td className="col-1">
                    <select
                      className="form-control"
                      name="mouse[on_shelf]"
                      id="on_shelf"
                    >
                      <option value="在架上">在架上</option>
                      <option value="已移出">已移出</option>
                      <option value="已犧牲">已犧牲</option>
                      <option value="自然死亡">自然死亡</option>
                    </select>
                  </td>
                  <td className="col-1">
                    <input
                      className="form-control"
                      type="text"
                      name="mouse[note]"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <button className="btn btn-success">新增繁殖資料</button>
          </form>
        </div>
      </div>
      <a href="/strains/<%= strainId %>">返回小鼠品系資訊</a>
    </>
  );
}
