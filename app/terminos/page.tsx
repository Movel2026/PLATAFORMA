import Link from "next/link";
import { ArrowLeft, FileText } from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos y Condiciones",
  description: "Términos y condiciones de uso de MOVEL — marketplace de vehículos en Colombia.",
};

export default function TerminosPage() {
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
              <FileText size={26} color="white" weight="fill" />
            </div>
            <div>
              <h1 className="font-display text-[32px] md:text-[40px] text-white leading-tight">Términos y Condiciones</h1>
              <p className="text-white/65 text-[13px] mt-1">Última actualización: {hoy}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">
        <article className="bg-white rounded-3xl p-8 md:p-12 border border-[#dce0e5] space-y-8 leading-relaxed">

          <section>
            <h2 className="font-display text-[20px] text-movel-900 mb-3">1. Introducción</h2>
            <p className="text-[14px] text-ink">
              Estos Términos y Condiciones (en adelante &quot;Términos&quot;) regulan el acceso y uso de la plataforma MOVEL (movelcar.com),
              operada por <strong>MOVEL S.A.S.</strong>, sociedad colombiana con NIT 901.234.567-8, con domicilio principal en Bogotá D.C.,
              Colombia (en adelante &quot;MOVEL&quot;, &quot;nosotros&quot; o &quot;la Plataforma&quot;). Al usar la Plataforma, el usuario acepta estos Términos.
            </p>
          </section>

          <section>
            <h2 className="font-display text-[20px] text-movel-900 mb-3">2. Naturaleza de MOVEL</h2>
            <p className="text-[14px] text-ink mb-2">
              MOVEL es una plataforma de intermediación que conecta vendedores y compradores de vehículos usados en Colombia.
              <strong> MOVEL no es propietaria de los vehículos publicados</strong> y, en la modalidad de publicación gratuita,
              tampoco interviene en la transacción comercial entre las partes.
            </p>
            <p className="text-[14px] text-ink">
              Existen dos modalidades de uso:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-[14px] text-ink">
              <li><strong>Publicación gratuita:</strong> el vendedor publica directamente y se encarga de toda la negociación.</li>
              <li><strong>Servicio Integral 360°:</strong> MOVEL gestiona fotos, atención de compradores, peritaje y traspaso por una comisión única del 3% del valor final de venta.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-[20px] text-movel-900 mb-3">3. Registro y cuenta de usuario</h2>
            <p className="text-[14px] text-ink mb-2">
              Para publicar vehículos, hacer ofertas o guardar favoritos, el usuario debe crear una cuenta. Al registrarse:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-[14px] text-ink">
              <li>Debe proporcionar información veraz, exacta y actualizada.</li>
              <li>Es responsable de mantener la confidencialidad de su contraseña.</li>
              <li>Debe ser mayor de edad (18 años) en Colombia.</li>
              <li>MOVEL puede suspender cuentas que incumplan estos Términos.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-[20px] text-movel-900 mb-3">4. Responsabilidad del vendedor</h2>
            <p className="text-[14px] text-ink mb-2">El vendedor garantiza que:</p>
            <ul className="list-disc pl-5 space-y-1 text-[14px] text-ink">
              <li>Es propietario legítimo del vehículo o cuenta con autorización para venderlo.</li>
              <li>La información publicada (kilometraje, año, estado, documentos) es <strong>veraz y completa</strong>.</li>
              <li>El vehículo no tiene impedimentos legales (embargos, prendas, gravámenes) salvo que se declaren expresamente.</li>
              <li>Los documentos (SOAT, tecnomecánica, traspaso) están al día o se declara su estado real.</li>
            </ul>
            <p className="text-[14px] text-ink mt-2">
              MOVEL <strong>no verifica de oficio</strong> la veracidad de cada publicación en la modalidad gratuita.
              En la modalidad Servicio Integral 360° realiza un peritaje técnico básico, pero ello no constituye garantía sobre el estado mecánico futuro del vehículo.
            </p>
          </section>

          <section>
            <h2 className="font-display text-[20px] text-movel-900 mb-3">5. Responsabilidad del comprador</h2>
            <p className="text-[14px] text-ink mb-2">El comprador se compromete a:</p>
            <ul className="list-disc pl-5 space-y-1 text-[14px] text-ink">
              <li>Verificar personalmente el estado del vehículo antes de cualquier pago.</li>
              <li>Solicitar y revisar el historial de propietarios, multas, comparendos y siniestros en RUNT/SIMIT.</li>
              <li>Realizar el traspaso legal del vehículo siguiendo la normatividad colombiana.</li>
              <li>No realizar pagos por adelantado sin garantías documentadas.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-[20px] text-movel-900 mb-3">6. Comisión del Servicio Integral 360°</h2>
            <p className="text-[14px] text-ink">
              Cuando el vendedor opta por el Servicio Integral 360°, MOVEL cobra una comisión única equivalente al <strong>3% del valor final de venta</strong>,
              pagadera al momento de la transacción. No existe tarifa fija, no se cobra por publicación ni por gestiones intermedias.
              La comisión cubre fotografía profesional, atención telefónica a interesados, coordinación de visitas, peritaje técnico básico,
              acompañamiento en el traspaso y documentación.
            </p>
          </section>

          <section>
            <h2 className="font-display text-[20px] text-movel-900 mb-3">7. Conducta prohibida</h2>
            <p className="text-[14px] text-ink mb-2">Está expresamente prohibido:</p>
            <ul className="list-disc pl-5 space-y-1 text-[14px] text-ink">
              <li>Publicar información falsa, engañosa o de vehículos que no se posean.</li>
              <li>Usar la Plataforma para fines distintos a la compraventa lícita de vehículos.</li>
              <li>Suplantar a otra persona o empresa.</li>
              <li>Hostigar a otros usuarios, enviar spam o contenido ofensivo.</li>
              <li>Intentar vulnerar la seguridad técnica de la Plataforma.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-[20px] text-movel-900 mb-3">8. Limitación de responsabilidad</h2>
            <p className="text-[14px] text-ink">
              MOVEL actúa como intermediario tecnológico. No será responsable por:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-[14px] text-ink">
              <li>El estado mecánico, eléctrico o estético real del vehículo.</li>
              <li>Información proporcionada por terceros (vendedores, compradores o proveedores externos).</li>
              <li>Disputas, incumplimientos o conflictos entre las partes derivados de la transacción.</li>
              <li>Pérdidas económicas indirectas o lucro cesante.</li>
            </ul>
            <p className="text-[14px] text-ink mt-2">
              La responsabilidad máxima de MOVEL ante un usuario, en cualquier caso, no excederá el monto efectivamente recibido por concepto de comisión por esa transacción.
            </p>
          </section>

          <section>
            <h2 className="font-display text-[20px] text-movel-900 mb-3">9. Propiedad intelectual</h2>
            <p className="text-[14px] text-ink">
              La marca MOVEL, el logo, la interfaz, el código y los contenidos editoriales de la Plataforma son propiedad de MOVEL S.A.S.
              Las fotografías subidas por usuarios son propiedad del usuario, pero al publicarlas otorgan a MOVEL una licencia no exclusiva
              para usarlas únicamente con fines de visualización en la Plataforma.
            </p>
          </section>

          <section>
            <h2 className="font-display text-[20px] text-movel-900 mb-3">10. Modificaciones</h2>
            <p className="text-[14px] text-ink">
              MOVEL puede modificar estos Términos en cualquier momento. Los cambios serán notificados a través de la Plataforma y entrarán
              en vigor a los 15 días calendario de su publicación. El uso continuado después de ese plazo implica aceptación.
            </p>
          </section>

          <section>
            <h2 className="font-display text-[20px] text-movel-900 mb-3">11. Ley aplicable y jurisdicción</h2>
            <p className="text-[14px] text-ink">
              Estos Términos se rigen por las leyes de la República de Colombia. Cualquier controversia será resuelta por los jueces
              competentes de Bogotá D.C., salvo lo dispuesto por las normas de protección al consumidor.
            </p>
          </section>

          <section>
            <h2 className="font-display text-[20px] text-movel-900 mb-3">12. Contacto</h2>
            <p className="text-[14px] text-ink">
              Para inquietudes sobre estos Términos:<br />
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
