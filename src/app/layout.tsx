import type { Metadata } from "next";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import StoreProvider from "./_providers/storeProvider";
import { ToastContainer } from "react-toastify";
import QueryProvider from "./_providers/QueryProvider";
import { Toaster } from "sonner";
import Header from "@/components/header";
import { AuthProvider } from "@/context/auth-context";
import Footer from "@/components/footer";
import Chatbot from "@/components/chatbot";

export const metadata: Metadata = {
  title: "Yabatech Healthcare System",
  description: "Healthcare bookings app.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ToastContainer />
        <AuthProvider>
          {/* <SocketProvider> */}
          <QueryProvider>
            <StoreProvider>
              <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
                <Header />
                <main className="min-h-screen">{children}</main>
                <Toaster richColors />
                <Footer />
                <Chatbot />
              </ThemeProvider>
            </StoreProvider>
          </QueryProvider>
          {/* </SocketProvider> */}
        </AuthProvider>
      </body>
    </html>
  );
}
