import React, { useEffect } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { PaginationWithLinks } from "./pagination-with-links";

export default function PaginationComponent({ paginationProps }) {


  const {totalPages,page,setPage}= paginationProps
  return (
    <div className=" ">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            />
          </PaginationItem>
          {Array.from({ length: totalPages }, (_, i) => (
            <PaginationItem key={i}>
              <PaginationLink
                href="#"
                onClick={() => setPage(i + 1)}
                // isActive={page === i + 1}
                 isActive={page === i + 1}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      {/* <PaginationWithLinks  /> */}
    </div>
  );
}
