import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Search, Bot, HelpCircle } from 'lucide-react';
import { ROUTES } from '../constants';
import dogIllustration from '../assets/images/404-dog.png';
import './NotFoundPage.css';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        {/* Left Side: Confused Dog Illustration */}
        <div className="not-found-illustration">
          <img src={dogIllustration} alt="Confused corporate puppy dog studying blueprints" />
        </div>

        {/* Right Side: Information & Actions */}
        <div className="not-found-info">
          <span className="error-code">404</span>
          <h1 className="error-title">Page Not Found</h1>
          <p className="error-description">
            Oops! It looks like you've ventured into an uncharted room. The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>

          <div className="track-section">
            <p className="track-label">Let's get you back on track:</p>
            
            <div className="shortcut-cards">
              <button 
                onClick={() => navigate(ROUTES.HOME)} 
                className="shortcut-card"
                aria-label="Navigate to Home Page"
              >
                <div className="icon-wrapper">
                  <Home className="shortcut-icon" size={24} />
                </div>
                <span className="shortcut-text">Home</span>
              </button>

              <button 
                onClick={() => navigate(ROUTES.ROOMS)} 
                className="shortcut-card"
                aria-label="Navigate to Search Rooms"
              >
                <div className="icon-wrapper">
                  <Search className="shortcut-icon" size={24} />
                </div>
                <span className="shortcut-text">Search Rooms</span>
              </button>

              <button 
                onClick={() => navigate(ROUTES.LANDLORD.MESSAGES)} 
                className="shortcut-card"
                aria-label="Open AI Assistant"
              >
                <div className="icon-wrapper">
                  <Bot className="shortcut-icon" size={24} />
                </div>
                <span className="shortcut-text">AI Assistant</span>
              </button>
            </div>
          </div>

          <button 
            onClick={() => navigate(ROUTES.LANDLORD.HELP)} 
            className="support-link"
            aria-label="Contact Support Help Center"
          >
            <HelpCircle size={18} />
            <span>Need further assistance? Contact Support</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
