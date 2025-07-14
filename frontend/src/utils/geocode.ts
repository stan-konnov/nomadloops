import { Coordinates } from '@src/types/interfaces/coordinates';

export const geocodeCity = async (city: string): Promise<Coordinates> => {
  const geocodeResponse = await fetch(
    `${import.meta.env.VITE_GEOCODE_API_URL}/search?format=json&q=${encodeURIComponent(city)}`,
  );

  const data = await geocodeResponse.json();

  if (data.length > 0) {
    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
    };
  } else {
    throw new Error(`City ${city} not found.`);
  }
};
