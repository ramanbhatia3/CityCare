// frontend/src/components/DashboardLayout.jsx

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Footer from './Footer';

export default function DashboardLayout({ children, navigateTo, userInfo, onLogout }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 relative">
      {isSidebarOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-gray-900/50 z-10 md:hidden backdrop-blur-sm"
          aria-hidden="true"
        ></div>
      )}

      <div className="flex flex-1">
        <Sidebar
          navigateTo={navigateTo}
          userInfo={userInfo}
          isSidebarOpen={isSidebarOpen}
          closeSidebar={toggleSidebar}
        />

        <div className="flex-1 flex flex-col">
          <Navbar
            navigateTo={navigateTo} // Pass navigateTo here
            userInfo={userInfo}
            onLogout={onLogout}
            onMenuClick={toggleSidebar}
          />

          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}