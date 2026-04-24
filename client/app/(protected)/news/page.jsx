"use client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import api from "@/lib/api";

const TERM_COLORS = {
  기준금리: "bg-blue-50 text-blue-600",
  통화정책: "bg-blue-50 text-blue-600",
  양적완화: "bg-blue-50 text-blue-600",
  주가지수: "bg-green-50 text-green-600",
  시가총액: "bg-green-50 text-green-600",
  PER: "bg-green-50 text-green-600",
  배당: "bg-green-50 text-green-600",
  환율: "bg-orange-50 text-orange-600",
  달러인덱스: "bg-orange-50 text-orange-600",
  외환보유액: "bg-orange-50 text-orange-600",
  LTV: "bg-purple-50 text-purple-600",
  DSR: "bg-purple-50 text-purple-600",
  전세: "bg-purple-50 text-purple-600",
  CPI: "bg-rose-50 text-rose-600",
  GDP: "bg-rose-50 text-rose-600",
  실업률: "bg-rose-50 text-rose-600",
};

export default function NewsListPage() {
  const { data: newsList = [], isLoading } = useQuery({
    queryKey: ["news"],
    queryFn: () => api.get("/api/news").then((r) => r.data),
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">금융 뉴스</h1>
        <p className="text-slate-500 text-sm mt-1">
          하이라이트된 단어를 클릭해 금융 용어를 학습하세요
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-slate-400">불러오는 중...</div>
      ) : (
        <div className="space-y-4">
          {newsList.map((news) => (
            <Link
              key={news.id}
              href={`/news/${news.id}`}
              className="block bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-blue-200 transition-all"
            >
              <h2 className="font-semibold text-slate-900 text-lg mb-3 leading-snug">
                {news.title}
              </h2>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {news.terms.map((term) => (
                  <span
                    key={term}
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      TERM_COLORS[term] || "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {term}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <span>{news.source}</span>
                <span>·</span>
                <span>{news.published_at}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
