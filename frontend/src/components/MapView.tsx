import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';
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
      map.flyTo(coordinates, map.getZoom(), { animate: true });
    } else {
      // Animate to coordinates but keep current zoom on user zoom
      map.flyTo(coordinates, zoom, { animate: true });
    }

    return (): void => {
      map.off('zoomend', onUserZoom);
    };
  }, [coordinates.toString(), zoom, map]);

  return null;
};

export const MapView = (): ReactElement => {
  const { cityCoordinates, generatedLoops } = useLoopsPlannerStore();

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

      {generatedLoops.flatMap((loop) =>
        loop.places.map((place, idx) => (
          <Marker
            key={`${loop.city}-${place.name}-${idx}`}
            position={[place.coordinates.lat, place.coordinates.lng]}
            icon={L.icon({
              iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
              shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
            })}
          >
            <Popup>
              <strong>{place.name}</strong>
              <br />
              {place.address}
              <br />
              Category: {place.category}
              <br />
              {place.url && (
                <a href={place.url} target="_blank" rel="noopener noreferrer">
                  Website
                </a>
              )}
              {place.price && <div>Price: ${place.price}</div>}
            </Popup>
          </Marker>
        )),
      )}
    </MapContainer>
  );
};
