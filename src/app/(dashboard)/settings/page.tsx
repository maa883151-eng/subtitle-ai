import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export default async function SettingsPage() {
  const { userId } = await auth();
  const clerkUser = await currentUser();
  const dbUser = await db.user.findUnique({ where: { clerkId: userId! } });

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Account and subscription management.</p>
      </div>
      <div className="space-y-4">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Profile</h2>
          <div className="flex items-center gap-4">
            {clerkUser?.imageUrl && <img src={clerkUser.imageUrl} alt="Avatar" className="w-14 h-14 rounded-full" />}
            <div>
              <p className="font-medium text-gray-900">{clerkUser?.fullName ?? "User"}</p>
              <p className="text-sm text-gray-500">{clerkUser?.emailAddresses[0]?.emailAddress}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-semibold text-gray-900 mb-3">Credits</h2>
          <p className="text-3xl font-bold text-blue-600 mb-1">{dbUser?.credits ?? 0}</p>
          <p className="text-sm text-gray-500 mb-4">subtitle jobs remaining</p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors">
            Buy More Credits
          </button>
        </div>
      </div>
    </div>
  );
}
