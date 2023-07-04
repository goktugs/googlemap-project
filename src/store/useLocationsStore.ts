import { create } from "zustand";

interface LocationState {
  id: number;
  lat: number;
  lng: number;
  markerColor: string;
  detail: string;
}

type LocationStore = {
  locations: LocationState[];
  addLocation: (location: LocationState) => void;
  removeLocation: (id: number) => void;
  updateLocation: (id: number, updatedData: Partial<LocationState>) => void;
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
