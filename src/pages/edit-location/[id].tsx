import GoogleMapComp from "@/components/map";
import { useLocationsStore } from "@/store/useLocationsStore";
import { getDetail } from "@/utils/getDetail";
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Center,
  Container,
  Heading,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

export default function EditLocations() {
  const { locations, updateLocation } = useLocationsStore();

  const router = useRouter();
  const { id } = router.query;

  const selectedLocation = locations.find(
    (location) => location.id === Number(id)
  );

  const handleMarkerDragEnd = async (e: google.maps.MapMouseEvent) => {
    if (selectedLocation && e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      const detail = await getDetail(lat, lng);
      const updatedLocation = {
        ...selectedLocation,
        lat: lat,
        lng: lng,
        detail: detail,
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
          <GoogleMapComp
            onMarkerDragEnd={handleMarkerDragEnd}
            locations={selectedLocation ? [selectedLocation] : []}
          />
        </Center>
        <Alert mt={8} status="info">
          <AlertIcon />
          Markerı sürükleyerek konumu değiştirebilirsiniz.
        </Alert>

        {locations.length > 0 && (
          <Center mt={8}>
            <Button
              colorScheme={"cyan"}
              padding={6}
              as={Link}
              fontWeight="medium"
              href="/list-locations"
            >
              Lokasyon Listelemeye Geri Dön
            </Button>
          </Center>
        )}
      </Container>
    </>
  );
}
