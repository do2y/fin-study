"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export default function TermModal({ word, onClose }) {
  const queryClient = useQueryClient();

  const { data: term, isLoading } = useQuery({
    queryKey: ["term", word],
    queryFn: () => api.get(`/api/terms/${word}`).then((r) => r.data),
    enabled: !!word,
  });

  const { data: vocabList = [] } = useQuery({
    queryKey: ["vocabulary"],
    queryFn: () => api.get("/api/vocabulary").then((r) => r.data),
  });

  const isSaved = vocabList.some((v) => v.word === word);

  const saveMutation = useMutation({
    mutationFn: () =>
      api.post("/api/vocabulary", {
        word: term.word,
        meaning: term.meaning,
        category: term.category,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vocabulary"] });
    },
  });

  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-xl font-bold"
        >
          ✕
        </button>

        {isLoading ? (
          <div className="py-8 text-center text-slate-400">불러오는 중...</div>
        ) : term ? (
          <>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-2xl font-bold text-slate-900">{term.word}</h2>
              <span className="text-xs bg-blue-50 text-blue-600 border border-blue-100 px-2 py-1 rounded-full font-medium">
                {term.category}
              </span>
            </div>

            <div className="mb-4">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">
                정의
              </p>
              <p className="text-slate-700 leading-relaxed">{term.meaning}</p>
            </div>

            <div className="mb-6 bg-slate-50 rounded-lg p-3">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">
                예시문
              </p>
              <p className="text-slate-600 text-sm italic">"{term.example}"</p>
            </div>

            <div>
              {isSaved ? (
                <button
                  disabled
                  className="w-full py-2.5 rounded-xl bg-slate-100 text-slate-400 font-medium text-sm"
                >
                  단어장에 저장됨 ✓
                </button>
              ) : (
                <button
                  onClick={() => saveMutation.mutate()}
                  disabled={saveMutation.isPending}
                  className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {saveMutation.isPending ? "저장 중..." : "내 단어장에 저장"}
                </button>
              )}
              {saveMutation.isError && (
                <p className="text-red-500 text-xs mt-2 text-center">
                  {saveMutation.error?.response?.data?.message || "저장 실패"}
                </p>
              )}
            </div>
          </>
        ) : (
          <div className="py-8 text-center text-slate-400">
            단어 정보를 찾을 수 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
