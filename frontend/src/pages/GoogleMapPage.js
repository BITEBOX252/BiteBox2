import React, { useEffect, useRef } from 'react';

const GoogleMapPage = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    // Load Google Maps script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCWbFBhosePB6shdaRAQd-qfO1Z4w2GWYQ`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      if (window.google) {
        new window.google.maps.Map(mapRef.current, {
          center: { lat: 37.7749, lng: -122.4194 }, // San Francisco
          zoom: 12,
        });
      }
    };

    document.body.appendChild(script);
  }, []);

  return (
    <div>
      <h2>Google Map</h2>
      <div
        ref={mapRef}
        style={{ width: '100%', height: '500px', borderRadius: '10px' }}
      ></div>
    </div>
  );
};

export default GoogleMapPage;
