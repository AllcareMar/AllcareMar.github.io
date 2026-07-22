# Estado del Proyecto — Allcare Mar Agency Website

Última actualización: 2026-07-22. Sesión cerrada aquí a pedido de Jesus. **Próxima sesión: enfocarse en dashboard-agentes.html.**

**Socio / interlocutor:** Jesus. Dirigirse a él por su nombre en cada respuesta.

## 0. ⚠️ Flujo de publicación — leer antes de tocar archivos

La carpeta `C:\Users\jicab\Claude\Projects\Allcaremar.com New Site\` (donde Claude lee/escribe) **NO es el clon real del repo** (no tiene `.git`). Jesus sube manualmente estos archivos al repo real (GitHub) más tarde.

**Limitación técnica confirmada:** la carpeta `J:\My Drive\Operations\Website-Claude` (Google Drive) NO se puede montar en el sandbox de Linux de Claude — Claude puede *ver* imágenes ahí con Read y leer nombres de archivo con Glob, pero no puede procesarlas (convertir a .webp) ni leer binarios (.xlsx) directamente. Flujo que funciona: Jesus copia los archivos crudos (xlsx, logos) a la raíz de `Allcaremar.com New Site\` (carpeta que sí es accesible), Claude los procesa/optimiza ahí y borra los crudos al terminar.

## 1. ✅ Completado esta sesión (2026-07-22) — pendiente que Jesus suba a GitHub y revise

**Archivos modificados/nuevos en esta carpeta de trabajo, listos para subir al repo:**
- `index.html` — carrusel de carriers: Cigna reemplazado por HealthSpring (slug `hs`, logo nuevo). Office Staff reordenado: Waldo, Julian, Mariel, Aurelyn, Jessica, Karen, Jesus. Teléfono de Office Staff ahora muestra `800-697-5631 ext. X` (antes solo "Ext. X").
- `agents.html` — quitada la extensión de todas las tarjetas de agentes (solo se muestra el teléfono). Mapa de carriers actualizado: `cigna` → `hs`/HealthSpring.
- `staff.json` — cambios:
  - Julian Vega agregado a `office_staff` (Training Manager / Gerente de Capacitación, ext. 400, solo email+teléfono de oficina — sigue existiendo también en `partner_agencies > JPM Solutions` con su número real, sin cambios ahí).
  - Sincronizado contra `Agent-Contact-Website.xlsx` (versión correcta, sin "-backup"): Olga Reyes (KMRA Group) eliminada — ya no está en el Excel. Marcos Rodriguez-Martinez ahora vende HealthSpring + Healthfirst. Oliver Jimenez: email actualizado a `oliver.j@nxhealthagency.com` + estados licenciados completados. Ana Martell: estados licenciados completados. Priscilla Galarza: agregado su link de PlanEnroll.
  - Slug de carrier `cigna` reemplazado por `hs` en todo el archivo (confirmado con el Excel: código válido = "HS").
- `assets/img/carriers/healthspring.webp` — logo nuevo, optimizado (696×202, fondo transparente, mismo padding que los demás carriers). `cigna.webp` eliminado (huérfano).

**Jesus debe:** subir estos archivos al repo real / GitHub Pages y confirmar visualmente que todo se ve bien en `www.allcaremar.com` antes de la próxima sesión.

## 2. 🎯 Próxima sesión — Dashboard (dashboard-agentes.html)

Retomar los pendientes de dashboard que quedaron de la sesión anterior (ver sección 4 de la versión previa de este archivo, resumido):
1. Link real de "Daily Sales Report" — Jesus está montando una URL propia atada a Tailscale/su servidor, la va a pasar cuando esté lista.
2. Nota: "Cigna" también aparece mencionado en la sección Medicare Portals de `dashboard-agentes.html` (texto/link `cigna.com/brokers`) — evaluar si también debe pasar a HealthSpring cuando se trabaje el dashboard.

## 3. 💡 Idea pendiente (anotada, NO implementada) — automatizar staff.json desde el Sheet

Jesus preguntó si se puede automatizar la actualización de carriers/links sin depender de una sesión de Claude cada vez. Propuesta acordada para explorar en sesión futura:

- Apps Script nuevo (separado de `Codigo.gs`, que es del formulario "Tell Us About You") vinculado al Google Sheet `Agent-Contact-Website.xlsx`.
- El script lee el Sheet, lo convierte a la estructura de `staff.json` (misma lógica usada manualmente esta sesión: códigos AET/HUM/HS/etc. → slugs, estados por guion → array, `PENDIENTE` → placeholder) y lo sube directo al repo vía GitHub Contents API (PUT).
- Requiere: Personal Access Token de GitHub (scope `repo`) guardado en Script Properties (no en el código).
- Disparador recomendado: botón manual "Publicar cambios al sitio" en el Sheet (no automático en cada edición, para evitar publicar cambios a medio hacer). Alternativa: trigger diario a hora fija.
- Pendiente: escribir el script cuando Jesus confirme que quiere avanzar con esto.

## 4. Pendientes de sesiones anteriores (sin resolver, solo referencia)

- Subir `google-config.js` (Client ID) al repo — pendiente desde hace varias sesiones.
- Confirmar "Enforce HTTPS" marcado en GitHub Pages.
- Verificación visual real del sitio en un móvil físico.
- Borrar `agentes/michael-ocasio.webp` (huérfano, opcional).
- `editor-fotos-agentes.html` (herramienta interna de recorte de fotos) tiene su propia lista `PEOPLE` hardcodeada, desincronizada de `staff.json` (todavía incluye a Olga Reyes, por ejemplo) — no es parte del sitio público, no se tocó, evaluar si vale la pena sincronizarla.

## 5. Siguiente paso exacto (arrancar aquí la próxima sesión)

1. Confirmar con Jesus que ya subió los archivos de la sección 1 al repo real y que se ven bien en producción.
2. Empezar dashboard-agentes.html: pedir la URL de Daily Sales Report si ya la tiene, y revisar la mención de Cigna en Medicare Portals.
3. Si Jesus quiere, retomar la idea de automatización (sección 3).
