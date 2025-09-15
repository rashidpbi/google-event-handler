//src/components/custom/EmptyEvent.jsx
import React from "react";
import { Plus, Bell } from "lucide-react";
import { useEventStore } from "@/store/eventStore";

export default function EmptyEvent() {
  const {setIsCreateModalOpen} = useEventStore();
  return (
    <div className="flex flex-col  p-2 text-center justify-center gap-2">
      <div className="flex justify-center  ">
        <div>
          <Bell className="size-12 text-zinc-300" />
        </div>
      </div>
      <div className="font-bold">No Reminders yet</div>
      <div className="text-zinc-500">
        Create a reminder to get started with managing your tasks.
      </div>
      <div className="flex justify-center">
        <div
          className="flex   items-center justify-center bg-black dark:bg-white rounded-md px-2 cursor-pointer"
          onClick={()=>setIsCreateModalOpen(true)}
        >
          <div className="dark:text-black text-white">
            <Plus />
          </div>
          <div className="m-2 text-white dark:text-black">Create reminder</div>
        </div>
      </div>
    </div>
  );
}
