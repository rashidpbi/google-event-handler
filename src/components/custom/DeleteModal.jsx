import React from "react";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import handleFrontendResponseObject from "@/utils/handleFrontendResponseObject";
export default function DeleteModal({ id }) {
  const onDelete = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/eventDeletion/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(id),
        }
      );
      const responseData = await response.json();
      console.log("response.ok: ",response.ok)
      if (!response.ok) {
        if (!response.ok) {
          handleFrontendResponseObject(responseData);
        }
      }
      if (response.ok) {
        let currEvents = JSON.parse(localStorage.getItem("events"));
        const updatedEvents = currEvents.filter((event) => event.id != id);
        localStorage.setItem("events", JSON.stringify(updatedEvents));
        window.location.href = "http://localhost:3000";
      }
    } catch (error) {
      console.log("error in deleting event", error);
    }
  };

  return (
    <div className="justify-center  flex text-center pt-10 flex-col items-center">
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
    </div>
  );
}
