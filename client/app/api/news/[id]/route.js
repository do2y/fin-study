import { NextResponse } from "next/server";
import newsData from "@/data/news";

export async function GET(request, { params }) {
  const { id } = await params;
  const item = newsData.find((n) => n.id === Number(id));
  if (!item) {
    return NextResponse.json(
      { message: "뉴스를 찾을 수 없습니다." },
      { status: 404 }
    );
  }
  return NextResponse.json(item);
}
