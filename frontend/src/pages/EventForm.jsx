import React, { useState, useEffect } from "react";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import API from "../lib/api";

const eventSchema = z.object({
  title: z.string().min(2, "Title is required"),
  date: z.string().min(1, "Date & time are required"),
  location: z.string().min(2, "Location is required"),
  description: z.string().optional(),
});

export default function EventForm() {
  const [loading, setLoading] = useState(false);
  const [eventsCount, setEventsCount] = useState(0);

  const form = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      date: "",
      location: "",
      description: "",
    },
  });

  const fetchEventsCount = async () => {
    try {
      const { data } = await API.get("/events");
      setEventsCount(data.events?.length || 0);
    } catch (err) {
      console.log("Failed to fetch events count", err);
    }
  };

  useEffect(() => {
    fetchEventsCount();
  }, []);

  async function onSubmit(values) {
    setLoading(true);
    try {
      await API.post(
        "/events",
        {
          title: values.title,
          date: new Date(values.date),
          location: values.location,
          description: values.description,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      toast.success("Event created successfully!");
      form.reset();
      fetchEventsCount();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create event.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto mt-12 p-4 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center bg-gradient-to-r from-neutral-100 to-neutral-200 rounded-lg p-6 shadow-md">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Total Events: {eventsCount}
          </h2>
          <p className="text-gray-600 mt-1">
            You can view or manage your events.
          </p>
        </div>
        <Link to="/">
          <Button variant="secondary" className="mt-4 md:mt-0">
            Go to Home
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="font-bold text-lg text-neutral-800 mb-6">
          Create New Event
        </h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <LabelInputContainer>
                  <Label htmlFor="title">Event Title *</Label>
                  <Input id="title" placeholder="React Workshop" {...field} />
                  <FormMessage />
                </LabelInputContainer>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <LabelInputContainer>
                  <Label htmlFor="date">Date & Time *</Label>
                  <Input
                    id="date"
                    type="datetime-local"
                    {...field}
                    className="cursor-pointer"
                  />
                  <FormMessage />
                </LabelInputContainer>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <LabelInputContainer>
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    placeholder="Zoom / Office / Venue"
                    {...field}
                  />
                  <FormMessage />
                </LabelInputContainer>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <LabelInputContainer>
                  <Label htmlFor="description">Description (optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Brief event details..."
                    rows={3}
                    {...field}
                  />
                  <FormMessage />
                </LabelInputContainer>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-gradient-to-br from-black to-neutral-600 text-white"
            >
              {loading ? "Creating..." : "Add Event"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

const LabelInputContainer = ({ children, className }) => (
  <div className={cn("flex flex-col space-y-2 w-full", className)}>
    {children}
  </div>
);
