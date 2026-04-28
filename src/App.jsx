import React, { useState } from 'react';
import MapComponent from './MapComponent';
import Sidebar from './Sidebar';
import zonesData from './data/zones.json';
import { Menu } from 'lucide-react';
import './index.css';

function App() {
  const [showCuerna, setShowCuerna] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="app-container">
      {/* Mobile toggle button */}
      <button className="mobile-toggle" onClick={() => setSidebarOpen(true)}>
        <Menu size={24} />
      </button>

      <Sidebar
        zones={zonesData}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        showCuerna={showCuerna}
        setShowCuerna={setShowCuerna}
      />
      <div className="map-container">
        <MapComponent selectedZones={zonesData} showCuerna={showCuerna} />
      </div>
    </div>
  );
}

export default App;
