import React, { useState, useEffect } from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import './ThemeToggle.css';

const MODES = ['light', 'dark', 'system'];
const MODE_LABELS = { light: 'Light', dark: 'Dark', system: 'System' };

const ThemeToggle = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    const applyTheme = (resolvedTheme) => {
      if (resolvedTheme === 'dark') {
        document.body.classList.add('dark');
        document.body.classList.remove('light');
      } else {
        document.body.classList.add('light');
        document.body.classList.remove('dark');
      }
    };

    let resolved = theme;
    if (theme === 'system') {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      resolved = systemDark ? 'dark' : 'light';
    }
    applyTheme(resolved);
    localStorage.setItem('theme', theme);

    // Listen for OS changes when in system mode
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = (e) => applyTheme(e.matches ? 'dark' : 'light');
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, [theme]);

  // Listen for changes from SettingsPage (they write to localStorage)
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'theme' && e.newValue) {
        setTheme(e.newValue);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const cycleTheme = () => {
    const currentIndex = MODES.indexOf(theme);
    const nextIndex = (currentIndex + 1) % MODES.length;
    setTheme(MODES[nextIndex]);
  };

  const getIcon = () => {
    if (theme === 'dark') return <Sun size={20} />;
    if (theme === 'system') return <Monitor size={20} />;
    return <Moon size={20} />;
  };

  return (
    <button 
      className="theme-toggle-btn" 
      onClick={cycleTheme}
      title={`Theme: ${MODE_LABELS[theme]} — Click to switch`}
    >
      {getIcon()}
      <span className="theme-toggle-label">{MODE_LABELS[theme]}</span>
    </button>
  );
};

export default ThemeToggle;
