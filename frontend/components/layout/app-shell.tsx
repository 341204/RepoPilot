"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BookOpen, Braces, FileCheck2, FlaskConical, FolderGit2, GitPullRequest, LayoutDashboard, ListTodo, Menu, MessagesSquare, Navigation, Network, PanelLeftClose, PanelLeftOpen, Play, Terminal, X, type LucideIcon } from "lucide-react";

const navGroups: Array<{ label: string; items: Array<{ href: string; label: string; icon: LucideIcon }> }> = [
  { label: "工作区", items: [
    { href: "/", label: "工程工作台", icon: LayoutDashboard },
    { href: "/pull-requests", label: "PR 审查", icon: GitPullRequest },
    { href: "/ci", label: "CI 排障", icon: Terminal },
    { href: "/issues", label: "Issue 分析", icon: ListTodo }
  ] },
  { label: "项目资源", items: [
    { href: "/repos", label: "仓库管理", icon: FolderGit2 },
    { href: "/knowledge", label: "项目知识", icon: BookOpen },
    { href: "/rag", label: "RAG 工作室", icon: Braces },
    { href: "/code-graph", label: "代码关系", icon: Network }
  ] },
  { label: "运行与评测", items: [
    { href: "/workflow-runs", label: "执行记录", icon: Play },
    { href: "/action-drafts", label: "操作草稿", icon: FileCheck2 },
    { href: "/evals", label: "评测", icon: FlaskConical },
    { href: "/reports", label: "工程周报", icon: MessagesSquare },
    { href: "/workspaces", label: "工作区管理", icon: FolderGit2 }
  ] }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const current = navGroups.flatMap((group) => group.items).find((item) => item.href === "/" ? pathname === "/" : pathname.startsWith(item.href));

  return (
    <div className={`app-shell ${collapsed ? "app-shell--compact" : ""}`}>
      <a className="skip-link" href="#main-content">跳到主要内容</a>
      {mobileOpen && <button type="button" className="app-nav-backdrop" aria-label="关闭导航" onClick={() => setMobileOpen(false)} />}
      <aside id="app-navigation" className={`app-nav ${mobileOpen ? "app-nav--open" : ""}`} onKeyDown={(event) => { if (event.key === "Escape") setMobileOpen(false); }}>
        <Link href="/" className="app-brand" onClick={() => setMobileOpen(false)} aria-label="RepoPilot 首页"><span className="app-brand-mark"><Navigation size={19} aria-hidden="true" /></span><span className="app-nav-label">RepoPilot</span></Link>
        <button type="button" className="app-nav-mobile-close" onClick={() => setMobileOpen(false)} aria-label="关闭导航"><X size={18} /></button>
        <nav className="app-nav-groups" aria-label="主导航">
          {navGroups.map((group) => <div className="app-nav-group" key={group.label}><div className="app-nav-group-label">{group.label}</div>{group.items.map(({ href, label, icon: Icon }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return <Link key={href} href={href} className={`app-nav-link ${active ? "is-active" : ""}`} aria-current={active ? "page" : undefined} title={collapsed ? label : undefined} onClick={() => setMobileOpen(false)}><Icon size={17} aria-hidden="true" /><span className="app-nav-label">{label}</span></Link>;
          })}</div>)}
        </nav>
        <div className="app-nav-footer"><span className="app-avatar">RP</span><div className="app-nav-label"><div>RepoPilot</div><div className="text-xs text-muted">工程协作工作区</div></div></div>
      </aside>
      <div className="app-stage">
        <header className="app-topbar">
          <button type="button" className="app-icon-button app-mobile-menu" onClick={() => setMobileOpen(true)} aria-label="打开导航" aria-expanded={mobileOpen} aria-controls="app-navigation"><Menu size={18} /></button>
          <button type="button" className="app-icon-button app-desktop-menu" onClick={() => setCollapsed((value) => !value)} aria-label={collapsed ? "展开导航" : "收起导航"} aria-expanded={!collapsed} aria-controls="app-navigation">{collapsed ? <PanelLeftOpen size={17} /> : <PanelLeftClose size={17} />}</button>
          <span className="app-breadcrumb">RepoPilot <span>/</span> <strong>{current?.label || "Agent 对话"}</strong></span>
          <span className="app-topbar-note">ENGINEERING WORKSPACE</span>
        </header>
        <main id="main-content" className={pathname === "/" ? "app-content app-content--workspace" : "app-content"}>{children}</main>
      </div>
    </div>
  );
}
