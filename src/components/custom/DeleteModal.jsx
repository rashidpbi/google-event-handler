//componets/custom/DeleteModal.jsx
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import handleFrontendResponseObject from "@/utils/handleFrontendResponseObject";
import { useEventStore } from "@/store/eventStore";
export default function DeleteModal({ id, onSuccess }) {
  const {isOpenDeleteModal,setIsOpenDeleteModal} = useEventStore()
  const onDelete = async (id) => {
    try {
      const response = await fetch(`/api/eventDeletion/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(id),
      });
      const responseData = await response.json();
      console.log("response.ok: ", response.ok);
      if (!response.ok) {
        await handleFrontendResponseObject(responseData);
        return;
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.log("error in deleting event", error);
    }
  };

  return (
    <div className="justify-center  flex text-center pt-10 flex-col items-center">
       <Dialog open={isOpenDeleteModal} onOpenChange={setIsOpenDeleteModal}>
      <DialogContent className="sm:max-w-md ">
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>Sure to delete the event ?</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div onClick={() => onDelete(id)}>
            <Button className="cursor-pointer">confirm</Button>
          </div>
        </DialogFooter>
      </DialogContent>
      </Dialog>
    </div>
  );
}
