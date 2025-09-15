//components/custom/StatusBar.jsx
import React from "react";
import ShowStatus from "./ShowStatus";
import CreateModal from "./CreateModal";
import { useEventStore } from "@/store/eventStore";

export default function StatusBar() {
  const { getStatusBarItems } = useEventStore();
  const items = getStatusBarItems();
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
      <CreateModal />
    </div>
  );
}
