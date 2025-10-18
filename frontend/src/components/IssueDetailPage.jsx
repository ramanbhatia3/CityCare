// frontend/src/components/IssueDetailPage.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MessageSquare, User, Calendar, MapPin, ShieldCheck, Upload, Send } from 'lucide-react';

// --- Reusable Child Components ---

// ✅ START: New WhatsApp Share Button Component
const WhatsAppIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.886-.001 2.269.655 4.505 1.905 6.37l-.558 2.035 2.074-.557z"></path></svg>;

const WhatsAppShareButton = ({ issue }) => {
  const pageUrl = window.location.href;
  const message = `Check out this civic issue on CityCare:\n\n*${issue.title}*\nLocation: ${issue.city}, ${issue.state}\n\nTrack its progress here:\n${pageUrl}`;
  
  // Encode the message for the URL
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors duration-200"
    >
      <WhatsAppIcon />
      Share
    </a>
  );
};
// ✅ END: New WhatsApp Share Button Component

const StatusBadge = ({ status }) => {
  const styles = {
    Open: 'bg-blue-100 text-blue-800', 'In Progress': 'bg-yellow-100 text-yellow-800', Resolved: 'bg-green-100 text-green-800',
  };
  return (<span className={`px-3 py-1 text-sm font-semibold rounded-full ${styles[status]}`}>{status}</span>);
};

const AuthorityUpdateForm = ({ issueId, userInfo, onUpdateAdded }) => {
  // ... (This component's code remains unchanged)
  const [text, setText] = useState(''); const [image, setImage] = useState(null); const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault(); if (!text.trim()) { alert('Update text cannot be empty.'); return; }
    setIsSubmitting(true);
    const formData = new FormData(); formData.append('text', text); if (image) { formData.append('image', image); }
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.post(`http://localhost:5000/api/issues/${issueId}/update`, formData, config);
      onUpdateAdded(data.authorityUpdates); setText(''); setImage(null); e.target.reset();
    } catch (error) { alert(error.response?.data?.message || 'Failed to post update.'); } 
    finally { setIsSubmitting(false); }
  };
  return (
    <div className="mt-6 bg-indigo-50 p-4 rounded-lg border border-indigo-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center"><ShieldCheck className="w-5 h-5 mr-2 text-indigo-600" />Post an Official Update</h3>
      <form onSubmit={handleSubmit}>
        <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Share a progress update..." className="w-full p-2 border rounded-md" rows="3" required/>
        <div className="mt-2 flex items-center justify-between">
          <label className="flex items-center text-sm text-gray-600 cursor-pointer"><Upload className="w-4 h-4 mr-2" /><span className={image ? 'text-green-600 font-semibold' : ''}>{image ? 'Image selected!' : 'Attach Photo (Optional)'}</span><input type="file" className="hidden" accept="image/*" onChange={(e) => setImage(e.target.files[0])} /></label>
          <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 flex items-center disabled:bg-indigo-400"><Send className="w-4 h-4 mr-2" />{isSubmitting ? 'Posting...' : 'Post'}</button>
        </div>
      </form>
    </div>
  );
};

// --- Main Page Component ---

export default function IssueDetailPage({ issueId, navigateTo, userInfo }) {
  const [issue, setIssue] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('official');

  useEffect(() => {
    // ... (This function's code remains unchanged)
    const fetchData = async () => {
      if (!issueId) { setError('No issue selected.'); setLoading(false); return; }
      try {
        setLoading(true);
        const issueRes = await axios.get(`http://localhost:5000/api/issues/${issueId}`); setIssue(issueRes.data);
        const commentsRes = await axios.get(`http://localhost:5000/api/comments/${issueId}`); setComments(commentsRes.data);
      } catch (err) { setError('Failed to load issue details.'); } 
      finally { setLoading(false); }
    };
    fetchData();
  }, [issueId]);

  const handleCommentSubmit = async (e) => {
    // ... (This function's code remains unchanged)
    e.preventDefault(); if (!newComment.trim()) return;
    try {
      const { token } = userInfo;
      const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } };
      const { data } = await axios.post(`http://localhost:5000/api/comments/${issueId}`, { text: newComment }, config);
      setComments([data, ...comments]); setNewComment('');
    } catch (err) { alert('Failed to post comment.'); }
  };
  
  const handleUpdateAdded = (newUpdates) => {
    setIssue({ ...issue, authorityUpdates: newUpdates });
  };

  if (loading) return <p className="text-center py-10">Loading Issue...</p>;
  if (error) return <p className="text-center py-10 text-red-600">{error}</p>;
  if (!issue) return null;

  return (
    <main className="space-y-8">
      <button onClick={() => navigateTo('all-issues')} className="text-indigo-600 hover:underline font-semibold">&larr; Back to All Issues</button>

      {/* --- Issue Header --- */}
      <div className="bg-white rounded-lg shadow-xl overflow-hidden">
        <img src={issue.imageUrl} alt={issue.title} className="w-full h-96 object-cover" />
        <div className="p-6 md:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-4">
            <h1 className="text-3xl font-bold text-gray-900 flex-1">{issue.title}</h1>
            {/* ✅ ADD THE WHATSAPP SHARE BUTTON HERE */}
            <div className="flex items-center space-x-4">
              <StatusBadge status={issue.status} />
              <WhatsAppShareButton issue={issue} />
            </div>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500 mb-4">
            <span className="flex items-center"><User className="w-4 h-4 mr-2" /> Reported by: <strong>{issue.user.name}</strong></span>
            <span className="flex items-center"><Calendar className="w-4 h-4 mr-2" /> On: {new Date(issue.createdAt).toLocaleDateString()}</span>
            <span className="flex items-center"><MapPin className="w-4 h-4 mr-2" /> Location: {issue.city}, {issue.state}</span>
          </div>
          <p className="text-gray-700 leading-relaxed">{issue.description}</p>
        </div>
      </div>

      {/* --- Tabbed Interface --- */}
      <div>
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-6" aria-label="Tabs">
            <button onClick={() => setActiveTab('official')} className={`flex items-center whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'official' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}><ShieldCheck className="w-5 h-5 mr-2" /> Official Updates</button>
            <button onClick={() => setActiveTab('community')} className={`flex items-center whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'community' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}><MessageSquare className="w-5 h-5 mr-2" /> Community Discussion</button>
          </nav>
        </div>
        <div className="pt-6">
          {activeTab === 'official' && (
            <div className="space-y-4">
              {issue.authorityUpdates && issue.authorityUpdates.length > 0 ? (
                <div className="space-y-4">
                  {issue.authorityUpdates.slice().reverse().map((update) => (
                    <div key={update._id} className="bg-white p-4 rounded-lg shadow">
                      {update.imageUrl && <img src={update.imageUrl} alt="Update" className="w-full rounded-md mb-3"/>}
                      <p className="text-gray-800">{update.text}</p>
                      <p className="text-xs text-gray-500 mt-2">- <strong>{update.updatedBy.name} (Authority)</strong> on {new Date(update.createdAt).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              ) : (<p className="text-center text-gray-500 py-4 bg-white rounded-lg shadow">No official updates have been posted yet.</p>)}
              {userInfo?.isAdmin && <AuthorityUpdateForm issueId={issue._id} userInfo={userInfo} onUpdateAdded={handleUpdateAdded} />}
            </div>
          )}
          {activeTab === 'community' && (
            <div className="space-y-4">
              <form onSubmit={handleCommentSubmit} className="bg-white p-4 rounded-lg shadow">
                <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Join the discussion..." className="w-full p-2 border rounded-md" rows="3"/>
                <button type="submit" className="mt-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">Post Comment</button>
              </form>
              <div className="space-y-4">
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <div key={comment._id} className="bg-white p-4 rounded-lg shadow">
                      <p className="text-gray-800">{comment.text}</p>
                      <p className="text-xs text-gray-500 mt-2">- <strong>{comment.user?.name || 'User'}</strong> on {new Date(comment.createdAt).toLocaleDateString()}</p>
                    </div>
                  ))
                ) : (<p className="text-center text-gray-500 py-4">No comments yet. Be the first to say something!</p>)}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}