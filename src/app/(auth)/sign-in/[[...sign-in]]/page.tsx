import { SignIn } from "@clerk/nextjs";
export default function Page() {
  return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4"><SignIn /></div>;
}
