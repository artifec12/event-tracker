import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "@/lib/api";
import Loading from "@/components/Loading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, NotebookText } from "lucide-react";
import { format } from "date-fns";

export default function SharedDashboard() {
  const { shareToken } = useParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSharedEvents = async () => {
      try {
        const { data } = await API.get(`/events/share/${shareToken}`);
        setEvents(Array.isArray(data) ? data : [data]);
      } catch (err) {
        setError("Event not found or expired.", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSharedEvents();
  }, [shareToken]);

  if (loading) return <Loading />;

  if (error)
    return <p className="text-center text-red-500 mt-20 text-lg">{error}</p>;

  return (
    <div className="max-w-7xl mx-auto sm:p-6 py-10 px-3 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Shared Events</h1>
          <p className="text-gray-500 text-sm">
            You can view these events, but cannot modify them.
          </p>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {events.map((event) => (
          <Card
            key={event._id}
            className="flex flex-col justify-between hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex flex-col flex-1">
              <CardHeader className="mb-2">
                <CardTitle className="text-lg font-semibold">
                  {event.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-3 text-sm flex-1 text-gray-700">
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>{format(new Date(event.date), "PPpp")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} />
                  <span>{event.location}</span>
                </div>
                {event.description && (
                  <div className="flex items-start gap-2">
                    <NotebookText size={16} />
                    <p>{event.description}</p>
                  </div>
                )}
              </CardContent>
            </div>
          </Card>
        ))}
      </div>

      {events.length === 0 && (
        <p className="text-center text-gray-500">No events available.</p>
      )}
    </div>
  );
}
