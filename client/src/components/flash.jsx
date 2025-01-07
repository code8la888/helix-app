import React from "react";

export default function flash() {
  return (
    <div>
      <div class="alert alert-success alert-dismissible fade show" role="alert">
        {/* <%= success%> */}
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="alert"
          aria-label="Close"
        ></button>
      </div>
      {/* <% } %> <% if(error && error.length){ %> */}
      <div class="alert alert-danger alert-dismissible fade show" role="alert">
        {/* <%= error%> */}
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="alert"
          aria-label="Close"
        ></button>
      </div>
      {/* <% } %> */}
    </div>
  );
}
