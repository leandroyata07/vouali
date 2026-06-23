import React from 'react';
import { Compass, ExternalLink, Navigation } from 'lucide-react';

function getCardinalDirection(bearing) {
  if (bearing === null || bearing === undefined) return '--';
  const index = Math.round(bearing / 45) % 8;
  const directions = [
    'Norte (N)', 
    'Nordeste (NE)', 
    'Leste (L)', 
    'Sudeste (SE)', 
    'Sul (S)', 
    'Sudoeste (SO)', 
    'Oeste (O)', 
    'Noroeste (NO)'
  ];
  return directions[index];
}

const formatDistance = (dist) => {
  if (dist === null || dist === undefined) return '--';
  if (dist < 1) {
    return `${(dist * 1000).toFixed(0)} metros`;
  }
  return `${dist.toFixed(2)} km`;
};

const formatDuration = (seconds) => {
  if (seconds === null || seconds === undefined) return '--';
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}min`;
};

export default function NavigationDashboard({
  distance,
  bearing,
  routeDistance,
  routeDuration,
  destinationName,
  currentCoords,
  destinationCoords,
  loading
}) {
  const hasData = distance !== null && bearing !== null;

  const googleMapsUrl = currentCoords && destinationCoords
    ? `https://www.google.com/maps/dir/?api=1&origin=${currentCoords.lat},${currentCoords.lng}&destination=${destinationCoords.lat},${destinationCoords.lng}&travelmode=driving`
    : '#';

  return (
    <div className="glass-panel flex-column gap-1 align-center text-center">
      <div className="flex-row align-center justify-between" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <h3 className="flex-row align-center gap-05" style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Compass className="text-accent" size={18} />
          Bússola & Telemetria
        </h3>
        
        {loading && (
          <span className="status-badge loading" style={{ fontSize: '0.7rem' }}>
            <span className="loading-spinner-small"></span>
            Traçando Rota...
          </span>
        )}
      </div>

      {hasData ? (
        <div className="flex-column align-center w-100" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <p className="text-muted-class" style={{ fontSize: '0.85rem', marginBottom: '0.2rem' }}>
            Rumo a: <strong style={{ color: 'var(--text-primary)' }}>{destinationName || 'Destino'}</strong>
          </p>


          <div className="compass-wrapper">
            <div className="compass">
              <span className="compass-direction n">N</span>
              <span className="compass-direction e">L</span>
              <span className="compass-direction s">S</span>
              <span className="compass-direction w">O</span>
              
              <div 
                className="compass-needle" 
                style={{ transform: `rotate(${bearing}deg)` }}
              ></div>
              
              <div className="compass-center"></div>
            </div>
          </div>


          <div className="data-grid">

            <div className="data-item" style={{ borderLeft: '3px solid var(--accent-color)' }}>
              <div className="data-label" style={{ color: 'var(--accent-color)' }}>Distância por Ruas</div>
              <div className="data-value">{formatDistance(routeDistance)}</div>
            </div>
            

            <div className="data-item">
              <div className="data-label">Tempo de Viagem</div>
              <div className="data-value">{formatDuration(routeDuration)}</div>
            </div>


            <div className="data-item">
              <div className="data-label">Distância em Linha Reta</div>
              <div className="data-value" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                {formatDistance(distance)}
              </div>
            </div>


            <div className="data-item">
              <div className="data-label">Rumo Bússola</div>
              <div className="data-value" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                {bearing.toFixed(0)}° ({getCardinalDirection(bearing).split(' ')[1] || ''})
              </div>
            </div>
          </div>

          <a 
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary flex-row align-center justify-center gap-05"
            style={{ marginTop: '1.25rem', padding: '0.65rem' }}
          >
            <ExternalLink size={14} />
            Ver Rota no Google Maps
          </a>
        </div>
      ) : (
        <div className="flex-column align-center justify-center" style={{ height: '240px', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Navigation size={36} className="animate-bounce" style={{ marginBottom: '0.75rem' }} />
          <p style={{ maxWidth: '240px', fontSize: '0.85rem' }}>
            Aguardando posições de partida e destino para iniciar as medições.
          </p>
        </div>
      )}
    </div>
  );
}
