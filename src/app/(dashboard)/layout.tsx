import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Sidebar } from "@/components/ui/sidebar";

const DEMO_USER_ID = "demo-user";

async function getCredits(clerkId: string) {
  const user = await db.user.findUnique({ where: { clerkId } });
  return user?.credits ?? 5;
}

export default async function Layout({ children }: { children: React.ReactNode }) {
  let userId: string;

  if (process.env.DEMO_MODE === "true") {
    userId = DEMO_USER_ID;
  } else {
    const { auth } = await import("@clerk/nextjs/server");
    const result = await auth();
    if (!result.userId) redirect("/sign-in");
    userId = result.userId!;
  }

  const credits = await getCredits(userId);
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar credits={credits} />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
