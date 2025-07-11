import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import { ReactElement } from 'react';

export const MapView = (): ReactElement => {
  const defaultCenter: LatLngExpression = [3.139, 101.6869];

  return (
    <MapContainer className="w-full h-full" center={defaultCenter} zoom={8} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={defaultCenter}>
        <Popup>Base of operations.</Popup>
      </Marker>
    </MapContainer>
  );
};
