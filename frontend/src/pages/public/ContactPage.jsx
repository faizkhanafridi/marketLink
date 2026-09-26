import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageCircle,
  User,
  AtSign,
  Tag,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import MapView from '../../components/common/MapView';
import { toast } from 'react-toastify';
import '../../styles/home.css';
import '../../styles/page-hero.css';
import '../../styles/contact.css';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Simulate sending message
    setTimeout(() => {
      toast.success('Message sent successfully. We will get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setSubmitting(false);
    }, 1000);
  };

  const contactItems = [
    {
      icon: MapPin,
      label: 'Visit us',
      value: '123 Market Street, City, State 12345',
    },
    {
      icon: Phone,
      label: 'Call us',
      value: '+1 (555) 123-4567',
      href: 'tel:+15551234567',
    },
    {
      icon: Mail,
      label: 'Email us',
      value: 'hello@marketlink.com',
      href: 'mailto:hello@marketlink.com',
    },
    {
      icon: Clock,
      label: 'Office hours',
      value: 'Mon – Fri · 9:00 AM – 6:00 PM',
    },
  ];

  return (
    <div className="contact-page">
      <Navbar />

      {/* =========================================================
          PAGE HERO
      ========================================================= */}
      <center>

    
      <section className="contact-hero">
        <div className="contact-hero-decoration contact-hero-decoration-one"></div>
        <div className="contact-hero-decoration contact-hero-decoration-two"></div>

        <div className="container">
          <div className="contact-hero-content">
            <span className="contact-page-tag">
              <Sparkles size={13} />
              Get in Touch
            </span>

            <h1 className="contact-page-title">
              Let's start a
              <span> conversation</span>
            </h1>

            <p className="contact-page-subtitle">
              Questions, feedback, partnership ideas — we'd love to hear
              from you. Our team usually replies within one business day.
            </p>
          </div>
        </div>
      </section>
  </center>
      {/* =========================================================
          CONTACT GRID
      ========================================================= */}
      <section className="contact-content-section">
        <div className="container">
          <div className="contact-grid">

            {/* ---------- LEFT: Info ---------- */}
            <aside className="contact-info">
              <span className="contact-eyebrow">Contact Information</span>
              <h2 className="contact-info-title">
                Other ways to reach us
              </h2>
              <p className="contact-info-text">
                Prefer a call or a visit? Here's how to find us outside of
                the form.
              </p>

              <div className="contact-info-list">
                {contactItems.map((item, idx) => {
                  const Icon = item.icon;
                  const Wrapper = item.href ? 'a' : 'div';
                  return (
                    <Wrapper
                      key={idx}
                      href={item.href}
                      className="contact-info-item"
                    >
                      <div className="contact-info-icon">
                        <Icon size={18} strokeWidth={1.8} />
                      </div>
                      <div className="contact-info-body">
                        <span className="contact-info-label">{item.label}</span>
                        <span className="contact-info-value">{item.value}</span>
                      </div>
                    </Wrapper>
                  );
                })}
              </div>

              {/* Response promise card */}
              <div className="contact-promise">
                <div className="contact-promise-icon">
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <strong>Quick response</strong>
                  <span>Most messages answered within 24 hours.</span>
                </div>
              </div>
            </aside>

            {/* ---------- RIGHT: Form ---------- */}
            <div className="contact-form-wrapper">
              <div className="contact-form-header">
                <span className="contact-eyebrow">Send a Message</span>
                <h2 className="contact-form-title">
                  Tell us what's on your mind
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="contact-form">
                <div className="contact-form-row">
                  <div className="contact-form-group">
                    <label className="contact-form-label">
                      <User size={13} />
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      className="contact-input"
                      placeholder="Jane Doe"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="contact-form-group">
                    <label className="contact-form-label">
                      <AtSign size={13} />
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      className="contact-input"
                      placeholder="jane@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="contact-form-group">
                  <label className="contact-form-label">
                    <Tag size={13} />
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    className="contact-input"
                    placeholder="How can we help?"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="contact-form-group">
                  <label className="contact-form-label">
                    <MessageCircle size={13} />
                    Message
                  </label>
                  <textarea
                    name="message"
                    className="contact-input contact-textarea"
                    rows="6"
                    placeholder="Write your message here..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="contact-submit"
                  disabled={submitting}
                >
                  <Send size={15} />
                  {submitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>

          </div>

          {/* =========================================================
              MAP
          ========================================================= */}
          <div className="contact-map">
            <div className="contact-map-header">
              <div>
                <span className="contact-eyebrow">Find Us</span>
                <h3 className="contact-map-title">Our location on the map</h3>
              </div>
              <a
                href="https://www.google.com/maps/search/?api=1&query=40.7128,-74.006"
                target="_blank"
                rel="noreferrer"
                className="contact-map-link"
              >
                <MapPin size={14} />
                Open in Google Maps
              </a>
            </div>

            <div className="contact-map-frame">
              <MapView
                latitude={40.7128}
                longitude={-74.006}
                height="440px"
                zoom={14}
              />
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactPage;