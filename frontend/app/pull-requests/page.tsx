"use client";

import { useEffect, useState } from "react";

import { Card, GhostButton, PageTitle, PrimaryButton } from "@/components/ui/card";
import { AnalysisReport } from "@/components/workspace/analysis-report";
import { apiGet, apiPost } from "@/lib/api";
import type { Repository } from "@/lib/types";

type PullRequest = {
  id: string;
  number: number;
  title: string;
  state: string;
  files: { filename: string; additions: number; deletions: number }[];
};

export default function PullRequestsPage() {
  const [prs, setPrs] = useState<PullRequest[]>([]);
  const [selected, setSelected] = useState<PullRequest | null>(null);
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    apiGet<Repository[]>("/api/repos").then((repos) => {
      if (repos[0]) {
        return apiGet<PullRequest[]>(`/api/repos/${repos[0].id}/pull-requests`).then((items) => {
          setPrs(items);
          setSelected(items[0] ?? null);
        });
      }
    }).catch((reason: Error) => setError(reason.message)).finally(() => setLoading(false));
  }, []);

  async function analyze() {
    if (!selected) return;
    setAnalyzing(true);
    setError("");
    try {
      const data = await apiPost(`/api/pull-requests/${selected.id}/analyze`, {});
      setAnalysis(JSON.stringify(data, null, 2));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "PR 分析失败，请稍后重试。");
    } finally { setAnalyzing(false); }
  }

  return (
    <>
      <PageTitle title="PR 审查" description="围绕代码变更与项目证据，审查风险、检查测试覆盖，并确定合并前的下一步。" />
      {error && <div role="alert" className="mb-4 rounded-lg border border-danger/25 bg-danger-soft p-4 text-sm text-danger">{error}</div>}
      <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
        <Card>
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-ink">Pull Requests</h2>
            <span className="rounded-full bg-panel px-2.5 py-1 text-xs text-muted">{prs.length} 个</span>
          </div>
          <div className="mt-4 space-y-2">
            {loading && <p className="py-6 text-sm text-muted">正在读取 Pull Requests…</p>}
            {!loading && prs.length === 0 && <p className="py-6 text-sm leading-7 text-muted">暂无 Pull Request，请先在仓库管理中连接并同步项目。</p>}
            {prs.map((pr) => (
              <GhostButton key={pr.id} disabled={analyzing} aria-pressed={selected?.id === pr.id} onClick={() => { setSelected(pr); setAnalysis(""); }} className={selected?.id === pr.id ? "border-accent/25 bg-accent-soft text-accent" : ""}>
                #{pr.number} {pr.title}
              </GhostButton>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="font-semibold text-ink">Review 报告</h2>
          {selected && (
            <div className="mt-3 rounded-md bg-panel p-3">
              <div className="text-sm font-medium text-ink">#{selected.number} {selected.title}</div>
              <div className="mt-3 grid gap-2">
                {selected.files.map((file) => (
                  <div key={file.filename} className="flex items-center justify-between rounded-md bg-surface px-3 py-2 text-sm text-muted">
                    <span className="truncate">{file.filename}</span>
                    <span className="ml-3 whitespace-nowrap text-xs text-muted">+{file.additions} / -{file.deletions}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {!selected && <div className="py-12 text-sm leading-7 text-muted">选择一个 PR，查看变更文件与审查报告。</div>}
          <PrimaryButton onClick={analyze} disabled={!selected || analyzing} className="mt-4">{analyzing ? "正在审查…" : "生成 PR 分析"}</PrimaryButton>
          {analysis && <AnalysisReport value={analysis} />}
        </Card>
      </div>
    </>
  );
}
