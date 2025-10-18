// frontend/src/components/PublicMapPage.jsx

import React, { useState, useMemo } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';

// ✅ NEW: Helper function to generate custom SVG map marker icons with different colors
const getMarkerIcon = (color) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="${color}" stroke="white" stroke-width="1.5">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

const statusColors = {
  Open: '#EF4444', // Red
  'In Progress': '#F59E0B', // Amber/Yellow
  Resolved: '#10B981', // Green
};

const defaultPosition = { lat: 20.5937, lng: 78.9629 };
const mapContainerStyle = { width: '100%', height: '100%' };

export default function PublicMapPage({ issues }) {
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All'); // ✅ NEW: State for the active filter

  // ✅ NEW: Memoized filtering logic for performance
  const filteredIssues = useMemo(() => {
    if (activeFilter === 'All') {
      return issues;
    }
    return issues.filter(issue => issue.status === activeFilter);
  }, [issues, activeFilter]);

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  if (loadError) return <div>Error loading map.</div>;
  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    // ✅ The main container is now a flex column to hold the filters and the map
    <div className="w-full h-full flex flex-col gap-4">
      {/* START: Filter Buttons */}
      <div className="bg-white p-2 rounded-lg shadow-md flex items-center justify-center space-x-2">
        {['All', 'Open', 'In Progress', 'Resolved'].map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${
              activeFilter === filter
                ? 'bg-indigo-600 text-white shadow'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>
      {/* END: Filter Buttons */}
      
      <div className="w-full flex-grow rounded-lg overflow-hidden shadow-md">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={defaultPosition}
          zoom={5}
          onClick={() => setSelectedIssue(null)} // Close InfoWindow when map is clicked
        >
          {filteredIssues.map((issue) => (
            <Marker
              key={issue._id}
              position={{ lat: issue.location.latitude, lng: issue.location.longitude }}
              onClick={() => setSelectedIssue(issue)}
              // ✅ Set the custom, color-coded icon for the marker
              icon={{
                url: getMarkerIcon(statusColors[issue.status] || '#808080'), // Default to gray
                scaledSize: new window.google.maps.Size(32, 32),
              }}
            />
          ))}

          {selectedIssue && (
            <InfoWindow
              position={{ lat: selectedIssue.location.latitude, lng: selectedIssue.location.longitude }}
              onCloseClick={() => setSelectedIssue(null)}
            >
              <div className="w-48">
                <h3 className="font-bold text-base mb-1">{selectedIssue.title}</h3>
                <p className="text-xs text-gray-600 mb-2 capitalize">
                  Status: <strong style={{ color: statusColors[selectedIssue.status] }}>{selectedIssue.status}</strong>
                </p>
                {selectedIssue.filePreview && (
                  <img src={selectedIssue.filePreview} alt={selectedIssue.title} className="w-full h-auto rounded-md object-cover"/>
                )}
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>
    </div>
  );
}