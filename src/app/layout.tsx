import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Korean Dictionary",
    template: "%s | Korean Dictionary",
  },
  description: "Korean dictionary and flashcard application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <div className='container'>
          <Navbar />
          <main className='child-container'>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
