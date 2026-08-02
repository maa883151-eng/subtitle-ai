// Server-side validation for files uploaded to /api/transcribe.
// The dropzone in the UI already restricts file type/size, but that check
// runs entirely in the browser and is trivial to bypass (e.g. curl/Postman),
// so every constraint enforced there must also be enforced here.

export const MAX_FILE_SIZE_BYTES = 500 * 1024 * 1024; // 500MB

// Extensions accepted by the uploader UI (kept in sync with job-uploader.tsx).
const ALLOWED_EXTENSIONS = [
  ".mp4", ".mov", ".avi", ".webm", ".mkv",
  ".mp3", ".wav", ".m4a", ".flac", ".ogg",
];

export type UploadValidationResult =
  | { valid: true }
  | { valid: false; error: string; status: number };

/**
 * Validates an uploaded audio/video file server-side.
 * Checks (in order): presence, size cap, extension allow-list, and MIME type.
 */
export function validateUploadFile(file: File | null): UploadValidationResult {
  if (!file || typeof file.size !== "number" || file.size <= 0) {
    return { valid: false, error: "No file provided", status: 400 };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File exceeds the ${Math.round(MAX_FILE_SIZE_BYTES / (1024 * 1024))}MB size limit`,
      status: 413,
    };
  }

  const name = file.name || "";
  const dotIndex = name.lastIndexOf(".");
  const ext = dotIndex >= 0 ? name.slice(dotIndex).toLowerCase() : "";

  if (!ext || !ALLOWED_EXTENSIONS.includes(ext)) {
    return {
      valid: false,
      error: "Unsupported file extension. Please upload an audio or video file.",
      status: 400,
    };
  }

  // Browsers/clients usually populate `type` from the file's MIME type. When
  // present it must be an audio/video type; if a client omits it we fall
  // back to the extension check above rather than rejecting the upload.
  const type = file.type || "";
  if (type && !type.startsWith("audio/") && !type.startsWith("video/")) {
    return {
      valid: false,
      error: "Unsupported file type. Only audio and video files are allowed.",
      status: 400,
    };
  }

  return { valid: true };
}
