"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import { Upload, FileVideo, Mic, Globe, Loader2, AlertCircle } from "lucide-react";
import { formatBytes } from "@/lib/utils";

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "bn", name: "Bengali" },
  { code: "ar", name: "Arabic" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "hi", name: "Hindi" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "pt", name: "Portuguese" },
  { code: "de", name: "German" },
  { code: "zh", name: "Chinese" },
  { code: "ru", name: "Russian" },
  { code: "tr", name: "Turkish" },
  { code: "it", name: "Italian" },
];

const TRANSLATE_OPTIONS = [
  { code: "", name: "No translation" },
  ...LANGUAGES,
];

export function JobUploader() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [language, setLanguage] = useState("en");
  const [translateTo, setTranslateTo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onDrop = useCallback((files: File[]) => {
    setFile(files[0] ?? null);
    setError("");
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "video/*": [".mp4", ".mov", ".avi", ".webm", ".mkv"],
      "audio/*": [".mp3", ".wav", ".m4a", ".flac", ".ogg"],
    },
    maxFiles: 1,
    maxSize: 500 * 1024 * 1024,
  });

  async function handleSubmit() {
    if (!file) return;
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("language", language);
      if (translateTo) formData.append("translateTo", translateTo);

      const res = await fetch("/api/transcribe", { method: "POST", body: formData });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Upload failed");
      }
      const job = await res.json();
      router.push(`/generate/${job.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to start job");
    } finally {
      setLoading(false);
    }
  }

  const selectCls = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white";

  return (
    <div className="space-y-5">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-colors ${
          isDragActive ? "border-blue-400 bg-blue-50" :
          file ? "border-green-300 bg-green-50" :
          "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50"
        }`}
      >
        <input {...getInputProps()} />
        {file ? (
          <div>
            <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <FileVideo className="w-7 h-7 text-green-600" />
            </div>
            <p className="font-semibold text-gray-900">{file.name}</p>
            <p className="text-sm text-gray-500 mt-1">{formatBytes(file.size)}</p>
            <p className="text-xs text-blue-600 mt-2">Click or drop to replace</p>
          </div>
        ) : (
          <div>
            <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Upload className="w-7 h-7 text-blue-600" />
            </div>
            <p className="font-semibold text-gray-900 text-lg">
              {isDragActive ? "Drop your file here" : "Drag & drop video or audio"}
            </p>
            <p className="text-sm text-gray-400 mt-2">MP4, MP3, WAV, MOV, WebM · Max 500MB</p>
          </div>
        )}
      </div>

      {/* Options */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5 flex items-center gap-1.5">
            <Mic className="w-3.5 h-3.5" /> Audio Language
          </label>
          <select value={language} onChange={(e) => setLanguage(e.target.value)} className={selectCls}>
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>{l.name}</option>
            ))}
          </select>
          <p className="text-xs text-gray-400 mt-1">The language spoken in the video</p>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5" /> Translate To (optional)
          </label>
          <select value={translateTo} onChange={(e) => setTranslateTo(e.target.value)} className={selectCls}>
            {TRANSLATE_OPTIONS.map((l) => (
              <option key={l.code} value={l.code}>{l.name}</option>
            ))}
          </select>
          <p className="text-xs text-gray-400 mt-1">Translate subtitles to another language</p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 rounded-lg p-3">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={!file || loading}
        className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-semibold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <><Loader2 className="w-5 h-5 animate-spin" />Uploading & Starting...</>
        ) : (
          <><Mic className="w-5 h-5" />Generate Subtitles</>
        )}
      </button>
    </div>
  );
}
