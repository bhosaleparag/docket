import { Suspense } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import LoginForm from "@/features/auth/LoginForm";

export const metadata = { title: "Sign in — Docket" };

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm border border-line bg-white rounded-lg p-8">
        <div className="mb-8">
          <Logo />
        </div>
        <h1 className="font-serif text-xl mb-1">Sign in</h1>
        <p className="text-muted text-sm mb-6">This dashboard is just for you.</p>

        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>

        <Link
          href="/"
          className="w-full text-xs mt-4 text-muted hover:underline flex items-center justify-center gap-1"
        >
          Back to site
        </Link>
      </div>
    </div>
  );
}
