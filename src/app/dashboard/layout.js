import Link from "next/link";
import Logo from "@/components/Logo";
import LogoutButton from "@/features/auth/LogoutButton";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-line px-8 py-4 flex items-center justify-between">
        <Link href="/dashboard">
          <Logo />
        </Link>
        <LogoutButton />
      </header>
      {children}
    </div>
  );
}
