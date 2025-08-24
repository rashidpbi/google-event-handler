import { Clock4 } from "lucide-react";
import React from "react";

export default function ReminderHeader({ n }) {
  return (
    <div className="flex flex-col  text-red-400 break-normal border p-4 bg-red-50">
      <div className="flex font-bold">
        <div className="m-2">
          <Clock4 />
        </div>
        <div className="m-2 text-xl">Pending Reminders ({n})</div>
      </div>
      <div>These reminders need your immediate attention</div>
    </div>
  );
}
