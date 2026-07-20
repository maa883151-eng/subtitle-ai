import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { JobResult } from "@/components/generate/job-result";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

async function getJob(id: string, clerkId: string) {
  const user = await db.user.findUnique({ where: { clerkId } });
  if (!user) return null;
  return db.subtitleJob.findFirst({ where: { id, userId: user.id } });
}

export default async function JobPage({ params }: { params: { id: string } }) {
  const { userId } = await auth();
  const job = await getJob(params.id, userId!);
  if (!job) notFound();

  return (
    <div className="p-8 max-w-4xl">
      <Link href="/generate" className="inline-flex items-center gap-1 text-gray-400 hover:text-gray-700 text-sm mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> New Job
      </Link>
      <JobResult job={job} />
    </div>
  );
}
