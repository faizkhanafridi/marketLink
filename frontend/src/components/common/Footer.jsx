import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../../styles/navbar.css';
import Logo from './Logo';

const Footer = () => {
  // ==================== ANIMATION VARIANTS ====================
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const columnVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const linkVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
  };

  const socialVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: (i = 0) => ({
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        delay: i * 0.08,
        type: 'spring',
        stiffness: 300,
        damping: 15,
      },
    }),
  };

  return (
    <footer className="marketlink-footer">
      <div className="footer-container">
        <motion.div
          className="footer-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
        >
          {/* Brand */}
          <motion.div
            className="footer-col brand-col"
            variants={columnVariants}
          >
            <div className="footer-brand">
          <motion.div
                className="brand-logo"
                whileHover={{ rotate: -6, scale: 1.08 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              >
                <Logo size={42} />
              </motion.div>
              <span className="brand-name">MarketLink</span>
            </div>

            <motion.p
              className="footer-description"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Connecting local farmers with their community through fresh,
              seasonal, and locally grown produce.
            </motion.p>

            <motion.div
              className="footer-social"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.1, delayChildren: 0.3 },
                },
              }}
            >
              {[
                { href: '#facebook', label: 'Facebook', icon: 'fab fa-facebook-f' },
                { href: '#twitter', label: 'Twitter', icon: 'fab fa-twitter' },
                { href: '#instagram', label: 'Instagram', icon: 'fab fa-instagram' },
                { href: '#linkedin', label: 'LinkedIn', icon: 'fab fa-linkedin-in' },
              ].map((social, i) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  variants={socialVariants}
                  custom={i}
                  whileHover={{
                    y: -4,
                    scale: 1.15,
                    transition: { duration: 0.25 },
                  }}
                  whileTap={{ scale: 0.9 }}
                >
                  <i className={social.icon}></i>
                </motion.a>
              ))}
            </motion.div>
          </motion.div>

          {/* Explore */}
          <motion.div className="footer-col" variants={columnVariants}>
            <motion.h4
              className="footer-heading"
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              Explore
            </motion.h4>

            <motion.ul
              className="footer-links"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.07, delayChildren: 0.25 },
                },
              }}
            >
              {[
                { to: '/', label: 'Home' },
                { to: '/markets', label: 'Markets' },
                { to: '/farmers', label: 'Farmers' },
                { to: '/products', label: 'Products' },
                { to: '/about', label: 'About Us' },
              ].map((link) => (
                <motion.li
                  key={link.label}
                  variants={linkVariants}
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link to={link.to}>{link.label}</Link>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* For Farmers */}
          <motion.div className="footer-col" variants={columnVariants}>
            <motion.h4
              className="footer-heading"
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.25 }}
            >
              For Farmers
            </motion.h4>

            <motion.ul
              className="footer-links"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.07, delayChildren: 0.35 },
                },
              }}
            >
              {[
                { to: '/register/farmer', label: 'Become a Farmer' },
                { to: '/farmer', label: 'Farmer Dashboard' },
                { to: '/about', label: 'How It Works' },
              ].map((link) => (
                <motion.li
                  key={link.label}
                  variants={linkVariants}
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link to={link.to}>{link.label}</Link>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Contact */}
          <motion.div className="footer-col" variants={columnVariants}>
            <motion.h4
              className="footer-heading"
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.35 }}
            >
              Get in Touch
            </motion.h4>

            <motion.ul
              className="footer-contact"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.1, delayChildren: 0.45 },
                },
              }}
            >
              {[
                { icon: 'fas fa-map-marker-alt', text: '123 Market Street, City' },
                { icon: 'fas fa-phone', text: '+1 (555) 123-4567' },
                { icon: 'fas fa-envelope', text: 'hello@marketlink.com' },
              ].map((item, i) => (
                <motion.li
                  key={i}
                  variants={{
                    hidden: { opacity: 0, x: -10 },
                    visible: {
                      opacity: 1,
                      x: 0,
                      transition: { duration: 0.4 },
                    },
                  }}
                  whileHover={{ x: 3 }}
                >
                  <motion.i
                    className={item.icon}
                    whileHover={{ scale: 1.2, rotate: 8 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  />
                  <span>{item.text}</span>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        </motion.div>

        {/* Bottom */}
        <motion.div
          className="footer-bottom"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <p>
            © {new Date().getFullYear()} MarketLink. All rights reserved.
          </p>

          <div className="footer-bottom-links">
            <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
              <Link to="/privacy">Privacy Policy</Link>
            </motion.div>
            <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
              <Link to="/terms">Terms of Service</Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;