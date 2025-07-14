import React from "react";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function page() {
  return (
    <div className="justify-center w-full flex text-center pt-10 flex-col items-center">
      <h1 className="text-lg font-bold">Google Calender</h1>
      <Link href={"/createEvent"}>
        <Button>create event</Button>
      </Link>
    </div>
  );
}
