
import { Outfit, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata = {
  title: "Oriflame Üyelik & Katalog",
  description: "Oriflame dünyasına katılın, ücretsiz üye olun ve kazanmaya başlayın.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body
        className={`${outfit.variable} ${playfair.variable} antialiased font-sans`}
      >
        <Header />
        <main>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
