import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { fetchEvents } from '../api/api';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [err, setErr] = useState('');

  useEffect(() => {
    fetchEvents().then(setEvents).catch(e => setErr(e.message || 'Failed to load'));
  }, []);

  return (
    <div className="page-container">
      {/* Dashboard Header */}
      <div className="page-header">
        <div className="page-header-content">
          <h1 className="page-title">Organizer Dashboard</h1>
          <p className="page-description">Manage your events and view analytics</p>
        </div>
        <div className="page-header-actions">
          <Link to="/organizer/new" className="btn btn-primary glow">+ Create Event</Link>
        </div>
      </div>

      {err && <div className="alert-error">{err}</div>}

      {/* Stats Overview */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-value">{events.length}</div>
            <div className="stat-label">Total Events</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-value">{events.filter(e => e.published).length}</div>
            <div className="stat-label">Published</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <div className="stat-value">{events.filter(e => !e.published).length}</div>
            <div className="stat-label">Drafts</div>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="section-header">
        <h2>Your Events</h2>
      </div>
      
      {events.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🎯</div>
          <h3>No events yet</h3>
          <p>Create your first event to start managing registrations</p>
          <Link to="/organizer/new" className="btn btn-primary">Create Event</Link>
        </div>
      ) : (
        <div className="dashboard-grid">
          {events.map(ev => (
            <div className="dashboard-card" key={ev.id}>
              <div className="dashboard-card-header">
                <h3 className="dashboard-card-title">{ev.title}</h3>
                <span className={`status-badge ${ev.published ? 'status-published' : 'status-draft'}`}>
                  {ev.published ? 'Published' : 'Draft'}
                </span>
              </div>
              <div className="dashboard-card-body">
                {ev.venue && <div className="dashboard-info">📍 {ev.venue}</div>}
                {ev.startTime && (
                  <div className="dashboard-info">🕒 {new Date(ev.startTime).toLocaleDateString()}</div>
                )}
              </div>
              <div className="dashboard-card-actions">
                <button className="btn btn-small">View Attendees</button>
                <button className="btn btn-small">Export Data</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
