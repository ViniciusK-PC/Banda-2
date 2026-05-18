import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { NextAuthProvider } from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VIBE BAND | Official Website",
  description: "Official website of VIBE BAND. Check out our tour dates, music, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={inter.className}>
        <NextAuthProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </NextAuthProvider>
      </body>
    </html>
  );
}
