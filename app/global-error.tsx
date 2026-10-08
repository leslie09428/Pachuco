"use client";

// Root-layout crash containment. error.tsx cannot catch failures in the root
// layout itself, so the platform template ships this last-line boundary to
// keep Preview from ever going blank-white. Must define its own <html>.

export default function GlobalError(props: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { error, reset } = props;
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          backgroundColor: "#f6f5f1",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "PingFang SC", "Noto Sans SC", "Microsoft YaHei", "Segoe UI", sans-serif',
          color: "#1c1a17",
        }}
      >
        <div style={{ textAlign: "center", padding: 24, maxWidth: 560 }}>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 600 }}>
            The application failed to render
          </h1>
          <p
            style={{
              margin: "14px 0 0",
              fontSize: 13,
              lineHeight: 1.6,
              color: "#6f6a61",
              maxHeight: 160,
              overflow: "auto",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              background: "rgba(28, 26, 23, 0.045)",
              borderRadius: 10,
              padding: "10px 14px",
            }}
          >
            {error.message || "An unexpected error occurred."}
          </p>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              marginTop: 18,
              padding: "8px 20px",
              fontSize: 13,
              fontWeight: 600,
              color: "#f7f6f2",
              background: "#1c1a17",
              border: "none",
              borderRadius: 999,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
          <p style={{ margin: "16px 0 0", fontSize: 12, color: "#9b968c" }}>
            Ask the Agent to review the Preview output and fix this error.
          </p>
        </div>
      </body>
    </html>
  );
}
