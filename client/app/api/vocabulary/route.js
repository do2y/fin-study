import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";

export async function GET(request) {
  const user = getAuthUser(request);
  if (!user) {
    return NextResponse.json({ message: "로그인이 필요합니다." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const status = searchParams.get("status");
  const important = searchParams.get("important");

  let sql = "SELECT * FROM Vocabulary WHERE user_id = ?";
  const params = [user.id];
  if (category) { sql += " AND category = ?"; params.push(category); }
  if (status) { sql += " AND status = ?"; params.push(status); }
  if (important === "true") sql += " AND is_important = 1";
  sql += " ORDER BY created_at DESC";

  try {
    const rows = await query(sql, params);
    return NextResponse.json(rows);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "조회 실패" }, { status: 500 });
  }
}

export async function POST(request) {
  const user = getAuthUser(request);
  if (!user) {
    return NextResponse.json({ message: "로그인이 필요합니다." }, { status: 401 });
  }

  try {
    const { word, meaning, category, memo } = await request.json();
    if (!word || !meaning) {
      return NextResponse.json(
        { message: "단어와 의미는 필수입니다." },
        { status: 400 }
      );
    }

    const existing = await query(
      "SELECT id FROM Vocabulary WHERE user_id = ? AND word = ?",
      [user.id, word]
    );
    if (existing.length > 0) {
      return NextResponse.json(
        { message: "이미 단어장에 저장된 단어입니다." },
        { status: 400 }
      );
    }

    const result = await query(
      "INSERT INTO Vocabulary (user_id, word, meaning, category, memo) VALUES (?, ?, ?, ?, ?)",
      [user.id, word, meaning, category || "기타", memo || null]
    );
    return NextResponse.json(
      { message: "단어장에 저장되었습니다.", id: result.insertId },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "저장 실패" }, { status: 500 });
  }
}
