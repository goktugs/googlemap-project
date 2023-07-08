import { MAPSTYLES } from "./styles";
import { LocationStateType } from "@/types/types";
import { Box, Container, Skeleton, useColorMode, Text } from "@chakra-ui/react";
import {
  DirectionsRenderer,
  GoogleMap,
  InfoWindow,
  MarkerF,
  useJsApiLoader,
} from "@react-google-maps/api";
import { useCallback, useEffect, useState } from "react";

interface GoogleMapCompProps {
  locations: LocationStateType[];
  onMapClick?: (e: google.maps.MapMouseEvent) => void;
  onMarkerDragEnd?: (e: google.maps.MapMouseEvent) => void;
  selectedLocation?: LocationStateType | null;
  userLocation?: google.maps.LatLng | null;
  handleMarkerClick?: (location: LocationStateType) => void;
  directions?: google.maps.DirectionsResult | null;
}

export default function GoogleMapComp({
  onMapClick,
  locations,
  onMarkerDragEnd,
  userLocation,
  handleMarkerClick,
  directions,
  selectedLocation,
}: GoogleMapCompProps) {
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const { colorMode } = useColorMode();

  const [center, setCenter] = useState<google.maps.LatLngLiteral>({
    lat: 41.015137,
    lng: 28.97953,
  });

  useEffect(() => {
    if (map && locations) {
      if (locations.length > 1) {
        const bounds = new google.maps.LatLngBounds();
        locations.forEach((location) => {
          bounds.extend({ lat: location.lat, lng: location.lng });
        });
        map.fitBounds(bounds);
      } else if (locations.length === 1) {
        map.setCenter({ lat: locations[0].lat, lng: locations[0].lng });
        setCenter({ lat: locations[0].lat, lng: locations[0].lng });
        map.setZoom(10);
      }
    }
  }, [locations, map]);

  const containerStyle = {
    width: "100%",
    height: "400px",
  };

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_ENV_VARIABLE!,
  });

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    map.setZoom(12);
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback() {
    setMap(null);
  }, []);

  if (loadError) return <Box>Map cannot be loaded right now, sorry.</Box>;
  if (!isLoaded)
    return (
      <Container maxW="container.lg">
        <Skeleton h="100%" w="400px" />
      </Container>
    );

  return (
    <Container maxW="container.lg">
      {isLoaded && (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={12}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={{
            styles:
              colorMode === "light" ? MAPSTYLES.lightMode : MAPSTYLES.darkMode,
          }}
          onClick={onMapClick}
        >
          {locations?.map((location) => (
            <MarkerF
              key={location.id}
              onDragEnd={locations?.length === 1 ? onMarkerDragEnd : undefined}
              onClick={() => handleMarkerClick && handleMarkerClick(location)}
              draggable={locations?.length === 1}
              position={{ lat: location.lat, lng: location.lng }}
              icon={`http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|${location.markerColor?.replace(
                "#",
                ""
              )}`}
            />
          ))}
          {userLocation && (
            <MarkerF
              position={userLocation}
              icon={"http://maps.google.com/mapfiles/kml/pal2/icon2.png"}
            />
          )}

          {directions && (
            <DirectionsRenderer
              options={{
                directions: directions,
                suppressMarkers: true,
              }}
            />
          )}
          {selectedLocation && (
            <InfoWindow
              position={{
                lat: selectedLocation.lat,
                lng: selectedLocation.lng,
              }}
              // bu ts hatasını çözemedim
              // @ts-ignore
              onCloseClick={() => handleMarkerClick && handleMarkerClick(null)}
            >
              <Box>
                <Text>{selectedLocation.detail}</Text>
                <Text>Latitude: {selectedLocation.lat}</Text>
                <Text>Longtitude: {selectedLocation.lng}</Text>
              </Box>
            </InfoWindow>
          )}
        </GoogleMap>
      )}{" "}
    </Container>
  );
}
