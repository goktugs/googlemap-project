import GoogleMapComp from "../src/components/map/index";
import { useJsApiLoader } from "@react-google-maps/api";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";

jest.mock("@react-google-maps/api", () => ({
  useJsApiLoader: jest.fn(),
  GoogleMap: () => <div>Mock Google Map</div>,
}));

describe("GoogleMapComp", () => {
  const mockLocations = [
    {
      id: "1",
      lat: 41.015137,
      lng: 28.97953,
      markerColor: "#ff0000",
      detail: "Location 1",
    },
    {
      id: "2",
      lat: 41.015137,
      lng: 28.97953,
      markerColor: "#00ff00",
      detail: "Location 2",
    },
  ];

  beforeEach(() => {
    (useJsApiLoader as jest.Mock).mockReturnValue({
      isLoaded: true,
      loadError: null,
    });
  });

  it("render googlemap", () => {
    render(<GoogleMapComp locations={[]} />);
    expect(screen.getByText("Mock Google Map")).toBeInTheDocument();
  });

  it("render error ", () => {
    (useJsApiLoader as jest.Mock).mockReturnValue({
      isLoaded: false,
      loadError: "Error",
    });
    render(<GoogleMapComp locations={mockLocations} />);
    expect(
      screen.getByText("Map cannot be loaded right now, sorry.")
    ).toBeInTheDocument();
  });
});
