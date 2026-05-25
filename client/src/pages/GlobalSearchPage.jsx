import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  X,
  Wifi,
  Lock,
  History,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  MapPin,
  Tag,
} from 'lucide-react';
import downtownImg from '../assets/images/downtown.png';
import techDistrictImg from '../assets/images/tech-district.png';
import { ROUTES } from '../constants';
import './GlobalSearchPage.css';

const SUGGESTIONS = [
  {
    icon: <Wifi size={18} />,
    iconClass: 'wifi-blue',
    label: 'High-Speed Wi-Fi Rooms',
    desc: 'Properties optimized for remote work with high bandwidth.',
  },
  {
    icon: <Lock size={18} />,
    iconClass: 'lock-indigo',
    label: 'Smart Lock Access',
    desc: 'Keyless entry properties for contactless seamless onboarding.',
  },
];

const RECENTS = [
  'Studio apartments in Downtown',
  'Pet-friendly monthly rentals',
  'Tech Hub Campus proximity',
];

const TRENDING = [
  { label: 'Downtown Metro', count: '142 Properties', img: downtownImg },
  { label: 'Tech District', count: '89 Properties', img: techDistrictImg },
];

const CATEGORIES = ['Studio', 'Co-living', 'Entire Home', 'Pet Friendly'];

const GlobalSearchPage = () => {
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const [query, setQuery] = useState('');
  const [activeCategories, setActiveCategories] = useState({
    Studio: true,
    'Co-living': false,
    'Entire Home': false,
    'Pet Friendly': true,
  });
  const [keyboardIndex, setKeyboardIndex] = useState(-1);

  const allItems = [...SUGGESTIONS.map((s) => s.label), ...RECENTS];

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setKeyboardIndex((p) => (p + 1) % allItems.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setKeyboardIndex((p) => (p - 1 + allItems.length) % allItems.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (keyboardIndex >= 0) {
          setQuery(allItems[keyboardIndex]);
          setKeyboardIndex(-1);
        } else if (query.trim()) {
          handleAdvancedSearch();
        }
      } else if (e.key === 'Escape') {
        navigate(-1);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [keyboardIndex, query]);

  const handleAdvancedSearch = () => {
    navigate(ROUTES.ROOMS);
  };

  const toggleCategory = (cat) => {
    setActiveCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  return (
    <div className="gsp-wrapper">

      {/* Page Header */}
      <div className="gsp-page-header">
        <button className="gsp-back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>
        <div className="gsp-header-brand">
          <Sparkles size={20} className="gsp-brand-icon" />
          <span>Global Search</span>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="gsp-search-bar-container">
        <div className="gsp-search-input-wrap">
          <Search size={22} className="gsp-search-icon" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for rooms, locations, amenities or smart features..."
            className="gsp-search-input"
          />
          {query && (
            <button className="gsp-clear-btn" onClick={() => setQuery('')}>
              <X size={16} />
            </button>
          )}
          <div className="gsp-kbd-hint">
            <kbd>ESC</kbd>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="gsp-content-grid">

        {/* Left Column */}
        <div className="gsp-left-col">

          {/* Smart Suggestions */}
          <section className="gsp-section">
            <div className="gsp-section-header">
              <Sparkles size={14} className="gsp-section-icon" />
              <h3 className="gsp-section-title">Smart Suggestions</h3>
            </div>
            <div className="gsp-suggestions-grid">
              {SUGGESTIONS.map((s, i) => (
                <div
                  key={s.label}
                  onClick={() => setQuery(s.label)}
                  className={`gsp-suggestion-card ${keyboardIndex === i ? 'kbd-active' : ''}`}
                >
                  <div className={`gsp-suggestion-icon ${s.iconClass}`}>
                    {s.icon}
                  </div>
                  <div className="gsp-suggestion-text">
                    <h4>{s.label}</h4>
                    <p>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Recent Searches */}
          <section className="gsp-section">
            <div className="gsp-section-header">
              <History size={14} className="gsp-section-icon" />
              <h3 className="gsp-section-title">Recent Searches</h3>
            </div>
            <ul className="gsp-recents-list">
              {RECENTS.map((r, i) => {
                const idx = SUGGESTIONS.length + i;
                return (
                  <li
                    key={r}
                    onClick={() => setQuery(r)}
                    className={`gsp-recent-item ${keyboardIndex === idx ? 'kbd-active' : ''}`}
                  >
                    <History size={15} className="gsp-recent-icon" />
                    <span>{r}</span>
                    <ArrowRight size={14} className="gsp-recent-arrow" />
                  </li>
                );
              })}
            </ul>
          </section>

        </div>

        {/* Right Column */}
        <div className="gsp-right-col">

          {/* Trending Locations */}
          <section className="gsp-section">
            <div className="gsp-section-header">
              <MapPin size={14} className="gsp-section-icon" />
              <h3 className="gsp-section-title">Trending Locations</h3>
            </div>
            <div className="gsp-trending-stack">
              {TRENDING.map((t) => (
                <div
                  key={t.label}
                  onClick={() => setQuery(t.label)}
                  className="gsp-trending-card"
                  style={{
                    backgroundImage: `linear-gradient(rgba(15,23,42,0.38), rgba(15,23,42,0.55)), url(${t.img})`,
                  }}
                >
                  <div className="gsp-trending-meta">
                    <h4>{t.label}</h4>
                    <span>{t.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Categories */}
          <section className="gsp-section">
            <div className="gsp-section-header">
              <Tag size={14} className="gsp-section-icon" />
              <h3 className="gsp-section-title">Categories</h3>
            </div>
            <div className="gsp-categories-wrap">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`gsp-category-pill ${activeCategories[cat] ? 'active' : ''}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </section>

        </div>
      </div>

      {/* Footer Bar */}
      <div className="gsp-footer-bar">
        <div className="gsp-kbd-guide">
          <span><kbd>↑↓</kbd> to navigate</span>
          <span><kbd>Enter</kbd> to select</span>
          <span><kbd>ESC</kbd> to go back</span>
        </div>
        <button className="gsp-advanced-btn" onClick={handleAdvancedSearch}>
          Advanced Search
          <ArrowRight size={15} />
        </button>
      </div>

    </div>
  );
};

export default GlobalSearchPage;
