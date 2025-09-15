//pages/index.js
import React, { useEffect } from "react";

import { useEventStore } from "@/store/eventStore";

import DashboardHeader from "@/components/custom/DashboardHeader";
import StatusBar from "@/components/custom/StatusBar";
import EventSkeleton from "@/components/custom/EventSkeleton";

import EventList from "@/components/custom/EventList";
import { useRouter } from "next/router";
import Pagination from "@/components/custom/Pagination";

export default function Page() {
  const router = useRouter();
  const currentPage = parseInt(router.query.page) || 1;
  const pageSize = parseInt(router.query.pageSize) || 2;

  const { isLoading, error, loadEvents, updateCookies } = useEventStore();

  useEffect(() => {
    const allCookies = document.cookie;
    updateCookies(allCookies);
    loadEvents(currentPage, pageSize);
  }, [currentPage, pageSize]);
  if (error) {
    return <div>error loading data</div>;
  }
  return (
    <div className="grid text-md mx-8  sm:mx-36  ">
      <div>
        <DashboardHeader />
        <StatusBar />
      </div>

      {isLoading && <EventSkeleton />}
      <EventList />
      <Pagination />
    </div>
  );
}
