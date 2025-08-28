import React from "react";
import ShowStatus from "./ShowStatus";

export default function StatusBar({ items }) {
  return (
    <div className="p-2">
      <div className="flex  justify-left  gap-1">
        {items.map((item, i) => (
          <ShowStatus
            key={i}
            status={item.status}
            n={item.n}
            Icon={item.Icon}
            iconColor={item.iconColor}
          />
        ))}
      </div>
    </div>
  );
}
