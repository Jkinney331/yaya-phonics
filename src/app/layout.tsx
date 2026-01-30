import type { Metadata } from "next";
import "./globals.css";
import { CloudSyncProvider } from "@/components/CloudSyncProvider";

export const metadata: Metadata = {
  title: "Yaya's Sound Safari 🦕",
  description: "A fun phonics adventure for Yaya!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <CloudSyncProvider>
          {children}
        </CloudSyncProvider>
      </body>
    </html>
  );
}
