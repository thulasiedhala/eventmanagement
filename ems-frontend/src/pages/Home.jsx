import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Event Management System</h1>
          <p className="hero-subtitle">
            Streamline your event planning, registration, and management all in one powerful platform.
          </p>
          <div className="hero-actions">
            <Link to="/events" className="btn btn-primary glow">Browse Events</Link>
            <Link to="/register" className="btn btn-secondary">Get Started</Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">Why Choose Our Platform</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📅</div>
            <h3 className="feature-title">Easy Event Creation</h3>
            <p className="feature-description">
              Create and manage events with intuitive tools. Set schedules, venues, and capacity limits effortlessly.
            </p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🎫</div>
            <h3 className="feature-title">Seamless Registration</h3>
            <p className="feature-description">
              Attendees can register instantly with QR code tickets and real-time confirmation.
            </p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3 className="feature-title">Analytics & Insights</h3>
            <p className="feature-description">
              Track attendance, export data, and gain valuable insights into your event performance.
            </p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3 className="feature-title">Secure & Reliable</h3>
            <p className="feature-description">
              Enterprise-grade security with role-based access control for organizers and admins.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Transform Your Events?</h2>
          <p className="cta-description">
            Join hundreds of organizers who trust our platform for their event management needs.
          </p>
          <Link to="/login" className="btn btn-primary glow">Start Now</Link>
        </div>
      </section>
    </div>
  );
}
