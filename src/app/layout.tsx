import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "regenerator-runtime";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Speech-to-Text",
  description: "Speech-to-Text",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
