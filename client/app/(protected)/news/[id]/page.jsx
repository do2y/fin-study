"use client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import HighlightedText from "@/components/HighlightedText";
import TermModal from "@/components/TermModal";
import QuizSection from "@/components/QuizSection";

export default function NewsDetailPage() {
  const { id } = useParams();
  const [selectedTerm, setSelectedTerm] = useState(null);

  const { data: news, isLoading } = useQuery({
    queryKey: ["news", id],
    queryFn: () => api.get(`/api/news/${id}`).then((r) => r.data),
  });

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center text-slate-400">
        불러오는 중...
      </div>
    );
  }

  if (!news) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center text-slate-400">
        뉴스를 찾을 수 없습니다.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link
        href="/news"
        className="text-sm text-blue-600 hover:underline mb-5 flex items-center gap-1"
      >
        ← 뉴스 목록
      </Link>

      <article>
        <h1 className="text-2xl font-bold text-slate-900 mb-3 leading-snug">
          {news.title}
        </h1>
        <div className="flex items-center gap-2 text-sm text-slate-400 mb-5">
          <span>{news.source}</span>
          <span>·</span>
          <span>{news.published_at}</span>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5 mb-6 text-sm text-amber-700">
          하이라이트된 단어를 클릭하면 뜻을 확인하고 단어장에 저장할 수 있어요.
        </div>

        <div className="bg-white rounded-xl border border-slate-100 p-6 text-slate-700">
          <HighlightedText
            content={news.content}
            terms={news.terms}
            onTermClick={setSelectedTerm}
          />
        </div>
      </article>

      {news.quizzes && news.quizzes.length > 0 && (
        <QuizSection
          quizzes={news.quizzes}
          onSaveTerm={setSelectedTerm}
        />
      )}

      {selectedTerm && (
        <TermModal word={selectedTerm} onClose={() => setSelectedTerm(null)} />
      )}
    </div>
  );
}
