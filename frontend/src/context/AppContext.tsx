/* eslint-disable no-unused-vars */

import React, { createContext, Dispatch, useReducer, useContext, ReactElement } from 'react';

export enum ActionTypes {
  SET_CITY_NAME = 'SET_CITY_NAME',
  SET_CITY_COORDS = 'SET_CITY_COORDS',
}

type State = {
  cityName: string;
  cityCoords: { lat: number; lng: number } | null;
};

type Action =
  | { type: ActionTypes.SET_CITY_NAME; payload: string }
  | { type: ActionTypes.SET_CITY_COORDS; payload: { lat: number; lng: number } };

const initialState: State = {
  cityName: '',
  cityCoords: null,
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_CITY_NAME':
      return { ...state, cityName: action.payload };
    case 'SET_CITY_COORDS':
      return { ...state, cityCoords: action.payload };
    default:
      return state;
  }
};

const AppContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
}>({ state: initialState, dispatch: () => null });

export const AppContextProvider = ({ children }: { children: ReactElement }): ReactElement => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
};

export const useAppContext = (): { state: State; dispatch: Dispatch<Action> } =>
  useContext(AppContext);
