//src/componets/custom/Event.jsx
import React from "react";
import { Calendar, Bell, Trash2, SquarePen } from "lucide-react";
import EditModal from "@/components/custom/EditModal";
import DeleteModal from "@/components/custom/DeleteModal";
import { useEventStore } from "@/store/eventStore";

export default function Event({ event }) {
  const { setIsOpenEditModal, setIsOpenDeleteModal } = useEventStore();
  return (
    <div className="border p-4  gap-2 ">
      <div className="flex  ">
        <div className="m-1">
          <Bell />
        </div>
        <div className="m-1 font-bold">{event.summary}</div>
      </div>
      <div className="m-1">{event.location || "location"}</div>

      <div className="flex">
        <div className="m-1">
          <Calendar />
        </div>
        <div className="m-1 text-sm text-zinc-500">
          Created:
          {new Date(event.created).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "long",
            day: "numeric",
            timeZone: "Asia/Kolkata",
          })}
        </div>
      </div>

      <div className="flex  items-center">
        <div
          className="flex border border-gray-300 gap-2  p-2 my-2 rounded-md cursor-pointer "
          onClick={() => setIsOpenEditModal(true)}
        >
          <div>
            <SquarePen />
          </div>
          <div>Edit</div>
        </div>

        <div
          className="flex border border-gray-300 gap-2  p-2 my-2  ml-2 rounded-md text-red-600 cursor-pointer "
          onClick={() => setIsOpenDeleteModal(true)}
        >
          <div>
            <Trash2 />
          </div>
          <div>Delete</div>
        </div>

        <DeleteModal id={event.id} className="hidden" />

        <EditModal
          key={event.id}
          id={event.id}
          className="hidden"
          event={event}
        />
      </div>
    </div>
  );
}
