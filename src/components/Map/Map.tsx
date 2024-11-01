// MapWithLine.tsx
import React from 'react';
import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Line } from '../../types/Line';

const Map: React.FC<Line> = ({ pointA, pointB }) => {
    const defaultCenter: [number, number] = [39.8283, -98.5795];

    return (
        <MapContainer 
            center={pointA || defaultCenter} 
            zoom={4} 
            style={{ height: "400px", width: "100%" }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {pointA && pointB && <Polyline positions={[pointA, pointB]} color="red" />}
        </MapContainer>
    );
};

export default Map;
