import React, { useState } from 'react';
import { motion } from 'framer-motion';
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

  // ==================== ANIMATION VARIANTS ====================
  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: i * 0.1,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  const stagger = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.15 },
    },
  };

  const slideLeft = {
    hidden: { opacity: 0, x: -40 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const slideRight = {
    hidden: { opacity: 0, x: 40 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const itemSlide = {
    hidden: { opacity: 0, x: -20 },
    visible: (i = 0) => ({
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        delay: i * 0.1,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  const floatingDecoration = {
    animate: {
      y: [0, -20, 0],
      x: [0, 10, 0],
      transition: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
    },
  };

  return (
    <div className="contact-page">
      <Navbar />

      {/* =========================================================
          PAGE HERO
      ========================================================= */}
      <center>
        <section className="contact-hero">
          <motion.div
            className="contact-hero-decoration contact-hero-decoration-one"
            variants={floatingDecoration}
            animate="animate"
          />
          <motion.div
            className="contact-hero-decoration contact-hero-decoration-two"
            variants={floatingDecoration}
            animate="animate"
            transition={{ duration: 7, delay: 1 }}
          />

          <div className="container">
            <motion.div
              className="contact-hero-content"
              initial="hidden"
              animate="visible"
              variants={stagger}
            >
              <motion.span variants={fadeUp} className="contact-page-tag">
                <motion.span
                  animate={{ rotate: [0, 20, -20, 0] }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    repeatDelay: 2,
                  }}
                  style={{ display: 'inline-flex' }}
                >
                  <Sparkles size={13} />
                </motion.span>
                Get in Touch
              </motion.span>

              <motion.h1 variants={fadeUp} className="contact-page-title">
                Let's start a
                <motion.span
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.7 }}
                >
                  {" "}conversation
                </motion.span>
              </motion.h1>

              <motion.p variants={fadeUp} className="contact-page-subtitle">
                Questions, feedback, partnership ideas — we'd love to hear
                from you. Our team usually replies within one business day.
              </motion.p>
            </motion.div>
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
            <motion.aside
              className="contact-info"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={slideLeft}
            >
              <motion.span
                className="contact-eyebrow"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                Contact Information
              </motion.span>

              <motion.h2
                className="contact-info-title"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.15 }}
              >
                Other ways to reach us
              </motion.h2>

              <motion.p
                className="contact-info-text"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Prefer a call or a visit? Here's how to find us outside of the
                form.
              </motion.p>

              <motion.div
                className="contact-info-list"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={stagger}
              >
                {contactItems.map((item, idx) => {
                  const Icon = item.icon;
                  const Wrapper = item.href ? motion.a : motion.div;
                  return (
                    <Wrapper
                      key={idx}
                      href={item.href}
                      className="contact-info-item"
                      variants={itemSlide}
                      custom={idx}
                      whileHover={{
                        x: 6,
                        transition: { duration: 0.25 },
                      }}
                    >
                      <motion.div
                        className="contact-info-icon"
                        whileHover={{ rotate: -10, scale: 1.12 }}
                        transition={{
                          type: 'spring',
                          stiffness: 300,
                          damping: 15,
                        }}
                      >
                        <Icon size={18} strokeWidth={1.8} />
                      </motion.div>
                      <div className="contact-info-body">
                        <span className="contact-info-label">
                          {item.label}
                        </span>
                        <span className="contact-info-value">
                          {item.value}
                        </span>
                      </div>
                    </Wrapper>
                  );
                })}
              </motion.div>

              {/* Response promise card */}
              <motion.div
                className="contact-promise"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
                whileHover={{ y: -3, scale: 1.02 }}
              >
                <motion.div
                  className="contact-promise-icon"
                  animate={{
                    scale: [1, 1.15, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <CheckCircle2 size={18} />
                </motion.div>
                <div>
                  <strong>Quick response</strong>
                  <span>Most messages answered within 24 hours.</span>
                </div>
              </motion.div>
            </motion.aside>

            {/* ---------- RIGHT: Form ---------- */}
            <motion.div
              className="contact-form-wrapper"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={slideRight}
            >
              <motion.div
                className="contact-form-header"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={stagger}
              >
                <motion.span variants={fadeUp} className="contact-eyebrow">
                  Send a Message
                </motion.span>
                <motion.h2 variants={fadeUp} className="contact-form-title">
                  Tell us what's on your mind
                </motion.h2>
              </motion.div>

              <motion.form
                onSubmit={handleSubmit}
                className="contact-form"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={stagger}
              >
                <motion.div className="contact-form-row" variants={fadeUp}>
                  <motion.div
                    className="contact-form-group"
                    variants={fadeUp}
                  >
                    <label className="contact-form-label">
                      <User size={13} />
                      Full Name
                    </label>
                    <motion.input
                      type="text"
                      name="name"
                      className="contact-input"
                      placeholder="Jane Doe"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      whileFocus={{
                        scale: 1.01,
                        transition: { duration: 0.2 },
                      }}
                    />
                  </motion.div>

                  <motion.div
                    className="contact-form-group"
                    variants={fadeUp}
                  >
                    <label className="contact-form-label">
                      <AtSign size={13} />
                      Email Address
                    </label>
                    <motion.input
                      type="email"
                      name="email"
                      className="contact-input"
                      placeholder="jane@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      whileFocus={{
                        scale: 1.01,
                        transition: { duration: 0.2 },
                      }}
                    />
                  </motion.div>
                </motion.div>

                <motion.div className="contact-form-group" variants={fadeUp}>
                  <label className="contact-form-label">
                    <Tag size={13} />
                    Subject
                  </label>
                  <motion.input
                    type="text"
                    name="subject"
                    className="contact-input"
                    placeholder="How can we help?"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    whileFocus={{
                      scale: 1.01,
                      transition: { duration: 0.2 },
                    }}
                  />
                </motion.div>

                <motion.div className="contact-form-group" variants={fadeUp}>
                  <label className="contact-form-label">
                    <MessageCircle size={13} />
                    Message
                  </label>
                  <motion.textarea
                    name="message"
                    className="contact-input contact-textarea"
                    rows="6"
                    placeholder="Write your message here..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                    whileFocus={{
                      scale: 1.01,
                      transition: { duration: 0.2 },
                    }}
                  />
                </motion.div>

                <motion.button
                  type="submit"
                  className="contact-submit"
                  disabled={submitting}
                  variants={fadeUp}
                  whileHover={!submitting ? { scale: 1.04, y: -3 } : {}}
                  whileTap={!submitting ? { scale: 0.97 } : {}}
                  transition={{ duration: 0.2 }}
                >
                  {submitting ? (
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                      style={{ display: 'inline-flex' }}
                    >
                      <Send size={15} />
                    </motion.span>
                  ) : (
                    <motion.span
                      whileHover={{ x: 3, rotate: 15 }}
                      transition={{ duration: 0.2 }}
                      style={{ display: 'inline-flex' }}
                    >
                      <Send size={15} />
                    </motion.span>
                  )}
                  {submitting ? 'Sending...' : 'Send Message'}
                </motion.button>
              </motion.form>
            </motion.div>
          </div>

          {/* =========================================================
              MAP
          ========================================================= */}
          <motion.div
            className="contact-map"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="contact-map-header">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <span className="contact-eyebrow">Find Us</span>
                <h3 className="contact-map-title">Our location on the map</h3>
              </motion.div>

              <motion.a
                href="https://www.google.com/maps/search/?api=1&query=40.7128,-74.006"
                target="_blank"
                rel="noreferrer"
                className="contact-map-link"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                whileHover={{ scale: 1.05, x: 3 }}
                whileTap={{ scale: 0.97 }}
              >
                <motion.span
                  whileHover={{ rotate: -10 }}
                  transition={{ duration: 0.2 }}
                  style={{ display: 'inline-flex' }}
                >
                  <MapPin size={14} />
                </motion.span>
                Open in Google Maps
              </motion.a>
            </div>

            <motion.div
              className="contact-map-frame"
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <MapView
                latitude={40.7128}
                longitude={-74.006}
                height="440px"
                zoom={14}
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactPage;