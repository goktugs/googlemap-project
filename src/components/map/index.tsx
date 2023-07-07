import { MAPSTYLES } from "./styles";
import { LocationStateType } from "@/types/types";
import { Box, Container, Skeleton, useColorMode } from "@chakra-ui/react";
import { GoogleMap, MarkerF, useJsApiLoader } from "@react-google-maps/api";
import { useCallback, useEffect, useState } from "react";

interface GoogleMapCompProps {
  onMapClick?: (e: google.maps.MapMouseEvent) => void;
  locations?: LocationStateType[];
  onMarkerDragEnd?: (e: google.maps.MapMouseEvent) => void;
}

export default function GoogleMapComp({
  onMapClick,
  locations,
  onMarkerDragEnd,
}: GoogleMapCompProps) {
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const { colorMode } = useColorMode();

  const [center, setCenter] = useState({
    lat: 41.015137,
    lng: 28.97953,
  });

  useEffect(() => {
    if (locations && locations.length === 1) {
      setCenter({
        lat: locations[0].lat,
        lng: locations[0].lng,
      });
    }
  }, [locations]);

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
              draggable={locations?.length === 1}
              position={{ lat: location.lat, lng: location.lng }}
              icon={`http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|${location.markerColor?.replace(
                "#",
                ""
              )}`}
            />
          ))}
        </GoogleMap>
      )}{" "}
    </Container>
  );
}
