import type { Metadata } from "next";
import "./globals.css";
import { CloudSyncProvider } from "@/components/CloudSyncProvider";
import { VoiceToggle } from "@/components/VoiceToggle";

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
          <VoiceToggle />
        </CloudSyncProvider>
      </body>
    </html>
  );
}
