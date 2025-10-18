// frontend/src/components/MyProfilePage.jsx

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

// --- Child Components (No changes here) ---

const CategoryTag = ({ category }) => {
  const categoryStyles = {
    pothole: 'bg-red-100 text-red-800',
    garbage: 'bg-green-100 text-green-800',
    'street-light': 'bg-yellow-100 text-yellow-800',
    'water-leakage': 'bg-blue-100 text-blue-800',
    other: 'bg-gray-100 text-gray-800',
  };
  return (<span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${categoryStyles[category] || categoryStyles['other']}`}>{category.replace('-', ' ')}</span>);
};

const FeedbackForm = ({ issue, userInfo, onFeedbackSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [hover, setHover] = useState(0);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Please select a star rating.');
      return;
    }
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.put(`http://localhost:5000/api/issues/${issue._id}/feedback`, { rating, feedback }, config);
      onFeedbackSubmitted(data);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to submit feedback.');
    }
  };
  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
      <form onSubmit={handleSubmit}>
        <h4 className="font-semibold text-gray-700 mb-2">Rate our service</h4>
        <div className="flex items-center mb-3">
          {[...Array(5)].map((star, index) => {
            const ratingValue = index + 1;
            return (
              <button type="button" key={ratingValue} className={`text-3xl transition-colors duration-200 ${ratingValue <= (hover || rating) ? 'text-yellow-400' : 'text-gray-300'}`} onClick={() => setRating(ratingValue)} onMouseEnter={() => setHover(ratingValue)} onMouseLeave={() => setHover(0)}>&#9733;</button>
            );
          })}
        </div>
        <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="Add an optional comment..." className="w-full p-2 border rounded-md text-sm" rows="2" />
        <button type="submit" className="mt-2 px-4 py-1.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700">Submit Feedback</button>
      </form>
    </div>
  );
};

const SubmittedFeedback = ({ rating, feedback }) => (
  <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
    <h4 className="font-semibold text-green-800 mb-2">Your Feedback</h4>
    <div className="flex items-center text-yellow-500 mb-1">
      {[...Array(rating)].map((_, i) => <span key={i} className="text-2xl">&#9733;</span>)}
      {[...Array(5 - rating)].map((_, i) => <span key={i} className="text-2xl text-gray-300">&#9733;</span>)}
    </div>
    {feedback && <p className="text-sm text-gray-600 italic">"{feedback}"</p>}
  </div>
);

const VolunteerStatus = ({ status }) => {
  const styles = {
    Pending: 'bg-yellow-100 text-yellow-800',
    Approved: 'bg-green-100 text-green-800',
    Rejected: 'bg-red-100 text-red-800',
  };
  if (!status) return null;
  return <div className={`text-xs font-bold uppercase px-2 py-1 rounded-full ${styles[status]}`}>Volunteer: {status}</div>;
};

const CertificateOfAppreciation = ({ userName, issueTitle }) => (
  <div className="mt-4 p-4 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg border-2 border-blue-200 text-center">
    <div className="font-bold text-blue-800 text-lg">🏆 Certificate of Appreciation 🏆</div>
    <p className="text-sm text-gray-600 mt-2">This certificate is proudly awarded to</p>
    <p className="text-xl font-semibold text-indigo-700 my-1">{userName}</p>
    <p className="text-sm text-gray-600">for their outstanding civic duty in resolving the issue:</p>
    <p className="text-md font-medium text-gray-800 mt-1">"{issueTitle}"</p>
  </div>
);

// --- Main Component ---

export default function MyProfilePage({ userInfo }) {
  const { t } = useTranslation();
  const [myIssues, setMyIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(''); // ✅ State for the stable avatar

  useEffect(() => {
    // ✅ Logic to get the stable avatar URL from sessionStorage
    let seed = sessionStorage.getItem('avatarSeed');
    if (!seed) {
      seed = Math.random();
      sessionStorage.setItem('avatarSeed', seed);
    }
    // Using a larger size for the profile page
    setAvatarUrl(`https://i.pravatar.cc/80?u=${seed}`);

    const fetchMyIssues = async () => {
      try {
        if (!userInfo || !userInfo.token) { throw new Error('You must be logged in to view your profile.'); }
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.get('http://localhost:5000/api/issues/myissues', config);
        const adaptedIssues = data.map(issue => ({ ...issue, filePreview: issue.imageUrl }));
        setMyIssues(adaptedIssues);
      } catch (err) {
        setError('Could not fetch your reports. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchMyIssues();
  }, [userInfo]);

  const handleFeedbackSubmitted = (updatedIssue) => {
    setMyIssues(myIssues.map(issue => (issue._id === updatedIssue._id ? { ...issue, ...updatedIssue, filePreview: updatedIssue.imageUrl } : issue)));
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-6">
        <img
          src={avatarUrl} // ✅ Use the stable avatar URL from state
          alt="User Avatar"
          className="w-20 h-20 rounded-full object-cover"
        />
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{userInfo.name}</h1>
          <p className="text-md text-gray-500">{userInfo.email}</p>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('my_submitted_reports')}</h2>

        {loading && <p className="text-gray-600">{t('loading_reports')}</p>}
        {error && <p className="text-red-500 font-semibold">{error}</p>}

        {!loading && !error && (
          myIssues.length === 0 ? (
            <div className="text-center py-16 px-4 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-700">{t('no_reports_found')}</h3>
              <p className="text-gray-500 mt-2">{t('no_reports_prompt')}</p>
            </div>
          ) : (
            <div className="space-y-6">
              {myIssues.map((issue) => (
                <div key={issue._id} className="bg-white rounded-xl shadow-lg overflow-hidden transition-shadow duration-300 hover:shadow-xl">
                  <div className="flex flex-col md:flex-row">
                    <img src={issue.filePreview} alt={issue.title} className="w-full md:w-1/3 h-48 md:h-auto object-cover" />
                    <div className="p-6 flex-grow">
                      <div className="flex justify-between items-start">
                        <h3 className="text-xl font-bold text-gray-900">{issue.title}</h3>
                        <CategoryTag category={issue.category} />
                      </div>
                      <p className="mt-2 text-sm text-gray-600">{issue.description}</p>
                      <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
                        <span>📍 {issue.city}, {issue.state}</span>
                        <span className={`font-semibold px-2 py-1 rounded-full text-xs ${issue.status === 'Open' ? 'bg-blue-100 text-blue-800' : issue.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>{issue.status}</span>
                      </div>
                      <div className="mt-4"><VolunteerStatus status={issue.volunteerRequest} /></div>
                    </div>
                  </div>
                  <div className="p-6 pt-0">
                    {issue.volunteerRequest === 'Approved' && issue.status === 'Resolved' && (
                      <CertificateOfAppreciation userName={userInfo.name} issueTitle={issue.title} />
                    )}
                    {issue.status === 'Resolved' && (
                      issue.rating ? (
                        <SubmittedFeedback rating={issue.rating} feedback={issue.feedback} />
                      ) : (
                        <FeedbackForm issue={issue} userInfo={userInfo} onFeedbackSubmitted={handleFeedbackSubmitted} />
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}