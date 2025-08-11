import React, { useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { AuthContext } from "@/context/authContext";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import {
  Calendar,
  Plus,
  Bell,
  ChartColumn,
  Trash2,
  SquarePen,
  Clock4,
  CircleCheckBig,
} from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CreateModal from "@/components/custom/CreateModal";
import EditModal from "@/components/custom/EditModal";
import DeleteModal from "@/components/custom/DeleteModal";

export default function page() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [events, setEvents] = useState(null);
  // console.log("eventts:", events);
  // console.log("Boolean(events):", Boolean(events));
  const { updateCookies } = useContext(AuthContext);
  const { setTheme } = useTheme();
  const getEventCounts = (events = []) => {
    const now = new Date();
    let pending = 0;
    let completed = 0;
    let filteredCount = 0;
    events.forEach((event) => {
      if (!event.start) return;

      const eventDateStr = event.start.dateTime || event.start.date;
      if (!eventDateStr) return;

      const eventDate = new Date(eventDateStr);
      if (eventDate > now) pending++;
      else completed++;
    });
    // events.filter(event => (new Date(event?.start?.dateTime) > new Date()))

    return { pending, completed, total: events.length };
  };

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/eventList", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const responseData = await response.json();
      // console.log("respnse data:", data?.error?.status);
      if (!response.ok) {
        console.log("respons: ", responseData);
        console.log("respnse not ok");
        console.log("responseData.error: ", responseData.error);
        if (
          responseData.code === 401 ||
          responseData.error == "invalid_grant" ||
          responseData?.error?.status === "UNAUTHENTICATED" ||
          responseData.error == "No refresh token is set." ||
          responseData.error == "missing access token"
        ) {
          // console.log("invalid ");
          localStorage.setItem("loggedOutDueToTokenIssue", "true");
          window.location.href = "http://localhost:3000/login";
        }
      }
      if (response.ok) {
        setEvents(responseData.events);
        // console.log("responseData.events: ", responseData.events);
        localStorage.setItem("events", JSON.stringify(responseData.events));
        console.log(responseData.events);
        setIsLoading(false);
      }
    } catch (error) {
      console.log("error fetching data: ", error);
      setError(true);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    const allCookies = document.cookie;
    // console.log("All Cookies:", allCookies);

    updateCookies(allCookies);

    if (localStorage.getItem("events") !== "undefined") {
      // console.log(
      //   'localStorage.getItem("events") : ',
      //   typeof localStorage.getItem("events")
      // );
      // console.log("inside local stoarge");
      const localData = JSON.parse(localStorage.getItem("events"));
      if (localData.length > 0) {
        // console.log("Boolean(localData):", Boolean(localData));
        console.log("localData:", localData);
        // console.log("Array.isArray(localData):", Array.isArray(localData));
        setEvents(localData);
        setIsLoading(false);
        return;
      }
    }
    fetchData();
  }, []);

  if (isLoading) {
    return <div>data loading ....</div>;
  }
  if (error) {
    return <div>error loading data</div>;
  }
  return (
    <div className="grid text-md sm sm:mx-36   ">
      <Dialog>
        <div className="flex place-content-end p-2">
          <DropdownMenu className="bg-amber-700">
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className=" flex flex-col sm:flex-row sm:justify-between">
          <div className="flex flex-col  px-4 items-start  ">
            {/* <CreateModal/> */}
            <div className="flex   ">
              <div className="m-2">
                <Bell className="size-8" />
              </div>
              <div className="font-bold  content-center m-2 text-2xl">
                Reminder Manager
              </div>
            </div>
            <div className="">
              Keep track of your important reminders with scheduling and sync
            </div>
          </div>
          <br></br>
          <div className="flex gap-2">
            <div className="flex cursor-pointer  items-center justify-center m-2">
              <div
                onClick={() => fetchData()}
                className="flex items-center p-2 border rounded-md border-zinc-300 dark:border-white "
              >
                <div>
                  <Calendar />
                </div>
                <div className="m-2">Sync</div>
              </div>
            </div>

            <div className="flex cursor-pointer  items-center justify-center m-2">
              <DialogTrigger asChild>
                <div className="flex items-center  p-2 border rounded-md bg-black dark:bg-white dark:text-black text-white">
                  <div>
                    <Plus />
                  </div>
                  <div className="m-2">Add reminder</div>
                </div>
              </DialogTrigger>
            </div>
          </div>
        </div>
        <div className="   p-2">
          <div className="flex flex-col md:flex-row justify-center md:justify-between gap-1">
            <div className="grid  border  border-zinc-300 p-2  rounded-md">
              <div className="flex ">
                <div className="m-2 text-blue-500">
                  <ChartColumn />
                </div>
                <div className="m-2">Total reminders</div>
              </div>
              <div>{events && events.length}</div>
            </div>
            <div className="grid  border  border-zinc-300 p-2  rounded-md">
              <div className="flex">
                <div className="m-2 text-red-400">
                  <Clock4 />
                </div>
                <div className="m-2">Pending</div>
              </div>
              <div>
                {events && (events ? getEventCounts(events).pending : 0)}
              </div>
            </div>
            <div className="grid  border  border-zinc-300 p-2  rounded-md">
              <div className="flex">
                <div className="m-2 text-green-400">
                  <CircleCheckBig />
                </div>
                <div className="m-2">Completed</div>
              </div>
              <div className="m-2">
                {events && (events ? getEventCounts(events).completed : 0)}
              </div>
            </div>
          </div>
        </div>
        <div className="grid mx-2 mt-2 border rounded-md ">
          <div className="grid ">
            {events &&
              (getEventCounts(events).pending > 0 ? (
                <div className="flex flex-col  text-red-400 break-normal border p-4 bg-red-50">
                  <div className="flex font-bold">
                    <div className="m-2">
                      <Clock4 />
                    </div>
                    <div className="m-2 text-xl">
                      Pending Reminders (
                      {events && (events ? getEventCounts(events).pending : 0)})
                    </div>
                  </div>
                  <div>These reminders need your immediate attention</div>
                </div>
              ) : (
                ""
              ))}
            {events &&
              (getEventCounts(events).pending > 0 ? (
                events
                  .filter(
                    (event) => new Date(event?.start?.dateTime) > new Date()
                  )
                  .map((event, i) => {
                    return (
                      <div key={i} className="border p-4  gap-2 ">
                        <div className="flex  ">
                          <div className="m-1">
                            <Bell />
                          </div>
                          <div className="m-1 font-bold">{event.summary}</div>
                        </div>
                        <div className="m-1">
                          {event.location || "location"}
                        </div>

                        <div className="flex">
                          <div className="m-1">
                            <Calendar />
                          </div>
                          <div className="m-1 text-sm text-zinc-500">
                            Created:
                            {new Date(event.created).toLocaleDateString(
                              "en-IN",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                timeZone: "Asia/Kolkata",
                              }
                            )}
                          </div>
                        </div>
                        <Dialog>
                          <div className="flex  items-center">
                            <DialogTrigger>
                              <div className="flex border gap-2  p-2 my-2 rounded-md cursor-pointer ">
                                <div>
                                  <SquarePen />
                                </div>
                                <div>Edit</div>
                              </div>
                            </DialogTrigger>

                            <Dialog>
                              <DialogTrigger>
                                <div className="flex border gap-2  p-2 my-2  ml-2 rounded-md text-red-400 cursor-pointer ">
                                  <div>
                                    <Trash2 />
                                  </div>
                                  <div>Delete</div>
                                </div>
                              </DialogTrigger>
                              <DeleteModal id={event.id} className="hidden" />
                            </Dialog>

                            <EditModal id={event.id} className="hidden" />
                          </div>
                        </Dialog>
                      </div>
                    );
                  })
              ) : (
                <div className="flex flex-col  p-2 text-center justify-center gap-2">
                  <div className="flex justify-center  ">
                    <div>
                      <Bell className="size-12 text-zinc-300" />
                    </div>
                  </div>
                  <div className="font-bold">No Reminders yet</div>
                  <div className="text-zinc-500">
                    Create a reminder to get started with managing your tasks.
                  </div>
                  <div className="flex justify-center">
                    <DialogTrigger>
                      <div className="flex   items-center justify-center bg-black dark:bg-white rounded-md px-2 ">
                        <div className="dark:text-black text-white">
                          <Plus />
                        </div>
                        <div className="m-2 text-white dark:text-black">
                          Create reminder
                        </div>
                      </div>
                    </DialogTrigger>
                  </div>
                </div>
              ))}
          </div>
        </div>
        <CreateModal />
      </Dialog>
    </div>
  );
}
