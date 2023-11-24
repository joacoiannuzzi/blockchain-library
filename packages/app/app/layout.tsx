import "@/app/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import "react-toastify/dist/ReactToastify.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/app/components/Providers";
import { Header } from "@/app/components/Header";
import { ToastContainer } from "react-toastify";
import { AuthWrapper } from "./components/AuthWrapper";

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
          <AuthWrapper>
            <div className="flex flex-col min-h-screen">
              <div className="sticky z-50 top-0">
                <Header />
              </div>
              <div className="flex-grow">{children}</div>
            </div>
          </AuthWrapper>
        </Providers>
        <ToastContainer />
      </body>
    </html>
  );
}
