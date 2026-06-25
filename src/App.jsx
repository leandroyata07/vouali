import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import LocationCard from './components/LocationCard';
import DestinationSelector from './components/DestinationSelector';
import NavigationDashboard from './components/NavigationDashboard';
import RouteMap from './components/RouteMap';
import Footer from './components/Footer';



const getHaversineDistance = (coords1, coords2) => {
  if (!coords1 || !coords2) return null;
  const R = 6371;
  const dLat = ((coords2.lat - coords1.lat) * Math.PI) / 180;
  const dLon = ((coords2.lng - coords1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((coords1.lat * Math.PI) / 180) *
      Math.cos((coords2.lat * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};


const getBearing = (coords1, coords2) => {
  if (!coords1 || !coords2) return null;
  const lat1 = (coords1.lat * Math.PI) / 180;
  const lat2 = (coords2.lat * Math.PI) / 180;
  const lon1 = (coords1.lng * Math.PI) / 180;
  const lon2 = (coords2.lng * Math.PI) / 180;

  const dLon = lon2 - lon1;
  const y = Math.sin(dLon) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
  let bearing = Math.atan2(y, x);
  bearing = (bearing * 180) / Math.PI;
  return (bearing + 360) % 360;
};


const fetchOSRMRoute = async (origin, destination) => {
  if (!origin || !destination) return null;
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
      const route = data.routes[0];
      const points = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);
      return {
        points,
        distance: route.distance / 1000,
        duration: route.duration
      };
    }
    return null;
  } catch (error) {
    console.error('Erro ao buscar rota no OSRM:', error);
    return null;
  }
};

export default function App() {
  const [theme, setTheme] = useState('light');

  const [useGps, setUseGps] = useState(true);
  const [gpsCoords, setGpsCoords] = useState(null);
  const [gpsError, setGpsError] = useState(null);
  const [manualInput, setManualInput] = useState('');
  const [resolvedLocationName, setResolvedLocationName] = useState(null);

  const [destinationInput, setDestinationInput] = useState('');
  const [resolvedDestinationName, setResolvedDestinationName] = useState(null);

  const [currentCoords, setCurrentCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);

  const [distance, setDistance] = useState(null);
  const [bearing, setBearing] = useState(null);

  const [routeGeometry, setRouteGeometry] = useState(null);
  const [routeDistance, setRouteDistance] = useState(null);
  const [routeDuration, setRouteDuration] = useState(null);
  const [routeLoading, setRouteLoading] = useState(false);

  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);

  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, [theme]);

  const startGpsTracking = () => {
    if (!navigator.geolocation) {
      setGpsError('Geolocalização não suportada no seu navegador.');
      setUseGps(false);
      return;
    }

    setGpsError(null);
    const handleSuccess = (position) => {
      const coords = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      setGpsCoords(coords);
      setGpsError(null);
    };

    const handleError = (error) => {
      let msg = 'Erro ao capturar GPS.';
      if (error.code === error.PERMISSION_DENIED) {
        msg = 'Permissão de GPS negada.';
      }
      setGpsError(msg);
      setUseGps(false);
    };

    const options = { enableHighAccuracy: true, timeout: 8000 };
    const watchId = navigator.geolocation.watchPosition(handleSuccess, handleError, options);
    return watchId;
  };

  useEffect(() => {
    let watchId;
    if (useGps) {
      watchId = startGpsTracking();
    }
    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [useGps]);

  useEffect(() => {
    if (useGps && gpsCoords) {
      setCurrentCoords(gpsCoords);
      setResolvedLocationName('Minha Localização (GPS)');
    }
  }, [useGps, gpsCoords]);

  useEffect(() => {
    if (!useGps) {
      setCurrentCoords(null);
      setResolvedLocationName(null);
    }
  }, [useGps]);

  const geocodeAddress = async (query) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
          name: data[0].display_name
        };
      }
      return null;
    } catch (e) {
      console.error('Erro na geocodificação:', e);
      return null;
    }
  };

  const handleResolveManualLocation = async (e) => {
    e.preventDefault();
    if (!manualInput.trim()) return;

    setLoading(true);
    setSearchError(null);

    const result = await geocodeAddress(manualInput);
    setLoading(false);

    if (result) {
      setCurrentCoords({ lat: result.lat, lng: result.lng });
      setResolvedLocationName(result.name);
    } else {
      setSearchError('Não foi possível encontrar o local de partida. Tente digitar de outra forma.');
    }
  };

  const handleResolveDestination = async (e) => {
    e.preventDefault();
    if (!destinationInput.trim()) return;

    setLoading(true);
    setSearchError(null);

    const result = await geocodeAddress(destinationInput);
    setLoading(false);

    if (result) {
      setDestinationCoords({ lat: result.lat, lng: result.lng });
      setResolvedDestinationName(result.name);
    } else {
      setSearchError('Não foi possível encontrar o local de destino. Tente digitar de outra forma.');
    }
  };

  const lastRouteCoords = useRef(null);
  const lastDestCoords = useRef(null);

  useEffect(() => {
    const updateRoute = async () => {
      if (currentCoords && destinationCoords) {
        const straightDist = getHaversineDistance(currentCoords, destinationCoords);
        const bear = getBearing(currentCoords, destinationCoords);
        setDistance(straightDist);
        setBearing(bear);

        const isSameDest = lastDestCoords.current &&
          lastDestCoords.current.lat === destinationCoords.lat &&
          lastDestCoords.current.lng === destinationCoords.lng;

        const distMoved = lastRouteCoords.current
          ? getHaversineDistance(currentCoords, lastRouteCoords.current)
          : null;

        if (isSameDest && distMoved !== null && distMoved < 0.01) {
          return;
        }

        setRouteLoading(true);
        const routeData = await fetchOSRMRoute(currentCoords, destinationCoords);
        setRouteLoading(false);

        if (routeData) {
          setRouteGeometry(routeData.points);
          setRouteDistance(routeData.distance);
          setRouteDuration(routeData.duration);
          lastRouteCoords.current = currentCoords;
          lastDestCoords.current = destinationCoords;
        } else {
          setRouteGeometry([[currentCoords.lat, currentCoords.lng], [destinationCoords.lat, destinationCoords.lng]]);
          setRouteDistance(straightDist);
          setRouteDuration(null);
        }
      } else {
        setDistance(null);
        setBearing(null);
        setRouteGeometry(null);
        setRouteDistance(null);
        setRouteDuration(null);
      }
    };

    updateRoute();
  }, [currentCoords, destinationCoords]);

  return (
    <div className="app-wrapper">
      <Header 
        theme={theme} 
        onToggleTheme={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')} 
      />

      {searchError && (
        <div className="glass-panel text-danger" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(239, 68, 68, 0.05)', borderColor: 'rgba(239, 68, 68, 0.15)', fontSize: '0.85rem' }}>
          <span>⚠️ {searchError}</span>
        </div>
      )}

      <main className="dashboard-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <LocationCard
            gpsCoords={gpsCoords}
            resolvedLocationName={resolvedLocationName}
            manualInput={manualInput}
            onManualInputChange={setManualInput}
            onResolveManualLocation={handleResolveManualLocation}
            useGps={useGps}
            setUseGps={setUseGps}
            gpsError={gpsError}
            loading={loading}
            onRetryGps={() => {
              setGpsError(null);
              startGpsTracking();
            }}
          />

          <DestinationSelector
            destinationInput={destinationInput}
            onDestinationInputChange={setDestinationInput}
            onResolveDestination={handleResolveDestination}
            resolvedDestinationName={resolvedDestinationName}
            loading={loading}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <NavigationDashboard
            distance={distance}
            bearing={bearing}
            routeDistance={routeDistance}
            routeDuration={routeDuration}
            destinationName={resolvedDestinationName}
            currentCoords={currentCoords}
            destinationCoords={destinationCoords}
            loading={routeLoading}
          />

          <RouteMap
            currentCoords={currentCoords}
            destinationCoords={destinationCoords}
            routeGeometry={routeGeometry}
            destinationName={resolvedDestinationName || 'Destino'}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
