import React, { useState, useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon paths (bundler issue with Vite)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Default center — Karachi
const DEFAULT_CENTER = { lat: 24.8607, lng: 67.0011 };

const LocationPicker = ({
  latitude,
  longitude,
  address,
  onChange,
  height = 320,
}) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const initialLat = parseFloat(latitude) || DEFAULT_CENTER.lat;
  const initialLng = parseFloat(longitude) || DEFAULT_CENTER.lng;
  const hasCoords = !!(latitude && longitude);

  /* -----------------------------------------------------------
     Initialize the map once
     ----------------------------------------------------------- */
  useEffect(() => {
    if (mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: [initialLat, initialLng],
      zoom: hasCoords ? 15 : 11,
      scrollWheelZoom: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    const marker = L.marker([initialLat, initialLng], {
      draggable: true,
    }).addTo(map);

    // Click on map moves the marker
    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      marker.setLatLng([lat, lng]);
      onChange({
        latitude: lat.toFixed(8),
        longitude: lng.toFixed(8),
      });
    });

    // Drag marker updates coordinates
    marker.on('dragend', () => {
      const { lat, lng } = marker.getLatLng();
      onChange({
        latitude: lat.toFixed(8),
        longitude: lng.toFixed(8),
      });
    });

    mapInstanceRef.current = map;
    markerRef.current = marker;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* -----------------------------------------------------------
     Sync map/marker when lat/lng props change externally
     ----------------------------------------------------------- */
  useEffect(() => {
    if (!mapInstanceRef.current || !markerRef.current) return;

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    if (isNaN(lat) || isNaN(lng)) return;

    const current = markerRef.current.getLatLng();
    if (current.lat !== lat || current.lng !== lng) {
      markerRef.current.setLatLng([lat, lng]);
      mapInstanceRef.current.setView([lat, lng], 15);
    }
  }, [latitude, longitude]);

  /* -----------------------------------------------------------
     Debounced Nominatim search
     ----------------------------------------------------------- */
  useEffect(() => {
    if (!searchTerm.trim() || searchTerm.length < 3) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            searchTerm
          )}&limit=6&addressdetails=1`,
          {
            headers: {
              // Nominatim requires a User-Agent or email for heavy use
              'Accept': 'application/json',
            },
          }
        );
        const data = await res.json();
        setSuggestions(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Nominatim search failed:', err);
        setSuggestions([]);
      } finally {
        setSearching(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  /* -----------------------------------------------------------
     Handle selecting a search result
     ----------------------------------------------------------- */
  const handleSelectSuggestion = useCallback(
    (place) => {
      const lat = parseFloat(place.lat);
      const lng = parseFloat(place.lon);

      if (mapInstanceRef.current && markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
        mapInstanceRef.current.setView([lat, lng], 15);
      }

      onChange({
        latitude: lat.toFixed(8),
        longitude: lng.toFixed(8),
        address: place.display_name,
      });

      setSearchTerm(place.display_name);
      setSuggestions([]);
      setShowSuggestions(false);
    },
    [onChange]
  );

  /* -----------------------------------------------------------
     Hide suggestions when clicking outside
     ----------------------------------------------------------- */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.location-picker-search')) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="location-picker">
      {/* ---------- Search box ---------- */}
      <div className="location-picker-search">
        <div className="location-search-input-wrap">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search address or place — e.g. 'Karachi Korangi'"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
          />
          {searching && <i className="fas fa-spinner fa-spin"></i>}
          {searchTerm && !searching && (
            <button
              type="button"
              className="location-search-clear"
              onClick={() => {
                setSearchTerm('');
                setSuggestions([]);
              }}
              aria-label="Clear search"
            >
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>

        {showSuggestions && suggestions.length > 0 && (
          <ul className="location-suggestions">
            {suggestions.map((place) => (
              <li key={place.place_id}>
                <button
                  type="button"
                  onClick={() => handleSelectSuggestion(place)}
                >
                  <i className="fas fa-map-marker-alt"></i>
                  <span>{place.display_name}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ---------- Map ---------- */}
      <div
        ref={mapRef}
        className="location-picker-map"
        style={{ height }}
      />

      {/* ---------- Manual lat/lng fields ---------- */}
      <div className="location-picker-coords">
        <div className="location-coord-field">
          <label>Latitude</label>
          <input
            type="number"
            step="any"
            value={latitude || ''}
            onChange={(e) =>
              onChange({ latitude: e.target.value })
            }
            placeholder="24.8607"
          />
        </div>
        <div className="location-coord-field">
          <label>Longitude</label>
          <input
            type="number"
            step="any"
            value={longitude || ''}
            onChange={(e) =>
              onChange({ longitude: e.target.value })
            }
            placeholder="67.0011"
          />
        </div>
      </div>

      <p className="location-picker-hint">
        <i className="fas fa-info-circle"></i>
        Search for a place, click the map, or drag the pin to set your exact
        location.
      </p>
    </div>
  );
};

export default LocationPicker;