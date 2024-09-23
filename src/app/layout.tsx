import "@twa-dev/sdk";
import type { Metadata } from "next";
import "./globals.css";
import App from "./components/App";

export const metadata: Metadata = {
  title: "Birb On Ton - Task",
  description: "Birb Tasks Page, engae and earn with Birb on TON Blockchain",
  icons: [
    "https://ipfs.io/ipfs/QmcSQadxGMin8VuZGBVUTSykLTsiNnoacgv2UnNkgjMt38/IMG_8168.jpeg",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <App>{children}</App>;
}
