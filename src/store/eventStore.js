//store/eventStore.js
import handleFrontendResponseObject from "@/utils/handleFrontendResponseObject";
import { se } from "date-fns/locale";
import { ChartColumn, Clock4, CircleCheckBig } from "lucide-react";

import { create } from "zustand";

const filterPendingEvents = (events) => {
  const now = new Date();
  return events.filter((event) => {
    if (!event.start) return false;
    const eventDateStr = event.start.dateTime || event.start.date;
    if (!eventDateStr) return false;
    const eventDate = new Date(eventDateStr);
    return eventDate > now;
  });
};
const filterCompletedEvents = (events) => {
  const now = new Date();
  return events.filter((event) => {
    if (!event.start) return false;
    const eventDateStr = event.start.dateTime || event.start.date;
    if (!eventDateStr) return false;
    const eventDate = new Date(eventDateStr);
    return eventDate <= now;
  });
};

const sortEvents = (allEvents) => {
  return allEvents.sort((a, b) => {
    const dateA = new Date(a.start?.dateTime || a.start?.date || 0);
    const dateB = new Date(b.start?.dateTime || b.start?.date || 0);
    return dateB - dateA;
  });
};
const calculateCounts = (allEvents) => {
  const pendingEvents = filterPendingEvents(allEvents);
  const completedEvents = filterCompletedEvents(allEvents);
  return {
    total: allEvents.length,
    pending: pendingEvents.length,
    completed: completedEvents.length,
  };
};

const paginateEvents = (allEvents, page, pageSize) => {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return allEvents.slice(start, end);
};
export const useEventStore = create((set, get) => ({
  //state

  isLoading: true,
  error: false,
  events: [],
  counts: { pending: 0, completed: 0, total: 0 },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalEvents: 0,
    pageSize: 2,
  },
  isCreateModalOpen:false,
  isOpenEditModal:false,
  isOpenDeleteModal:false,
  //actions
  setIsLoading: (val) => set({ isLoading: val }),
  setError: (val) => set({ error: val }),
  setEvents: (events) => set({ events }),
  setCounts: (counts) => set({ counts }),
  setPagination: (pagination) => set({ pagination }),
  setIsCreateModalOpen: (isOpen) => set({ isCreateModalOpen: isOpen }),
  setIsOpenEditModal: (isOpen) => set({ isOpenEditModal: isOpen }),
  setIsOpenDeleteModal:(isOpen)=>set({ isOpenDeleteModal: isOpen }),
  // Force refresh from API, bypassing localStorage
  refreshEvents: async (currentPage, pageSize) => {

    try {
      const response = await fetch(
        `/api/eventList/?page=${currentPage}&pageSize=${pageSize}`,
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
        // console.log("response data: ", responseData);
        set({
          pagination: responseData.pagination,
          events: responseData.events,
          counts: responseData.counts,
          isLoading: false,
        });
        if (responseData.allEvents) {
          localStorage.setItem(
            "events",
            JSON.stringify(responseData.allEvents)
          );
        }

      }
    } catch (error) {
      console.log("error fetching data: ", error);
      set({ error: true });
    }
  },
  forceRefreshEvents: async (currentPage, pageSize) => {
    set({ isLoading: true });
    await get().refreshEvents(currentPage, pageSize);
    set({ isLoading: false });
  },
  setEventsAndRecalculate: (allEvents, currentPage, pageSize) => {
    let pendingEvents = filterPendingEvents(allEvents);
    // let completedEvents = filterCompletedEvents(allEvents);
    pendingEvents.sort((a, b) => {
      const dateA = new Date(a.start?.dateTime || a.start?.date || 0);
      const dateB = new Date(b.start?.dateTime || b.start?.date || 0);
      return dateB - dateA;
    });
    let calcualatedCounts = calculateCounts(allEvents);
    let paginatedEvents = paginateEvents(pendingEvents, currentPage, pageSize);
    const totalPages = Math.ceil(pendingEvents.length / pageSize);
    // Adjust page if it's now out of bounds
    let adjustedPage = currentPage;
    if (currentPage > totalPages && totalPages > 0) {
      adjustedPage = totalPages;
    } else if (totalPages === 0) {
      adjustedPage = 1;
    }
    set({ events: paginatedEvents });
    set({
      pagination: {
        currentPage,
        totalPages,
        totalEvents: pendingEvents.length,
        pageSize,
      },
    });
    set({
      counts: calcualatedCounts,
    });
  },

  loadEvents: (currentPage, pageSize) => {
    //check local storage
    if (!get().loadFromLocalStorage(currentPage, pageSize)) {
      //load from api if not found
      refreshEvents(currentPage, pageSize);
    }
  },
  loadFromLocalStorage: (currentPage, pageSize) => {
    // const { pagination } = get();
    const stored = localStorage.getItem("events");
    if (stored && stored !== "undefined" && stored !== "null") {
      try {
        const localData = JSON.parse(localStorage.getItem("events"));
        if (localData.length > 0) {
          get().setEventsAndRecalculate(localData, currentPage, pageSize);
          set({ isLoading: false });
          return true;
        }
      } catch (error) {
        console.error("Error parsing localStorage data:", error);
      }
    }
    return false;
  },
  getStatusBarItems: () => {
    const { counts } = get();
    return [
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
    ];
  },
   updateCookies: function (allCookies) {
      document.cookie = allCookies;
    },
}));
