import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;

// Cliente con service_role key para operaciones server-side (API routes)
// Se inicializa de forma lazy para evitar errores en build cuando no hay env vars
export function getSupabaseAdmin(): SupabaseClient | null {
  if (!supabaseConfigured()) return null;
  if (!_client) {
    _client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    );
  }
  return _client;
}

// Helper: ¿está Supabase configurado?
export function supabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

// Alias conveniente (devuelve null si no configurado)
export const supabaseAdmin = {
  from: (table: string) => {
    const client = getSupabaseAdmin();
    if (!client) throw new Error("Supabase no configurado");
    return client.from(table);
  },
};
