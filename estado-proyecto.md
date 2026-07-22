# Estado del Proyecto — Allcare Mar Agency Website

Última actualización: 2026-07-22. Sesión cerrada aquí a pedido de Jesus — subió (o está por subir) todos los cambios de hoy al repo real.

**Socio / interlocutor:** Jesus. Dirigirse a él por su nombre en cada respuesta.

## 0. ⚠️ Flujo de publicación — leer antes de tocar archivos

La carpeta `C:\Users\jicab\Claude\Projects\Allcaremar.com New Site\` (donde Claude lee/escribe) **NO es el clon real del repo** (no tiene `.git`). Jesus sube manualmente estos archivos al repo real (GitHub) después de cada sesión.

**Limitación técnica confirmada:** la carpeta `J:\My Drive\Operations\Website-Claude` (Google Drive) NO se puede montar en el sandbox de Linux de Claude — Claude puede *ver* imágenes ahí con Read y nombres de archivo con Glob, pero no puede procesarlas (convertir a .webp) ni leer binarios (.xlsx) directamente. Flujo que funciona: Jesus copia los archivos crudos (xlsx, logos) a la raíz de `Allcaremar.com New Site\` (carpeta que sí es accesible), Claude los procesa/optimiza ahí y borra los crudos al terminar.

## 1. ✅ Completado en la sesión del 2026-07-22 — Jesus está subiendo esto al repo ahora

**index.html**
- Carrusel de carriers: Cigna → HealthSpring (slug `hs`, logo `assets/img/carriers/healthspring.webp`).
- Sección "Meet Our Team" (leader-cards, hardcoded): quitada la tarjeta de Julian Vega que había quedado ahí por error — solo quedan Marcos Rodriguez y Maria Santiago, centrados en grid de 2 columnas (`.leader-grid` ajustado a `repeat(2,1fr)` + `max-width:640px`). Se limpiaron las referencias JS/i18n huérfanas de `lead3-role`.
- Tarjetas de Marcos y Maria: quitada la extensión del teléfono (solo número).
- Office Staff (grid dinámico desde `staff.json`): orden Waldo, Julian, Mariel, Aurelyn, Jessica, Karen, Jesus. Todos muestran `800-697-5631 ext. X` (antes solo "Ext. X" con número interno).

**agents.html**
- Quitada la extensión de todas las tarjetas de agentes (solo teléfono).
- Mapa de carriers: `cigna` → `hs` / HealthSpring.

**staff.json**
- Julian Vega agregado a `office_staff` (Training Manager / Gerente de Capacitación, ext. 400 → aparece como `800-697-5631 ext. 400`). Sigue existiendo también en `partner_agencies > JPM Solutions` con su número real sin cambios.
- Sincronizado contra `Agent-Contact-Website.xlsx` (versión correcta, sin "-backup"):
  - Olga Reyes (KMRA Group) eliminada — ya no está en el Excel.
  - Marcos Rodriguez-Martinez: ahora vende también HealthSpring (`hs`) y Healthfirst (`healthfirst`).
  - Oliver Jimenez: email → `oliver.j@nxhealthagency.com`, estados licenciados completados.
  - Ana Martell: estados licenciados completados (antes `PENDIENTE`).
  - Priscilla Galarza: agregado su link de PlanEnroll.
  - Slug `cigna` reemplazado por `hs` en todo el archivo (confirmado con el Excel: código válido = "HS").

**login.html / dashboard-agentes.html — sesión persistente**
- Antes: `sessionStorage` (se borraba al cerrar el navegador) + expiración de ~1h heredada del token de Google → pedía login constantemente.
- Ahora: `localStorage` con expiración propia de **15 días** (`SESSION_DURATION_MS` en `login.html`, fácil de ajustar). Si el navegador ya tiene sesión de Google activa con la cuenta `@allcaremar.com`, entra directo (One Tap: se activó `auto_select` + `google.accounts.id.prompt()`, que antes no estaba conectado aunque el logout ya llamaba a `disableAutoSelect()`).
- Nota de seguridad ya conversada con Jesus: cualquiera que use ese mismo navegador/dispositivo entra sin re-autenticar durante esos 15 días — aceptable para intranet interna.

**dashboard-agentes.html — Medicare Portals**
- Cigna → HealthSpring: nueva tarjeta con logo correcto y link `https://healthspringforbrokers.zilverton.com/public/login`.
- Quitado el texto "Open Link"/"Abrir enlace" de las 15 tarjetas (se limpió el CSS `.cx` y el JS `linkTag` que ya no se usan).
- Logos ampliados: `max-height` de 68px → 100px, padding de la tarjeta reducido para darles más espacio.
- Tarjeta de UnitedHealthcare: logo cambiado a un lockup específico "Jarvis + United Healthcare" (`assets/img/carriers/uhc-jarvis.webp`, nuevo archivo — el logo genérico `unitedhealthcare.webp` que usan index/agents NO se tocó). El link (`uhcjarvis.com`) no cambió.
- Nueva tarjeta **Mira** agregada en 2do lugar (justo después de UnitedHealthcare): logo `assets/img/carriers/mira.webp`, link `https://uhcmira.my.site.com/PartnerLoginPage?ec=302&startURL=%2Fs%2F`. El logo se recortó de una captura de baja resolución que mandó Jesus (comparación Mira + UnitedHealthcare) — se procesó con upscale + alpha suave para evitar ruido/pixelado; se ve bien al tamaño real de la tarjeta (100px alto) aunque el archivo fuente era pequeño. Si en el futuro aparece un logo oficial de Mira en mejor resolución, conviene reemplazarlo.

**Archivos de imagen nuevos/eliminados**
- Nuevos: `assets/img/carriers/healthspring.webp`, `assets/img/carriers/mira.webp`, `assets/img/carriers/uhc-jarvis.webp`.
- Eliminado: `assets/img/carriers/cigna.webp` (huérfano).
- Todos los archivos crudos temporales (xlsx, logos sin procesar) se borraron de la raíz de la carpeta de trabajo al terminar cada tarea.

## 2. 💡 Idea pendiente (anotada, NO implementada) — automatizar staff.json desde el Sheet

Jesus preguntó si se puede automatizar la actualización de carriers/links sin depender de una sesión de Claude cada vez. Propuesta acordada para explorar en sesión futura:

- Apps Script nuevo (separado de `Codigo.gs`, que es del formulario "Tell Us About You") vinculado al Google Sheet `Agent-Contact-Website.xlsx`.
- El script lee el Sheet, lo convierte a la estructura de `staff.json` (misma lógica usada manualmente: códigos AET/HUM/HS/etc. → slugs, estados por guion → array, `PENDIENTE` → placeholder) y lo sube directo al repo vía GitHub Contents API (PUT).
- Requiere: Personal Access Token de GitHub (scope `repo`) guardado en Script Properties (no en el código).
- Disparador recomendado: botón manual "Publicar cambios al sitio" en el Sheet (no automático en cada edición). Alternativa: trigger diario a hora fija.
- Pendiente: escribir el script cuando Jesus confirme que quiere avanzar con esto.

## 3. Pendientes de sesiones anteriores (sin resolver, solo referencia)

- Link real de "Daily Sales Report" en dashboard-agentes.html — Jesus está montando una URL propia atada a Tailscale/su servidor, la va a pasar cuando esté lista (sigue con `href="#"`).
- Subir `google-config.js` (Client ID) al repo — pendiente desde hace varias sesiones.
- Confirmar "Enforce HTTPS" marcado en GitHub Pages.
- Verificación visual real del sitio en un móvil físico.
- Borrar `agentes/michael-ocasio.webp` (huérfano, opcional).
- `editor-fotos-agentes.html` (herramienta interna de recorte de fotos) tiene su propia lista `PEOPLE` hardcodeada, desincronizada de `staff.json` (todavía incluye a Olga Reyes) — no es parte del sitio público, no se tocó.
- Considerar reemplazar `mira.webp` si aparece un logo oficial de mejor resolución.

## 4. Siguiente paso exacto (arrancar aquí la próxima sesión)

1. Confirmar con Jesus que ya subió todos los archivos de la sección 1 al repo real y que se ven bien en producción (`www.allcaremar.com`), incluyendo el login persistente de 15 días.
2. Si ya tiene el link de Tailscale para "Daily Sales Report", conectarlo.
3. Si Jesus quiere, retomar la idea de automatización del Sheet → staff.json (sección 2).
