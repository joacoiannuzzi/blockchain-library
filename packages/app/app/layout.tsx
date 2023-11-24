import "@/app/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import "react-toastify/dist/ReactToastify.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/app/components/Providers";
import { Header } from "@/app/components/Header";
import { ToastContainer } from "react-toastify";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Blockchain Library",
  description: "A blockchain library",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <div className="sticky z-50 top-0">
              <Header />
            </div>
            <div className="flex-grow">{children}</div>
          </div>
        </Providers>
        <ToastContainer />
      </body>
    </html>
  );
}
