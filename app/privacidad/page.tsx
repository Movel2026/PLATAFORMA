import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidad",
  description: "Política de tratamiento de datos personales de MOVEL — Ley 1581 de 2012 Colombia.",
};

export default function PrivacidadPage() {
  const hoy = new Date().toLocaleDateString("es-CO", { day: "2-digit", month: "long", year: "numeric" });

  return (
    <div className="min-h-screen bg-cloud">
      {/* Header */}
      <div className="bg-movel-gradient-dark px-4 py-10">
        <div className="max-w-3xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white text-[13px] font-semibold mb-4">
            <ArrowLeft size={16} /> Volver al inicio
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center">
              <ShieldCheck size={26} color="white" weight="fill" />
            </div>
            <div>
              <h1 className="font-display text-[32px] md:text-[40px] text-white leading-tight">Política de Privacidad</h1>
              <p className="text-white/65 text-[13px] mt-1">Última actualización: {hoy}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">
        <article className="bg-white rounded-3xl p-8 md:p-12 border border-[#dce0e5] space-y-8 leading-relaxed">

          <section>
            <h2 className="font-display text-[20px] text-movel-900 mb-3">1. Responsable del tratamiento</h2>
            <p className="text-[14px] text-ink">
              <strong>MOVEL S.A.S.</strong> con NIT 901.234.567-8, domiciliada en Bogotá D.C., Colombia,
              es responsable del tratamiento de los datos personales de los usuarios de la plataforma movelcar.com.
              Esta política cumple con la Ley 1581 de 2012, el Decreto 1377 de 2013 y demás normas de protección de datos personales en Colombia.
            </p>
          </section>

          <section>
            <h2 className="font-display text-[20px] text-movel-900 mb-3">2. Datos que recolectamos</h2>
            <p className="text-[14px] text-ink mb-2">Recolectamos las siguientes categorías de datos:</p>
            <ul className="list-disc pl-5 space-y-1 text-[14px] text-ink">
              <li><strong>Datos de identificación:</strong> nombre, correo electrónico, celular, ciudad de residencia.</li>
              <li><strong>Datos del vehículo:</strong> marca, modelo, año, placa, kilometraje, fotos, descripción.</li>
              <li><strong>Datos de uso:</strong> dirección IP, navegador, páginas visitadas, dispositivo, fecha y hora de acceso.</li>
              <li><strong>Datos de transacción:</strong> historial de ofertas, contactos, mensajes intercambiados en la Plataforma.</li>
            </ul>
            <p className="text-[14px] text-ink mt-2">
              <strong>No recolectamos</strong> información financiera sensible como números de tarjeta de crédito, contraseñas bancarias o datos biométricos.
              Las transacciones económicas ocurren directamente entre vendedor y comprador o, en su caso, a través de aliados financieros externos.
            </p>
          </section>

          <section>
            <h2 className="font-display text-[20px] text-movel-900 mb-3">3. Finalidad del tratamiento</h2>
            <p className="text-[14px] text-ink mb-2">Sus datos personales serán utilizados para:</p>
            <ul className="list-disc pl-5 space-y-1 text-[14px] text-ink">
              <li>Crear y administrar su cuenta de usuario en MOVEL.</li>
              <li>Publicar vehículos y conectar vendedores con compradores potenciales.</li>
              <li>Brindar atención al cliente y resolver consultas.</li>
              <li>Enviar notificaciones operativas (cambios de estado de publicaciones, ofertas recibidas).</li>
              <li>Mejorar la experiencia, seguridad y funcionamiento de la Plataforma.</li>
              <li>Cumplir obligaciones legales (facturación, requerimientos de autoridad).</li>
              <li>Enviar comunicaciones comerciales solo si el usuario lo autoriza expresamente.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-[20px] text-movel-900 mb-3">4. Privacidad de la placa</h2>
            <p className="text-[14px] text-ink">
              La placa completa del vehículo solo es visible para el equipo MOVEL con fines de verificación administrativa.
              A los compradores y al público en general solo se muestra el último dígito de la placa (para que puedan consultar el pico y placa).
              La placa completa nunca se publica en perfiles públicos ni se comparte con terceros sin autorización del propietario.
            </p>
          </section>

          <section>
            <h2 className="font-display text-[20px] text-movel-900 mb-3">5. Compartir datos con terceros</h2>
            <p className="text-[14px] text-ink mb-2">Sus datos pueden ser compartidos únicamente con:</p>
            <ul className="list-disc pl-5 space-y-1 text-[14px] text-ink">
              <li><strong>Proveedores de servicios técnicos:</strong> hosting (Vercel), base de datos (Supabase), notificaciones (Telegram, WhatsApp). Estos terceros tienen sus propias políticas de privacidad y obligaciones contractuales de confidencialidad con MOVEL.</li>
              <li><strong>Compradores o vendedores interesados:</strong> únicamente los datos de contacto necesarios para concretar la transacción y solo después de que el usuario lo autorice.</li>
              <li><strong>Autoridades competentes:</strong> cuando exista requerimiento legal válido (Fiscalía, Policía, jueces, DIAN, etc.).</li>
            </ul>
            <p className="text-[14px] text-ink mt-2">
              <strong>No vendemos datos personales</strong> a terceros con fines publicitarios.
            </p>
          </section>

          <section>
            <h2 className="font-display text-[20px] text-movel-900 mb-3">6. Derechos del titular</h2>
            <p className="text-[14px] text-ink mb-2">
              Como titular de los datos, el usuario tiene los siguientes derechos según la Ley 1581 de 2012:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-[14px] text-ink">
              <li><strong>Conocer</strong> los datos personales que tenemos sobre usted.</li>
              <li><strong>Actualizar</strong> o <strong>rectificar</strong> datos inexactos.</li>
              <li><strong>Solicitar prueba</strong> de la autorización otorgada.</li>
              <li><strong>Ser informado</strong> sobre el uso dado a sus datos.</li>
              <li><strong>Revocar</strong> la autorización y/o <strong>solicitar la supresión</strong> de los datos.</li>
              <li><strong>Acceder gratuitamente</strong> a sus datos.</li>
              <li><strong>Presentar quejas</strong> ante la Superintendencia de Industria y Comercio (SIC).</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-[20px] text-movel-900 mb-3">7. Cómo ejercer sus derechos</h2>
            <p className="text-[14px] text-ink">
              Para ejercer cualquiera de estos derechos, envíe una solicitud al correo
              {" "}<a href="mailto:movelcol@outlook.com" className="text-movel-600 font-semibold hover:underline">movelcol@outlook.com</a>{" "}
              con asunto &quot;Protección de Datos&quot; e identificación clara del titular.
              Responderemos en un plazo máximo de 15 días hábiles según lo establecido en la ley.
            </p>
          </section>

          <section>
            <h2 className="font-display text-[20px] text-movel-900 mb-3">8. Conservación y eliminación</h2>
            <p className="text-[14px] text-ink">
              Los datos se conservan mientras el usuario mantenga una cuenta activa, y hasta por 5 años adicionales para fines legales y contables (RUNT, DIAN).
              Cuando el usuario solicita eliminación, se borran o anonimizan los datos salvo aquellos que la ley exija conservar.
            </p>
          </section>

          <section>
            <h2 className="font-display text-[20px] text-movel-900 mb-3">9. Seguridad</h2>
            <p className="text-[14px] text-ink">
              Implementamos medidas técnicas y administrativas razonables para proteger los datos contra acceso no autorizado, pérdida o alteración:
              cifrado en tránsito (HTTPS), control de acceso por roles, copias de seguridad y monitoreo de eventos de seguridad.
              Sin embargo, ningún sistema es 100% seguro; en caso de incidente notificaremos a los usuarios afectados y a la autoridad competente.
            </p>
          </section>

          <section>
            <h2 className="font-display text-[20px] text-movel-900 mb-3">10. Cookies y tecnologías similares</h2>
            <p className="text-[14px] text-ink">
              Usamos cookies estrictamente necesarias para mantener la sesión iniciada y cookies analíticas (Vercel Analytics) para entender
              cómo se usa la Plataforma de manera agregada. El usuario puede deshabilitar cookies en la configuración de su navegador,
              aunque esto puede afectar funcionalidades como mantenerse autenticado.
            </p>
          </section>

          <section>
            <h2 className="font-display text-[20px] text-movel-900 mb-3">11. Cambios a esta política</h2>
            <p className="text-[14px] text-ink">
              Esta política puede actualizarse para reflejar cambios legales o de la operación. La fecha de la última actualización aparece en la parte superior.
              Cambios sustanciales serán notificados por correo electrónico a los usuarios registrados.
            </p>
          </section>

          <section>
            <h2 className="font-display text-[20px] text-movel-900 mb-3">12. Contacto</h2>
            <p className="text-[14px] text-ink">
              <strong>MOVEL S.A.S.</strong> · NIT 901.234.567-8<br />
              Bogotá D.C., Colombia<br />
              Email: <a href="mailto:movelcol@outlook.com" className="text-movel-600 hover:underline">movelcol@outlook.com</a><br />
              WhatsApp: <a href="https://wa.me/573175737083" className="text-movel-600 hover:underline">+57 317 573 7083</a>
            </p>
          </section>

        </article>
      </div>
    </div>
  );
}
