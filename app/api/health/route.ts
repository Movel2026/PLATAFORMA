import { NextResponse } from "next/server";

/**
 * GET /api/health
 *
 * Endpoint de diagnóstico para verificar qué env vars están configuradas
 * en producción. NO expone los valores, solo si están presentes (boolean).
 *
 * Útil para diagnosticar problemas de configuración en Vercel.
 * Acceder: https://movelcar.com/api/health
 */
export async function GET() {
  const checks = {
    supabase: {
      NEXT_PUBLIC_SUPABASE_URL:        !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY:   !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      SUPABASE_SERVICE_ROLE_KEY:       !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    },
    admin: {
      ADMIN_PIN: !!process.env.ADMIN_PIN,
    },
    telegram: {
      TELEGRAM_BOT_TOKEN: !!process.env.TELEGRAM_BOT_TOKEN,
      TELEGRAM_CHAT_ID:   !!process.env.TELEGRAM_CHAT_ID,
    },
    anthropic: {
      ANTHROPIC_API_KEY: !!process.env.ANTHROPIC_API_KEY,
    },
  };

  const allReady =
    checks.supabase.NEXT_PUBLIC_SUPABASE_URL &&
    checks.supabase.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    checks.supabase.SUPABASE_SERVICE_ROLE_KEY;

  return NextResponse.json({
    ok: allReady,
    timestamp: new Date().toISOString(),
    region: process.env.VERCEL_REGION ?? "local",
    deployment: process.env.VERCEL_URL ?? "local",
    checks,
    nextSteps: allReady ? null : "Configura las env vars faltantes en Vercel → Settings → Environment Variables y haz Redeploy",
  });
}
