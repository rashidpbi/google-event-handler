import { useEventStore } from "@/store/eventStore"
import React from 'react'
import { PaginationWithLinks } from "./pagination-with-links"

export default function Pagination() {
    const {pagination} = useEventStore()
  return (
    <div>
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
  )
}
