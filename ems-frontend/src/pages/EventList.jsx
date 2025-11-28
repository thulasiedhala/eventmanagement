import React, { useEffect, useState } from 'react';
import { fetchPublishedEvents, fetchOrganizerEvents } from '../api/events';
import EventCard from '../components/EventCard';
import { useAuth } from '../auth/AuthProvider';
import { useLocation } from 'react-router-dom';

export default function EventList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth?.() || {};
  const location = useLocation();

  useEffect(() => {
    setLoading(true);

    const loader = async () => {
      try {
        let data;
        if (user && (user.roles?.includes('ORGANIZER') || user.roles?.includes('ADMIN'))) {
          data = await fetchOrganizerEvents();
        } else {
          data = await fetchPublishedEvents();
        }
        const payload = data?.data ?? data;
        setEvents(payload || []);
      } catch (err) {
        console.error('Error loading events', err);
        alert('Could not load events: ' + (err?.response?.data || err?.message));
      } finally {
        setLoading(false);
      }
    };

    loader();
  }, [user, location.search]); // <-- re-fetch when query string changes

  function handleDeleted(id) {
    setEvents(prev => prev.filter(e => e.id !== id));
  }

  if (loading) return (
    <div className="loading-state">
      <div className="spinner"></div>
      <p>Loading events…</p>
    </div>
  );
  
  if (!events.length) return (
    <div className="empty-state">
      <div className="empty-icon">📅</div>
      <h3>No events yet</h3>
      <p>Create your first event to get started</p>
    </div>
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-content">
          <h1 className="page-title">My Events</h1>
          <p className="page-description">Manage your events and registrations</p>
        </div>
      </div>
      <div className="events-grid">
        {events.map(e => <EventCard key={e.id} event={e} onDeleted={handleDeleted} />)}
      </div>
    </div>
  );
}
