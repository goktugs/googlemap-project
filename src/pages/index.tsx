import Head from "next/head";
import { Inter } from "next/font/google";
import { Box, Center, SimpleGrid, Text } from "@chakra-ui/react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Center>
        <SimpleGrid columns={2} spacing={10}></SimpleGrid>
      </Center>
    </>
  );
}
