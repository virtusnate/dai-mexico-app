import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, Pane } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function MapComponent({ selectedZones, showCuerna }) {
    const [geoData, setGeoData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetching the locally hosted massive municipalities GeoJSON
        fetch(import.meta.env.BASE_URL + 'municipalities.geojson')
            .then(res => {
                if (!res.ok) throw new Error("Failed to fetch Map GeoJSON");
                return res.json();
            })
            .then(data => setGeoData(data))
            .catch(err => {
                console.error(err);
                setError("Could not load the interactive map boundaries.");
            });
    }, []);

    const selectedCves = new Set(selectedZones.map(z => z.cve));

    const styleFeature = (feature) => {
        const props = feature.properties;
        let cve = props.CVEGEO || props.cvegeo || props.cve_mun || props.cve || props.id;
        if (!cve && props.state_code && props.mun_code) {
            cve = String(props.state_code).padStart(2, '0') + String(props.mun_code).padStart(3, '0');
        }

        if (showCuerna && cve && selectedCves.has(cve)) {
            return {
                fillColor: '#ef4444',
                weight: 1.5,
                opacity: 0.9,
                color: '#fca5a5',
                fillOpacity: 0.35
            };
        }
        return {
            fillColor: 'transparent',
            weight: 0.5,
            opacity: 0.4,
            color: '#475569',
            fillOpacity: 0
        };
    };

    const onEachFeature = (feature, layer) => {
        const props = feature.properties;
        const name = props.nomgeo || props.NOMGEO || props.mun_name || props.name || "Unknown Municipality";
        let cve = props.CVEGEO || props.cvegeo || props.cve_mun || props.cve || props.id;
        if (!cve && props.state_code && props.mun_code) {
            cve = String(props.state_code).padStart(2, '0') + String(props.mun_code).padStart(3, '0');
        }

        const isSelected = selectedCves.has(cve);
        const isActivelySelected = showCuerna && isSelected;

        const popupContent = `
        <div style="font-family: 'Inter', sans-serif;">
            <h3 style="margin: 0 0 5px 0; font-size: 14px; color: #0f172a;">${name}</h3>
            <p style="margin: 0; font-size: 12px; color: #475569;">CVE: ${cve || 'N/A'}</p>
            ${isActivelySelected ? '<strong style="color: #ef4444; font-size: 12px; display: block; margin-top: 5px;">📍 Zona economica Cuerna</strong>' : ''}
        </div>
      `;
        layer.bindPopup(popupContent);

        layer.on('mouseover', function (e) {
            const l = e.target;
            if (isActivelySelected) {
                l.setStyle({ fillOpacity: 0.6, fillColor: '#f87171' });
            } else {
                l.setStyle({ fillOpacity: 0.2, fillColor: '#38bdf8' });
            }
        });
        layer.on('mouseout', function (e) {
            const l = e.target;
            if (isActivelySelected) {
                l.setStyle({ fillOpacity: 0.35, fillColor: '#ef4444' });
            } else {
                l.setStyle({ fillOpacity: 0, fillColor: 'transparent' });
            }
        });
    };

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            {error && (
                <div style={{ position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 1000, background: '#ef4444', color: 'white', padding: '10px 20px', borderRadius: 8 }}>
                    {error}
                </div>
            )}
            <MapContainer
                center={[19.4326, -99.1332]}
                zoom={9}
                style={{ height: '100%', width: '100%' }}
                zoomControl={true}
                preferCanvas={true}
                className="leaflet-container"
            >
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
                />
                {geoData && (
                    <GeoJSON
                        data={geoData}
                        style={styleFeature}
                        onEachFeature={onEachFeature}
                    />
                )}
                <Pane name="labelsPane" style={{ zIndex: 450, pointerEvents: 'none' }}>
                    <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png"
                    />
                </Pane>
            </MapContainer>
        </div>
    );
}
