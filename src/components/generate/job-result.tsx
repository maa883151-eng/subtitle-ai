"use client";

import { useState, useEffect } from "react";
import { Download, CheckCircle, Loader2, AlertTriangle, FileText, Clock } from "lucide-react";

interface Subtitle {
  index: number;
  start: number;
  end: number;
  text: string;
}

interface Job {
  id: string;
  title: string;
  fileName: string;
  language: string;
  translateTo: string | null;
  status: string;
  progress: number;
  subtitles: unknown;
  srtContent: string | null;
  vttContent: string | null;
  errorMsg: string | null;
  createdAt: Date;
}

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function JobResult({ job: initialJob }: { job: Job }) {
  const [job, setJob] = useState(initialJob);
  const [activeTab, setActiveTab] = useState<"preview" | "srt" | "vtt">("preview");

  useEffect(() => {
    if (job.status === "PROCESSING" || job.status === "PENDING") {
      const interval = setInterval(async () => {
        const res = await fetch(`/api/jobs/${job.id}`);
        if (res.ok) {
          const updated = await res.json();
          setJob(updated);
          if (updated.status === "DONE" || updated.status === "FAILED") {
            clearInterval(interval);
          }
        }
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [job.id, job.status]);

  function downloadFile(content: string, ext: string) {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${job.title}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const subtitles = (job.subtitles as Subtitle[]) ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
        <p className="text-gray-400 text-sm mt-1">
          {job.fileName} · {job.language.toUpperCase()}{job.translateTo ? ` → ${job.translateTo.toUpperCase()}` : ""}
        </p>
      </div>

      {/* Status */}
      {(job.status === "PROCESSING" || job.status === "PENDING") && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
            <span className="font-medium text-blue-800">Processing your audio with Whisper AI...</span>
          </div>
          <div className="w-full bg-blue-100 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${job.progress}%` }}
            />
          </div>
          <p className="text-xs text-blue-500 mt-2">{job.progress}% — This may take 1-3 minutes</p>
        </div>
      )}

      {job.status === "FAILED" && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-5 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-red-800">Processing failed</p>
            <p className="text-sm text-red-600 mt-1">{job.errorMsg ?? "Unknown error occurred"}</p>
          </div>
        </div>
      )}

      {job.status === "DONE" && (
        <>
          {/* Success + Download */}
          <div className="flex items-center justify-between bg-green-50 border border-green-100 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="font-medium text-green-800">
                {subtitles.length} subtitles generated successfully!
              </span>
            </div>
            <div className="flex gap-2">
              {job.srtContent && (
                <button
                  onClick={() => downloadFile(job.srtContent!, "srt")}
                  className="flex items-center gap-1.5 bg-gray-900 hover:bg-gray-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                >
                  <Download className="w-3.5 h-3.5" /> SRT
                </button>
              )}
              {job.vttContent && (
                <button
                  onClick={() => downloadFile(job.vttContent!, "vtt")}
                  className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                >
                  <Download className="w-3.5 h-3.5" /> VTT
                </button>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div>
            <div className="flex border-b border-gray-100 mb-4">
              {(["preview", "srt", "vtt"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors uppercase -mb-px ${
                    activeTab === tab ? "border-blue-600 text-blue-600" : "border-transparent text-gray-400 hover:text-gray-700"
                  }`}
                >
                  {tab === "preview" ? "Preview" : tab.toUpperCase()}
                </button>
              ))}
            </div>

            {activeTab === "preview" && (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {subtitles.map((sub) => (
                  <div key={sub.index} className="flex gap-4 p-3 rounded-lg hover:bg-gray-50">
                    <div className="flex-shrink-0 text-right">
                      <span className="text-xs text-gray-300 font-mono block">{sub.index}</span>
                      <span className="text-xs text-gray-400 font-mono">{formatTime(sub.start)}</span>
                    </div>
                    <div className="flex-1 flex items-center gap-2">
                      <div className="w-px h-full bg-gray-100 flex-shrink-0" />
                      <p className="text-sm text-gray-800">{sub.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "srt" && job.srtContent && (
              <pre className="bg-gray-900 text-green-400 p-4 rounded-xl text-xs overflow-auto max-h-96 font-mono">
                {job.srtContent.substring(0, 3000)}
                {job.srtContent.length > 3000 && "\n\n... (truncated)"}
              </pre>
            )}

            {activeTab === "vtt" && job.vttContent && (
              <pre className="bg-gray-900 text-blue-400 p-4 rounded-xl text-xs overflow-auto max-h-96 font-mono">
                {job.vttContent.substring(0, 3000)}
                {job.vttContent.length > 3000 && "\n\n... (truncated)"}
              </pre>
            )}
          </div>
        </>
      )}
    </div>
  );
}
