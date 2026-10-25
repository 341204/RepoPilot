import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/layout/app-shell";

export const metadata: Metadata = {
  title: { default: "RepoPilot", template: "%s · RepoPilot" },
  description: "RepoPilot — 面向工程团队的 PR 审查、CI 排障与项目知识协作工作台"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" className="dark">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
