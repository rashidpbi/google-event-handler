import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function page() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [events, setEvents] = useState(null);
  console.log("eventts:", events);
  console.log("Boolean(events):", Boolean(events));

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
      if (response.ok) {
        const updatedEvents = events.filter((event) => event.id != id);
        localStorage.setItem("events", JSON.stringify(updatedEvents));
        setEvents(updatedEvents);
      }
    } catch (error) {
      console.log("error in deleting event", error);
    }
  };
  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/eventList", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setEvents(data.events);
        localStorage.setItem("events", JSON.stringify(data.events));
        setIsLoading(false);
      }
    } catch (error) {
      console.log("error fetching data: ", error);
      setError(true);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (localStorage.getItem("events")) {
      const localData = JSON.parse(localStorage.getItem("events"));

      if (localData.length > 0) {
        console.log("Boolean(localData):", Boolean(localData));
        console.log("localData:", localData);
        console.log("Array.isArray(localData):", Array.isArray(localData));
        setEvents(localData);
        setIsLoading(false);
        return;
      }
    }

    fetchData();
  }, []);

  if (isLoading) {
    return <div>data loading ....</div>;
  }
  if (error) {
    return <div>error loading data</div>;
  }
  return (
    <div className="justify-center w-full flex text-center pt-10 flex-col items-center">
      <h1 className="text-lg font-bold">Google Calender</h1>
      <Link href={"/createEvent"}>
        <Button>create event</Button>
      </Link>
      <div className="grid gap-2">
        {/* {Number(Array.isArray(events))} */}
        {events &&
          events.map((event, i) => {
            return (
              <div key={i}>
                {event.summary}
                <Link href={`/updateEvent/${event.id}`}>
                  <Button>update event</Button>
                </Link>
                <Button onClick={() => onDelete(event.id)}>delete event</Button>
              </div>
            );
          })}
      </div>
      <button onClick={() => fetchData()}>sync</button>
    </div>
  );
}
