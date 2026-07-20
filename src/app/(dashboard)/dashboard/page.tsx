import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import Link from "next/link";
import { Upload, Subtitles, CheckCircle, Clock, ArrowRight } from "lucide-react";
import { format } from "date-fns";

async function getData(clerkId: string) {
  let user = await db.user.findUnique({ where: { clerkId } });
  if (!user) user = await db.user.create({ data: { clerkId, email: clerkId, credits: 5 } });

  const jobs = await db.subtitleJob.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const total = await db.subtitleJob.count({ where: { userId: user.id } });
  const done = await db.subtitleJob.count({ where: { userId: user.id, status: "DONE" } });

  return { user, jobs, total, done };
}

const statusConfig: Record<string, { label: string; cls: string }> = {
  DONE: { label: "Done", cls: "bg-green-50 text-green-600" },
  PROCESSING: { label: "Processing", cls: "bg-yellow-50 text-yellow-600" },
  PENDING: { label: "Pending", cls: "bg-gray-50 text-gray-600" },
  FAILED: { label: "Failed", cls: "bg-red-50 text-red-600" },
};

export default async function DashboardPage() {
  const { userId } = await auth();
  const { user, jobs, total, done } = await getData(userId!);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back! Generate subtitles from any video or audio file.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total Jobs", value: total, icon: Subtitles, color: "bg-blue-50 text-blue-600" },
          { label: "Completed", value: done, icon: CheckCircle, color: "bg-green-50 text-green-600" },
          { label: "Credits Left", value: user.credits, icon: Clock, color: "bg-orange-50 text-orange-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-500">{s.label}</span>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${s.color}`}>
                <s.icon className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
          </div>
        ))}
      </div>

      {jobs.length === 0 ? (
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-10 text-white text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Upload className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Generate your first subtitles</h2>
          <p className="text-blue-200 mb-6">Upload a video or audio file — subtitles in seconds.</p>
          <Link href="/generate" className="bg-white text-blue-700 hover:bg-blue-50 px-8 py-3 rounded-xl font-semibold transition-colors inline-flex items-center gap-2">
            Upload File <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-gray-50">
            <h2 className="font-semibold text-gray-900">Recent Jobs</h2>
            <Link href="/history" className="text-blue-600 text-sm font-medium flex items-center gap-1 hover:text-blue-800">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {jobs.map((job) => {
              const s = statusConfig[job.status] ?? { label: job.status, cls: "bg-gray-50 text-gray-600" };
              return (
                <Link key={job.id} href={`/generate/${job.id}`} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Subtitles className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{job.title}</p>
                    <p className="text-xs text-gray-400">{job.fileName} · {job.language.toUpperCase()}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${s.cls}`}>{s.label}</span>
                    <p className="text-xs text-gray-400 mt-1">{format(new Date(job.createdAt), "MMM d")}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
