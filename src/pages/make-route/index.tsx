import GoogleMapComp from "@/components/map";
import { useLocationsStore } from "@/store/useLocationsStore";
import { LocationStateType } from "@/types/types";
import {
  Alert,
  AlertIcon,
  Center,
  Container,
  Heading,
  VStack,
} from "@chakra-ui/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function MakeRoute() {
  const { locations } = useLocationsStore();
  const [selectedLocation, setSelectedLocation] =
    useState<LocationStateType | null>(null);
  const [userLocation, setUserLocation] = useState<google.maps.LatLng | null>(
    null
  );
  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);
  console.log(userLocation);
  const handleMarkerClick = (location: LocationStateType) => {
    setSelectedLocation(location);
  };

  useEffect(() => {
    if (userLocation && selectedLocation) {
      const directionsService = new google.maps.DirectionsService();
      const origin = userLocation;
      const destination = new google.maps.LatLng(
        selectedLocation.lat,
        selectedLocation.lng
      );

      directionsService.route(
        {
          origin: origin,
          destination: destination,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            setDirections(result);
          } else {
            console.error("Rota oluşturulamadı.", status);
          }
        }
      );
    }
  }, [userLocation, selectedLocation]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLatLng = new google.maps.LatLng(
            position.coords.latitude,
            position.coords.longitude
          );
          setUserLocation(userLatLng);
        },
        (error) => {
          console.error("Kullanıcı konumu alınamadı.", error);
        }
      );
    } else {
      console.error("Tarayıcınız konum hizmetini desteklemiyor.");
    }
  }, []);
  return (
    <VStack>
      <Center mt={8}>
        <Heading as="h1">Rota Oluşturma Sayfası</Heading>
      </Center>
      <Container maxW="container.lg" mt={4}>
        <GoogleMapComp
          locations={locations}
          selectedLocation={selectedLocation}
          userLocation={userLocation}
          handleMarkerClick={handleMarkerClick}
          directions={directions}
        />

        {locations.length === 0 ? (
          <Alert mt={8} status="error">
            <AlertIcon />
            <Link href={"/add-location"}>
              Konum Yok. Konum Ekleme Sayfasına Geri Dön?
            </Link>{" "}
          </Alert>
        ) : (
          <Alert mt={8} status="info">
            <AlertIcon />
            Konumunuzla Marker arasında rota oluşturmak için Markera tıklayın.
          </Alert>
        )}

        {!userLocation && (
          <Alert mt={8} status="error">
            <AlertIcon />
            Konumunuz alınamadı. Tarayıcınız konum hizmetini desteklemiyor.
          </Alert>
        )}
      </Container>
    </VStack>
  );
}
