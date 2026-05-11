-- =============================================================
-- MOVEL — Schema de Base de Datos en Supabase
-- Ejecutar este SQL en: Supabase Dashboard → SQL Editor → New query
-- =============================================================

-- ─── TABLA: usuarios ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS usuarios (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre      TEXT NOT NULL,
  email       TEXT UNIQUE NOT NULL,
  telefono    TEXT,
  ciudad      TEXT,
  origen      TEXT DEFAULT 'web',         -- 'web', 'mobile', 'admin'
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── TABLA: publicaciones ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS publicaciones (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre        TEXT,
  email         TEXT,
  celular       TEXT,
  marca         TEXT NOT NULL,
  modelo        TEXT NOT NULL,
  ano           INTEGER,                  -- año del vehículo
  version       TEXT,
  precio        BIGINT,                   -- precio en COP sin puntos
  kilometraje   INTEGER,
  ciudad        TEXT,
  color         TEXT,
  transmision   TEXT,
  combustible   TEXT,
  descripcion   TEXT,
  total_fotos   INTEGER DEFAULT 0,
  estado        TEXT DEFAULT 'pendiente', -- 'pendiente','activo','rechazado','vendido'
  notas_admin   TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─── TABLA: ofertas ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ofertas (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vehiculo     TEXT NOT NULL,             -- título del vehículo
  precio_pub   BIGINT,                    -- precio publicado
  monto_oferta BIGINT,                    -- oferta del comprador
  porcentaje   INTEGER,                   -- % del precio
  nombre       TEXT,
  celular      TEXT,
  estado       TEXT DEFAULT 'nueva',      -- 'nueva','contactado','cerrada','rechazada'
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ─── TABLA: contactos ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS contactos (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre      TEXT,
  email       TEXT,
  celular     TEXT,
  mensaje     TEXT,
  vehiculo    TEXT,                       -- vehículo consultado (si aplica)
  estado      TEXT DEFAULT 'nuevo',       -- 'nuevo','respondido','archivado'
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── ÍNDICES para consultas rápidas ──────────────────────────
CREATE INDEX IF NOT EXISTS idx_usuarios_created   ON usuarios(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_publicaciones_created ON publicaciones(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_publicaciones_estado  ON publicaciones(estado);
CREATE INDEX IF NOT EXISTS idx_ofertas_created    ON ofertas(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contactos_created  ON contactos(created_at DESC);

-- ─── ROW LEVEL SECURITY (RLS) ─────────────────────────────────
-- Desactivamos RLS para estas tablas ya que solo las lee/escribe
-- el servidor (service_role key), nunca el cliente directamente.
ALTER TABLE usuarios       DISABLE ROW LEVEL SECURITY;
ALTER TABLE publicaciones  DISABLE ROW LEVEL SECURITY;
ALTER TABLE ofertas        DISABLE ROW LEVEL SECURITY;
ALTER TABLE contactos      DISABLE ROW LEVEL SECURITY;

-- ✅ Listo. Luego agregar en Vercel las variables de entorno:
--    NEXT_PUBLIC_SUPABASE_URL  = https://xxxx.supabase.co
--    SUPABASE_SERVICE_ROLE_KEY = eyJ...
