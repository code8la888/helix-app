import React from "react";

export default function TableHeaderItem({ title }) {
  return (
    <th scope="col" className="col-1">
      {title}
    </th>
  );
}
