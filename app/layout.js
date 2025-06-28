import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ContextProvider } from "./_context/ContextApi";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/components/ui/theme-provider";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Quizo",
  description: "Quizo – Explore, answer, and master quizzes across categories.",
  keywords: ["about", "dashboard"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ContextProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
          <Toaster />
        </ContextProvider>
      </body>
    </html>
  );
}
