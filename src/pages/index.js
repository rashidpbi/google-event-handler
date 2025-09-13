//pages/index.js
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useCallback } from "react";

import { useEventStore } from "@/store/eventStore";

import CreateModal from "@/components/custom/CreateModal";
import DashboardHeader from "@/components/custom/DashboardHeader";
import StatusBar from "@/components/custom/StatusBar";
import { PaginationWithLinks } from "@/components/custom/pagination-with-links";
import EventSkeleton from "@/components/custom/EventSkeleton";

import EventList from "@/components/custom/EventList";

export default function Page() {
  const router = useRouter();
  const currentPage = parseInt(router.query.page) || 1;
  const pageSize = parseInt(router.query.pageSize) || 2;

  const {
    isLoading,
    error,
    pagination,
    loadEvents,
    getStatusBarItems,
    forceRefreshEvents,
    updateCookies,
    setIsCreateModalOpen,
  } = useEventStore();

  const handleSync = useCallback(() => {
    forceRefreshEvents(currentPage, pageSize);
  }, [forceRefreshEvents, currentPage, pageSize]);

  const refreshCurrentPage = useCallback(async () => {
    console.log("refresh called");

    // First, fetch the updated data
    await forceRefreshEvents(currentPage, pageSize);

    // After fetching, check if current page is now invalid
    const { pagination: updatedPagination } = useEventStore.getState();

    // If we're on a page that no longer exists, redirect to the last valid page
    if (
      currentPage > updatedPagination.totalPages &&
      updatedPagination.totalPages > 0
    ) {
      router.push({
        pathname: "/",
        query: {
          page: updatedPagination.totalPages,
          pageSize: pageSize,
        },
      });
    } else if (updatedPagination.totalPages === 0) {
      // If no pages exist at all, go to page 1
      router.push({
        pathname: "/",
        query: {
          page: 1,
          pageSize: pageSize,
        },
      });
    }
  }, [forceRefreshEvents, currentPage, pageSize, router]);
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
        <DashboardHeader handleSync={handleSync} />
        <StatusBar items={getStatusBarItems()} />
      </div>

      {isLoading && <EventSkeleton />}
      <EventList
        onCreateClick={() => setIsCreateModalOpen(true)}
        refreshCurrentPage={refreshCurrentPage}
      />
      <CreateModal
        onSuccess={() => {
          setIsCreateModalOpen(false);
          refreshCurrentPage();
        }}
      />
      {pagination.totalPages > 1 && (
        <div className="md:fixed left-48 right-48 bottom-22  mx-auto">
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
