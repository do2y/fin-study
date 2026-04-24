import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { query, ensureSchema } from "@/lib/db";

export async function POST(request) {
  try {
    await ensureSchema();
    const { email, password, name } = await request.json();
    if (!email || !password || !name) {
      return NextResponse.json(
        { message: "이메일, 비밀번호, 이름은 필수입니다." },
        { status: 400 }
      );
    }
    const hashed = await bcrypt.hash(password, 10);
    await query(
      "INSERT INTO Users (email, password, name) VALUES (?, ?, ?)",
      [email, hashed, name]
    );
    return NextResponse.json(
      { message: "회원가입이 완료되었습니다." },
      { status: 201 }
    );
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return NextResponse.json(
        { message: "이미 가입된 이메일입니다." },
        { status: 400 }
      );
    }
    console.error(err);
    return NextResponse.json({ message: "서버 에러" }, { status: 500 });
  }
}
