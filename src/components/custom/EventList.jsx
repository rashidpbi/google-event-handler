import React from "react";
import ReminderHeader from "./ReminderHeader";
import Event from "./Event";
import { useEventStore } from "@/store/eventStore";
import EmptyEvent from "./EmptyEvent";

export default function EventList() {
  const { events, isLoading, counts } = useEventStore();
  return (
    <div className="grid mx-2 mt-2 border rounded-md ">
      {!isLoading &&
        events &&
        (counts.pending > 0 ? (
          <div>
            <ReminderHeader n={events ? counts.pending : 0} />
            {events.map((event, i) => {
              return <Event event={event} key={i} />;
            })}
          </div>
        ) : (
          <EmptyEvent />
        ))}
    </div>
  );
}
