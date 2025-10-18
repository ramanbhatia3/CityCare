// frontend/src/components/Sidebar.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import logo from '../assets/logo.png'; // ✅ 1. Import your new logo

// --- Icon Components (No changes here) ---
const OverviewIcon = () => <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>;
const MapIcon = () => <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5 5V7l5-5 5 5 5-5v12l-5 5-5-5zm0 0V9l5-5 5 5v7m-5-7V7"></path></svg>;
const ProfileIcon = () => <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>;
const AllIssuesIcon = () => <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>;
const AdminIcon = () => <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h2a2 2 0 002-2V8a2 2 0 00-2-2h-2V4a2 2 0 00-2-2H9a2 2 0 00-2 2v2H5a2 2 0 00-2 2v10a2 2 0 002 2h2m0 0v-5a2 2 0 012-2h6a2 2 0 012 2v5M7 20h10"></path></svg>;
const ReportIssueIcon = () => <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>;
const CloseIcon = () => <svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>;
const VolunteerIcon = () => <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197M4 10.5a5.5 5.5 0 1111 0v-1a5.5 5.5 0 00-11 0v1z"></path></svg>;

export default function Sidebar({ navigateTo, userInfo, isSidebarOpen, closeSidebar }) {
  const { t } = useTranslation();
  const isAdmin = userInfo?.isAdmin;

  const handleNavigate = (page) => {
    navigateTo(page);
    if (window.innerWidth < 768) {
      closeSidebar();
    }
  };

  const NavLink = ({ to, icon, label }) => (
    <button
      onClick={() => handleNavigate(to)}
      className="flex items-center px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors duration-200 w-full text-left"
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  return (
    <aside className={`w-64 bg-white p-6 shadow-md flex flex-col justify-between fixed md:relative md:translate-x-0 h-full z-20 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div>
        <div className="flex items-center justify-between mb-10">
          {/* ✅ 2. Replace the text with an image tag for the logo */}
          <img src={logo} alt="CityCare Logo" className="h-10" />
          <button onClick={closeSidebar} className="md:hidden p-1">
            <CloseIcon />
          </button>
        </div>

        <nav className="space-y-2">
          <button onClick={() => handleNavigate('report')} className="flex items-center justify-center w-full px-4 py-3 bg-indigo-600 text-white font-medium rounded-xl shadow-lg hover:bg-indigo-700 transition-colors duration-300 mb-6">
            <ReportIssueIcon />
            {t('register_issue')}
          </button>

          <NavLink to="home" icon={<OverviewIcon />} label={t('overview')} />
          <NavLink to="map" icon={<MapIcon />} label={t('public_map')} />
          <NavLink to="my-profile" icon={<ProfileIcon />} label={t('my_profile')} />
          <NavLink to="all-issues" icon={<AllIssuesIcon />} label={t('all_issues')} />

          {isAdmin && (
            <>
              <div className="pt-2 pb-1 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Authority Tools</div>
              <NavLink to="admin-dashboard" icon={<AdminIcon />} label={t('admin_dashboard')} />
              <NavLink to="volunteer-requests" icon={<VolunteerIcon />} label={t('volunteer_requests')} />
            </>
          )}
        </nav>
      </div>

      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-xl text-center mt-8">
        <div className="text-4xl mb-2">💡</div>
        <p className="text-sm font-semibold text-gray-800">Get mobile app</p>
        <p className="text-xs text-gray-600 mb-3">Lorem ipsum dolor sit amet.</p>
        <div className="flex justify-center space-x-2">
          <button className="bg-gray-800 text-white text-xs px-3 py-1 rounded-md">App Store</button>
          <button className="bg-gray-800 text-white text-xs px-3 py-1 rounded-md">Google Play</button>
        </div>
      </div>
    </aside>
  );
}