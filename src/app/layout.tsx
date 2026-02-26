import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Cairo } from "next/font/google";
import "./globals.css";
import ConditionalNavbar from "@/components/layout/ConditionalNavbar";
import ConditionalFooter from "@/components/layout/ConditionalFooter";
import { LanguageProvider } from "@/context/LanguageContext";
import { AuthProvider } from "@/context/AuthContext";
import IntagoChatbot from "@/components/chat/IntagoChatbot";
import TopLoader from '@/components/common/TopLoader';
import ProfileGuard from "@/components/auth/ProfileGuard";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const cairo = Cairo({
  subsets: ["arabic"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Intaglab | Industrial Surplus Marketplace",
  description: "The premier platform for buying and selling industrial surplus inventory in Egypt.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${jakarta.variable} ${cairo.variable}`}>
        <TopLoader />
        <AuthProvider>
          <LanguageProvider>
            <ConditionalNavbar />
            <ProfileGuard>
              <main style={{ minHeight: "100vh" }}>
                {children}
              </main>
              <IntagoChatbot />
              <ConditionalFooter />
            </ProfileGuard>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
