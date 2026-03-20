import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CompareProvider } from "@/context/CompareContext";
import { VariantProvider } from "@/context/VariantContext";
import Header from "@/components/Header";
import ScrollToTopButton from "@/components/ScrollToTopButton";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "DonkeyFavs — Termos Karşılaştırma Platformu",
  description:
    "En iyi termos modellerini karşılaştırın. Hacim, ısı koruması, ağırlık ve boyut bilgilerini yan yana görün.",
  keywords: "termos, karşılaştırma, bardak, tumbler, su şişesi, stanley",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${inter.className} h-full`}>
      <body className="flex min-h-full flex-col">
        <CompareProvider>
          <VariantProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <footer className="border-t border-navy-border bg-navy-darkest/80 py-6 text-center text-sm text-text-muted">
              <p>© 2026 DonkeyFavs — Sea</p>
            </footer>
            <ScrollToTopButton />
          </VariantProvider>
        </CompareProvider>
      </body>
    </html>
  );
}
