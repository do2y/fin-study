"use client";
import { useState } from "react";

export default function QuizSection({ quizzes, onSaveTerm }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState({});

  function handleSelect(quizId, idx) {
    if (submitted[quizId]) return;
    setAnswers((prev) => ({ ...prev, [quizId]: idx }));
  }

  function handleSubmit(quiz) {
    if (answers[quiz.id] === undefined) return;
    setSubmitted((prev) => ({ ...prev, [quiz.id]: true }));
  }

  return (
    <div className="mt-10 border-t border-slate-200 pt-8">
      <h2 className="text-xl font-bold text-slate-800 mb-6">관련 용어 퀴즈</h2>
      <div className="space-y-5">
        {quizzes.map((quiz) => {
          const isSubmitted = !!submitted[quiz.id];
          const selectedIdx = answers[quiz.id];
          const isCorrect = isSubmitted && selectedIdx === quiz.answer;

          return (
            <div
              key={quiz.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm"
            >
              <p className="font-semibold text-slate-800 mb-4">
                Q. {quiz.question}
              </p>
              <div className="space-y-2">
                {quiz.options.map((option, i) => {
                  let cls =
                    "border rounded-lg px-4 py-2.5 text-sm cursor-pointer transition-colors ";
                  if (!isSubmitted) {
                    cls +=
                      selectedIdx === i
                        ? "bg-blue-50 border-blue-400 text-blue-700"
                        : "border-slate-200 hover:bg-slate-50 text-slate-700";
                  } else {
                    if (i === quiz.answer)
                      cls += "bg-green-50 border-green-400 text-green-700 font-medium";
                    else if (i === selectedIdx)
                      cls += "bg-red-50 border-red-300 text-red-600";
                    else cls += "border-slate-100 text-slate-400";
                  }
                  return (
                    <div key={i} className={cls} onClick={() => handleSelect(quiz.id, i)}>
                      {i + 1}. {option}
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 flex items-center gap-3">
                {!isSubmitted ? (
                  <button
                    onClick={() => handleSubmit(quiz)}
                    disabled={selectedIdx === undefined}
                    className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-40 transition-colors"
                  >
                    정답 확인
                  </button>
                ) : (
                  <>
                    <span
                      className={`font-bold text-sm ${isCorrect ? "text-green-600" : "text-red-500"}`}
                    >
                      {isCorrect ? "정답!" : "오답"}
                    </span>
                    <button
                      onClick={() => onSaveTerm(quiz.termWord)}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      '{quiz.termWord}' 단어장에 저장
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
