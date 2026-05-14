import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, supabaseConfigured } from "@/lib/supabase";

/**
 * POST /api/upload-foto
 *
 * Sube una foto al bucket `vehiculos` de Supabase Storage.
 * Body: FormData con campo "file" (image/*) y "folder" (opcional, ej: "pub_uuid")
 *
 * Devuelve: { ok: true, url: "https://...", path: "vehiculos/folder/timestamp.jpg" }
 *
 * Requisitos en Supabase:
 *   1. Crear bucket "vehiculos" (público o con policy de SELECT pública)
 *   2. Policy de INSERT para anon o authenticated según preferencia
 */

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];

export async function POST(req: NextRequest) {
  if (!supabaseConfigured()) {
    return NextResponse.json({ ok: false, error: "Storage no configurado" }, { status: 503 });
  }

  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    const folder = (form.get("folder") as string) || "publicaciones";

    if (!file) {
      return NextResponse.json({ ok: false, error: "No se recibió archivo" }, { status: 400 });
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ ok: false, error: `Tipo no permitido: ${file.type}` }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ ok: false, error: "Archivo > 5MB" }, { status: 400 });
    }

    const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const path = `${folder}/${filename}`;

    const bytes = new Uint8Array(await file.arrayBuffer());

    // Subir al bucket "vehiculos"
    const sb = (await import("@/lib/supabase")).getSupabaseAdmin();
    if (!sb) {
      return NextResponse.json({ ok: false, error: "Cliente Supabase no disponible" }, { status: 503 });
    }

    const { error: upErr } = await sb.storage
      .from("vehiculos")
      .upload(path, bytes, {
        contentType: file.type,
        upsert: false,
      });

    if (upErr) {
      console.error("[upload-foto]:", upErr.message);
      return NextResponse.json({ ok: false, error: upErr.message }, { status: 500 });
    }

    // URL pública
    const { data: urlData } = sb.storage.from("vehiculos").getPublicUrl(path);
    return NextResponse.json({ ok: true, url: urlData.publicUrl, path });

  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
