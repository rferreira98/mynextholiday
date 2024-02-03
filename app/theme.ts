// src/theme.ts
"use client";
import { createTheme } from "@mui/material/styles";

import { Inter } from "next/font/google";


const inter = Inter({ subsets: ["latin"] });


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
    fontFamily: inter.style.fontFamily
  },
});

export default theme;
