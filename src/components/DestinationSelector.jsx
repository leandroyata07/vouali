import React from 'react';
import { Target, Search } from 'lucide-react';

export default function DestinationSelector({
  destinationInput,
  onDestinationInputChange,
  onResolveDestination,
  resolvedDestinationName,
  loading
}) {
  return (
    <div className="glass-panel flex-column gap-1">
      <h3 className="flex-row align-center gap-05" style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Target className="text-accent" size={18} />
        Onde quer ir?
      </h3>

      <form onSubmit={onResolveDestination} className="flex-column gap-05" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div className="form-group" style={{ margin: 0 }}>
          <input
            type="text"
            className="input-control"
            placeholder="Digite o destino (ex: Cristo Redentor ou São Paulo)"
            value={destinationInput}
            onChange={(e) => onDestinationInputChange(e.target.value)}
            required
          />
        </div>

        <button 
          type="submit" 
          className="btn btn-primary flex-row align-center justify-center gap-05"
          disabled={loading || !destinationInput.trim()}
          style={{ width: '100%' }}
        >
          {loading ? (
            <span className="loading-spinner-small"></span>
          ) : (
            <>
              <Search size={16} />
              Calcular Direção
            </>
          )}
        </button>

        {resolvedDestinationName && (
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Destino definido: <strong style={{ color: 'var(--text-primary)' }}>{resolvedDestinationName}</strong>
          </p>
        )}
      </form>
    </div>
  );
}
