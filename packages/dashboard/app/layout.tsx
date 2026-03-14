import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Sidebar } from "@/components/layout/sidebar";
import { DemoProvider } from "@/components/demo/demo-provider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PropBot — Autonomous Property Manager",
  description: "AI-managed vacation rental dashboard powered by OpenClaw",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <DemoProvider>
          <Sidebar />
          <main className="ml-64 min-h-screen p-8">
            {children}
          </main>
        </DemoProvider>
      </body>
    </html>
  );
}
