import React from "react";
import { DialogTrigger } from "../ui/dialog";
import { Bell, Calendar, Plus } from "lucide-react";

export default function DashboardHeader({ fetchData }) {
  return (
    <div className=" flex flex-col sm:flex-row sm:justify-between">
      <div className="flex flex-col  px-4 items-">
        <div className="flex   ">
          <div className="m-2 ml-0 ">
            <Bell className="size-8" />
          </div>
          <div className="font-bold  content-center m-2 text-2xl">
            Reminder Manager
          </div>
        </div>
        <div className="">
          Keep track of your important reminders with scheduling and sync
        </div>
      </div>
      <br></br>

      <div className="flex gap-2">
        <div className="flex cursor-pointer  items-center justify-center m-2">
          <div
            onClick={() => fetchData()}
            className="flex items-center p-2 border rounded-md border-zinc-300 dark:border-white "
          >
            <div>
              <Calendar />
            </div>
            <div className="m-2">Sync</div>
          </div>
        </div>
        <div className="flex cursor-pointer  items-center justify-center m-2">
          <DialogTrigger asChild>
            <div className="flex items-center  p-2 border rounded-md bg-black dark:bg-white dark:text-black text-white">
              <div>
                <Plus />
              </div>
              <div className="m-2">Add reminder</div>
            </div>
          </DialogTrigger>
        </div>
      </div>
    </div>
  );
}
