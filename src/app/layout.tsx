import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Topbar from "@/components/Topbar";
import ModalProvider from "@/providers/modalProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PM",
  description: "A Project Manager",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className={inter.className}>
        <ModalProvider>{children}</ModalProvider>
        <Toaster />
      </body>
    </html>
  );
}
