import { db } from "@/lib/db";
import Link from "next/link";
import { Subtitles } from "lucide-react";
import { formatBytes } from "@/lib/utils";
import { format } from "date-fns";

const DEMO_USER_ID = "demo-user";

const statusCls: Record<string, string> = {
  DONE: "bg-green-50 text-green-600",
  PROCESSING: "bg-yellow-50 text-yellow-600",
  PENDING: "bg-gray-50 text-gray-500",
  FAILED: "bg-red-50 text-red-600",
};

export default async function HistoryPage() {
  let userId: string;

  if (process.env.DEMO_MODE === "true") {
    userId = DEMO_USER_ID;
  } else {
    const { auth } = await import("@clerk/nextjs/server");
    const result = await auth();
    userId = result.userId!;
  }

  const user = await db.user.findUnique({ where: { clerkId: userId } });
  const jobs = user ? await db.subtitleJob.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" } }) : [];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">History</h1>
        <p className="text-gray-500 text-sm mt-1">{jobs.length} subtitle jobs</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {jobs.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">
            No jobs yet. <Link href="/generate" className="text-blue-600 font-medium">Start generating →</Link>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["File", "Language", "Size", "Status", "Date", ""].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {jobs.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                        <Subtitles className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{job.title}</p>
                        <p className="text-xs text-gray-400">{job.fileName}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">
                    {job.language.toUpperCase()}{job.translateTo ? ` → ${job.translateTo.toUpperCase()}` : ""}
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">{formatBytes(job.fileSize)}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusCls[job.status] ?? "bg-gray-50 text-gray-500"}`}>
                      {job.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-400">{format(new Date(job.createdAt), "MMM d, yyyy")}</td>
                  <td className="px-5 py-4">
                    <Link href={`/generate/${job.id}`} className="text-blue-600 hover:text-blue-800 text-sm font-medium">View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
