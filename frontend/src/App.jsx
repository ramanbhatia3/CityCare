// frontend/src/App.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Import all components
import DashboardLayout from './components/DashboardLayout';
import DashboardPage from './components/DashboardPage';
import ReportIssuePage from './components/ReportIssuePage';
import PublicMapPage from './components/PublicMapPage';
import AuthPage from './components/AuthPage';
import MyProfilePage from './components/MyProfilePage';
import AdminDashboardPage from './components/AdminDashboardPage';
import AllIssuesPage from './components/AllIssuesPage';
import IssueDetailPage from './components/IssueDetailPage';
import VolunteerRequestsPage from './components/VolunteerRequestsPage';

export default function App() {
  const [userInfo, setUserInfo] = useState(null);
  const [currentPage, setCurrentPage] = useState('home'); // Start on the dashboard
  const [issues, setIssues] = useState([]);
  const [selectedIssueId, setSelectedIssueId] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true); // Track initial user load

  // Check for logged-in user on mount
  useEffect(() => {
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
    }
    setIsLoadingUser(false); // Finished checking user
  }, []);

  // Fetch all issues (can run whether logged in or not)
  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const { data } = await axios.get(`${apiUrl}/api/issues`);
        const adaptedIssues = data.map(issue => ({ ...issue, filePreview: issue.imageUrl }));
        setIssues(adaptedIssues);
      } catch (error) {
        console.error('Could not fetch issues:', error);
      }
    };
    fetchIssues();
  }, []); // Fetch issues once on load

  const navigateTo = (page, id = null) => {
    // Protected pages check
    const protectedPages = ['report', 'my-profile', 'admin-dashboard', 'volunteer-requests'];
    if (protectedPages.includes(page) && !userInfo) {
      alert("Please log in or sign up to access this page.");
      setCurrentPage('login'); // Redirect to login
      return;
    }
    // Admin route check
    if ((page === 'admin-dashboard' || page === 'volunteer-requests') && userInfo && !userInfo.isAdmin) {
       alert("You are not authorized to access this page.");
       // Don't change page, just show the alert
       return;
    }

    setCurrentPage(page);
    setSelectedIssueId(id);
  };

  const handleAddIssue = async (formData, wantsToVolunteer) => {
    // Already protected by navigateTo('report') check
    try {
      const { token } = userInfo; // userInfo is guaranteed here
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const { data: newIssue } = await axios.post(`${apiUrl}/api/issues`, formData, config);
      let finalIssue = { ...newIssue, filePreview: newIssue.imageUrl };
      if (wantsToVolunteer) {
        await axios.post(`${apiUrl}/api/issues/${newIssue._id}/volunteer`, {}, config);
        finalIssue.volunteerRequest = 'Pending';
      }
      setIssues(prevIssues => [finalIssue, ...prevIssues]);
      navigateTo('my-profile');
    } catch (error) {
      console.error('Error creating issue:', error);
      alert('Failed to create issue. Please try again.');
    }
  };

  const handleLoginSuccess = (data) => {
    const newUserInfo = { ...data.user, token: data.token };
    localStorage.setItem('userInfo', JSON.stringify(newUserInfo));
    setUserInfo(newUserInfo);
    // Go home after login
    setCurrentPage('home');
  };

  const handleLogout = () => {
    sessionStorage.removeItem('avatarSeed');
    localStorage.removeItem('userInfo');
    setUserInfo(null);
    setCurrentPage('home'); // Go back to home page on logout
  };

  // Show loading indicator while checking auth status initially
  if (isLoadingUser) {
    return <div>Loading...</div>; // Replace with a better loading indicator if desired
  }

  // Render AuthPage if needed, otherwise render the DashboardLayout
  if (!userInfo && currentPage === 'login') {
    return <AuthPage onLoginSuccess={handleLoginSuccess} navigateTo={navigateTo}/>;
  }

  // Define which page component to render inside the layout
  const renderPageContent = () => {
    switch (currentPage) {
      case 'home':
        // Show AdminDashboard if admin is logged in, otherwise show citizen DashboardPage
        return userInfo?.isAdmin ? <AdminDashboardPage issues={issues} setIssues={setIssues} navigateTo={navigateTo} userInfo={userInfo} /> : <DashboardPage issues={issues} />;
      case 'report':
        // Protected via navigateTo
        return <ReportIssuePage navigateTo={navigateTo} onReportSubmit={handleAddIssue} />;
      case 'map':
        return <PublicMapPage issues={issues} />;
      case 'my-profile':
        // Protected via navigateTo
        return <MyProfilePage userInfo={userInfo} />;
      case 'all-issues':
        return <AllIssuesPage navigateTo={navigateTo} />;
      case 'issue-detail':
        return <IssueDetailPage issueId={selectedIssueId} navigateTo={navigateTo} userInfo={userInfo} />; // Pass userInfo for comment check
      case 'admin-dashboard':
         // Protected via navigateTo
         return <AdminDashboardPage issues={issues} setIssues={setIssues} navigateTo={navigateTo} userInfo={userInfo} />;
      case 'volunteer-requests':
         // Protected via navigateTo
         return <VolunteerRequestsPage userInfo={userInfo} />;
      default:
        // Default to the correct dashboard based on login status
        return userInfo?.isAdmin ? <AdminDashboardPage issues={issues} setIssues={setIssues} navigateTo={navigateTo} userInfo={userInfo} /> : <DashboardPage issues={issues} />;
    }
  };

  // Render the main layout for logged-in users or public pages
  return (
    <DashboardLayout
      navigateTo={navigateTo}
      userInfo={userInfo}
      onLogout={handleLogout}
    >
      {renderPageContent()}
    </DashboardLayout>
  );
}