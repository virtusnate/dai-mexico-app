import React, { useState } from 'react';
import { Search, MapPin, Database, X, ToggleLeft, ToggleRight } from 'lucide-react';

export default function Sidebar({ zones, isOpen, setIsOpen, showCuerna, setShowCuerna }) {
    const [search, setSearch] = useState('');

    const filtered = zones.filter(z =>
        z.mun.toLowerCase().includes(search.toLowerCase()) ||
        z.cve.includes(search)
    );

    return (
        <div className={`sidebar ${isOpen ? 'open' : ''}`}>
            <div className="sidebar-header">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1>Mexican Zones</h1>
                    <button className="close-btn" onClick={() => setIsOpen(false)}>
                        <X size={24} />
                    </button>
                </div>
                <p>Interactive Map of Municipalities</p>

                <div className="toggle-box" onClick={() => setShowCuerna(!showCuerna)}>
                    {showCuerna ? <ToggleRight size={24} className="toggle-icon active" /> : <ToggleLeft size={24} className="toggle-icon" />}
                    <span>Zona economica Cuerna</span>
                </div>

                <div className="search-box">
                    <Search size={20} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search municipality or CVE..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>
            <div className="zone-list">
                {filtered.map(z => (
                    <div key={z.cve} className={`zone-item ${!showCuerna ? 'disabled-item' : ''}`}>
                        <div className="zone-info">
                            <MapPin size={16} className="pin-icon" />
                            <span className="zone-name">{z.mun}</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                            <span className="zone-cve">{z.cve}</span>
                            {z.region && <span className="zone-region">Reg: {z.region}</span>}
                        </div>
                    </div>
                ))}
                {filtered.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '20px', color: '#64748b', fontSize: '0.9rem' }}>
                        No matching zones found.
                    </div>
                )}
            </div>
        </div>
    );
}
