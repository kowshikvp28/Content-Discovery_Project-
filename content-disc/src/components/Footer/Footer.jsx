
import React from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';

const Footer = ()  => {
  const Logo = () => <div className="footer-logo">R</div>;

  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-column brand-column">
          <Logo />
          <p className="footer-tagline">
            Your curated archive of cinema's greatest treasures.
          </p>
        </div>

        <div className="footer-column links-column">
          <h3 className="footer-heading">Explore</h3>
          <ul className="footer-links">
            <Link to={'/'}>
            <li>Home</li>
            </Link>
            <Link to={'/most-popular'}>
            <li>Most Popular</li>
            </Link>
            
            <Link to={'/about'}>
            <li>About Us</li>
            </Link>
            <Link to={'/membership'}>
            <li>Membership</li>
            </Link>
          </ul>
        </div>

        <div className="footer-column links-column">
          <h3 className="footer-heading">Legal</h3>
          <ul className="footer-links">
            <li><a href="#">Terms of Service</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Contact Us</a></li>
          </ul>
        </div>

        <div className="footer-column social-column">
          <h3 className="footer-heading">Follow Us</h3>
          <div className="social-icons">
            <a href="#" aria-label="Twitter">
              <svg viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
            </a>
            <a href="#" aria-label="Instagram">
              <svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
            <a href="#" aria-label="Facebook">
              <svg viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 Your Classic Films. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
