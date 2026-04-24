import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { query, ensureSchema } from "@/lib/db";
import { signToken } from "@/lib/auth";

export async function POST(request) {
  try {
    await ensureSchema();
    const { email, password } = await request.json();
    const rows = await query("SELECT * FROM Users WHERE email = ?", [email]);
    if (rows.length === 0) {
      return NextResponse.json(
        { message: "사용자를 찾을 수 없습니다." },
        { status: 401 }
      );
    }
    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "비밀번호가 일치하지 않습니다." },
        { status: 401 }
      );
    }
    const token = signToken({ id: user.id, email: user.email });
    return NextResponse.json({ message: "로그인 성공", token, name: user.name });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "서버 에러" }, { status: 500 });
  }
}
