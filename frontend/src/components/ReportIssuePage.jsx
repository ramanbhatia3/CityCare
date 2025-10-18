// frontend/src/components/ReportIssuePage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const LocationIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>;
const UploadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>;

export default function ReportIssuePage({ navigateTo, onReportSubmit }) {
  const [issueTitle, setIssueTitle] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  const [issueCategory, setIssueCategory] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState('');
  const [location, setLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 20.5937, lng: 78.9629 });
  const [wantsToVolunteer, setWantsToVolunteer] = useState(false); // ✅ State for the volunteer checkbox

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFilePreview(URL.createObjectURL(file));
    }
  };

  const handleCenterOnMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const currentLocation = { lat: position.coords.latitude, lng: position.coords.longitude };
          setMapCenter(currentLocation);
          setLocation(currentLocation);
        },
        () => alert('Unable to retrieve your location. Please select it manually on the map.')
      );
    }
  };

  useEffect(() => {
    handleCenterOnMyLocation();
  }, []);

  const onMapClick = useCallback((event) => {
    setLocation({ lat: event.latLng.lat(), lng: event.latLng.lng() });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!issueTitle || !issueDescription || !issueCategory || !city || !state || !selectedFile || !location) {
      alert('Please fill out all fields, upload a photo, and select a location on the map.');
      return;
    }

    const formData = new FormData();
    formData.append('title', issueTitle);
    formData.append('description', issueDescription);
    formData.append('category', issueCategory);
    formData.append('latitude', location.lat);
    formData.append('longitude', location.lng);
    formData.append('city', city);
    formData.append('state', state);
    formData.append('image', selectedFile);

    // Pass both the form data and the volunteer status to the handler in App.jsx
    onReportSubmit(formData, wantsToVolunteer);
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <main className="flex-grow container mx-auto px-6 py-12">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Report a Civic Issue</h1>
        <p className="text-gray-600 mb-6">Fill out the details below. Your report helps us improve our city.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ... (all the other form fields: title, description, city, state, category, map) ... */}
          <div>
            <label htmlFor="issue-title" className="block text-sm font-medium text-gray-700 mb-1">Issue Title</label>
            <input type="text" id="issue-title" value={issueTitle} onChange={(e) => setIssueTitle(e.target.value)} placeholder="e.g., Overflowing rubbish bin" className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500" required />
          </div>
          <div>
            <label htmlFor="issue-description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea id="issue-description" rows="4" value={issueDescription} onChange={(e) => setIssueDescription(e.target.value)} placeholder="Provide more details about the issue..." className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500" required></textarea>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input type="text" id="city" value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g., Mumbai" className="w-full rounded-lg border-gray-300" required />
            </div>
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">State</label>
              <input type="text" id="state" value={state} onChange={(e) => setState(e.target.value)} placeholder="e.g., Maharashtra" className="w-full rounded-lg border-gray-300" required />
            </div>
          </div>
          <div>
            <label htmlFor="issue-category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select id="issue-category" value={issueCategory} onChange={(e) => setIssueCategory(e.target.value)} className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500" required>
              <option value="" disabled>Select a category</option>
              <option value="pothole">Pothole</option>
              <option value="garbage">Garbage Collection</option>
              <option value="street-light">Broken Streetlight</option>
              <option value="water-leakage">Water Leakage</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Location on Map</label>
            <button
              type="button"
              onClick={handleCenterOnMyLocation}
              className="w-full flex items-center justify-center mb-4 px-4 py-2 border rounded-lg transition-colors duration-200 bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
            >
              <LocationIcon /> Center on My Current Location
            </button>
            <div className="h-80 w-full rounded-lg overflow-hidden border">
              <GoogleMap
                mapContainerStyle={{ width: '100%', height: '100%' }}
                center={mapCenter}
                zoom={12}
                onClick={onMapClick}
              >
                {location && <Marker position={location} />}
              </GoogleMap>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload Photo</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <UploadIcon />
                <div className="flex text-sm text-gray-600">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                    <span>Upload a file</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" required />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
          </div>
          {filePreview && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Photo Preview:</p>
              <img src={filePreview} alt="Selected file preview" className="rounded-lg max-h-60 mx-auto"/>
            </div>
          )}

          {/* ✅ START: Volunteer Checkbox Section */}
          <div className="pt-4 border-t">
            <label htmlFor="volunteer-checkbox" className="flex items-center space-x-3 cursor-pointer">
              <input 
                type="checkbox" 
                id="volunteer-checkbox"
                checked={wantsToVolunteer}
                onChange={(e) => setWantsToVolunteer(e.target.checked)}
                className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" 
              />
              <span className="text-sm font-medium text-gray-700">I would like to volunteer to help resolve this issue.</span>
            </label>
            <p className="text-xs text-gray-500 mt-1 pl-8">If you volunteer, an authority will review your request and may grant you permission to resolve the issue yourself.</p>
          </div>
          {/* ✅ END: Volunteer Checkbox Section */}

          <div className="flex items-center justify-end space-x-4 pt-4">
            <button type="button" onClick={() => navigateTo('home')} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
              Cancel
            </button>
            <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">
              Submit Report
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}