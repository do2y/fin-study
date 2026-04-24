"use client";
import { useState } from "react";

const STATUS_CONFIG = {
  unknown: { label: "모름", cls: "bg-slate-100 text-slate-500" },
  learning: { label: "학습중", cls: "bg-yellow-100 text-yellow-700" },
  mastered: { label: "이해완료", cls: "bg-green-100 text-green-700" },
};
const STATUSES = ["unknown", "learning", "mastered"];
const CATEGORIES = ["금리", "주식", "채권", "환율", "부동산", "경제지표", "기타"];

export default function VocabularyCard({ vocab, onUpdate, onDelete }) {
  const [editMemo, setEditMemo] = useState(false);
  const [memo, setMemo] = useState(vocab.memo || "");

  function cycleStatus() {
    const idx = STATUSES.indexOf(vocab.status);
    onUpdate({ status: STATUSES[(idx + 1) % STATUSES.length] });
  }

  const cfg = STATUS_CONFIG[vocab.status] || STATUS_CONFIG.unknown;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <h3 className="font-bold text-slate-900 text-lg">{vocab.word}</h3>
            <span className="text-xs bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded-full">
              {vocab.category}
            </span>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">{vocab.meaning}</p>

          {editMemo ? (
            <div className="mt-3 flex gap-2">
              <input
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="메모 입력..."
                className="flex-1 text-sm border border-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                onClick={() => {
                  onUpdate({ memo });
                  setEditMemo(false);
                }}
                className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700"
              >
                저장
              </button>
              <button
                onClick={() => setEditMemo(false)}
                className="text-xs text-slate-400 px-2 py-1.5"
              >
                취소
              </button>
            </div>
          ) : (
            <div className="mt-2 flex items-center gap-2">
              {vocab.memo ? (
                <span className="text-xs text-slate-400 italic">
                  "{vocab.memo}"
                </span>
              ) : (
                <span className="text-xs text-slate-300">메모 없음</span>
              )}
              <button
                onClick={() => setEditMemo(true)}
                className="text-xs text-blue-400 hover:text-blue-600"
              >
                {vocab.memo ? "수정" : "+ 메모"}
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col items-end gap-2.5 flex-shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onUpdate({ is_important: !vocab.is_important })}
              title="중요 표시"
              className={`text-2xl leading-none transition-colors ${
                vocab.is_important
                  ? "text-yellow-400"
                  : "text-slate-200 hover:text-yellow-300"
              }`}
            >
              ★
            </button>
            <button
              onClick={onDelete}
              title="삭제"
              className="text-slate-300 hover:text-red-400 font-bold transition-colors"
            >
              ✕
            </button>
          </div>

          <button
            onClick={cycleStatus}
            className={`text-xs px-3 py-1 rounded-full font-medium ${cfg.cls}`}
          >
            {cfg.label}
          </button>

          <select
            value={vocab.category}
            onChange={(e) => onUpdate({ category: e.target.value })}
            className="text-xs border border-slate-200 rounded-lg px-2 py-1 text-slate-500 focus:outline-none"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
