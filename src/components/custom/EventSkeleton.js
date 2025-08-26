import React from "react";

export default function EventSkeleton() {
  return (
    <div className="animate-pulse p-4 border rounded-md mb-2 mt-20">
      <div className="h-8 bg-gray-300 rounded w-3/4 mb-2"></div>
      <div className="h-8 bg-gray-300 rounded w-1/2"></div>
    </div>
  );
}
