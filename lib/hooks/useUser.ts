"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { getSupabaseBrowser, supabaseBrowserConfigured } from "@/lib/supabase-browser";

/**
 * Hook que retorna el usuario autenticado actual.
 * - `user`: el objeto User de Supabase (o null si no hay sesión)
 * - `loading`: true mientras se verifica la sesión inicial
 * - `signOut`: cierra sesión
 *
 * Se mantiene sincronizado automáticamente con cambios de auth (login/logout)
 * en otras pestañas también.
 */
export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabaseBrowserConfigured()) {
      setLoading(false);
      return;
    }
    const sb = getSupabaseBrowser();
    if (!sb) { setLoading(false); return; }

    // Cargar sesión inicial
    sb.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    // Suscribirse a cambios de auth
    const { data: subscription } = sb.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.subscription.unsubscribe();
  }, []);

  async function signOut() {
    const sb = getSupabaseBrowser();
    if (sb) await sb.auth.signOut();
    setUser(null);
  }

  return { user, loading, signOut, configured: supabaseBrowserConfigured() };
}
