import React from 'react'
import ReminderHeader from "./ReminderHeader";
import Event from "./Event";
import { useEventStore } from "@/store/eventStore";


export default function EventList({onCreateClick,refreshCurrentPage}) {

    const {events,isLoading,counts } = useEventStore();
  return (
    <div className="grid mx-2 mt-2 border rounded-md ">
             {!isLoading &&
               events &&
               (counts.pending > 0 ? (
                 <div>
                   <ReminderHeader n={events ? counts.pending : 0} />
                   {events.map((event, i) => {
                     return (
                       <Event
                         event={event}
                         key={i}
                         refreshCurrentPage={refreshCurrentPage}
                       />
                     );
                   })}
                 </div>
               ) : (
                 <EmptyEvent onCreateClick={onCreateClick} />
               ))}
           </div>
  )
}
