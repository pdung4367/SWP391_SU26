import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants';
import './NotFoundPage.css';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="notfound-page-container">
      <div className="notfound-content">
        <h1 className="notfound-code">404</h1>
        <p className="notfound-message">Page Not Found</p>
        <p className="notfound-desc">
          Sorry, the page you are looking for doesn't exist or has been moved.
        </p>
        <button
          className="notfound-btn"
          onClick={() => navigate(ROUTES.HOME)}
        >
          Go Home
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
