"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <nav className="bg-blue-700 text-white px-6 py-3 flex items-center justify-between shadow-md">
      <Link href="/news" className="text-xl font-bold tracking-tight">
        FinWord
      </Link>
      <div className="flex items-center gap-6">
        <Link
          href="/news"
          className={`text-sm hover:text-blue-200 transition-colors ${
            pathname.startsWith("/news")
              ? "font-semibold underline underline-offset-4"
              : ""
          }`}
        >
          뉴스
        </Link>
        <Link
          href="/vocabulary"
          className={`text-sm hover:text-blue-200 transition-colors ${
            pathname === "/vocabulary"
              ? "font-semibold underline underline-offset-4"
              : ""
          }`}
        >
          내 단어장
        </Link>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-blue-200">{user?.name}님</span>
        <button
          onClick={handleLogout}
          className="text-sm bg-white text-blue-700 px-3 py-1 rounded-lg hover:bg-blue-50 font-medium transition-colors"
        >
          로그아웃
        </button>
      </div>
    </nav>
  );
}
