import React from "react";

export default function ShowStatus({ status, n, Icon, iconColor }) {
  return (
    <div className="grid  border  border-zinc-300 p-2  rounded-md">
      <div className="flex ">
        <div className={`m-2 ${iconColor}`}>{Icon}</div>
        <div className="m-2">{status}</div>
      </div>
      <div>{n}</div>
    </div>
  );
}
