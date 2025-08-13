import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import Paginations from "@/components/custom/Paginations";
export default function Page() {


  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
    hi 
    <Paginations/>
    </div>
  );    
}
