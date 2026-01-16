import type { Metadata } from "next";
import "@/globals.css";
import { poppins } from "@/fonts";
import { Toaster } from "@/components/ui/sonner";
import QueryProvider from "@/providers/query-provider";

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
      <body className={`${poppins.className} antialiased`}>
        <QueryProvider>
          {children}
          <Toaster closeButton richColors position="top-right" />
        </QueryProvider>
      </body>
    </html>
  );
}
