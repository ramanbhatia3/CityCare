import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Search, MapPin, Tag } from 'lucide-react';

// A reusable card component to display an issue
const IssueCard = ({ issue, navigateTo }) => (
  <div 
    className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl cursor-pointer"
    onClick={() => navigateTo('issue-detail', issue._id)}
  >
    <img src={issue.imageUrl} alt={issue.title} className="w-full h-48 object-cover" />
    <div className="p-4">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-bold text-gray-800 truncate">{issue.title}</h3>
        <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-2 py-1 rounded-full capitalize">{issue.category}</span>
      </div>
      <p className="text-sm text-gray-600 flex items-center">
        <MapPin className="w-4 h-4 mr-2 text-gray-400" />
        {issue.city}, {issue.state}
      </p>
    </div>
  </div>
);


export default function AllIssuesPage({ navigateTo }) {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  // Fetch all issues when the component loads
  useEffect(() => {
    const fetchAllIssues = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/issues');
        setIssues(data);
      } catch (err) {
        setError('Failed to fetch issues. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllIssues();
  }, []);

  // Memoize filtered results to avoid re-calculating on every render
  const filteredIssues = useMemo(() => {
    return issues.filter(issue => {
      const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesState = !selectedState || issue.state.toLowerCase() === selectedState.toLowerCase();
      const matchesCity = !selectedCity || issue.city.toLowerCase() === selectedCity.toLowerCase();
      return matchesSearch && matchesState && matchesCity;
    });
  }, [issues, searchTerm, selectedState, selectedCity]);
  
  // Get unique states and cities for filter dropdowns
  const uniqueStates = useMemo(() => [...new Set(issues.map(issue => issue.state))], [issues]);
  const uniqueCities = useMemo(() => [...new Set(issues.filter(issue => !selectedState || issue.state === selectedState).map(issue => issue.city))], [issues, selectedState]);

  if (loading) return <p className="text-center p-10">Loading issues...</p>;
  if (error) return <p className="text-center p-10 text-red-500">{error}</p>;

  return (
    <main className="flex-grow bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold text-gray-800">Community Issues Board</h1>
            <p className="mt-2 text-lg text-gray-600">Browse, search, and engage with reports from your community.</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-8 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-grow w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text"
              placeholder="Search by issue title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <select value={selectedState} onChange={(e) => { setSelectedState(e.target.value); setSelectedCity(''); }} className="w-full md:w-auto border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="">All States</option>
            {uniqueStates.map(state => <option key={state} value={state}>{state}</option>)}
          </select>
          <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} className="w-full md:w-auto border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="">All Cities</option>
            {uniqueCities.map(city => <option key={city} value={city}>{city}</option>)}
          </select>
        </div>

        {/* Issues Grid */}
        {filteredIssues.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredIssues.map(issue => (
              <IssueCard key={issue._id} issue={issue} navigateTo={navigateTo} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500">No issues found matching your criteria.</p>
          </div>
        )}
      </div>
    </main>
  );
}
