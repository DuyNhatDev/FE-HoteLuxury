import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AppProvider } from "@/hooks/AppContext";
import HeaderController from "@/app/components/layout/HeaderController";
import MainLayout from "@/app/components/layout/MainLayout";
import FooterController from "@/app/components/layout/FooterController";
import { GG_CLIENT_ID } from "@/utils/variable/google";
import { GoogleOAuthProvider } from "@react-oauth/google";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "HoteLuxury",
  description: "Generated by create next app",
};

const clientId = GG_CLIENT_ID;
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GoogleOAuthProvider clientId={clientId}>
          <AppProvider>
            <HeaderController />
            <MainLayout>{children}</MainLayout>
            <FooterController />
          </AppProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
