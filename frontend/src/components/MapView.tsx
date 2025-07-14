import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import { ReactElement, useEffect, useRef } from 'react';
import { useLoopsPlannerStore } from '@src/store/loops.planner.store';

const MapCenterUpdater = ({
  coordinates,
  zoom,
}: {
  coordinates: LatLngExpression;
  zoom: number;
}): null => {
  const map = useMap();
  const hasZoomed = useRef(false);

  useEffect(() => {
    if (!coordinates) {
      return;
    }

    const onUserZoom = (): void => {
      hasZoomed.current = true;
    };
    map.on('zoomend', onUserZoom);

    if (!hasZoomed.current) {
      // Animate to coordinates and zoom on first render
      map.flyTo(coordinates, map.getZoom());
    } else {
      // Animate to coordinates but keep current zoom on user zoom
      map.flyTo(coordinates, zoom);
    }

    return (): void => {
      map.off('zoomend', onUserZoom);
    };
  }, [coordinates.toString(), zoom, map]);

  return null;
};

export const MapView = (): ReactElement => {
  const { cityCoordinates } = useLoopsPlannerStore();

  // Default to Kuala Lumpur, Malaysia
  const defaultCenter: LatLngExpression = [3.139, 101.6869];
  const center: LatLngExpression =
    cityCoordinates?.lat && cityCoordinates?.lng
      ? [cityCoordinates.lat, cityCoordinates.lng]
      : defaultCenter;

  const defaultZoom = 5;
  const zoomOnInput = cityCoordinates?.lat && cityCoordinates?.lng ? 12 : defaultZoom;

  return (
    <MapContainer
      className="w-full h-full"
      center={defaultCenter}
      zoom={defaultZoom}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {cityCoordinates && <MapCenterUpdater coordinates={center} zoom={zoomOnInput} />}
    </MapContainer>
  );
};
