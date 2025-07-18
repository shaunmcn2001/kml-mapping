import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';

function MapViewer() {
  const { token } = useContext(AuthContext);
  const { fileId } = useParams();
  const navigate = useNavigate();
  const [geoData, setGeoData] = useState(null);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL || ''}/api/kml/${fileId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setGeoData(data.geojson);
          setFileName(data.name || '');
        } else {
          setError('Failed to load map data.');
        }
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load map data.');
      }
    };
    fetchData();
  }, [fileId, token]);

  function FitBounds({ geojson }) {
    const map = useMap();
    useEffect(() => {
      if (geojson) {
        try {
          const layer = L.geoJSON(geojson);
          const bounds = layer.getBounds();
          if (bounds.isValid()) {
            map.fitBounds(bounds);
          }
        } catch (err) {
          console.error('Bounds error:', err);
        }
      }
    }, [geojson, map]);
    return null;
  }

  const geoStyle = {
    color: '#3388ff',
    weight: 2,
    opacity: 0.8,
    fillColor: '#3388ff',
    fillOpacity: 0.2
  };

  return (
    <div>
      <div className="topbar">
        <span className="logo">Spatial KML Viewer</span>
        <div>
          {fileName && <span style={{ marginRight: '10px' }}>{fileName}</span>}
          <button onClick={() => navigate('/')}>Back to Dashboard</button>
        </div>
      </div>

      {error && <p className="error">{error}</p>}

      {geoData && (
        <MapContainer className="map-container" center={[-33.865, 151.209]} zoom={6}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          <GeoJSON
            data={geoData}
            style={geoStyle}
            pointToLayer={(feature, latlng) =>
              L.circleMarker(latlng, {
                radius: 6,
                fillColor: '#3388ff',
                color: '#fff',
                weight: 1,
                opacity: 1,
                fillOpacity: 0.9
              })
            }
            onEachFeature={(feature, layer) => {
              if (feature.properties && feature.properties.name) {
                layer.bindPopup(feature.properties.name);
              }
            }}
          />
          <FitBounds geojson={geoData} />
        </MapContainer>
      )}
    </div>
  );
}

export default MapViewer;
