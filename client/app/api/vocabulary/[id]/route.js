import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";

export async function PUT(request, { params }) {
  const user = getAuthUser(request);
  if (!user) {
    return NextResponse.json({ message: "로그인이 필요합니다." }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { status, category, is_important, memo } = body;

    const rows = await query(
      "SELECT * FROM Vocabulary WHERE id = ? AND user_id = ?",
      [id, user.id]
    );
    if (rows.length === 0) {
      return NextResponse.json(
        { message: "단어를 찾을 수 없습니다." },
        { status: 404 }
      );
    }
    const cur = rows[0];

    await query(
      "UPDATE Vocabulary SET status = ?, category = ?, is_important = ?, memo = ?, updated_at = NOW() WHERE id = ? AND user_id = ?",
      [
        status !== undefined ? status : cur.status,
        category !== undefined ? category : cur.category,
        is_important !== undefined ? (is_important ? 1 : 0) : cur.is_important,
        memo !== undefined ? memo : cur.memo,
        id,
        user.id,
      ]
    );

    const updated = await query("SELECT * FROM Vocabulary WHERE id = ?", [id]);
    return NextResponse.json({ message: "수정 완료", vocabulary: updated[0] });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "수정 실패" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const user = getAuthUser(request);
  if (!user) {
    return NextResponse.json({ message: "로그인이 필요합니다." }, { status: 401 });
  }

  try {
    const { id } = await params;
    const result = await query(
      "DELETE FROM Vocabulary WHERE id = ? AND user_id = ?",
      [id, user.id]
    );
    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "삭제할 단어가 없습니다." },
        { status: 404 }
      );
    }
    return NextResponse.json({ message: "삭제 완료" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "삭제 실패" }, { status: 500 });
  }
}
