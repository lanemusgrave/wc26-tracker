export const metadata = {
  title: "WC26 Ticket Tracker",
  description: "FIFA World Cup 2026 ticket resale tracker",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
