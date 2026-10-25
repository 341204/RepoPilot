"use client";

import { useEffect, useState } from "react";

import { Card, GhostButton, PageTitle, PrimaryButton } from "@/components/ui/card";
import { AnalysisReport } from "@/components/workspace/analysis-report";
import { apiGet, apiPost } from "@/lib/api";
import type { Repository } from "@/lib/types";

type WorkflowRun = {
  id: string;
  name: string;
  status: string;
  conclusion?: string | null;
  logs_text?: string | null;
  jobs?: Array<{ name?: string; conclusion?: string; steps?: Array<{ name?: string; conclusion?: string }> }>;
};

export default function CIPage() {
  const [runs, setRuns] = useState<WorkflowRun[]>([]);
  const [selected, setSelected] = useState<WorkflowRun | null>(null);
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    apiGet<Repository[]>("/api/repos").then((repos) => {
      if (repos[0]) {
        return apiGet<WorkflowRun[]>(`/api/repos/${repos[0].id}/workflow-runs`).then((items) => {
          setRuns(items);
          setSelected(items.find((item) => item.conclusion === "failure") ?? items[0] ?? null);
        });
      }
    }).catch((reason: Error) => setError(reason.message)).finally(() => setLoading(false));
  }, []);

  async function analyze() {
    if (!selected) return;
    setAnalyzing(true);
    setError("");
    try {
      const data = await apiPost(`/api/workflow-runs/${selected.id}/analyze`, {});
      setAnalysis(JSON.stringify(data, null, 2));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "CI 分析失败，请稍后重试。");
    } finally { setAnalyzing(false); }
  }

  return (
    <>
      <PageTitle title="CI 排障" description="从失败日志定位问题，关联执行步骤与项目上下文，生成有依据的排查建议。" />
      {error && <div role="alert" className="mb-4 rounded-lg border border-danger/25 bg-danger-soft p-4 text-sm text-danger">{error}</div>}
      <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
        <Card>
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-ink">Workflow Runs</h2>
            <span className="rounded-full bg-panel px-2.5 py-1 text-xs text-muted">{runs.length} 次</span>
          </div>
          <div className="mt-4 space-y-2">
            {loading && <p className="py-6 text-sm text-muted">正在读取工作流记录…</p>}
            {!loading && runs.length === 0 && <p className="py-6 text-sm leading-7 text-muted">暂无工作流记录，请先连接并同步 GitHub 仓库。</p>}
            {runs.map((run) => (
              <GhostButton key={run.id} disabled={analyzing} aria-pressed={selected?.id === run.id} onClick={() => { setSelected(run); setAnalysis(""); }} className={selected?.id === run.id ? "border-accent/25 bg-accent-soft text-accent" : ""}>
                <div className="flex items-center justify-between gap-3">
                  <span>{run.name}</span>
                  <span className={run.conclusion === "failure" ? "text-danger" : run.conclusion === "success" ? "text-success" : "text-muted"}>{run.conclusion ?? run.status}</span>
                </div>
              </GhostButton>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="font-semibold text-ink">排查建议</h2>
          {(selected?.jobs?.length ?? 0) > 0 && (
            <div className="mt-3 rounded-md border border-line bg-panel p-3 text-xs leading-5 text-ink">
              <div className="font-medium text-ink">失败 Job</div>
              {(selected?.jobs ?? [])
                .filter((job) => job.conclusion === "failure")
                .map((job) => (
                  <div key={job.name} className="mt-2">
                    <span className="font-medium">{job.name}</span>
                    {job.steps?.filter((step) => step.conclusion === "failure").map((step) => (
                      <span key={step.name} className="ml-2 rounded-full bg-warn-soft px-2 py-0.5 text-warn">
                        {step.name}
                      </span>
                    ))}
                  </div>
                ))}
            </div>
          )}
          {selected?.logs_text && <pre className="mt-3 max-h-44 overflow-auto rounded-md border border-line bg-panel p-3 text-xs text-ink">{selected.logs_text}</pre>}
          {!selected && <div className="py-12 text-sm leading-7 text-muted">选择一次运行，查看失败日志与排查建议。</div>}
          <PrimaryButton onClick={analyze} disabled={!selected || analyzing} className="mt-4">{analyzing ? "正在分析…" : "分析失败原因"}</PrimaryButton>
          {analysis && <AnalysisReport value={analysis} />}
        </Card>
      </div>
    </>
  );
}
