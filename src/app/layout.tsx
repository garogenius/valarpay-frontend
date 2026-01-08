import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";
import NextTopLoader from "nextjs-toploader";
import "react-loading-skeleton/dist/skeleton.css";
import { Toaster } from "react-hot-toast";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import UserProvider from "@/providers/UserProvider";
import GlobalModalsProvider from "@/components/shared/GlobalModalsProvider";
import "react-datepicker/dist/react-datepicker.css";
// Removed next/font/google due to Turbopack resolution error; using Tailwind's font-sans instead

// Using default Tailwind font stack (font-sans)

export const metadata: Metadata = {
  title: "Valarpay – Smart Payments for Your Business",
  description: "Valarpay offers modern payment solutions to streamline your business transactions.",
  openGraph: {
    title: "Valarpay – Smart Payments for Your Business",
    description: "Valarpay offers modern payment solutions to streamline your business transactions.",
    url: "https://www.valarpay.com",
    siteName: "Valarpay",
    images: [
      {
        url: "https://www.valarpay.com/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark" data-mode="dark">

      <body className="font-sans">
        <ThemeProvider>
          <ReactQueryProvider>
            <UserProvider>
              <GlobalModalsProvider />
              <Toaster
                position="top-center"
                reverseOrder={false}
                toastOptions={{
                  style: {
                    border: "1px solid #E4E7EC",
                    borderRadius: 15,
                    padding: "16px",
                    color: "#000",
                    fontSize: 15,
                    fontWeight: 400,
                  },
                  duration: 15000,
                }}
              />
              <NextTopLoader color="#D4B139" showSpinner={false} />
              <main className="w-full overflow-hidden">{children}</main>
            </UserProvider>
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
