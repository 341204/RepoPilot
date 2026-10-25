import { AlertTriangle, CheckCircle2, FileCode2 } from "lucide-react";

const sections: Array<[string, string]> = [
  ["key_changes", "关键变更"], ["risk_points", "风险提示"], ["blocking_issues", "合并阻塞项"],
  ["review_checklist", "审查清单"], ["test_suggestions", "测试建议"], ["files_need_attention", "重点文件"],
  ["possible_causes", "可能原因"], ["fix_steps", "修复步骤"], ["debug_steps", "排查步骤"],
  ["related_files", "相关文件"], ["executed_steps", "已执行步骤"], ["review_comments", "审查建议"]
];

function text(value: unknown) { return typeof value === "string" ? value : ""; }

export function AnalysisReport({ value }: { value: string }) {
  let result: Record<string, unknown>;
  try {
    const parsed = JSON.parse(value);
    result = parsed.result ?? parsed;
    if (!result || typeof result !== "object" || Array.isArray(result)) throw new Error("Unexpected report shape");
  } catch {
    return <pre className="mt-5 overflow-auto rounded-lg border border-line bg-base p-4 text-xs leading-6 text-ink">{value}</pre>;
  }
  const summary = text(result.summary) || text(result.failure_summary);
  const recommendation = text(result.merge_recommendation);
  const reason = text(result.recommendation_reason) || text(result.root_cause);
  const findings = Array.isArray(result.review_findings) ? result.review_findings as Record<string, unknown>[] : [];

  return (
    <div className="mt-6 space-y-6" aria-live="polite">
      {(summary || recommendation) && <section className="border-t border-line pt-5"><div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-muted"><CheckCircle2 className="h-4 w-4 text-accent" />分析结果{recommendation && <span className={`rounded px-2 py-1 ${recommendation === "建议合入" ? "bg-success-soft text-success" : "bg-warn-soft text-warn"}`}>{recommendation}</span>}</div>{summary && <p className="text-sm leading-7 text-ink">{summary}</p>}{reason && <p className="mt-2 text-xs leading-6 text-muted">{reason}</p>}</section>}
      {text(result.first_error) && <section><h3 className="mb-2 text-xs font-medium text-muted">首个错误</h3><pre className="whitespace-pre-wrap break-all rounded-lg border border-line bg-base p-4 font-mono text-xs leading-6 text-danger">{text(result.first_error)}</pre></section>}
      {findings.length > 0 && <section><h3 className="mb-3 text-sm font-medium text-ink">审查发现</h3><div className="space-y-4">{findings.map((finding, index) => <div key={index} className="border-l-2 border-warn/60 pl-3"><div className="flex items-start gap-2 text-sm text-warn"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /><span>{text(finding.severity)} · {text(finding.title)}</span></div><p className="mt-2 text-xs leading-6 text-muted">{text(finding.evidence)}</p><p className="mt-1 text-xs leading-6 text-ink">{text(finding.required_action)}</p></div>)}</div></section>}
      {sections.map(([key, label]) => {
        const items = Array.isArray(result[key]) ? (result[key] as unknown[]).filter((item): item is string => typeof item === "string") : [];
        if (!items.length) return null;
        return <section key={key}><h3 className="mb-3 text-xs font-medium text-muted">{label}</h3><ul className="space-y-2">{items.map((item, index) => <li key={index} className="flex gap-2 text-xs leading-6 text-ink">{key.includes("files") ? <FileCode2 className="mt-1 h-3.5 w-3.5 shrink-0 text-accent" /> : <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-muted" />}<span className="min-w-0 break-words">{item}</span></li>)}</ul></section>;
      })}
      <details className="border-t border-line pt-4 text-xs text-muted"><summary className="cursor-pointer">查看完整结构化结果</summary><pre className="mt-3 max-h-96 overflow-auto rounded-lg bg-base p-4 leading-6 text-ink">{value}</pre></details>
    </div>
  );
}
