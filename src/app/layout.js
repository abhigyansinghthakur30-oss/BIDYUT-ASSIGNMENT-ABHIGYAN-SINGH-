import "./globals.css";

export const metadata = {
  title: "Bidyut Solutions — Team Task Dashboard",
  description:
    "A real-time team task management dashboard with role-based access control, built with Next.js and Supabase.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
