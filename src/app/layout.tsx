import type { Metadata } from "next";
import { Chakra_Petch, JetBrains_Mono } from "next/font/google";

import { Providers } from "@/app/providers";

import "./globals.css";

const display = Chakra_Petch({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SetupGuide AI",
  description:
    "Guia inteligente de setup para desenvolvedores: salve, organize e atualize seus ambientes de desenvolvimento com ajuda de IA.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${mono.variable} ${display.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
