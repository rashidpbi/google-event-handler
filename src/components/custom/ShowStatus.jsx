import React from "react";

export default function ShowStatus({ status, n, Icon, iconColor }) {
  return (
    <div className="grid  border  border-zinc-300 py-2  rounded-md  w-38 px-4">
      <div className="flex ">
        <div className={`my-2 ${iconColor} b`}>{Icon}</div>
        <div className="m-2 ">{status}</div>
      </div>
      <div className="">{n}</div>
    </div>
  );
}
