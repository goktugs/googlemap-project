import { Box, Center, Container, Heading } from "@chakra-ui/react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import React, { useState } from "react";
import { useLocationsStore } from "@/store/useLocationsStore";
import Link from "next/link";

export default function AddLocations() {
  const containerStyle = {
    width: "100%",
    height: "400px",
  };

  const [center, setCenter] = useState({
    lat: 41.015137,
    lng: 28.97953,
  });

  const [color, setColor] = useState("#FF0000");

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_ENV_VARIABLE!,
  });

  const { locations, addLocation } = useLocationsStore();

  const onMapClick = React.useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        const newLocation = {
          id: locations.length + 1,
          lat: e.latLng.lat(),
          lng: e.latLng.lng(),
          markerColor: color,
          detail: "deneme",
        };
        addLocation(newLocation);
      }
    },
    [addLocation, locations.length, color]
  );

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value);
  };

  return (
    <Box>
      <Center mt={8}>
        <Heading as="h1">Konum Ekleme Sayfası</Heading>
      </Center>

      <Container maxW="container.lg" mt={4}>
        <Center>
          {isLoaded && (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={14}
              onClick={onMapClick}
            >
              {locations.map((location) => (
                <Marker
                  key={location.id}
                  position={{ lat: location.lat, lng: location.lng }}
                  icon={`http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|${location.markerColor.replace(
                    "#",
                    ""
                  )}`}
                />
              ))}
            </GoogleMap>
          )}
        </Center>
        <Center flexDir="column" mt={4}>
          <Heading as="h2" fontSize="md">
            Markerın Rengini Değiştir
          </Heading>
          <Box mt={4}>
            <input type="color" value={color} onChange={handleColorChange} />
          </Box>
        </Center>
      </Container>

      {locations.length > 0 && (
        <Center mt={8}>
          <Link href="/list-locations">Lokasyon Listelemeye Git</Link>
        </Center>
      )}
    </Box>
  );
}
