"use client";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  return (
    <html>
      <body style={{ padding: 40 }}>
        <h1>Erro detectado</h1>
        <pre>{error.message}</pre>
      </body>
    </html>
  );
}
