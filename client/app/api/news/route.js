import { NextResponse } from "next/server";
import newsData from "@/data/news";

export async function GET() {
  const list = newsData.map(({ id, title, source, published_at, terms }) => ({
    id,
    title,
    source,
    published_at,
    terms,
  }));
  return NextResponse.json(list);
}
