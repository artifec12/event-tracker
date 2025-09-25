import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "@/lib/api";
import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Trash2,
  Share2,
  Calendar,
  MapPin,
  SortAsc,
  SortDesc,
  NotebookText,
  Plus,
} from "lucide-react";

export default function Dashboard() {
  const [deleteTarget, setDeleteTarget] = useState([]);
  const [openAlert, setOpenAlert] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selected, setSelected] = useState([]);

  const fetchEventsData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const { data } = await API.get("/events", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(data.events || []);
    } catch (error) {
      toast.error("Failed to load events.", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventsData();
  }, []);

  const filteredEvents = events.filter((event) => {
    const now = new Date();
    const eventDate = new Date(event.date);

    if (filter === "upcoming") return eventDate >= now;
    if (filter === "past") return eventDate < now;
    return true;
  });

  const sortedEvents = [...filteredEvents].sort((a, b) => {
    return sortOrder === "asc"
      ? new Date(a.date) - new Date(b.date)
      : new Date(b.date) - new Date(a.date);
  });

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const deleteEvents = async (ids) => {
    try {
      const token = localStorage.getItem("token");
      for (let id of ids) {
        await API.delete(`/events/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      toast.success("Event(s) deleted.");
      fetchEventsData();
      setSelected([]);
    } catch (err) {
      toast.error("Failed to delete event(s).", err.message);
    }
  };
  // const bulkShareEvents = async () => {
  //   if (selected.length === 0) return;

  //   try {
  //     const token = localStorage.getItem("token");
  //     const { data } = await API.post(
  //       "/events/bulk-share",
  //       { eventIds: selected },
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     );

  //     if (data?.shareLinks?.length > 0) {
  //       // Construct message for user
  //       const links = data.shareLinks
  //         .map((e) => `${e.title}: ${e.shareUrl}`)
  //         .join("\n");

  //       // Copy all links to clipboard
  //       navigator.clipboard.writeText(links);

  //       toast.success("🔗 Share links copied!", {
  //         description: `You can now share ${data.shareLinks.length} event(s).`,
  //       });
  //     } else {
  //       toast.error("No share links generated.");
  //     }
  //   } catch (err) {
  //     toast.error("Failed to generate share links.", {
  //       description: err.response?.data?.message || err.message,
  //     });
  //   }
  // };

  const shareEvent = (event) => {
    const shareLink = `${window.location.origin}/share/${event.shareToken}`;
    navigator.clipboard.writeText(shareLink);
    toast.success("Share link copied to clipboard!");
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-7xl mx-auto sm:p-6 py-10 px-3 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Track Your Events
          </h1>
          <p className="text-gray-500 text-sm">
            Manage, filter, and share your events easily
          </p>
        </div>
        <Link to="/addEvent">
          <Button className="flex items-center gap-2 cursor-pointer">
            <Plus size={16} /> Add Event
          </Button>
        </Link>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex gap-3">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
            className="cursor-pointer"
          >
            All
          </Button>
          <Button
            variant={filter === "upcoming" ? "default" : "outline"}
            onClick={() => setFilter("upcoming")}
            className="cursor-pointer"
          >
            Upcoming
          </Button>
          <Button
            variant={filter === "past" ? "default" : "outline"}
            onClick={() => setFilter("past")}
            className="cursor-pointer"
          >
            Past
          </Button>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSortOrder("asc")}
            className="cursor-pointer"
          >
            <SortAsc />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSortOrder("desc")}
            className="cursor-pointer"
          >
            <SortDesc />
          </Button>
          {selected.length > 0 && (
            <Button
              variant="destructive"
              className="cursor-pointer"
              onClick={() => {
                setDeleteTarget([...selected]);
                setOpenAlert(true);
              }}
            >
              Delete Selected ({selected.length})
            </Button>
          )}
          {/* {selected.length > 0 && (
            <Button
              variant="secondary"
              className="cursor-pointer"
              onClick={bulkShareEvents}
            >
              <Share2 size={16} className="mr-1" /> Share Selected (
              {selected.length})
            </Button>
          )} */}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 ">
        {sortedEvents.map((event) => (
          <Card
            key={event._id}
            className="flex flex-col justify-between hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex flex-col flex-1">
              <CardHeader className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={selected.includes(event._id)}
                    onCheckedChange={() => toggleSelect(event._id)}
                  />
                  <CardTitle className="text-lg font-semibold">
                    {event.title}
                  </CardTitle>
                </div>
              </CardHeader>

              <CardContent className="space-y-3 text-sm flex-1">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar size={16} />
                  <span className="truncate">
                    {format(new Date(event.date), "PPpp")}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin size={16} />
                  <span className="truncate">{event.location}</span>
                </div>
                {event.description && (
                  <div className="flex items-start gap-2 text-gray-600">
                    <NotebookText size={16} />
                    <p className="line-clamp-3">{event.description}</p>
                  </div>
                )}
              </CardContent>
            </div>
            <div className="flex  gap-3 mx-4">
              <Button
                size="sm"
                variant="destructive"
                className="flex-1 cursor-pointer"
                onClick={() => {
                  setDeleteTarget([event._id]);
                  setOpenAlert(true);
                }}
              >
                <Trash2 size={16} className="mr-1" /> Delete
              </Button>

              <Button
                size="sm"
                variant="secondary"
                className="flex-1 cursor-pointer"
                onClick={() => shareEvent(event)}
              >
                <Share2 size={16} className="mr-1" /> Share
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {sortedEvents.length === 0 && (
        <p className="text-center text-gray-500">No events found.</p>
      )}
      <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {deleteTarget.length} event
              {deleteTarget.length > 1 ? "s" : ""}? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 ">
            <AlertDialogCancel
              className={"cursor-pointer"}
              onClick={() => setOpenAlert(false)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 cursor-pointer"
              onClick={async () => {
                await deleteEvents(deleteTarget);
                setOpenAlert(false);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
