import {
  Box,
  Center,
  Container,
  Heading,
  useColorMode,
} from "@chakra-ui/react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import React, { useState } from "react";
import { useLocationsStore } from "@/store/useLocationsStore";
import Link from "next/link";

export default function AddLocations() {
  const { colorMode } = useColorMode();

  const containerStyle = {
    width: "100%",
    height: "400px",
  };

  const stylesArray = [
    [
      {
        elementType: "geometry",
        stylers: [
          {
            color: "#242f3e",
          },
        ],
      },
      {
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#746855",
          },
        ],
      },
      {
        elementType: "labels.text.stroke",
        stylers: [
          {
            color: "#242f3e",
          },
        ],
      },
      {
        featureType: "administrative.locality",
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#d59563",
          },
        ],
      },
      {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#d59563",
          },
        ],
      },
      {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [
          {
            color: "#263c3f",
          },
        ],
      },
      {
        featureType: "poi.park",
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#6b9a76",
          },
        ],
      },
      {
        featureType: "road",
        elementType: "geometry",
        stylers: [
          {
            color: "#38414e",
          },
        ],
      },
      {
        featureType: "road",
        elementType: "geometry.stroke",
        stylers: [
          {
            color: "#212a37",
          },
        ],
      },
      {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#9ca5b3",
          },
        ],
      },
      {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [
          {
            color: "#746855",
          },
        ],
      },
      {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [
          {
            color: "#1f2835",
          },
        ],
      },
      {
        featureType: "road.highway",
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#f3d19c",
          },
        ],
      },
      {
        featureType: "transit",
        elementType: "geometry",
        stylers: [
          {
            color: "#2f3948",
          },
        ],
      },
      {
        featureType: "transit.station",
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#d59563",
          },
        ],
      },
      {
        featureType: "water",
        elementType: "geometry",
        stylers: [
          {
            color: "#17263c",
          },
        ],
      },
      {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#515c6d",
          },
        ],
      },
      {
        featureType: "water",
        elementType: "labels.text.stroke",
        stylers: [
          {
            color: "#17263c",
          },
        ],
      },
    ],
    [{}],
  ];

  const [map, setMap] = React.useState(null);

  const [center, setCenter] = useState({
    lat: 41.015137,
    lng: 28.97953,
  });

  const [color, setColor] = useState("#FF0000");

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_ENV_VARIABLE!,
  });

  const onLoad = React.useCallback(function callback(map: google.maps.Map) {
    const bounds = new window.google.maps.LatLngBounds();
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map: google.maps.Map) {
    setMap(null);
  }, []);

  React.useEffect(() => {
    if (map) {
      console.log("colorMode changed, updating map");
      map.setOptions(
        colorMode === "light"
          ? { styles: stylesArray[1] }
          : { styles: stylesArray[0] }
      );
    }
  }, [colorMode, map]);

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
  if (loadError) {
    return <div>Map cannot be loaded right now, sorry.</div>;
  }
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
              onLoad={onLoad}
              onUnmount={onUnmount}
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
