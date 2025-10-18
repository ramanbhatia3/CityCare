// frontend/src/components/DashboardPage.jsx
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next'; // ✅ Import hook
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// ... (Icon and StatCard components remain the same)
const TotalIcon = () => <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>;
const OpenIcon = () => <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>;
const InProgressIcon = () => <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>;
const ResolvedIcon = () => <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>;
const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
    <div className={`p-3 rounded-full mr-4 ${color}`}>{icon}</div>
    <div><p className="text-sm font-medium text-gray-500">{title}</p><p className="text-2xl font-bold text-gray-800">{value}</p></div>
  </div>
);


export default function DashboardPage({ issues }) {
  const { t } = useTranslation(); // ✅ Initialize hook
  
  const processedData = useMemo(() => {
    // ... (logic remains the same)
    if (!issues || issues.length === 0) {
      return { statusCounts: { Open: 0, 'In Progress': 0, Resolved: 0 }, categoryData: [], statusChartData: [] };
    }
    const statusCounts = issues.reduce((acc, issue) => { acc[issue.status] = (acc[issue.status] || 0) + 1; return acc; }, { Open: 0, 'In Progress': 0, Resolved: 0 });
    const categoryCounts = issues.reduce((acc, issue) => { acc[issue.category] = (acc[issue.category] || 0) + 1; return acc; }, {});
    const categoryData = Object.keys(categoryCounts).map(name => ({ name: name.charAt(0).toUpperCase() + name.slice(1).replace('-', ' '), count: categoryCounts[name] }));
    const statusChartData = [
      { name: t('open'), value: statusCounts.Open },
      { name: t('in_progress'), value: statusCounts['In Progress'] },
      { name: t('resolved'), value: statusCounts.Resolved },
    ];
    return { statusCounts, categoryData, statusChartData };
  }, [issues, t]); // Add t as a dependency

  const { statusCounts, categoryData, statusChartData } = processedData;
  const PIE_COLORS = ['#3B82F6', '#F59E0B', '#10B981'];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">{t('overview')}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title={t('total_issues')} value={issues.length} icon={<TotalIcon />} color="bg-gray-200 text-gray-700" />
        <StatCard title={t('open')} value={statusCounts.Open} icon={<OpenIcon />} color="bg-blue-100 text-blue-600" />
        <StatCard title={t('in_progress')} value={statusCounts['In Progress']} icon={<InProgressIcon />} color="bg-yellow-100 text-yellow-600" />
        <StatCard title={t('resolved')} value={statusCounts.Resolved} icon={<ResolvedIcon />} color="bg-green-100 text-green-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">{t('issues_by_category')}</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" fontSize={12} />
              <YAxis allowDecimals={false} fontSize={12} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: '14px' }} />
              <Bar dataKey="count" fill="#4F46E5" name={t('issues')} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">{t('issues_by_status')}</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={statusChartData} cx="50%" cy="50%" labelLine={false} outerRadius={110} dataKey="value" nameKey="name">
                {statusChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: '14px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}