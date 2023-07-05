import React from "react";

import { useLocationsStore } from "@/store/useLocationsStore";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useRouter } from "next/router";
import { Alert, AlertIcon, Center, Container, Heading } from "@chakra-ui/react";
import Link from "next/link";

export default function EditLocations() {
  const { locations, updateLocation } = useLocationsStore();

  const router = useRouter();
  const { id } = router.query;

  const selectedLocation = locations.find(
    (location) => location.id === Number(id)
  );

  const containerStyle = {
    width: "100%",
    height: "400px",
  };

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_ENV_VARIABLE!,
  });

  const handleMarkerDragEnd = (e: google.maps.MapMouseEvent) => {
    if (e.latLng && selectedLocation) {
      const updatedLocation = {
        ...selectedLocation,
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      };
      updateLocation(selectedLocation.id, updatedLocation);
    }
  };

  return (
    <>
      <Center mt={8}>
        <Heading as="h1">Konum Düzenleme Sayfası</Heading>
      </Center>
      <Container maxW="container.lg" mt={4}>
        <Center>
          {isLoaded && (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={{
                lat: selectedLocation?.lat!,
                lng: selectedLocation?.lng!,
              }}
              zoom={14}
            >
              <Marker
                draggable={true}
                onDragEnd={handleMarkerDragEnd}
                position={{
                  lat: selectedLocation?.lat!,
                  lng: selectedLocation?.lng!,
                }}
                icon={`http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|${selectedLocation?.markerColor.replace(
                  "#",
                  ""
                )}`}
              />
            </GoogleMap>
          )}
        </Center>
        <Alert mt={8} status="info">
          <AlertIcon />
          Markerı sürükleyerek konumu değiştirebilirsiniz.
        </Alert>

        {locations.length > 0 && (
          <Center mt={8}>
            <Link href="/list-locations">Lokasyon Listelemeye Git</Link>
          </Center>
        )}
      </Container>
    </>
  );
}
