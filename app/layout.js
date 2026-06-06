import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Agape Bible Church",
  description: "Official Agape Bible Church App",
  manifest: "/manifest.json",
  themeColor: "#0F172A",
  icons: {
    icon: "/church-logo.png",
    apple: "/church-logo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}

        <Script id="register-service-worker" strategy="afterInteractive">
          {`
            if ("serviceWorker" in navigator) {
              navigator.serviceWorker
                .register("/sw.js")
                .then(() => console.log("Service Worker Registered"))
                .catch((err) => console.log(err));
            }
          `}
        </Script>
      </body>
    </html>
  );
}