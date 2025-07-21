import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DatetimePicker } from "@/components/ui/datetime-picker";
import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
  //   FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
const formSchema = z.object({
  summary: z.string().min(1),
  location: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  start: z.coerce.date(),
  end: z.coerce.date(),
});
export async function getServerSideProps({ req }) {
  const accessToken = req.cookies.google_access_token;

  if (!accessToken) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: {
      token: accessToken,
    },
  };
}
export default function Page({ token }) {
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
      body: JSON.stringify({ values, token }),
    });
    if(response.ok){
      const results = await response.json();
      let currEvents = JSON.parse(localStorage.getItem("events"))
      // console.log("currEvents",currEvents)
      // console.log("Array.isArray(currEvents))",Array.isArray(currEvents))
      currEvents.push(results.newEvent)
      localStorage.setItem("events",JSON.stringify(currEvents))
    }
   
  };
  return (
    <div className="justify-center w-full flex text-center pt-10 flex-col items-center">
      <h4>event creation form</h4>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 max-w-3xl mx-auto py-10"
        >
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-6">
              <FormField
                control={form.control}
                name="summary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>event title</FormLabel>
                    <FormControl>
                      <Input placeholder="" type="" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="col-span-6">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>location</FormLabel>
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
                <FormLabel>event description</FormLabel>
                <FormControl>
                  <Input placeholder="" type="" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-6">
              <FormField
                control={form.control}
                name="start"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>start time</FormLabel>
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

            <div className="col-span-6">
              <FormField
                control={form.control}
                name="end"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>end time</FormLabel>
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
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}
