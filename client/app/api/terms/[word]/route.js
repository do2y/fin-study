import { NextResponse } from "next/server";
import termsData from "@/data/terms";

export async function GET(request, { params }) {
  const { word } = await params;
  const term = termsData[word];
  if (!term) {
    return NextResponse.json(
      { message: "단어를 찾을 수 없습니다." },
      { status: 404 }
    );
  }
  return NextResponse.json(term);
}
