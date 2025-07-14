import { Coordinates } from '@src/types/interfaces/coordinates';
import { PlaceCategory } from '@src/utils/enums';

export interface Place {
  /** Name of the place */
  name: string;

  /** Address of the place */
  address: string;

  /** Category of the place, e.g., living, working, etc. */
  category: PlaceCategory;

  /** URL of the place, e.g., website or social media link */
  url?: string | null;

  /** Price of the place, e.g., cost of living or provided service */
  price?: number | null;

  /** Geographic coordinates of the place */
  coordinates: Coordinates;
}
