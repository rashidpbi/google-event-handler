import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/authContext";
import { ChartColumn, Clock4, CircleCheckBig } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import CreateModal from "@/components/custom/CreateModal";
import handleFrontendResponseObject from "@/utils/handleFrontendResponseObject";
import Event from "@/components/custom/Event";
import EmptyEvent from "@/components/custom/EmptyEvent";
import PaginationComponent from "@/components/custom/PaginationComponent";
import ReminderHeader from "@/components/custom/ReminderHeader";
import DashboardHeader from "@/components/custom/DashboardHeader";
import StatusBar from "@/components/custom/StatusBar";
export default function page() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [events, setEvents] = useState([]);
  const { updateCookies } = useContext(AuthContext);
  const [page, setPage] = useState(1);
  const limit = 2;
  const start = (page - 1) * limit;

  const getEventCounts = (events = []) => {
    const now = new Date();
    let pending = 0;
    let completed = 0;
    events.forEach((event) => {
      if (!event.start) return;

      const eventDateStr = event.start.dateTime || event.start.date;
      if (!eventDateStr) return;

      const eventDate = new Date(eventDateStr);
      if (eventDate > now) pending++;
      else completed++;
    });

    return { pending, completed, total: events.length };
  };
  const { pending, completed, total } = getEventCounts(events);
  const totalPages =
    pending > 0
      ? Math.ceil(
          events.filter(
            (event) => new Date(event?.start?.dateTime) > new Date()
          ).length / limit
        )
      : 0;

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/eventList", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const responseData = await response.json();

      if (!response.ok) {
        handleFrontendResponseObject(responseData);
      }
      if (response.ok) {
        setEvents(responseData.events);
        localStorage.setItem("events", JSON.stringify(responseData.events));
        console.log(responseData.events);
        setIsLoading(false);
      }
    } catch (error) {
      console.log("error fetching data: ", error);
      setError(true);
      setIsLoading(false);
    }
  };

  const statusBarItems = [
    {
      status: "total",
      n: total,
      Icon: <ChartColumn />,
      iconColor: "text-blue-500",
    },
    {
      status: "pending",
      n: pending,
      Icon: <Clock4 />,
      iconColor: "text-red-400",
    },
    {
      status: "completed",
      n: completed,
      Icon: <CircleCheckBig />,
      iconColor: "text-green-400",
    },
  ];
  useEffect(() => {
    const allCookies = document.cookie;

    updateCookies(allCookies);

    if (localStorage.getItem("events") !== "undefined") {
      const localData = JSON.parse(localStorage.getItem("events"));
      if (localData.length > 0) {
        console.log("localData:", localData);
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
    <div className="grid text-md mx-8  sm:mx-36  ">
      <Dialog>
        <DashboardHeader fetchData={fetchData} />
        <StatusBar items={statusBarItems} />
        <div className="grid mx-2 mt-2 border rounded-md ">
          <div className="grid ">
            {events &&
              (pending > 0 ? <ReminderHeader n={events ? pending : 0} /> : "")}
            {events &&
              (pending > 0 ? (
                events
                  .filter(
                    (event) => new Date(event?.start?.dateTime) > new Date()
                  )
                  .slice(start, start + limit)
                  .map((event, i) => {
                    return <Event event={event} key={i} />;
                  })
              ) : (
                <EmptyEvent />
              ))}
          </div>
        </div>
        <CreateModal />
      </Dialog>
      <div className="md:fixed left-48 right-48 bottom-22  mx-auto ">
        <PaginationComponent paginationProps={{ totalPages, page, setPage }} />
      </div>
    </div>
  );
}
