import React from "react";
import ShowStatus from "./ShowStatus";

export default function StatusBar({ items }) {
  return (
    <div className="p-2">
      <div className="flex flex-col md:flex-row justify-center md:justify-between gap-1">
        {items.map((item) => (
          <ShowStatus
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
