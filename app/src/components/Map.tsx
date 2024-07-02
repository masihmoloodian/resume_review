import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface MapProps {
    initialLatitude: number;
    initialLongitude: number;
    editable: boolean;
    onLocationChange?: (lat: number, lng: number) => void;
}

const ClickHandler: React.FC<{ onLocationChange?: (lat: number, lng: number) => void }> = ({ onLocationChange }) => {
    useMapEvents({
        click: (event) => {
            if (onLocationChange) {
                onLocationChange(event.latlng.lat, event.latlng.lng);
            }
        }
    });
    return null;
};

const MapComponent: React.FC<MapProps> = ({ initialLatitude, initialLongitude, editable, onLocationChange }) => {
    const [position, setPosition] = useState<[number, number]>([initialLatitude, initialLongitude]);

    const handleLocationChange = (lat: number, lng: number) => {
        setPosition([lat, lng]);
        if (onLocationChange) {
            onLocationChange(lat, lng);
        }
    };

    return (
        <MapContainer center={[initialLatitude, initialLongitude]} zoom={13} style={{ width: '100%', height: '400px' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={position}>
                <Popup>
                    Lat: {position[0]}, Lng: {position[1]}
                </Popup>
            </Marker>
            {editable && (<ClickHandler onLocationChange={handleLocationChange} />)}
        </MapContainer>

    );
}

export default MapComponent;
