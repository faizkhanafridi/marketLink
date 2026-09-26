import React, { useEffect, useRef } from 'react';

const MapView = ({ latitude, longitude, markers = [], height = '400px', zoom = 13 }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!window.L || !mapRef.current) return;

    const L = window.L;
    const center = [latitude || 40.7128, longitude || -74.006];

    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView(center, zoom);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(mapInstanceRef.current);
    } else {
      mapInstanceRef.current.setView(center, zoom);
    }

    // Clear existing markers
    mapInstanceRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        mapInstanceRef.current.removeLayer(layer);
      }
    });

    // Add markers
    if (markers.length > 0) {
      markers.forEach((marker) => {
        const icon = L.divIcon({
          className: 'custom-map-marker',
          html: `<div class="marker-pin"><i class="fas fa-map-marker-alt"></i></div>`,
          iconSize: [30, 42],
          iconAnchor: [15, 42],
        });
        L.marker([marker.latitude, marker.longitude], { icon })
          .addTo(mapInstanceRef.current)
          .bindPopup(`<strong>${marker.title}</strong><br/>${marker.address || ''}`);
      });
    } else if (latitude && longitude) {
      L.marker([latitude, longitude]).addTo(mapInstanceRef.current);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [latitude, longitude, markers, zoom]);

  return (
    <div className="map-view-container" style={{ height }}>
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      />
      <script
        src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
        async
      ></script>
      <div ref={mapRef} style={{ height: '100%', width: '100%' }}></div>
    </div>
  );
};

export default MapView;