import type { Metadata, Viewport } from "next";
import "./globals.css";
import Sincronizador from "@/components/Sincronizador";
import Offline from "@/components/Offline";

export const metadata: Metadata = {
  title: "AlimentaProva",
  description: "Registre as despesas do seu filho com comprovante, em vinte segundos. Tudo datado, tudo guardado.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "AlimentaProva",
    statusBarStyle: "default",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#1f4d8f",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-full">
        <Sincronizador />
        <Offline />
        <div className="mx-auto min-h-screen w-full max-w-md bg-paper print:max-w-none print:bg-white">{children}</div>
      </body>
    </html>
  );
}
