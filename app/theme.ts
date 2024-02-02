// src/theme.ts
"use client";
import { createTheme } from "@mui/material/styles";

import { Roboto } from "next/font/google";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

const theme = createTheme({
  palette: {
    text: {
      primary: "#432C23",
    },
    primary: {
      main: "#432C23",
      contrastText: "#FFFFFF",
    },
  },
  typography: {
    allVariants: {
      color: "#432C23",
    },
    fontFamily: roboto.style.fontFamily,
  },
});

export default theme;
