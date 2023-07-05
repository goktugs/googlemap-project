import React, { useEffect, useState } from "react";

import { useLocationsStore } from "@/store/useLocationsStore";
import {
  Box,
  Button,
  Center,
  Table,
  TableContainer,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import Image from "next/image";

import { AiOutlineArrowRight } from "react-icons/ai";
import Link from "next/link";

import { LocationStateType } from "@/types/types";

export default function ListLocations() {
  const { locations } = useLocationsStore();

  const [selectedLocation, setSelectedLocation] =
    useState<LocationStateType | null>(null);

  const handleMarkerClick = (location: LocationStateType) => {
    if (selectedLocation?.id === location.id) {
      setSelectedLocation(null);
    } else {
      setSelectedLocation(location);
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (selectedLocation) {
      timer = setTimeout(() => {
        setSelectedLocation(null);
      }, 3000);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [selectedLocation]);

  return (
    <VStack>
      {locations.length && (
        <Button padding={8} my={4} bg="salmon">
          <Link href={"/make-route"}>Rota Düzenleme Sayfasına Git</Link>
        </Button>
      )}

      <Center>
        <TableContainer>
          <Table variant="striped">
            <Thead textAlign="center">
              <Tr>
                <Th>Id</Th>
                <Th>Detail</Th>
                <Th textAlign="center">Marker Icon</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {locations.map((location) => (
                <Tr key={location.id}>
                  <Th>{location.id}</Th>
                  <Th>{location.detail}</Th>
                  <Th display="flex">
                    <Center _hover={{ cursor: "pointer" }} gap={4}>
                      <Image
                        alt={`marker-${location.id}-${location.markerColor}`}
                        onClick={() => handleMarkerClick(location)}
                        src={`http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|${location.markerColor.replace(
                          "#",
                          ""
                        )}`}
                        width={25}
                        height={25}
                      />{" "}
                      {selectedLocation?.id === location.id && (
                        <VStack>
                          <Text>{`Latitude: ${selectedLocation.lat}`}</Text>
                          <Text>{`Longitude: ${selectedLocation.lng}`}</Text>
                        </VStack>
                      )}
                    </Center>
                  </Th>
                  <Th
                    _hover={{
                      cursor: "pointer",
                    }}
                  >
                    <Link href={`/edit-location/${location.id}`}>
                      <Box
                        _hover={{
                          cursor: "pointer",
                        }}
                      >
                        <AiOutlineArrowRight size={25} />
                      </Box>
                    </Link>
                  </Th>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Center>

      <Button padding={8} bg="salmon" mt={4}>
        <Link href={"/add-location"}>Konum Ekleme Sayfasına Geri Dön</Link>
      </Button>
    </VStack>
  );
}
