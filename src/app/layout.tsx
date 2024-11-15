import "@twa-dev/sdk";
import type { Metadata } from "next";
import "./globals.css";
import App from "./components/App";

export const metadata: Metadata = {
  title: "Solvuim Task Bot",
  description: "Earn with Solvuim Tasks on TON Blockchain",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <App>{children}</App>;
}
