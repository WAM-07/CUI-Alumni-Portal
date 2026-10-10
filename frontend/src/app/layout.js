import "./globals.css";
import { AuthProvider } from "../providers/AuthProvider";

export const metadata = {
  title: "COMSATS University Alumni Portal",
  description: "Centralized networking, recruitment, and mentorship portal for COMSATS University.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#F8FAFC] text-[#0F172A] antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
