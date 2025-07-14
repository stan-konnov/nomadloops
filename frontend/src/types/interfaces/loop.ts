import { Place } from '@src/types/interfaces/place';

export interface Loop {
  /** Name of the city for which the loop is created */
  city: string;

  /** List of places in the loop representing points of interest */
  places: Place[];
}
