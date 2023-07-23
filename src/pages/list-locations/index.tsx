import { useLocationsStore } from "@/store/useLocationsStore";
import { LocationStateType } from "@/types/types";
import {
  Box,
  Button,
  Center,
  IconButton,
  Table,
  TableContainer,
  Tbody,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  VStack,
} from "@chakra-ui/react";
import { useMediaQuery } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { AiOutlineArrowRight } from "react-icons/ai";

const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#333" offset="20%" />
      <stop stop-color="#222" offset="50%" />
      <stop stop-color="#333" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#333" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str: string) =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);

export default function ListLocations() {
  const { locations, removeLocation } = useLocationsStore();
  const [isSmallScreen] = useMediaQuery("(max-width: 600px)");

  const [selectedLocation, setSelectedLocation] =
    useState<LocationStateType | null>(null);

  const handleMarkerClick = (location: LocationStateType) => {
    if (selectedLocation?.id === location.id) {
      setSelectedLocation(null);
    } else {
      setSelectedLocation(location);
    }
  };

  const handleDeleteClick = (id: number) => {
    removeLocation(id);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (selectedLocation) {
      timer = setTimeout(() => {
        setSelectedLocation(null);
      }, 2000);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [selectedLocation]);

  return (
    <VStack>
      {locations.length > 0 && (
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
      )}

      <Center>
        <TableContainer>
          <Table
            size="sm"
            variant="striped"
            style={
              isSmallScreen ? { tableLayout: "fixed", width: "100vw" } : {}
            }
          >
            <Thead textAlign="center">
              <Tr>
                <Th>Remove Loc</Th>
                <Th>Id</Th>
                <Th>Detail</Th>
                <Th textAlign="center">Marker Icon</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {locations.map((location) => (
                <Tr key={location.id}>
                  <Th>
                    <Button
                      onClick={() => handleDeleteClick(Number(location.id))}
                    >
                      Delete
                    </Button>
                  </Th>
                  <Th>{location.id}</Th>
                  <Th maxW="200px">
                    <Tooltip label={location.detail}>
                      <Text isTruncated>{location.detail}</Text>
                    </Tooltip>
                  </Th>
                  <Th>
                    <Tooltip label="Konum bilgilerine erişmek için marker üzerine tıklayın">
                      <Center _hover={{ cursor: "pointer" }} gap={4}>
                        <Image
                          alt={`marker-${location.id}-${location.markerColor}`}
                          onClick={() => handleMarkerClick(location)}
                          src={`http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|${location?.markerColor?.replace(
                            "#",
                            ""
                          )}`}
                          width={40}
                          height={40}
                          blurDataURL={`data:image/svg+xml;base64,${toBase64(
                            shimmer(700, 475)
                          )}`}
                          placeholder="blur"
                        />{" "}
                        {selectedLocation?.id === location.id && (
                          <VStack>
                            <Text>{`Latitude: ${selectedLocation.lat}`}</Text>
                            <Text>{`Longitude: ${selectedLocation.lng}`}</Text>
                          </VStack>
                        )}
                      </Center>
                    </Tooltip>
                  </Th>
                  <Th>
                    <Tooltip label="Konum Düzenleme Sayfasına Git">
                      <IconButton
                        size={"lg"}
                        as={Link}
                        colorScheme="cyan"
                        href={`/edit-location/${location.id}`}
                        aria-label="Konum Düzenleme Sayfasına Git"
                        icon={<AiOutlineArrowRight />}
                      ></IconButton>
                    </Tooltip>
                  </Th>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Center>
      <Center mt={8}>
        <Button
          colorScheme={"cyan"}
          padding={6}
          as={Link}
          fontWeight="medium"
          href="/add-location"
        >
          Konum Ekleme Sayfasına Geri Dön{" "}
        </Button>
      </Center>
    </VStack>
  );
}
