// frontend/src/components/AdminDashboardPage.jsx

import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { BarChart, PieChart, Pie, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Users, FileText, UserCheck, CheckSquare, Search } from 'lucide-react';

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center">
    <div className={`p-3 rounded-full mr-4 ${color}`}>{icon}</div>
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

export default function AdminDashboardPage({ issues = [], setIssues, navigateTo, userInfo }) {
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // State for the search input

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.get('http://localhost:5000/api/admin/stats', config);
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch admin stats:", error);
      }
    };
    if (userInfo?.token) {
      fetchStats();
    }
  }, [userInfo?.token]);

  const handleStatusChange = async (issueId, newStatus) => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data: updatedIssue } = await axios.put(
        `http://localhost:5000/api/issues/${issueId}/status`,
        { status: newStatus },
        config
      );
      setIssues(
        issues.map((issue) =>
          issue._id === updatedIssue._id ? { ...issue, status: updatedIssue.status } : issue
        )
      );
    } catch (error) {
      alert('Failed to update status. Please try again.');
    }
  };

  const chartData = useMemo(() => {
    if (!issues || issues.length === 0) return { categoryData: [], statusData: [] };
    const categoryCounts = issues.reduce((acc, issue) => { acc[issue.category] = (acc[issue.category] || 0) + 1; return acc; }, {});
    const categoryData = Object.keys(categoryCounts).map(name => ({ name: name.charAt(0).toUpperCase() + name.slice(1).replace('-', ' '), count: categoryCounts[name] }));
    const statusCounts = issues.reduce((acc, issue) => { acc[issue.status] = (acc[issue.status] || 0) + 1; return acc; }, { Open: 0, 'In Progress': 0, Resolved: 0 });
    const statusData = [
      { name: t('open'), value: statusCounts.Open },
      { name: t('in_progress'), value: statusCounts['In Progress'] },
      { name: t('resolved'), value: statusCounts.Resolved },
    ];
    return { categoryData, statusData };
  }, [issues, t]);
  
  // Filter issues based on the search term
  const filteredIssues = useMemo(() => {
    return issues.filter(issue => 
      issue.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [issues, searchTerm]);

  const PIE_COLORS = ['#EF4444', '#F59E0B', '#10B981'];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">{t('admin_dashboard')}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Issues" value={stats?.totalIssues ?? '...'} icon={<FileText />} color="bg-blue-100 text-blue-600" />
        <StatCard title="Total Users" value={stats?.totalUsers ?? '...'} icon={<Users />} color="bg-indigo-100 text-indigo-600" />
        <StatCard title="Pending Volunteers" value={stats?.pendingVolunteers ?? '...'} icon={<UserCheck />} color="bg-yellow-100 text-yellow-600" />
        <StatCard title="Resolved (30d)" value={stats?.resolvedLast30Days ?? '...'} icon={<CheckSquare />} color="bg-green-100 text-green-600" />
      </div>

      {/* All Issues Management Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-700">Manage All Issues</h2>
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
        <div className="overflow-y-auto h-[500px]">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Issue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reported By</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredIssues.map(issue => (
                <tr key={issue._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{issue.title}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{issue.user.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(issue.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${issue.status === 'Open' ? 'bg-red-100 text-red-800' : issue.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                      {issue.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right flex items-center justify-end space-x-2">
                    <select
                      onChange={(e) => handleStatusChange(issue._id, e.target.value)}
                      value={issue.status}
                      className="text-xs rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    >
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                    <button onClick={() => navigateTo('issue-detail', issue._id)} className="text-indigo-600 hover:text-indigo-900 font-semibold text-sm">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">{t('issues_by_category')}</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.categoryData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" fontSize={12} />
              <YAxis allowDecimals={false} fontSize={12} />
              <Tooltip />
              <Bar dataKey="count" fill="#4F46E5" name={t('issues')} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">{t('issues_by_status')}</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={chartData.statusData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} dataKey="value" nameKey="name" paddingAngle={5}>
                {chartData.statusData.map((entry, index) => <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}