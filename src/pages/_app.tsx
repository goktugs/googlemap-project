import Layout from "@/components/layout";
import { ChakraProvider, Flex } from "@chakra-ui/react";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <Flex height="100vh" flexDirection="column">
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Flex>
    </ChakraProvider>
  );
}
