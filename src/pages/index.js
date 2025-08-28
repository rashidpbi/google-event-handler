import React, { useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "@/context/authContext";
import { ChartColumn, Clock4, CircleCheckBig } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import CreateModal from "@/components/custom/CreateModal";
import Event from "@/components/custom/Event";
import EmptyEvent from "@/components/custom/EmptyEvent";
import ReminderHeader from "@/components/custom/ReminderHeader";
import DashboardHeader from "@/components/custom/DashboardHeader";
import StatusBar from "@/components/custom/StatusBar";
import { PaginationWithLinks } from "@/components/custom/pagination-with-links";
import { useEvents } from "@/hooks/useEvents";
import EventSkeleton from "@/components/custom/EventSkeleton";

export default function page() {
  const { updateCookies } = useContext(AuthContext);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const {
    isLoading,
    setIsLoading,
    error,
    setError,
    counts,
    setCounts,
    events,
    setEvents,
    currentPage,
    pageSize,
    pagination,
    setPagination,
    fetchData,
    handleSync,
    refreshCurrentPage,
  } = useEvents();

  const statusBarItems = useMemo(
    () => [
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
        iconColor: "text-red-600",
      },
      {
        status: "completed",
        n: counts.completed,
        Icon: <CircleCheckBig />,
        iconColor: "text-green-400",
      },
    ],
    [counts]
  );

  useEffect(() => {
    const allCookies = document.cookie;
    updateCookies(allCookies);
    const handleLocalStorage = () => {
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
  if (error) {
    return <div>error loading data</div>;
  }
  return (
    <div className="grid text-md mx-8  sm:mx-36  ">
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <div>
          <DashboardHeader fetchData={handleSync} />
          <StatusBar items={statusBarItems} />
        </div>
        {isLoading && <EventSkeleton />}
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
              <EmptyEvent onCreateClick={() => setIsCreateModalOpen(true)} />
            ))}
        </div>
        <CreateModal
          onSuccess={() => {
            setIsCreateModalOpen(false);
            refreshCurrentPage();
          }}
        />
      </Dialog>
      {pagination.totalPages > 1 && (
        <div className="md:fixed left-48 right-48 bottom-22  mx-auto ">
          <PaginationWithLinks
            pageSize={pagination.pageSize}
            totalCount={pagination.totalEvents}
            page={pagination.currentPage}
          />
        </div>
      )}
    </div>
  );
}
