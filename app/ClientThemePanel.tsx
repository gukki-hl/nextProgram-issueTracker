"use client";

import dynamic from "next/dynamic";

const ThemePanel = dynamic(
  () => import("@radix-ui/themes").then((mod) => mod.ThemePanel),
  { ssr: false }
);

export default function ClientThemePanel() {
  return <ThemePanel />;
}
