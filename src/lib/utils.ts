import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")},${String(ms).padStart(3, "0")}`;
}

export function toVttTime(seconds: number): string {
  return formatTime(seconds).replace(",", ".");
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export interface Subtitle {
  index: number;
  start: number;
  end: number;
  text: string;
}

export function toSRT(subtitles: Subtitle[]): string {
  return subtitles
    .map((s) => `${s.index}\n${formatTime(s.start)} --> ${formatTime(s.end)}\n${s.text}`)
    .join("\n\n");
}

export function toVTT(subtitles: Subtitle[]): string {
  const entries = subtitles
    .map((s) => `${toVttTime(s.start)} --> ${toVttTime(s.end)}\n${s.text}`)
    .join("\n\n");
  return `WEBVTT\n\n${entries}`;
}
