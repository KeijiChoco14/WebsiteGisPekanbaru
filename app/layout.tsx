import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import 'ol/ol.css';
import NextTopLoader from 'nextjs-toploader';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Peta Wilayah Pekanbaru",
  description: "WebGIS Pengelolaan Sampah Kota Pekanbaru",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Loader diletakkan di dalam body agar muncul di setiap halaman */}
        <NextTopLoader 
          color="#10b981" 
          showSpinner={false} 
          shadow="0 0 10px #10b981,0 0 5px #10b981"
          height={3}
        />
        {children}
      </body>
    </html>
  );
}