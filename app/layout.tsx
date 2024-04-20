import { ThemeProvider } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import theme from "./theme";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "My next holiday",
  description: "Find out when's your next holiday going to be. Easy and fast!",
  icons: {
    icon: [
      {
        media: "(prefers-color-scheme: light)",
        url: "/mynextholiday/images/favicon.ico",
        href: "/mynextholiday/images/favicon.ico",
      },
      {
        media: "(prefers-color-scheme: dark)",
        url: "/mynextholiday/images/dark-favicon.ico",
        href: "/mynextholiday/images/dark-favicon.ico",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider theme={theme}>
          <AppRouterCacheProvider>{children}</AppRouterCacheProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
