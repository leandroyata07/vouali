import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Map, Maximize2 } from 'lucide-react';

const currentLocIcon = L.divIcon({
  className: 'custom-pulse-marker',
  html: '<div class="pulse"></div>',
  iconSize: [20, 20],
  iconAnchor: [10, 10]
});

const destinationIcon = L.divIcon({
  className: 'custom-destination-marker',
  html: `
    <div style="
      background-color: var(--accent-color);
      border: 2px solid white;
      border-radius: 50% 50% 50% 0;
      width: 22px;
      height: 22px;
      transform: rotate(-45deg);
      box-shadow: 0 0 8px var(--accent-glow);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.3s ease;
    ">
      <div style="
        background-color: white;
        width: 7px;
        height: 7px;
        border-radius: 50%;
      "></div>
    </div>
  `,
  iconSize: [22, 22],
  iconAnchor: [11, 22]
});

function MapController({ currentCoords, destinationCoords, routeGeometry, fitTrigger }) {
  const map = useMap();
  const lastDestRef = React.useRef(null);
  const lastFitTriggerRef = React.useRef(fitTrigger);

  React.useEffect(() => {
    const hasDestChanged = !lastDestRef.current ||
      lastDestRef.current.lat !== destinationCoords?.lat ||
      lastDestRef.current.lng !== destinationCoords?.lng;

    const hasFitTriggered = fitTrigger !== lastFitTriggerRef.current;

    if (hasDestChanged || hasFitTriggered) {
      if (routeGeometry && routeGeometry.length > 0) {
        const bounds = L.latLngBounds(routeGeometry);
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
      } else if (currentCoords && destinationCoords) {
        const bounds = L.latLngBounds([
          [currentCoords.lat, currentCoords.lng],
          [destinationCoords.lat, destinationCoords.lng]
        ]);
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
      } else if (currentCoords) {
        map.setView([currentCoords.lat, currentCoords.lng], 13);
      }

      if (destinationCoords) {
        lastDestRef.current = destinationCoords;
      }
      lastFitTriggerRef.current = fitTrigger;
    }
  }, [currentCoords, destinationCoords, routeGeometry, fitTrigger, map]);

  return null;
}

export default function RouteMap({ currentCoords, destinationCoords, routeGeometry, destinationName }) {
  const defaultCenter = currentCoords ? [currentCoords.lat, currentCoords.lng] : [-22.9068, -43.1729];
  const defaultZoom = 12;


  const [fitTrigger, setFitTrigger] = useState(0);

  const handleResetZoom = () => {
    setFitTrigger(prev => prev + 1);
  };

  return (
    <div className="glass-panel flex-column gap-1">
      <div className="flex-row align-center justify-between" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 className="flex-row align-center gap-05" style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Map className="text-accent" size={18} />
          Visualização no Mapa
        </h3>
        

        {(currentCoords || destinationCoords) && (
          <button 
            onClick={handleResetZoom}
            className="btn btn-secondary flex-row align-center gap-05"
            style={{ 
              width: 'auto', 
              padding: '0.35rem 0.75rem', 
              fontSize: '0.75rem', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.35rem' 
            }}
            title="Redefinir enquadramento para mostrar todo o trajeto"
          >
            <Maximize2 size={12} />
            Enquadrar Rota
          </button>
        )}
      </div>
      
      <div className="map-container-wrapper">
        <MapContainer 
          center={defaultCenter} 
          zoom={defaultZoom} 
          scrollWheelZoom={true}
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />


          <MapController 
            currentCoords={currentCoords} 
            destinationCoords={destinationCoords} 
            routeGeometry={routeGeometry}
            fitTrigger={fitTrigger}
          />


          {currentCoords && (
            <Marker position={[currentCoords.lat, currentCoords.lng]} icon={currentLocIcon}>
              <Popup>
                <div style={{ color: '#000', fontSize: '0.85rem' }}>
                  <strong>Partida</strong><br />
                  Lat: {currentCoords.lat.toFixed(4)}<br />
                  Lng: {currentCoords.lng.toFixed(4)}
                </div>
              </Popup>
            </Marker>
          )}


          {destinationCoords && (
            <Marker position={[destinationCoords.lat, destinationCoords.lng]} icon={destinationIcon}>
              <Popup>
                <div style={{ color: '#000', fontSize: '0.85rem' }}>
                  <strong>Destino: {destinationName}</strong><br />
                  Lat: {destinationCoords.lat.toFixed(4)}<br />
                  Lng: {destinationCoords.lng.toFixed(4)}
                </div>
              </Popup>
            </Marker>
          )}


          {routeGeometry && routeGeometry.length > 0 && (
            <Polyline 
              positions={routeGeometry}
              color="var(--accent-color)"
              weight={5}
              opacity={0.85}
            />
          )}


          {currentCoords && destinationCoords && (
            <Polyline 
              positions={[
                [currentCoords.lat, currentCoords.lng],
                [destinationCoords.lat, destinationCoords.lng]
              ]}
              color="var(--accent-secondary)"
              weight={2}
              dashArray="5, 7"
              opacity={0.5}
            />
          )}
        </MapContainer>
      </div>
    </div>
  );
}
