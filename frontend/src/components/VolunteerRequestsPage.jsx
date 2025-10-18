// frontend/src/components/VolunteerRequestsPage.jsx

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

export default function VolunteerRequestsPage({ userInfo }) {
  const { t } = useTranslation();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.get('http://localhost:5000/api/issues/volunteer-requests', config);
        setRequests(data);
      } catch (err) {
        setError('Failed to fetch volunteer requests.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, [userInfo.token]);

  const handleManageRequest = async (issueId, decision) => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.put(`http://localhost:5000/api/issues/${issueId}/volunteer/manage`, { decision }, config);
      setRequests(requests.filter(req => req._id !== issueId));
    } catch (err) {
      alert(`Failed to ${decision.toLowerCase()} request. Please try again.`);
      console.error(err);
    }
  };

  if (loading) return <p>{t('loading_requests')}</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">{t('volunteer_requests')}</h1>
      
      {requests.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-gray-600">{t('no_pending_requests')}</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('issue_title')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('reported_by')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('date')}</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {requests.map(req => (
                <tr key={req._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{req.title}</div>
                    <div className="text-sm text-gray-500">{req.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{req.user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(req.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
                    <button onClick={() => handleManageRequest(req._id, 'Approved')} className="text-white bg-green-600 hover:bg-green-700 px-3 py-1 rounded-md">{t('approve')}</button>
                    <button onClick={() => handleManageRequest(req._id, 'Rejected')} className="text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md">{t('reject')}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}