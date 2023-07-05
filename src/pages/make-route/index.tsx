import { useLocationsStore } from "@/store/useLocationsStore";
import { LocationStateType } from "@/types/types";
import {
  Alert,
  AlertIcon,
  Box,
  Center,
  Container,
  Heading,
  VStack,
} from "@chakra-ui/react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
  DirectionsRenderer,
} from "@react-google-maps/api";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function MakeRoute() {
  const containerStyle = {
    width: "100%",
    height: "400px",
  };
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_ENV_VARIABLE!,
  });

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

  return (
    <VStack>
      <Center mt={8}>
        <Heading as="h1">Rota Oluşturma Sayfası</Heading>
      </Center>
      <Container maxW="container.lg" mt={4}>
        {isLoaded && (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={{ lat: 41.015137, lng: 28.97953 }}
            zoom={14}
          >
            {locations.map((location) => (
              <Marker
                key={location.id}
                onClick={() => handleMarkerClick(location)}
                position={{
                  lat: location.lat,
                  lng: location.lng,
                }}
                icon={`http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|${location.markerColor.replace(
                  "#",
                  ""
                )}`}
              >
                {selectedLocation === location && (
                  <InfoWindow onCloseClick={() => setSelectedLocation(null)}>
                    <Box>
                      <p>{location.detail}</p>
                      <p>{`Latitude: ${location.lat}`}</p>
                      <p>{`Longitude: ${location.lng}`}</p>
                    </Box>
                  </InfoWindow>
                )}
              </Marker>
            ))}

            {directions && (
              <DirectionsRenderer
                options={{
                  directions: directions,
                  suppressMarkers: true,
                }}
              />
            )}
          </GoogleMap>
        )}
        {locations.length === 0 ? (
          <Alert mt={8} status="error">
            <AlertIcon />
            <Link href={"/add-location"}>
              Yeterince Konum Yok Konum Ekleme Sayfasına Geri Dön?
            </Link>{" "}
          </Alert>
        ) : (
          <Alert mt={8} status="info">
            <AlertIcon />
            Konumunuzla Marker arasında rota oluşturmak için Markera tıklayın.
          </Alert>
        )}
      </Container>
    </VStack>
  );
}
