import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Sidebar } from "@/components/ui/sidebar";

async function getCredits(clerkId: string) {
  const user = await db.user.findUnique({ where: { clerkId } });
  return user?.credits ?? 5;
}

export default async function Layout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  const credits = await getCredits(userId);
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar credits={credits} />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
