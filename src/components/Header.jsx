import React from 'react';
import { Compass, Sun, Moon } from 'lucide-react';

export default function Header({ theme, onToggleTheme }) {
  return (
    <header className="app-header glass-panel">
      <div className="app-logo">
        <Compass size={32} className="logo-icon" />
        <div>
          <h1 className="app-title">Vou Ali!</h1>
          <p className="app-subtitle" style={{ fontSize: '0.8rem' }}>Geolocalização simplificada</p>
        </div>
      </div>
      
      <button 
        className="theme-toggle-btn" 
        onClick={onToggleTheme}
        title={theme === 'light' ? 'Ativar Tema Escuro' : 'Ativar Tema Claro'}
        aria-label="Alternar tema"
      >
        {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
      </button>
    </header>
  );
}
