import React from 'react';
<<<<<<< Updated upstream
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Menu, Bell } from 'lucide-react';
=======
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Menu, Bell, MessageSquare, Home } from 'lucide-react';
>>>>>>> Stashed changes
import useAuthStore from '../../store/useAuthStore';
import { supabase } from '../../config/supabase';
import { ROUTES } from '../../constants';
import { API_URL } from '../../config';
import './Header.css';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();

  const isNotificationsPage = location.pathname === ROUTES.TENANT.NOTIFICATIONS;

  const getAvatarUrl = () => {
    if (user?.avatarUrl) {
      // If it's a relative path from our server
      if (user.avatarUrl.startsWith('/uploads')) {
        const baseUrl = API_URL.replace('/api', '');
        return `${baseUrl}${user.avatarUrl}`;
      }
      // If it's a full URL (e.g., from Google)
      return user.avatarUrl;
    }
    return `https://ui-avatars.com/api/?name=${user?.fullName || 'User'}&background=random`;
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      logout();
      navigate(ROUTES.LOGIN);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
<<<<<<< Updated upstream
          <Link to={ROUTES.HOME} className="logo">
            RentalRoom
=======
          {isAuthenticated && (
            <button className="sidebar-toggle-btn" onClick={toggleSidebar} style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Menu size={22} />
            </button>
          )}
          <Link to={ROUTES.HOME} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
            <svg width="46" height="46" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M 5 88 Q 50 105 95 88" stroke="var(--primary)" strokeWidth="6" strokeLinecap="round" fill="none"/>
              <path d="M 15 78 Q 50 90 85 78" stroke="#6C63FF" strokeWidth="3" strokeLinecap="round" fill="none"/>
              
              <rect x="20" y="35" width="28" height="47" fill="var(--primary)"/>
              <path d="M 15 35 L 34 15 L 53 35" stroke="var(--primary)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              <rect x="26" y="45" width="5" height="6" fill="var(--bg-card)"/>
              <rect x="37" y="45" width="5" height="6" fill="var(--bg-card)"/>
              <rect x="26" y="57" width="5" height="6" fill="var(--bg-card)"/>
              <rect x="37" y="57" width="5" height="6" fill="var(--bg-card)"/>
              <rect x="26" y="69" width="5" height="6" fill="var(--bg-card)"/>
              <rect x="37" y="69" width="5" height="6" fill="var(--bg-card)"/>

              <rect x="70" y="28" width="6" height="15" fill="#6C63FF"/>
              <path d="M 45 50 L 65 30 L 85 50" stroke="#6C63FF" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              <rect x="52" y="50" width="26" height="32" fill="#6C63FF"/>
              <rect x="58" y="60" width="14" height="14" fill="var(--bg-card)"/>
              <path d="M 65 60 V 74 M 58 67 H 72" stroke="#6C63FF" strokeWidth="2.5"/>
            </svg>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <span className="logo" style={{ fontSize: '1.45rem', lineHeight: '1', color: 'var(--primary)', letterSpacing: '-0.5px' }}>Rent<span style={{ color: '#6C63FF' }}>Wise</span></span>
              <span style={{ fontSize: '0.65rem', fontWeight: '700', color: 'var(--text-muted)', letterSpacing: '0.8px', marginTop: '3px', textTransform: 'uppercase' }}>Nền Tảng Thuê Trọ</span>
            </div>
>>>>>>> Stashed changes
          </Link>
          {!isNotificationsPage && (
            <div className="header-search-bar">
              <Search size={16} className="search-icon" />
              <input type="text" placeholder="Quick search..." />
            </div>
          )}
        </div>

        <nav className="header-tabs">
          {isAuthenticated && user?.role === 'LANDLORD' ? (
            <>
              <Link to="/landlord/dashboard" className={`tab-link ${location.pathname === '/landlord/dashboard' || location.pathname === '/landlord' ? 'active' : ''}`} style={{ fontWeight: '700', color: '#2563EB' }}>Landlord Dashboard</Link>
              <Link to={ROUTES.LANDLORD.LISTINGS} className={`tab-link ${location.pathname === ROUTES.LANDLORD.LISTINGS ? 'active' : ''}`}>My Listings</Link>
              <Link to={ROUTES.LANDLORD.MESSAGES} className={`tab-link ${location.pathname === ROUTES.LANDLORD.MESSAGES ? 'active' : ''}`}>Messages</Link>
            </>
          ) : (
            <>
              <Link to={ROUTES.ROOMS} className={`tab-link ${location.pathname === ROUTES.ROOMS ? 'active' : ''}`}>Explore</Link>
              <Link to={ROUTES.TENANT.FAVORITES} className={`tab-link ${location.pathname === ROUTES.TENANT.FAVORITES ? 'active' : ''}`}>Favorites</Link>
              <Link to={ROUTES.TENANT.RENTAL_REQUEST || '#'} className={`tab-link ${location.pathname === ROUTES.TENANT.RENTAL_REQUEST ? 'active' : ''}`}>Requests</Link>
            </>
          )}
        </nav>

        <div className="header-right">
          {/* Notification Bell */}
          <Link
            to={ROUTES.TENANT.NOTIFICATIONS}
            className={`header-bell-btn ${isNotificationsPage ? 'active' : ''}`}
          >
            <Bell size={20} />
            <span className="bell-badge-dot"></span>
          </Link>
          {!isAuthenticated ? (
            <Link to={ROUTES.LOGIN} className="sign-in-btn">Sign In</Link>
          ) : (
            <div className="user-actions" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {user?.role === 'LANDLORD' && (
                <Link
                  to="/landlord/dashboard"
                  className="sign-in-btn"
                  style={{ background: '#2563EB', color: 'white', border: 'none', padding: '0.4rem 0.9rem', fontSize: '0.85rem', fontWeight: '600', textDecoration: 'none', borderRadius: '4px' }}
                >
                  Landlord Portal
                </Link>
              )}
              <Link to={user?.role === 'LANDLORD' ? ROUTES.LANDLORD.PROFILE : ROUTES.TENANT.PROFILE}>
                <div className="header-avatar" title="Profile">
                  <img src={getAvatarUrl()} alt="Avatar" />
                </div>
              </Link>
              <button
                onClick={handleLogout}
                className="sign-in-btn"
                style={{ background: 'transparent', color: '#6C3AED', border: '1px solid #6C3AED', cursor: 'pointer' }}
              >
                Logout
              </button>
            </div>
          )}
          <button className="mobile-menu-btn">
            <Menu size={22} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
