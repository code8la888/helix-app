import React from "react";

export default function UserInfo({ users }) {
  if (!users || users.length === 0) return null;

  return (
    <>
      <div className="shadow-lg mt-3 mb-5 p-3 rounded-3 table-responsive">
        <table className="table table-striped table-hover custom-striped caption-top">
          <caption className="table-title p-0">計畫人員資訊</caption>
          <thead>
            <tr>
              <th scope="col">姓名</th>
              <th scope="col">職稱</th>
              <th scope="col">聯絡信箱</th>
              <th scope="col">聯絡電話</th>
            </tr>
          </thead>
          <tbody>
            {users
              .filter((user) => user.role !== "獸醫")
              .map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.role}</td>
                  <td>{user.username}</td>
                  <td>{user.tel}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
