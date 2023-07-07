import GoogleMapComp from "@/components/map";
import MarkerColorChange from "@/components/markerColorChange";
import { useLocationsStore } from "@/store/useLocationsStore";
import { getDetail } from "@/utils/getDetail";
import { Box, Button, Center, Container, Heading } from "@chakra-ui/react";
import Link from "next/link";
import React, { useState } from "react";

export default function AddLocations() {
  const [color, setColorState] = useState<string>("#FF0000");
  const [details, setDetails] = useState<string | null>(null);

  const colorRef = React.useRef(color);

  const { locations, addLocation } = useLocationsStore();

  const onMapClick = React.useCallback(
    async (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        const detail = await getDetail(lat, lng);
        setDetails(detail || "Bilgi Yok");
        const newLocation = {
          id: locations.length + 1,
          lat: lat,
          lng: lng,
          markerColor: colorRef.current,
          detail: details || "Bilgi Yok",
        };
        addLocation(newLocation);
      }
    },
    [addLocation, details, locations.length]
  );

  return (
    <Box>
      <Center mt={8}>
        <Heading as="h1">Konum Ekleme Sayfası</Heading>
      </Center>

      <Container maxW="container.lg" mt={4}>
        <Center flexDir="column" mt={4}>
          <GoogleMapComp onMapClick={onMapClick} locations={locations} />
          <MarkerColorChange setColorRef={colorRef} />
        </Center>
      </Container>

      {locations.length > 0 && (
        <Center mt={8}>
          <Button
            colorScheme={"cyan"}
            padding={6}
            as={Link}
            fontWeight="medium"
            href="/list-locations"
          >
            Lokasyon Listelemeye Git
          </Button>
        </Center>
      )}
    </Box>
  );
}
