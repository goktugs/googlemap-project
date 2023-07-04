import { create } from "zustand";

import { LocationStateType } from "../types/types";

type LocationStore = {
  locations: LocationStateType[];
  addLocation: (location: LocationStateType) => void;
  removeLocation: (id: number) => void;
  updateLocation: (id: number, updatedData: Partial<LocationStateType>) => void;
  //   clearLocations: () => void;
};
export const useLocationsStore = create<LocationStore>((set) => ({
  locations: [],
  addLocation: (location) =>
    set((state) => ({ locations: [...state.locations, location] })),
  removeLocation: (id) =>
    set((state) => ({
      locations: state.locations.filter((loc) => loc.id !== id),
    })),
  updateLocation: (id, updatedData) =>
    set((state) => ({
      locations: state.locations.map((loc) =>
        loc.id === id ? { ...loc, ...updatedData } : loc
      ),
    })),
}));
