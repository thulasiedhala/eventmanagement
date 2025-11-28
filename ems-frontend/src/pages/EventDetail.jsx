import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchEvent, listSessions, createSession, updateSession, deleteSession } from '../api/events';
import SessionForm from '../components/SessionForm';
import { useAuth } from '../auth/AuthProvider';
import { formatTimeRange, formatDateTime } from '../utils/formatDateTime';

export default function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const { user } = useAuth?.() || {};

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const e = await fetchEvent(id);
        if (!mounted) return;
        setEvent(e);

        // sessions may be in a separate endpoint or inside event; try separate then fallback
        try {
          const s = await listSessions(id);
          if (!mounted) return;
          setSessions(s || []);
        } catch (sessErr) {
          console.warn('listSessions failed, falling back to event.sessions', sessErr);
          if (e?.sessions) setSessions(e.sessions);
        }
      } catch (err) {
        console.error('Failed loading event detail', err);
      } finally {
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  async function handleCreate(sd) {
    try {
      const payload = {
        ...sd,
        startTime: sd.startTime?.length === 16 ? sd.startTime + ':00' : sd.startTime,
        endTime: sd.endTime?.length === 16 ? sd.endTime + ':00' : sd.endTime
      };
      const created = await createSession(id, payload);
      setSessions(prev => [...prev, created]);
      setShowCreate(false);
    } catch (err) {
      console.error('create session failed', err);
      alert('Failed to create session');
    }
  }

  async function handleUpdate(sessionId, sd) {
    try {
      const payload = {
        ...sd,
        startTime: sd.startTime?.length === 16 ? sd.startTime + ':00' : sd.startTime,
        endTime: sd.endTime?.length === 16 ? sd.endTime + ':00' : sd.endTime
      };
      const updated = await updateSession(id, sessionId, payload);
      setSessions(prev => prev.map(s => s.id === updated.id ? updated : s));
      setEditing(null);
    } catch (err) {
      console.error(err);
      alert('Failed to update session');
    }
  }

  async function handleDelete(sessionId) {
    if (!window.confirm('Delete this session?')) return;
    try {
      await deleteSession(id, sessionId);
      setSessions(prev => prev.filter(s => s.id !== sessionId));
    } catch (err) {
      console.error(err);
      alert('Failed to delete session');
    }
  }

  if (loading) return (
    <div className="loading-state">
      <div className="spinner"></div>
      <p>Loading event details...</p>
    </div>
  );
  
  if (!event) return (
    <div className="empty-state">
      <div className="empty-icon">⚠️</div>
      <h3>Event not found</h3>
      <Link to="/events" className="btn btn-primary">Back to Events</Link>
    </div>
  );

  const title = event.title || event.name;
  const isOrganizer = user && (user.roles?.includes('ORGANIZER') || user.roles?.includes('ROLE_ORGANIZER') || user.roles?.includes('ADMIN') || user.roles?.includes('ROLE_ADMIN'));
  const start = event.startTime ?? event.startAt ?? null;
  const end = event.endTime ?? event.endAt ?? null;

  return (
    <div className="page-container">
      {/* Event Header */}
      <div className="event-detail-header">
        <Link to="/events" className="btn btn-link">← Back to Events</Link>
        
        <div className="event-detail-hero">
          <h1 className="event-detail-title">{title}</h1>
          
          <div className="event-detail-meta">
            {event.location && (
              <div className="event-meta-item">
                <span className="event-meta-icon">📍</span>
                <span>{event.location}</span>
              </div>
            )}
            
            {(start || end) && (
              <div className="event-meta-item">
                <span className="event-meta-icon">🕒</span>
                <span>{formatTimeRange(start, end)}</span>
              </div>
            )}
            
            {event.capacity && (
              <div className="event-meta-item">
                <span className="event-meta-icon">👥</span>
                <span>Capacity: {event.capacity}</span>
              </div>
            )}
          </div>

          {event.description && (
            <div className="event-detail-description">{event.description}</div>
          )}
        </div>
      </div>

      {/* Sessions Section */}
      <div className="event-detail-section">
        <div className="section-header">
          <h2>Schedule & Sessions</h2>
          {isOrganizer && !showCreate && (
            <button onClick={() => setShowCreate(true)} className="btn btn-primary btn-small">
              + Add Session
            </button>
          )}
        </div>

        {sessions.length === 0 && !showCreate && (
          <div className="empty-state-small">
            <p>No sessions scheduled yet</p>
          </div>
        )}

        <div className="sessions-grid">
          {sessions.map(s => {
            const sStart = s.startTime ?? s.startAt ?? null;
            const sEnd = s.endTime ?? s.endAt ?? null;
            return (
              <div key={s.id ?? `${s.title}-${sStart}`} className="session-card">
                <div className="session-card-header">
                  <div>
                    <h3 className="session-card-title">{s.title}</h3>
                    {s.speaker && (
                      <div className="session-speaker">🎤 {s.speaker}</div>
                    )}
                  </div>
                  {isOrganizer && (
                    <div className="session-actions">
                      <button onClick={() => setEditing(s)} className="btn-icon" title="Edit">
                        ✏️
                      </button>
                      <button onClick={() => handleDelete(s.id)} className="btn-icon btn-danger" title="Delete">
                        🗑️
                      </button>
                    </div>
                  )}
                </div>

                <div className="session-card-body">
                  <div className="session-info">
                    <span className="session-info-icon">🕒</span>
                    <span>{formatTimeRange(sStart, sEnd)}</span>
                  </div>
                  {s.location && (
                    <div className="session-info">
                      <span className="session-info-icon">📍</span>
                      <span>{s.location}</span>
                    </div>
                  )}
                  {s.description && (
                    <p className="session-description">{s.description}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Session Form for Create/Edit */}
        {editing && (
          <div className="form-modal">
            <div className="form-modal-content">
              <h3>Edit Session</h3>
              <SessionForm 
                initial={{
                  ...editing,
                  startTime: editing.startTime ? editing.startTime.slice(0,16) : (editing.startAt ? editing.startAt.slice(0,16) : ''),
                  endTime: editing.endTime ? editing.endTime.slice(0,16) : (editing.endAt ? editing.endAt.slice(0,16) : '')
                }} 
                onCancel={() => setEditing(null)} 
                onSave={(data) => handleUpdate(editing.id, data)} 
              />
            </div>
          </div>
        )}

        {showCreate && (
          <div className="form-modal">
            <div className="form-modal-content">
              <h3>Add New Session</h3>
              <SessionForm onCancel={() => setShowCreate(false)} onSave={handleCreate} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
