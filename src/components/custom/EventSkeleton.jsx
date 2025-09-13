//src/components/custom/EventSkeleton.jsx
import React from "react";

const EventSkeleton = () => {
  return [...Array(2)].map((_, i) => (
    <div className="animate-pulse p-4 border rounded-md mb-2 mt-20" key={i}>
      <div className="h-8 bg-gray-300 rounded w-3/4 mb-2"></div>
      <div className="h-8 bg-gray-300 rounded w-1/2"></div>
    </div>
  ));
};
EventSkeleton.displayName = "EventSkeleton";
export default React.memo(EventSkeleton);
