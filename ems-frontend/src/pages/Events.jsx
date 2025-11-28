// src/pages/Events.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchPublishedEvents } from "../api/events";
import EventCard from "../components/EventCard";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await fetchPublishedEvents();
        setEvents(res.data ?? res ?? []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  function handleDeleted(id) {
    setEvents(prev => prev.filter(e => e.id !== id));
  }

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-content">
          <h1 className="page-title">Browse Events</h1>
          <p className="page-description">Discover and register for upcoming events</p>
        </div>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading events…</p>
        </div>
      ) : events.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📅</div>
          <h3>No events available</h3>
          <p>Check back later for new events</p>
        </div>
      ) : (
        <div className="events-grid">
          {events.map((e) => (
            <EventCard key={e.id} event={e} onDeleted={handleDeleted} />
          ))}
        </div>
      )}
    </div>
  );
}
