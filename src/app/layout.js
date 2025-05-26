import { Inter } from "next/font/google";
import { LogsProvider } from "../contexts/LogsContext";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata = {
  title: "SCUD Dashboard",
  description: "SCUD Dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`} suppressHydrationWarning>
        <LogsProvider>
          {children}
        </LogsProvider>
      </body>
    </html>
  );
}
