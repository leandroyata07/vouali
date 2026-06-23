import React from 'react';
import { MapPin, Navigation, Compass, AlertCircle } from 'lucide-react';

export default function LocationCard({
  gpsCoords,
  resolvedLocationName,
  manualInput,
  onManualInputChange,
  onResolveManualLocation,
  useGps,
  setUseGps,
  gpsError,
  loading,
  onRetryGps
}) {
  return (
    <div className="glass-panel flex-column gap-1">
      <div className="flex-row align-center justify-between" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 className="flex-row align-center gap-05" style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <MapPin className="text-accent" size={18} />
          Ponto de Partida
        </h3>


        {useGps ? (
          gpsCoords ? (
            <span className="status-badge">
              <Navigation size={12} className="animate-pulse" />
              GPS Ativo
            </span>
          ) : gpsError ? (
            <span className="status-badge error">GPS Inativo</span>
          ) : (
            <span className="status-badge loading">
              <span className="loading-spinner-small"></span>
              GPS...
            </span>
          )
        ) : (
          <span className="status-badge" style={{ backgroundColor: 'var(--accent-glow)', color: 'var(--accent-color)' }}>
            Manual
          </span>
        )}
      </div>


      <div className="flex-row gap-1" style={{ display: 'flex', gap: '1rem', margin: '0.2rem 0' }}>
        <label className="flex-row align-center gap-05" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', cursor: 'pointer' }}>
          <input 
            type="radio" 
            name="loc-source" 
            checked={useGps} 
            onChange={() => {
              setUseGps(true);
              onRetryGps();
            }} 
          />
          Usar GPS do Dispositivo
        </label>
        <label className="flex-row align-center gap-05" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', cursor: 'pointer' }}>
          <input 
            type="radio" 
            name="loc-source" 
            checked={!useGps} 
            onChange={() => setUseGps(false)} 
          />
          Digitar Local Atual
        </label>
      </div>


      {useGps ? (
        <div className="flex-column gap-05">
          {gpsError ? (
            <div className="flex-column gap-05" style={{ background: 'rgba(239, 68, 68, 0.05)', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
              <p className="text-danger" style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <AlertCircle size={14} />
                {gpsError}
              </p>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => setUseGps(false)}
                style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem', width: 'auto', alignSelf: 'flex-start' }}
              >
                Mudar para entrada manual
              </button>
            </div>
          ) : gpsCoords ? (
            <div className="data-grid" style={{ marginTop: '0.25rem' }}>
              <div className="data-item">
                <div className="data-label">Latitude</div>
                <div className="data-value">{gpsCoords.lat.toFixed(5)}</div>
              </div>
              <div className="data-item">
                <div className="data-label">Longitude</div>
                <div className="data-value">{gpsCoords.lng.toFixed(5)}</div>
              </div>
            </div>
          ) : (
            <p className="text-muted-class" style={{ fontSize: '0.85rem', fontStyle: 'italic' }}>
              Aguardando permissão ou sinal do GPS...
            </p>
          )}
        </div>
      ) : (

        <form onSubmit={onResolveManualLocation} className="flex-column gap-05" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <input
              type="text"
              className="input-control"
              placeholder="Digite seu local atual (ex: Copacabana, Rio)"
              value={manualInput}
              onChange={(e) => onManualInputChange(e.target.value)}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-secondary flex-row align-center justify-center"
            disabled={loading || !manualInput.trim()}
            style={{ padding: '0.6rem' }}
          >
            {loading ? (
              <span className="loading-spinner-small"></span>
            ) : (
              'Buscar Local de Origem'
            )}
          </button>

          {resolvedLocationName && (
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Partindo de: <strong style={{ color: 'var(--text-primary)' }}>{resolvedLocationName}</strong>
            </p>
          )}
        </form>
      )}
    </div>
  );
}
