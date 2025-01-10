import React from 'react'

export default function EditStrain() {
  return (
    <><div class="row">
    <h2 class="text-center">修改<%= strain.strain%>小鼠品系資訊:</h2>
    <div class="col-md-8 offset-md-2">
      <form
        action="/strains/<%= strain._id %>?_method=PUT"
        method="POST"
        novalidate
        class="validated-form"
      >
        <div class="row g-3 rounded-2 my-5">
          <div class="col-md-4">
            <label class="form-label" for="strain">品系名稱:</label>
            <input
              class="form-control"
              type="text"
              id="strain"
              name="strain[strain]"
              value="<%= strain.strain %>"
              required
            />
            <div class="valid-feedback">looks good!</div>
          </div>
          <div class="col-md-4 mb-3">
            <label class="form-label" for="abbr">品系縮寫:</label>
            <input
              class="form-control"
              type="text"
              id="abbr"
              name="strain[abbr]"
              value="<%= strain.abbr %>"
              required
            />
            <div class="valid-feedback">looks good!</div>
          </div>
          <div class="col-md-4 mb-3">
            <label class="form-label" for="dept">單位:</label>
            <input
              class="form-control"
              type="text"
              id="dept"
              name="strain[dept]"
              value="<%= strain.dept %>"
              required
            />
            <div class="valid-feedback">looks good!</div>
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label" for="iacuc_no">IACUC編號:</label>
            <input
              class="form-control"
              type="text"
              id="iacuc_no"
              name="strain[iacuc_no]"
              value="<%= strain.iacuc_no %>"
              required
            />
            <div class="valid-feedback">looks good!</div>
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label" for="EXP">計畫期限:</label>
            <input
              class="form-control"
              type="date"
              id="EXP"
              name="strain[EXP]"
              value="<%= strain.EXP.toISOString().split('T')[0] %>"
              required
            />
            <div class="valid-feedback">looks good!</div>
          </div>
        </div>
        <hr />
        <h2 class="text-center mt-3">修改使用者資訊:</h2>
        <%strain.users.forEach(function(user,i){%> <% if(user.role !=="獸醫"){ %>
        <div class="row mb-3">
          <%= user %>
          <div class="form-check-inline">
            <input
              type="checkbox"
              value="<%= user %>"
              id="user-<%= i %>"
              name="deleteUsers[]"
            />
            <label for="user-<%= i %>"> 刪除使用者 </label>
          </div>
        </div>
        <% } %> <%})%>
        <div class="mb-3">
          <div id="user-fields"></div>
          <button
            type="button"
            class="btn btn-outline-primary"
            onclick="addUserField()"
          >
            新增使用者
          </button>
        </div>
        <div class="mb-3">
          <button class="btn btn-success">更新</button>
        </div>
      </form>
    </div>
  </div>
  <a href="/strains/<%= strain._id %>">返回小鼠品系資訊</a></>
  )
}
