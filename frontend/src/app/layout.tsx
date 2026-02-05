import "../styles/globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <div style={{ padding: 40 }}>
          <h1>LAYOUT ROOT CARREGOU</h1>
          {children}
        </div>
      </body>
    </html>
  );
}
