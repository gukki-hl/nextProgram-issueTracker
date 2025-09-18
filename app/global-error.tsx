'use client';

import * as Sentry from "@sentry/nextjs";

function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <html>
      <body>
        <h2>Something went wrong!</h2>
        <p>{error.message}</p>
        <button onClick={() => reset()}>Try again</button>
      </body>
    </html>
  );
}

export default Sentry.withErrorBoundary(GlobalError, {
  fallback: <h2>Something went wrong!</h2>, // 兜底 UI（可选）
  showDialog: true, // 是否在浏览器弹出 Sentry 报错对话框
});
