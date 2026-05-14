# Setup Supabase + Telegram + Storage para MOVEL

Pasos para activar las funciones críticas en producción.

## ⚠️ FIX RÁPIDO si las publicaciones no aparecen en /admin

Si publicaste un carro y llegó a Telegram pero NO al panel admin, ejecuta este SQL en
Supabase (SQL Editor → New query → Run):

```sql
-- Agregar columnas faltantes a la tabla publicaciones existente
ALTER TABLE publicaciones
  ADD COLUMN IF NOT EXISTS placa                text,
  ADD COLUMN IF NOT EXISTS ultimo_digito_placa  text,
  ADD COLUMN IF NOT EXISTS motor                text,
  ADD COLUMN IF NOT EXISTS potencia             text,
  ADD COLUMN IF NOT EXISTS carroceria           text,
  ADD COLUMN IF NOT EXISTS pasajeros            text,
  ADD COLUMN IF NOT EXISTS accept_offers        boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS modo                 text    DEFAULT 'gratis',
  ADD COLUMN IF NOT EXISTS fotos_urls           jsonb   DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS notas_admin          text,
  ADD COLUMN IF NOT EXISTS updated_at           timestamptz DEFAULT now(),
  ADD COLUMN IF NOT EXISTS user_id              uuid REFERENCES auth.users(id) ON DELETE SET NULL;
```

Mientras eso esté pendiente, el código ya hace un **fallback al insert mínimo**, así que
la publicación al menos llegará con los campos básicos. Pero para tener todos los datos
(placa, motor, fotos URL, etc.) necesitas correr el ALTER de arriba.

---

## 1. Variables de entorno en Vercel

Settings → Environment Variables:

| Variable | Valor | Notas |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxxx.supabase.co` | Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGc...` (anon key) | Pública |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGc...` (service_role) | **PRIVADA** |
| `ADMIN_PIN` | `1234` o tu PIN | Para `/admin` |
| `TELEGRAM_BOT_TOKEN` | `123:ABC...` | @BotFather |
| `TELEGRAM_CHAT_ID` | `123456789` | @userinfobot |
| `NEXT_PUBLIC_BASE_URL` | `https://movelcar.com` | Tu dominio |

Después de agregar las vars → **Redeploy** en Vercel.

## 2. Crear todas las tablas (instalación nueva)

Si es Supabase recién creado, ejecuta TODO este SQL:

```sql
-- ─── Tabla usuarios ───
CREATE TABLE IF NOT EXISTS usuarios (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id     uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre      text,
  email       text UNIQUE,
  telefono    text,
  ciudad      text,
  origen      text DEFAULT 'web',
  rol         text DEFAULT 'particular', -- 'particular' | 'concesionario' | 'movel'
  created_at  timestamptz DEFAULT now()
);

-- ─── Tabla publicaciones (con TODAS las columnas) ───
CREATE TABLE IF NOT EXISTS publicaciones (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  nombre       text,
  email        text,
  celular      text,
  marca        text NOT NULL,
  modelo       text NOT NULL,
  ano          integer,
  version      text,
  placa        text,                       -- privada
  ultimo_digito_placa text,                 -- pública
  precio       bigint,
  kilometraje  integer,
  ciudad       text,
  color        text,
  transmision  text,
  combustible  text,
  motor        text,
  potencia     text,
  carroceria   text,
  pasajeros    text,
  descripcion  text,
  total_fotos  integer DEFAULT 0,
  fotos_urls   jsonb   DEFAULT '[]'::jsonb,
  accept_offers boolean DEFAULT false,
  modo         text DEFAULT 'gratis',       -- 'gratis' | '360'
  estado       text DEFAULT 'pendiente',    -- pendiente | activo | rechazado | vendido
  notas_admin  text,
  created_at   timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_pub_estado ON publicaciones(estado);
CREATE INDEX IF NOT EXISTS idx_pub_created ON publicaciones(created_at DESC);

-- ─── Tabla ofertas ───
CREATE TABLE IF NOT EXISTS ofertas (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  vehiculo     text,
  precio_pub   bigint,
  monto_oferta bigint,
  porcentaje   numeric,
  nombre       text,
  celular      text,
  email        text,
  estado       text DEFAULT 'nueva',
  created_at   timestamptz DEFAULT now()
);

-- ─── Tabla contactos ───
CREATE TABLE IF NOT EXISTS contactos (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre      text,
  email       text,
  celular     text,
  mensaje     text,
  vehiculo    text,
  estado      text DEFAULT 'nuevo',
  created_at  timestamptz DEFAULT now()
);

-- ─── Tabla favoritos ───
CREATE TABLE IF NOT EXISTS favoritos (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  vehicle_id  text NOT NULL,
  created_at  timestamptz DEFAULT now(),
  UNIQUE (user_id, vehicle_id)
);
CREATE INDEX IF NOT EXISTS idx_fav_user ON favoritos(user_id);

-- ─── RLS ───
ALTER TABLE usuarios       ENABLE ROW LEVEL SECURITY;
ALTER TABLE publicaciones  ENABLE ROW LEVEL SECURITY;
ALTER TABLE ofertas        ENABLE ROW LEVEL SECURITY;
ALTER TABLE contactos      ENABLE ROW LEVEL SECURITY;
ALTER TABLE favoritos      ENABLE ROW LEVEL SECURITY;

-- Lectura pública: cualquiera puede ver publicaciones activas
DROP POLICY IF EXISTS "publicaciones_select_activas" ON publicaciones;
CREATE POLICY "publicaciones_select_activas" ON publicaciones
  FOR SELECT TO anon, authenticated
  USING (estado = 'activo');

-- Inserción: cualquier autenticado puede publicar
DROP POLICY IF EXISTS "publicaciones_insert" ON publicaciones;
CREATE POLICY "publicaciones_insert" ON publicaciones
  FOR INSERT TO authenticated WITH CHECK (true);

-- Favoritos: solo del dueño
DROP POLICY IF EXISTS "favoritos_owner" ON favoritos;
CREATE POLICY "favoritos_owner" ON favoritos
  FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
```

## 3. Configurar Supabase Storage para FOTOS

**Esto es lo que hace que las fotos se vean realmente en el admin.**

### 3.1. Crear el bucket
1. Ve a Supabase → **Storage** → **New bucket**
2. Nombre: `vehiculos`
3. **Public bucket**: ✅ Sí (las fotos deben ser visibles)
4. File size limit: 5 MB
5. Allowed MIME types: `image/jpeg, image/png, image/webp, image/heic, image/heif`

### 3.2. Policies del bucket
En **Storage → Policies → vehiculos**, agrega:

```sql
-- Lectura pública
CREATE POLICY "fotos_public_read" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'vehiculos');

-- Inserción: cualquier autenticado puede subir (también service_role bypassea)
CREATE POLICY "fotos_authenticated_upload" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'vehiculos');
```

## 4. Configurar Supabase Auth

1. **Authentication → Providers → Email**: activado
2. **Authentication → URL Configuration**:
   - Site URL: `https://movelcar.com`
   - Redirect URLs: `https://movelcar.com/**`

## 5. Webhook de Telegram (gratuito)

Una vez deployado, abre:
```
https://movelcar.com/api/telegram/webhook?setup=1
```
Esto registra el bot. Luego en Telegram escribe `/help`.

Comandos disponibles:
- `/publicaciones [hoy|pendientes|activos]`
- `/ofertas`
- `/contactos`
- `/usuarios`
- `/total`
- `/buscar <texto>`

## 6. Verificación post-deploy

| Test | Cómo | Esperado |
|---|---|---|
| Auth | `/auth` → registrarme | Email de confirmación llega |
| Login persistente | Logueo → cierro pestaña | Sigo logueado |
| Publicar | Logueado → `/publicar?modo=gratis` → llenar y enviar | Aparece en admin |
| Fotos | Subo 3+ fotos al publicar | Bucket `vehiculos` tiene los archivos |
| Activar | Admin → click "Activo" → recargar `/buscar` | Aparece en catálogo |
| Favoritos | ♥ logueado → cierro → vuelvo | Sigue marcado |
| Telegram | `/total` al bot | Devuelve resumen |
| Validaciones | Email "test@test.com" o placa "ABC1" | Errores inline |

## 7. Próximos pasos (siguiente iteración)

- Registro de **Concesionario** (cuenta especial con badge para 10+ vehículos)
- Badge **"Vendido por Movel"** en cards de venta directa
- Progress indicator en specs técnicas (red → blue mientras se completan)
- Compresión client-side de fotos antes de subir
- Confirmación de placa real contra RUNT (API externa)

---

📧 `movelcol@outlook.com` · 📱 `https://wa.me/573175737083`
