// frontend/src/components/Navbar.jsx

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// --- Icon Components ---
const SearchIcon = () => <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>;
const BellIcon = () => <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>;
const MenuIcon = () => <svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>;
const LoginIcon = () => <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>;


export default function Navbar({ onLogout, userInfo, onMenuClick, navigateTo }) { // Add navigateTo prop
  const { t, i18n } = useTranslation();
  const userDisplayName = userInfo?.name || 'Guest';
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    let seed = sessionStorage.getItem('avatarSeed');
    if (!seed && userInfo) { // Only generate/set seed if logged in
      seed = Math.random();
      sessionStorage.setItem('avatarSeed', seed);
    } else if (!userInfo) { // Clear seed if logged out
       sessionStorage.removeItem('avatarSeed');
       seed = null;
    }
    // Use seed if available, otherwise use a default or placeholder
    setAvatarUrl(seed ? `https://i.pravatar.cc/40?u=${seed}` : 'https://via.placeholder.com/40');
  }, [userInfo]); // Re-run effect when userInfo changes

  const handleLanguageChange = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <header className="bg-white shadow-sm p-4 flex justify-between items-center z-10">
      <div className="flex items-center">
        <button onClick={onMenuClick} className="md:hidden mr-4 p-1">
          <MenuIcon />
        </button>
        <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2 w-full max-w-md">
          <SearchIcon />
          <input
            type="text"
            placeholder={t('search')}
            className="ml-2 bg-transparent outline-none text-gray-700 placeholder-gray-400 flex-grow"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2 md:space-x-4">
        <select
          value={i18n.language}
          onChange={handleLanguageChange}
          className="bg-gray-100 border-none text-gray-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2"
        >
          <option value="en">English</option>
          <option value="hi">हिन्दी</option>
        </select>

        <button className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
          <BellIcon />
        </button>

        <div className="flex items-center md:border-l border-gray-200 md:pl-4">
          {userInfo ? (
            // Logged-in view
            <>
              <img
                src={avatarUrl}
                alt="User Avatar"
                className="w-9 h-9 rounded-full mr-3 object-cover"
              />
              <span className="text-gray-800 font-semibold hidden sm:block">{userDisplayName}</span>
              <button
                onClick={onLogout}
                className="ml-4 px-3 py-1.5 bg-red-100 text-red-700 font-semibold rounded-md text-sm hover:bg-red-200 transition-colors duration-200"
              >
                {t('logout')}
              </button>
            </>
          ) : (
            // Logged-out view
            <button
              onClick={() => navigateTo('login')} // Navigate to login page
              className="ml-4 px-3 py-1.5 bg-indigo-600 text-white font-semibold rounded-md text-sm hover:bg-indigo-700 transition-colors duration-200 flex items-center"
            >
              <LoginIcon /> Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
}