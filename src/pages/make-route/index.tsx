import GoogleMapComp from "@/components/map";
import { useLocationsStore } from "@/store/useLocationsStore";
import { LocationStateType } from "@/types/types";
import {
  Alert,
  AlertIcon,
  Center,
  Container,
  Text,
  Heading,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tooltip,
  Tr,
  VStack,
  Button,
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

  let userLatLng: google.maps.LatLng | undefined;

  if (userLocation) {
    userLatLng = new google.maps.LatLng(
      userLocation?.lat(),
      userLocation?.lng()
    );
  }

  const distanceByLocations = locations.map((location) => {
    if (userLatLng === undefined) {
      return;
    }
    const locationLatLng = new google.maps.LatLng(location.lat, location.lng);
    const rad = function (x: number) {
      return (x * Math.PI) / 180;
    };
    var R = 63710;
    var dLat = rad(locationLatLng.lat() - userLatLng.lat());
    var dLong = rad(locationLatLng.lng() - userLatLng.lng());
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(rad(userLatLng.lat())) *
        Math.cos(rad(locationLatLng.lat())) *
        Math.sin(dLong / 2) *
        Math.sin(dLong / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;

    return {
      id: location.id,
      detail: location.detail,
      distance: d.toFixed(2),
    };
  });

  distanceByLocations.sort((a, b) => {
    if (a === undefined || b === undefined) {
      return 0;
    }
    return Number(a.distance) - Number(b.distance);
  });

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
        <Center my={8}>
          <Button
            colorScheme="cyan"
            padding={6}
            as={Link}
            href={"/make-route"}
            fontWeight="medium"
          >
            Rota Oluşturma Sayfasına Git
          </Button>
        </Center>
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
            Konumunuz henüz alınamadı. Tarayıcınız konum hizmetini desteklemiyor
            olabilir...
          </Alert>
        )}

        {distanceByLocations.length > 0 && (
          <TableContainer mt={4}>
            <Table size="sm" variant="striped">
              <TableCaption>
                Markerların konumunuza en yakın sıralanması
              </TableCaption>
              <Thead>
                <Tr>
                  <Th>Id</Th>
                  <Th>Detay</Th>
                  <Th>Konumunuza Uzaklık</Th>
                </Tr>
              </Thead>
              <Tbody>
                {distanceByLocations.map(
                  (location) =>
                    location && (
                      <Tr key={location.id}>
                        <Td>{location.id}</Td>
                        <Td>
                          <Tooltip label={location.detail}>
                            <Text
                              maxW="250px"
                              overflow="hidden"
                              textOverflow="ellipsis"
                              whiteSpace="nowrap"
                            >
                              {location.detail}
                            </Text>
                          </Tooltip>
                        </Td>
                        <Td>{location.distance ?? 0} km</Td>
                      </Tr>
                    )
                )}
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </Container>
    </VStack>
  );
}
