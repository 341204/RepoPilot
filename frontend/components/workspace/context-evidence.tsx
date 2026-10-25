import { BookOpen, Circle, CircleCheck, CircleX, FileText, FolderGit2, LoaderCircle } from "lucide-react";

type Citation = Record<string, unknown>;
type Activity = { id: string; title: string; content: string; status?: string };

export function ContextEvidence({ repository, citations, activity, pending }: { repository?: string; citations: Citation[]; activity: Activity[]; pending: boolean }) {
  return (
    <div className="space-y-7">
      <section>
        <div className="mb-3 text-[11px] font-medium uppercase tracking-[0.14em] text-muted">Repository context</div>
        <div className="flex items-center gap-2 text-sm text-ink"><FolderGit2 className="h-4 w-4 shrink-0 text-accent" /><span className="break-all">{repository || "尚未选择项目"}</span></div>
        <p className="mt-2 text-xs leading-6 text-muted">{repository ? "回答围绕当前项目的代码、知识与工程记录展开。" : "添加或选择一个项目，开始审查代码和检索项目知识。"}</p>
      </section>
      <section>
        <div className="mb-2 flex items-center justify-between gap-2"><h3 className="text-xs font-medium text-ink">引用来源</h3><span className="text-[11px] text-muted">{citations.length} 项</span></div>
        {citations.length === 0 ? <div className="border-t border-line py-4 text-xs leading-6 text-muted"><BookOpen className="mb-2 h-4 w-4" />本轮回答的引用来源会显示在这里。历史消息可展开对话中的工具记录查看证据。</div> : citations.map((citation, index) => {
          const title = String(citation.title || citation.path || citation.source || `来源 ${index + 1}`);
          const detail = String(citation.path || citation.type || citation.source_type || "项目资料");
          const url = typeof citation.url === "string" && /^https?:\/\//i.test(citation.url) ? citation.url : undefined;
          return <div key={`${String(citation.id || title)}-${index}`} className="border-t border-line py-3"><div className="flex items-start gap-2 text-xs text-ink"><FileText className="mt-0.5 h-4 w-4 shrink-0 text-accent" />{url ? <a href={url} target="_blank" rel="noreferrer" className="break-all hover:underline">{title}</a> : <span className="break-all">{title}</span>}</div><div className="mt-1 break-all pl-6 font-mono text-[11px] text-muted">{detail}</div></div>;
        })}
      </section>
      <section>
        <div className="mb-3 flex items-center justify-between"><h3 className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted">Agent activity</h3>{pending && <LoaderCircle className="h-3.5 w-3.5 animate-spin text-accent" aria-label="执行中" />}</div>
        {activity.length === 0 ? <p className="text-xs leading-6 text-muted">提问后展示实际执行的任务和工具记录。</p> : <ol className="space-y-4">{activity.slice(-12).map((item) => {
          const Icon = item.status === "error" ? CircleX : item.status === "running" ? LoaderCircle : item.status === "done" ? CircleCheck : Circle;
          return <li key={item.id} className="flex gap-2.5"><Icon className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${item.status === "error" ? "text-danger" : item.status === "running" ? "animate-spin text-accent" : item.status === "done" ? "text-success" : "text-muted"}`} /><div className="min-w-0"><div className="break-words text-xs text-ink">{item.title}</div><details className="mt-1 text-[11px] leading-5 text-muted"><summary className="cursor-pointer">{item.status === "error" ? "查看错误" : item.status === "running" ? "执行中 · 查看详情" : "查看记录"}</summary><p className="mt-1 whitespace-pre-wrap break-all">{item.content || "暂无详细记录"}</p></details></div></li>;
        })}</ol>}
      </section>
    </div>
  );
}
