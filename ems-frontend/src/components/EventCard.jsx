import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterButton from './RegisterButton';
import AttendeeList from './AttendeeList';
import { AuthContext } from '../auth/AuthProvider';
import { deleteEvent } from '../api/events';
import { formatTimeRange } from '../utils/formatDateTime';

export default function EventCard({ event, onDeleted }) {
  const [showAttendees, setShowAttendees] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const { user } = useContext(AuthContext);
  const nav = useNavigate();

  // role checks
  const isAdmin = user?.roles?.includes('ROLE_ADMIN') || user?.roles?.includes('ADMIN');
  const isOrganizer = user?.roles?.includes('ROLE_ORGANIZER') || user?.roles?.includes('ORGANIZER');
  const canViewAttendees = isAdmin || isOrganizer;
  const canRegister = !(isAdmin || isOrganizer); // only attendees can register

  // allow edit/delete only to admin OR organizer who owns this event.
  const isOwner = isOrganizer && event?.organizer?.email && event.organizer.email === user?.email;
  const canEditOrDelete = isAdmin || isOwner;

  const handleEdit = () => {
    nav(`/events/edit/${event.id}`);
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete event "${event.title}"? This cannot be undone.`)) return;
    try {
      await deleteEvent(event.id);
      alert('Event deleted');
      if (onDeleted) onDeleted(event.id);
    } catch (err) {
      console.error('Delete failed', err);
      alert('Failed to delete event: ' + (err?.response?.data || err?.message || 'Unknown'));
    }
  };

  // backend may use startTime/endTime or startAt/endAt — support both
  const start = event.startTime ?? event.startAt ?? null;
  const end = event.endTime ?? event.endAt ?? null;

  return (
    <div className="event-card">
      <div className="event-card-header">
        <div className="event-card-main">
          <h3 className="event-card-title">{event.title}</h3>
          {event.description && (
            <p className="event-card-description">{event.description}</p>
          )}
        </div>
      </div>

      <div className="event-card-body">
        {event.location && (
          <div className="event-info-item">
            <span className="event-info-icon">📍</span>
            <span className="event-info-text">{event.location}</span>
          </div>
        )}

        {(start || end) && (
          <div className="event-info-item">
            <span className="event-info-icon">🕒</span>
            <span className="event-info-text">{formatTimeRange(start, end)}</span>
          </div>
        )}

        {event.capacity && (
          <div className="event-info-item">
            <span className="event-info-icon">👥</span>
            <span className="event-info-text">Capacity: {event.capacity}</span>
          </div>
        )}
      </div>

      <div className="event-card-actions">
        <button onClick={() => nav(`/events/${event.id}`)} className="btn btn-primary btn-small">
          View Details
        </button>

        {canRegister && (
          <RegisterButton
            eventId={event.id}
            onRegistered={() => setRefreshKey(k => k + 1)}
          />
        )}

        {canViewAttendees && (
          <button
            onClick={() => setShowAttendees(s => !s)}
            className="btn btn-small"
          >
            {showAttendees ? 'Hide' : 'Attendees'}
          </button>
        )}

        {canEditOrDelete && (
          <>
            <button onClick={handleEdit} className="btn btn-small">
              ✏️ Edit
            </button>
            <button onClick={handleDelete} className="btn btn-small btn-danger">
              🗑️ Delete
            </button>
          </>
        )}
      </div>

      {showAttendees && canViewAttendees && (
        <div className="event-card-attendees">
          <AttendeeList key={refreshKey} eventId={event.id} />
        </div>
      )}
    </div>
  );
}
