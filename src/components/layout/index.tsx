import { Box } from "@chakra-ui/react";
import React from "react";
import Footer from "../footer";
import Header from "../header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <Box flex={1}>{children}</Box>
      <Footer />
    </>
  );
}
