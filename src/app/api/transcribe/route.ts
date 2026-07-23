import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { transcribeAudio, translateSubtitles } from "@/lib/whisper";
import { toSRT, toVTT } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (process.env.DEMO_MODE === "true") {
    return NextResponse.json({
      id: "demo-job-" + Math.random().toString(36).slice(2, 8),
      status: "PROCESSING",
      title: "Demo Transcription",
      progress: 10,
      fileName: "demo.mp3",
      fileSize: 1024000,
      language: "en",
    });
  }

  const { auth } = await import("@clerk/nextjs/server");
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let user = await db.user.findUnique({ where: { clerkId: userId } });
  if (!user) user = await db.user.create({ data: { clerkId: userId, email: userId, credits: 5 } });

  if (user.credits <= 0) {
    return NextResponse.json({ error: "No credits remaining." }, { status: 402 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File;
  const language = (formData.get("language") as string) || "en";
  const translateTo = formData.get("translateTo") as string | null;

  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

  const title = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");

  const job = await db.subtitleJob.create({
    data: {
      userId: user.id,
      title,
      fileName: file.name,
      fileSize: file.size,
      language,
      translateTo: translateTo || null,
      status: "PROCESSING",
      progress: 10,
    },
  });

  (async () => {
    try {
      const tmpDir = path.join(process.cwd(), "tmp");
      await mkdir(tmpDir, { recursive: true });
      const tmpPath = path.join(tmpDir, `${job.id}_${file.name}`);

      const bytes = await file.arrayBuffer();
      await writeFile(tmpPath, Buffer.from(bytes));

      await db.subtitleJob.update({ where: { id: job.id }, data: { progress: 30 } });

      let subtitles = await transcribeAudio(tmpPath, language);

      await db.subtitleJob.update({ where: { id: job.id }, data: { progress: 70 } });

      if (translateTo) {
        subtitles = await translateSubtitles(subtitles, translateTo);
      }

      const srt = toSRT(subtitles);
      const vtt = toVTT(subtitles);

      await db.subtitleJob.update({
        where: { id: job.id },
        data: {
          status: "DONE",
          progress: 100,
          subtitles: subtitles as unknown as import("@prisma/client").Prisma.InputJsonValue,
          srtContent: srt,
          vttContent: vtt,
        },
      });

      await db.user.update({ where: { id: user!.id }, data: { credits: { decrement: 1 } } });

      const { unlink } = await import("fs/promises");
      await unlink(tmpPath).catch(() => {});
    } catch (err) {
      console.error("Transcription error:", err);
      await db.subtitleJob.update({
        where: { id: job.id },
        data: { status: "FAILED", errorMsg: String(err) },
      });
    }
  })();

  return NextResponse.json(job);
}
