"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import useFilterStore from "@/store/filterStore";
import VocabularyCard from "@/components/VocabularyCard";

const CATEGORIES = ["금리", "주식", "채권", "환율", "부동산", "경제지표", "기타"];
const STATUS_LABELS = { "": "전체", unknown: "모름", learning: "학습중", mastered: "이해완료" };

export default function VocabularyPage() {
  const queryClient = useQueryClient();
  const { category, status, important, setCategory, setStatus, setImportant, resetFilters } =
    useFilterStore();

  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (status) params.set("status", status);
  if (important) params.set("important", "true");

  const { data: vocabList = [], isLoading } = useQuery({
    queryKey: ["vocabulary", category, status, important],
    queryFn: () => api.get(`/api/vocabulary?${params}`).then((r) => r.data),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }) =>
      api.put(`/api/vocabulary/${id}`, data).then((r) => r.data),
    onMutate: async ({ id, ...changes }) => {
      await queryClient.cancelQueries({ queryKey: ["vocabulary"] });
      const previousAll = queryClient.getQueriesData({ queryKey: ["vocabulary"] });
      queryClient.setQueriesData({ queryKey: ["vocabulary"] }, (old = []) =>
        old.map((v) => (v.id === id ? { ...v, ...changes } : v))
      );
      return { previousAll };
    },
    onError: (_err, _vars, context) => {
      context.previousAll.forEach(([key, data]) =>
        queryClient.setQueryData(key, data)
      );
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["vocabulary"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/api/vocabulary/${id}`),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["vocabulary"] });
      const previousAll = queryClient.getQueriesData({ queryKey: ["vocabulary"] });
      queryClient.setQueriesData({ queryKey: ["vocabulary"] }, (old = []) =>
        old.filter((v) => v.id !== id)
      );
      return { previousAll };
    },
    onError: (_err, _vars, context) => {
      context.previousAll.forEach(([key, data]) =>
        queryClient.setQueryData(key, data)
      );
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["vocabulary"] }),
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">내 단어장</h1>
        <p className="text-slate-500 text-sm mt-1">
          학습 상태를 클릭해 변경하고, ★로 중요 단어를 표시하세요
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 flex flex-wrap gap-3 items-center">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">전체 카테고리</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {Object.entries(STATUS_LABELS).map(([val, label]) => (
            <option key={val} value={val}>{label}</option>
          ))}
        </select>

        <label className="flex items-center gap-1.5 text-sm cursor-pointer text-slate-600">
          <input
            type="checkbox"
            checked={important}
            onChange={(e) => setImportant(e.target.checked)}
            className="accent-yellow-400 w-4 h-4"
          />
          중요 단어만
        </label>

        <button
          onClick={resetFilters}
          className="ml-auto text-sm text-slate-400 hover:text-slate-600 transition-colors"
        >
          필터 초기화
        </button>
      </div>

      {isLoading ? (
        <div className="text-center text-slate-400 py-12">불러오는 중...</div>
      ) : vocabList.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">📚</p>
          <p className="text-slate-500 font-medium">저장된 단어가 없습니다.</p>
          <p className="text-slate-400 text-sm mt-1">
            뉴스에서 하이라이트된 단어를 클릭해 저장해보세요!
          </p>
        </div>
      ) : (
        <>
          <p className="text-sm text-slate-400 mb-3">{vocabList.length}개 단어</p>
          <div className="space-y-3">
            {vocabList.map((v) => (
              <VocabularyCard
                key={v.id}
                vocab={v}
                onUpdate={(data) => updateMutation.mutate({ id: v.id, ...data })}
                onDelete={() => deleteMutation.mutate(v.id)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
