# Setup Supabase + Telegram para MOVEL

Pasos para activar las funciones críticas en producción.

## 1. Variables de entorno en Vercel

En el dashboard de Vercel → Project Settings → Environment Variables, añade:

| Variable | Valor | Notas |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxxx.supabase.co` | Settings → API del dashboard Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGc...` (anon key) | Pública, segura para el cliente |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGc...` (service_role) | **PRIVADA**, solo server-side |
| `ADMIN_PIN` | `1234` (o el PIN que quieras) | Acceso al dashboard `/admin` |
| `TELEGRAM_BOT_TOKEN` | `123456:ABC-DEF...` | Crea el bot con [@BotFather](https://t.me/botfather) |
| `TELEGRAM_CHAT_ID` | `123456789` | Tu chat ID (escribe a [@userinfobot](https://t.me/userinfobot)) |

Después de añadirlas, **redeploy** el proyecto desde Vercel para que tomen efecto.

## 2. Crear tablas en Supabase

Ve a tu proyecto Supabase → SQL Editor → New query, pega y ejecuta:

```sql
-- Tabla usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id     uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre      text,
  email       text UNIQUE,
  telefono    text,
  ciudad      text,
  origen      text DEFAULT 'web',
  created_at  timestamptz DEFAULT now()
);

-- Tabla publicaciones
CREATE TABLE IF NOT EXISTS publicaciones (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  -- contacto
  nombre       text,
  email        text,
  celular      text,
  -- identificación
  marca        text NOT NULL,
  modelo       text NOT NULL,
  ano          integer,
  version      text,
  placa        text,                 -- privada, solo admin
  ultimo_digito_placa text,          -- pública (pico y placa)
  -- características
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
  -- adicional
  descripcion  text,
  total_fotos  integer DEFAULT 0,
  accept_offers boolean DEFAULT false,
  modo         text DEFAULT 'gratis',  -- 'gratis' | '360'
  -- estado
  estado       text DEFAULT 'pendiente', -- pendiente | activo | rechazado | vendido
  notas_admin  text,
  created_at   timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_pub_estado ON publicaciones(estado);
CREATE INDEX IF NOT EXISTS idx_pub_created ON publicaciones(created_at DESC);

-- Tabla ofertas
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
  estado       text DEFAULT 'nueva', -- nueva | contactado | cerrada
  created_at   timestamptz DEFAULT now()
);

-- Tabla contactos
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

-- Tabla favoritos (un registro por (user, vehicle))
CREATE TABLE IF NOT EXISTS favoritos (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  vehicle_id  text NOT NULL,
  created_at  timestamptz DEFAULT now(),
  UNIQUE (user_id, vehicle_id)
);
CREATE INDEX IF NOT EXISTS idx_fav_user ON favoritos(user_id);

-- ─── Row Level Security ───────────────────────────────────────
ALTER TABLE usuarios       ENABLE ROW LEVEL SECURITY;
ALTER TABLE publicaciones  ENABLE ROW LEVEL SECURITY;
ALTER TABLE ofertas        ENABLE ROW LEVEL SECURITY;
ALTER TABLE contactos      ENABLE ROW LEVEL SECURITY;
ALTER TABLE favoritos      ENABLE ROW LEVEL SECURITY;

-- Public: cualquiera puede leer publicaciones activas
DROP POLICY IF EXISTS "publicaciones_select_activas" ON publicaciones;
CREATE POLICY "publicaciones_select_activas" ON publicaciones
  FOR SELECT TO anon, authenticated
  USING (estado = 'activo');

-- Usuarios autenticados pueden ver sus propias publicaciones
DROP POLICY IF EXISTS "publicaciones_select_owner" ON publicaciones;
CREATE POLICY "publicaciones_select_owner" ON publicaciones
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- Usuarios autenticados pueden crear publicaciones
DROP POLICY IF EXISTS "publicaciones_insert" ON publicaciones;
CREATE POLICY "publicaciones_insert" ON publicaciones
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- Favoritos: solo el dueño
DROP POLICY IF EXISTS "favoritos_owner" ON favoritos;
CREATE POLICY "favoritos_owner" ON favoritos
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Service role bypassea todo (admin lo usa)
```

## 3. Configurar Supabase Auth

1. En Supabase → **Authentication → Providers**, activa **Email** (ya viene activado por defecto).
2. **Authentication → URL Configuration**:
   - Site URL: `https://movelcar.com`
   - Redirect URLs: agregar `https://movelcar.com/**`
3. **Authentication → Email Templates** (opcional): personalizar el correo de confirmación con la marca MOVEL.

## 4. Configurar el webhook de Telegram (gratuito)

Una vez deployado el proyecto en `movelcar.com`, abre en el navegador:

```
https://movelcar.com/api/telegram/webhook?setup=1
```

Esto registra tu bot para recibir comandos. Luego desde Telegram:

- Escribe a tu bot `/help` para ver los comandos disponibles
- `/publicaciones hoy` — publicaciones del día
- `/publicaciones pendientes` — esperando aprobación
- `/ofertas` — ofertas recientes
- `/contactos` — consultas de compradores
- `/usuarios` — usuarios registrados
- `/total` — resumen general
- `/buscar Toyota` — busca por texto

El bot solo responde a tu chat ID (configurado en `TELEGRAM_CHAT_ID`).

## 5. Verificación post-deploy

1. **Auth**: `https://movelcar.com/auth` → registra una cuenta de prueba con tu correo personal. Confirma desde el email recibido.
2. **Publicar**: ya logueado, `/publicar` debería dejarte llenar el formulario.
3. **Admin**: `https://movelcar.com/admin` → ingresa el PIN (`ADMIN_PIN`). La publicación debería aparecer en "Pendientes".
4. **Activar**: click en "Activo" en el admin → recarga `/buscar` y debería aparecer.
5. **Favoritos**: click ♥ en una card mientras estás logueado → debe persistir tras refresh.
6. **Telegram**: escribe `/total` al bot → te devuelve el resumen.

## 6. Próximos pasos (no críticos)

- **Supabase Storage**: para fotos reales. Crear bucket `vehiculos` y modificar `/api/publicar` para subir las imágenes.
- **Confirmación de email**: si te molesta el flujo del confirm, en Supabase Auth → Providers → Email puedes desactivar "Confirm email" (más rápido para pruebas, menos seguro).
- **Roles**: agregar columna `rol` en `usuarios` para distinguir vendedores particulares vs concesionarios.
- **Búsqueda full-text**: índice GIN sobre publicaciones para `/buscar` más potente.

---

¿Dudas? Escribe a `movelcol@outlook.com` o `https://wa.me/573175737083`.
