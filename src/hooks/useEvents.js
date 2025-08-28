import handleFrontendResponseObject from "@/utils/handleFrontendResponseObject";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";

export const useEvents = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [events, setEvents] = useState([]);
  const [counts, setCounts] = useState({
    pending: 0,
    completed: 0,
    total: 0,
  });
  const router = useRouter();
  const currentPage = parseInt(router.query.page) || 1;
  const pageSize = parseInt(router.query.pageSize) || 2;
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalEvents: 0,
    pageSize: 2,
  });

  const fetchData =useCallback(async (
    page = currentPage,
    size = pageSize,
    forceRefresh = false
  ) => {
    if (forceRefresh) {
      setIsLoading(true);
    }
    try {
      const response = await fetch(
        `/api/eventList/?page=${page}&pageSize=${size}`,
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
  },[]) 
  const handleSync =useCallback(() => {
    fetchData(currentPage, pageSize, true);
  },[fetchData,currentPage,pageSize]) 
 
  const refreshCurrentPage =  useCallback(() => {
    fetchData(currentPage, pageSize, false);
  },[fetchData,currentPage,pageSize]) 
  return {
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
  };
};
