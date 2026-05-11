import { NextResponse } from "next/server";
import { getBrands, TOP_BRANDS_COLOMBIA } from "@/lib/catalog";

// GET /api/catalog/brands — lista de todas las marcas
export async function GET() {
  const all = getBrands();
  const popular = TOP_BRANDS_COLOMBIA.filter(b => all.includes(b));
  return NextResponse.json({
    total:    all.length,
    populares: popular,
    todas:    all,
  });
}
