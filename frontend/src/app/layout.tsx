import type { Metadata } from "next";
import "@/globals.css";
import { poppins } from "@/fonts";

export const metadata: Metadata = {
  title: "Runbook",
  description: "Documentation that can run",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <script
        async
        crossOrigin="anonymous"
        src="https://tweakcn.com/live-preview.min.js"
      />
      <body className={`${poppins.className} antialiased`}>{children}</body>
    </html>
  );
}
