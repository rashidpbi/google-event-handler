import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DatetimePicker } from "@/components/ui/datetime-picker";
import {
  Calendar,
} from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
const formSchema = z.object({
  summary: z.string().min(1),
  location: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  start: z.coerce.date(),
  end: z.coerce.date(),
});
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export default function CreateModal() {
      const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
          summary: "",
          location: "",
          description: "",
          start: new Date(),
          end: new Date(),
        },
      });
      const onSubmit = async (values) => {
        const response = await fetch("http://localhost:3000/api/eventCreation", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ values }),
        });
         const responseData = await response.json();
        if (!response.ok) {
           console.log("respons: ",responseData)
            console.log("respnse not ok");
            console.log("responseData.error: ", responseData.error);
             if (responseData.code === 401 ||
          responseData.error == "invalid_grant" ||
          responseData?.error?.status === "UNAUTHENTICATED" || responseData.error == "No refresh token is set." || responseData.error == "missing access token"
      ) {
            // console.log("invalid ")
            localStorage.setItem("loggedOutDueToTokenIssue", "true");
            window.location.href = "http://localhost:3000/login";
          }
        }
        if (response.ok) {
          let currEvents = JSON.parse(localStorage.getItem("events"));
          // console.log("currEvents",currEvents)
          // console.log("Array.isArray(currEvents))",Array.isArray(currEvents))
          currEvents.push(responseData.data);
          localStorage.setItem("events", JSON.stringify(currEvents));
          window.location.href = "http://localhost:3000";
        }
      };
  return (
     <div className="justify-center w-full flex text-center pt-10 flex-col items-center">
               <>
                 {/* <DialogTrigger asChild>
                   <Button variant="outline">Open Dialog</Button>
                 </DialogTrigger> */}
                 <DialogContent className="sm:max-w-2xl w-full">
                   <DialogHeader>
                     <div className="flex items-center gap-2">
                       <div>
                         <Calendar />
                       </div>
                       <div>
                         <DialogTitle className="font-bold">Create New Task</DialogTitle>
                         <DialogDescription> </DialogDescription>
                       </div>
                     </div>
                    
                   </DialogHeader>
                   <Form {...form}>
                     <form
                       onSubmit={form.handleSubmit(onSubmit)}
                       className="space-y-8 max-w-3xl mx-auto py-10"
                     >
                   
                       
                       <div className="grid grid-cols-12 gap-4">
                         <div className="col-span-12">
                           <FormField
                             control={form.control}
                             name="summary"
                             render={({ field }) => (
                               <FormItem>
                                 <FormLabel className="font-semibold">Task Title</FormLabel>
                                 <FormControl>
                                   <Input placeholder="" type="" {...field} />
                                 </FormControl>
         
                                 <FormMessage />
                               </FormItem>
                             )}
                           />
                         </div>
         
                         <div className="col-span-12">
                           <FormField
                             control={form.control}
                             name="location"
                             render={({ field }) => (
                               <FormItem>
                                 <FormLabel className="font-semibold">Location</FormLabel>
                                 <FormControl>
                                   <Input placeholder="" type="" {...field} />
                                 </FormControl>
         
                                 <FormMessage />
                               </FormItem>
                             )}
                           />
                         </div>
                       </div>
         
                       <FormField
                         control={form.control}
                         name="description"
                         render={({ field }) => (
                           <FormItem>
                             <FormLabel className="font-semibold">Description</FormLabel>
                             <FormControl>
                               <Input placeholder="" type="" {...field} />
                             </FormControl>
         
                             <FormMessage />
                           </FormItem>
                         )}
                       />
         
                       <div className="grid grid-cols-12 gap-8">
                         <div className="col-span-12 sm:col-span-6">
                           <FormField
                             control={form.control}
                             name="start"
                             render={({ field }) => (
                               <FormItem className="flex flex-col">
                                 <FormLabel className="font-semibold">Start Time</FormLabel>
                                 <DatetimePicker
                                   {...field}
                                   format={[
                                     ["months", "days", "years"],
                                     ["hours", "minutes", "am/pm"],
                                   ]}
                                 />
         
                                 <FormMessage />
                               </FormItem>
                             )}
                           />
                         </div>
         
                         <div className="col-span-12 sm:col-span-6">
                           <FormField
                             control={form.control}
                             name="end"
                             render={({ field }) => (
                               <FormItem className="flex flex-col">
                                 <FormLabel className="font-semibold">End Time</FormLabel>
                                 <DatetimePicker
                                   {...field}
                                   format={[
                                     ["months", "days", "years"],
                                     ["hours", "minutes", "am/pm"],
                                   ]}
                                 />
         
                                 <FormMessage />
                               </FormItem>
                             )}
                           />
                         </div>
                       </div>
                       {/* <Button type="submit">Submit</Button> */}
                   <DialogFooter>
                     <Button type="submit" className="cursor-pointer">Create Task</Button>
                     <DialogClose asChild>
                       <Button variant="outline" className="cursor-pointer">Cancel</Button>
                     </DialogClose>
                   </DialogFooter>
                     </form>
                   </Form>
                 </DialogContent>
               </>
        </div>
  )
}
