import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/app/providers/providers";
import SideBar from "./components/SideBar";
import Header from "./components/Header";
import { headers } from "next/headers";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SCCS Lists",
  description: "The newest version of SCCS Mailing Lists.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers
          themeProps={{
            attribute: "class",
            defaultTheme: "system",
            enableSystem: true,
          }}
        >
          <div className="flex min-h-screen bg-zinc-50 font-sans dark:bg-black">
            <main className="flex w-full flex-col bg-white dark:bg-black min-h-screen p-5">
                <div className="h-full">{children}</div>
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
