import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import L from 'leaflet';

const MyMap = ({ path, currentLocation, trainPosition }) => {
  const mapRef = useRef(null);
  const [locationNames, setLocationNames] = useState({}); // To store names of locations

  useEffect(() => {
    if (mapRef.current && trainPosition) {
      const map = mapRef.current;
      map.setView([trainPosition.latitude, trainPosition.longitude], map.getZoom());
    }
  }, [trainPosition]);

  // Function to get location name using reverse geocoding
  const getLocationName = async (latitude, longitude, index) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
      const data = await response.json();
      const locationName = data.address?.city || data.address?.town || data.address?.village || 'Unknown location';
      setLocationNames(prev => ({ ...prev, [index]: locationName }));
    } catch (error) {
      console.error('Error fetching location name:', error);
    }
  };

  useEffect(() => {
    // Fetch the location names for each pin in the path
    path.forEach((point, index) => {
      getLocationName(point.latitude, point.longitude, index);
    });
  }, [path]);

  return (
    <MapContainer
      center={[path[0]?.latitude || 0, path[0]?.longitude || 0]}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
      ref={mapRef}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Static Pins */}
      {path.map((point, index) => (
        <Marker
          key={index}
          position={[point.latitude, point.longitude]}
          icon={L.icon({ iconUrl: '/images/pin.png', iconSize: [32, 42] })} // Default pin icon
        >
          <Popup>
            {locationNames[index] || `Point ${index + 1}`} {/* Show location name or fallback */}
          </Popup>
        </Marker>
      ))}

      {/* Moving Train Icon */}
      {trainPosition && (
        <Marker
          position={[trainPosition.latitude, trainPosition.longitude]}
          icon={L.icon({ iconUrl: '/images/trainpin.png', iconSize: [52, 62] })} // Train icon
        >
          <Popup>
            Current Train Position
          </Popup>
        </Marker>
      )}

      {/* Path Lines */}
      {path.length > 0 && (
        <Polyline
          positions={path.map(point => [point.latitude, point.longitude])}
          color="blue"
          weight={3}
        />
      )}
    </MapContainer>
  );
};

export default MyMap;
