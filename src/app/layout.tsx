import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/providers/AuthProvider";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { getCurrentProfile, getCurrentUser } from "@/services/auth";
import "leaflet/dist/leaflet.css";

const SITE_NAME = "JemberKost";
const SITE_DESCRIPTION = "Platform pencarian dan pengelolaan kos modern di Jember.";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: ["kos jember", "sewa kost jember", "tempat tinggal mahasiswa jember"],
  icons: {
    icon: [{ url: "/favicon.ico" }, { url: "/favicon.ico.png", rel: "icon" }],
    shortcut: [{ url: "/favicon.ico" }, { url: "/favicon.ico.png", rel: "icon" }],
    apple: [{ url: "/logo.png" }],
  },
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    siteName: SITE_NAME,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();
  const profile = user ? await getCurrentProfile() : null;

  return (
    <html lang="id" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider>
          <AuthProvider initialUser={user} initialProfile={profile}>
            <Navbar />

            <main className="flex-1">{children}</main>

            <Footer />
            <Toaster richColors closeButton position="top-right" />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
