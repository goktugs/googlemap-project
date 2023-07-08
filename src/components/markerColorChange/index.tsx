import { Box, Heading } from "@chakra-ui/react";
import { useEffect, useState } from "react";

interface MarkerColorChangeProps {
  setColorRef: React.MutableRefObject<string>;
}
export default function MarkerColorChange({
  setColorRef,
}: MarkerColorChangeProps) {
  const [color, setColor] = useState("#FF0000");

  useEffect(() => {
    setColorRef.current = color;
  }, [color, setColorRef]);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value);
  };

  return (
    <>
      <Heading mt={4} as="h2" fontSize="md">
        Markerın Rengini Değiştir
      </Heading>
      <Box mt={4}>
        <input
          data-testid="colorChanger"
          type="color"
          value={color}
          onChange={handleColorChange}
        />
      </Box>
    </>
  );
}
