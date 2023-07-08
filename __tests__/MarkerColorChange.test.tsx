import MarkerColorChange from "../src/components/markerColorChange/index";
import "@testing-library/jest-dom/extend-expect";
import { render, screen, fireEvent } from "@testing-library/react";

describe("MarkerColorChange", () => {
  let colorRef = { current: "" };

  it("renders without crashing", () => {
    render(<MarkerColorChange setColorRef={colorRef} />);
    expect(screen.getByText("Markerın Rengini Değiştir")).toBeInTheDocument();
  });

  it("changes color on input change", () => {
    render(<MarkerColorChange setColorRef={colorRef} />);
    const colorInput = screen.getByTestId("colorChanger");
    fireEvent.change(colorInput, { target: { value: "#ff0000" } });
    expect(colorRef.current).toBe("#ff0000");
  });
});
