import React, { useState } from "react";
import { Calendar, Bell, Trash2, SquarePen } from "lucide-react";
import EditModal from "@/components/custom/EditModal";
import DeleteModal from "@/components/custom/DeleteModal";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

export default function Event({ event,fetchData }) {
  const [openDelete,setOpenDelete]  = useState(false)
  const [openEdit, setOpenEdit] = useState(false);
  
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
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <div className="flex  items-center">
          <DialogTrigger>
            <div className="flex border gap-2  p-2 my-2 rounded-md cursor-pointer ">
              <div>
                <SquarePen />
              </div>
              <div>Edit</div>
            </div>
          </DialogTrigger>

          <Dialog open={openDelete} onOpenChange={setOpenDelete}>
            <DialogTrigger>
              <div className="flex border gap-2  p-2 my-2  ml-2 rounded-md text-red-400 cursor-pointer ">
                <div>
                  <Trash2 />
                </div>
                <div>Delete</div>
              </div>
            </DialogTrigger>
            <DeleteModal id={event.id} className="hidden"  open={openDelete} onOpenChange={setOpenDelete} fetchData={fetchData}/>
          </Dialog>

          <EditModal id={event.id} className="hidden"  open={openEdit} onOpenChange={setOpenEdit} fetchData={fetchData}/>
        </div>
      </Dialog>
    </div>
  );
}
