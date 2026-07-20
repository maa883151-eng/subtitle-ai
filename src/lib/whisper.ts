import OpenAI from "openai";
import { Subtitle } from "./utils";
import fs from "fs";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function transcribeAudio(
  filePath: string,
  language?: string
): Promise<Subtitle[]> {
  const audioFile = fs.createReadStream(filePath);

  const transcription = await openai.audio.transcriptions.create({
    file: audioFile,
    model: "whisper-1",
    language: language || undefined,
    response_format: "verbose_json",
    timestamp_granularities: ["segment"],
  });

  const segments = (transcription as any).segments ?? [];

  return segments.map((seg: any, idx: number) => ({
    index: idx + 1,
    start: seg.start,
    end: seg.end,
    text: seg.text.trim(),
  }));
}

export async function translateSubtitles(
  subtitles: Subtitle[],
  targetLanguage: string
): Promise<Subtitle[]> {
  const texts = subtitles.map((s) => s.text);
  const batchSize = 20;
  const translated: string[] = [];

  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize);
    const prompt = `Translate these subtitle lines to ${targetLanguage}. Return ONLY the translated lines, one per line, in the same order. Do not add numbering or extra text.\n\n${batch.join("\n")}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 2000,
    });

    const result = response.choices[0].message.content ?? "";
    const lines = result.split("\n").filter((l) => l.trim());
    translated.push(...lines);
  }

  return subtitles.map((s, idx) => ({
    ...s,
    text: translated[idx] ?? s.text,
  }));
}
