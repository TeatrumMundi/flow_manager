import Image from "next/image";
import Link from "next/link";
import LoginForm from "@/app/components/LoginForm";
import LogoutButton from "@/app/components/LogoutButton";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const session = await auth();

  return (
    <main className="relative flex items-center justify-center min-h-screen px-4">
      {/* Main content */}
      <div className="w-full max-w-md bg-white/50 backdrop-blur-md rounded-3xl shadow-xl p-7 pl-14 pr-14 flex flex-col items-center space-y-8">
        {/* Logo + Title */}
        <div className="flex items-center">
          <Image
            src="/flowIcon.png"
            alt="Flow Manager Logo"
            width={70}
            height={70}
            className="object-contain"
            priority
          />
          <h1 className="text-4xl font-semibold tracking-tight text-gray-700">
            Flow Manager
          </h1>
        </div>

        {/* Login Form or Profile Link */}
        {session?.user ? (
          <div className="w-full bg-white/80 rounded-2xl shadow-md p-6 border border-gray-200 flex flex-col items-center space-y-4">
            <p className="text-gray-700 text-center">
              Jesteś zalogowany jako <strong>{session.user.email}</strong>
            </p>
            <Link
              href="/profile/me"
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-700 transition-colors transform active:scale-[1.05] duration-500 cursor-pointer text-center"
            >
              Wróć do profilu
            </Link>
            <LogoutButton />
          </div>
        ) : (
          <LoginForm />
        )}
      </div>
    </main>
  );
}
