import { ReactElement, useEffect, useRef } from 'react';
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

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

  const loopColors = ['orange', 'cyan', 'purple'];

  // Default to Kuala Lumpur, Malaysia
  const defaultCenter: LatLngExpression = [
    Number(import.meta.env.VITE_DEFAULT_LAT),
    Number(import.meta.env.VITE_DEFAULT_LNG),
  ];

  const center: LatLngExpression =
    cityCoordinates?.lat && cityCoordinates?.lng
      ? [cityCoordinates.lat, cityCoordinates.lng]
      : defaultCenter;

  const defaultZoom = 5;
  const zoomOnInput = cityCoordinates?.lat && cityCoordinates?.lng ? 12 : defaultZoom;

  return (
    <div data-testid="map-view">
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

        {generatedLoops.map((loop, loopIndex) => {
          const loopPath: LatLngExpression[] = loop.places.map((place) => [
            place.coordinates.lat,
            place.coordinates.lng,
          ]);

          const color = loopColors[loopIndex % loopColors.length];

          return (
            <div key={`loop-${loopIndex}`}>
              {loop.places.map((place, placeIdx) => (
                <Marker
                  key={`marker-${loopIndex}-${placeIdx}`}
                  position={[place.coordinates.lat, place.coordinates.lng]}
                  icon={L.icon({
                    iconUrl: markerIcon,
                    shadowUrl: markerShadow,
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
                    {place.price && <div>Price: {place.price}</div>}
                  </Popup>
                </Marker>
              ))}

              {loopPath.length > 1 && (
                <Polyline
                  key={`polyline-${loopIndex}`}
                  positions={loopPath}
                  pathOptions={{ color, weight: 3 }}
                />
              )}
            </div>
          );
        })}
      </MapContainer>
    </div>
  );
};
