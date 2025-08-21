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
import { useRouter } from "next/router";
import { PaginationWithLinks } from "@/components/custom/pagination-with-links";

export default function page() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [events, setEvents] = useState([]);
  const { updateCookies } = useContext(AuthContext);
  // const [page, setPage] = useState(1);
    const [open, setOpen] = useState(false)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalEvents: 0,
    pageSize: 2,
  });
  const [counts, setCounts] = useState({
    pending: 0,
    completed: 0,
    total: 0,
  });
  // const getEventCounts = (events = []) => {
  //   const now = new Date();
  //   let pending = 0;
  //   let completed = 0;
  //   events.forEach((event) => {
  //     if (!event.start) return;

  //     const eventDateStr = event.start.dateTime || event.start.date;
  //     if (!eventDateStr) return;

  //     const eventDate = new Date(eventDateStr);
  //     if (eventDate > now) pending++;
  //     else completed++;
  //   });

  //   return { pending, completed, total: events.length };
  // };
  // const { pending, completed, total } = getEventCounts(events);
  // const totalPages =
  //   pending > 0
  //     ? Math.ceil(
  //         events.filter(
  //           (event) => new Date(event?.start?.dateTime) > new Date()
  //         ).length / limit
  //       )
  //     : 0;
  const router = useRouter();
  const currentPage = parseInt(router.query.page) || 1;
  const pageSize = parseInt(router.query.pageSize) || 2;
  const fetchData = async (page = currentPage, size = pageSize) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/eventList/?page=${page}&pageSize=${size}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const responseData = await response.json();

      if (!response.ok) {
        handleFrontendResponseObject(responseData);
      }
      if (response.ok) {
        console.log("response data: ", responseData);
        setPagination(responseData.pagination);
        setEvents(responseData.events);
        setCounts(responseData.counts);
        if (responseData.allEvents) {
          localStorage.setItem(
            "events",
            JSON.stringify(responseData.allEvents)
          );
        }
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
      n: counts.total,
      Icon: <ChartColumn />,
      iconColor: "text-blue-500",
    },
    {
      status: "pending",
      n: counts.pending,
      Icon: <Clock4 />,
      iconColor: "text-red-400",
    },
    {
      status: "completed",
      n: counts.completed,
      Icon: <CircleCheckBig />,
      iconColor: "text-green-400",
    },
  ];
  useEffect(() => {
    // const url = new URL(window.location);
    // console.log("page: ", url.searchParams.get("page"));
    const allCookies = document.cookie;
    updateCookies(allCookies);
    const handleLocalStorage = () => {
      console.log("pagination: ", pagination);
      const stored = localStorage.getItem("events");
      if (stored && stored !== "undefined" && stored !== "null") {
        try {
          const localData = JSON.parse(localStorage.getItem("events"));
          if (localData.length > 0) {
            const now = new Date();
            const pendingEvents = localData.filter((event) => {
              if (!event.start) return false;
              const eventDateStr = event.start.dateTime || event.start.date;
              if (!eventDateStr) return false;
              const eventDate = new Date(eventDateStr);
              return eventDate > now;
            });
            pendingEvents.sort((a, b) => {
              const dateA = new Date(a.start?.dateTime || a.start?.date || 0);
              const dateB = new Date(b.start?.dateTime || b.start?.date || 0);
              return dateB - dateA;
            });
            const totalEvents = pendingEvents.length;
            const start = (currentPage - 1) * pagination.pageSize;
            const end = start + pagination.pageSize;
            const paginatedEvents = pendingEvents.slice(start, end);
            const totalPages = Math.ceil(
              pendingEvents.length / pagination.pageSize
            );
            setEvents(paginatedEvents);
            setPagination({
              currentPage,
              totalPages,
              totalEvents,
              pageSize,
            });

            // Calculate counts from all local data
            const completedEvents = localData.filter((event) => {
              if (!event.start) return false;
              const eventDateStr = event.start.dateTime || event.start.date;
              if (!eventDateStr) return false;
              const eventDate = new Date(eventDateStr);
              return eventDate <= now;
            });

            setCounts({
              total: localData.length,
              pending: pendingEvents.length,
              completed: completedEvents.length,
            });

            setIsLoading(false);
            return true;
          }
        } catch (error) {
          console.error("Error parsing localStorage data:", error);
        }
      }
      return false;
    };
    if (!handleLocalStorage()) {
      fetchData(currentPage, pageSize);
    }
  }, [currentPage, pageSize]);

  if (isLoading) {
    return <div>data loading ....</div>;
  }
  if (error) {
    return <div>error loading data</div>;
  }
  return (
    <div className="grid text-md mx-8  sm:mx-36  ">
      <Dialog open={open} onOpenChange={setOpen}>
        <DashboardHeader fetchData={fetchData} />
        <StatusBar items={statusBarItems} />
        <div className="grid mx-2 mt-2 border rounded-md ">
          <div className="grid ">
            {events &&
              (counts.pending > 0 ? (
                <ReminderHeader n={events ? counts.pending : 0} />
              ) : (
                ""
              ))}
            {events &&
              (counts.pending > 0 ? (
                events
                  .map((event, i) => {
                    return <Event event={event} key={i} fetchData={fetchData}/>;
                  })
              ) : (
                <EmptyEvent />
              ))}
          </div>
        </div>
        <CreateModal  open={open} onOpenChange={setOpen} fetchData={fetchData}/>
      </Dialog>
      {pagination.totalPages > 1 && (
        <div className="md:fixed left-48 right-48 bottom-22  mx-auto ">
          {/* <PaginationComponent paginationProps={{totalPages, page,setPage} } /> */}
          <PaginationWithLinks
            pageSize={pagination.pageSize}
            totalCount={pagination.totalEvents}
            page={pagination.currentPage}
            //   pageSizeSelectOptions={{
            //     pageSizeOptions: [2, 5, 10, 20],
            //     pageSizeSearchParam: "pageSize",
            //   }
            // }
          />
        </div>
      )}
    </div>
  );
}
