import type { Metadata } from "next";
import { Quicksand, Nunito_Sans } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";
import { ToastProvider } from "@/components/ToastProvider";

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
});

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bimbel Grase Kamila Bogor",
  description: "Platform e-learning dan manajemen bimbingan belajar Bimbel Grase.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="id"
      className={`${quicksand.variable} ${nunitoSans.variable} h-full antialiased`}
    >
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-surface text-on-surface">
        <ToastProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
        </ToastProvider>
      </body>
    </html>
  );
}
