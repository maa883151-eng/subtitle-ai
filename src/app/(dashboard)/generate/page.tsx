import { JobUploader } from "@/components/generate/job-uploader";

export default function GeneratePage() {
  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">New Subtitle Job</h1>
        <p className="text-gray-500 text-sm mt-1">Upload a video or audio file to generate subtitles with AI.</p>
      </div>
      <JobUploader />
    </div>
  );
}
