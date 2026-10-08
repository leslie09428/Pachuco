import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { AppShell } from "@/components/app/app-shell";
import { AppProviders } from "./providers";

export const metadata: Metadata = {
  title: "Crónicas del Pachuco",
  description:
    "Página web interactiva con un personaje pachuco en 3D y un asistente de IA para conocer la historia, vestimenta, lenguaje y costumbres de los pachucos.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        <Script src="/spk-runtime-config.js" strategy="beforeInteractive" />
        <AppProviders>
          <AppShell>{children}</AppShell>
        </AppProviders>
      </body>
    </html>
  );
}
