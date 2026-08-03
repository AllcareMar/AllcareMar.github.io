# Estado del Proyecto — Allcare Mar Agency Website

Última actualización: 2026-08-03. Form-Carriers, la excepción de Carlos y todo el repo de `dashboard-agentes.html`/`resources.html`/`google-config.js` ya están subidos, probados y funcionando en producción (ver secciones 1.6, 1.7, 1.8 — cerradas). Confidentiality Agreement: `info@allcaremar.com` confirmado recibiendo los PDF correctos. `EXEMPT_GATE_ACTIVE` se deja en `false` (decisión de Jesus, sin exenciones). `staff.json` recién sincronizado contra `Agent-Contact-Website.xlsx` (ver sección 1.9) — falta que Jesus lo suba al repo real.

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

## 1.5 ✅ Completado en la sesión del 2026-07-27 — Gate de Firma (Confidentiality Agreement)

Origen: `docs/Handoff_Equipo_Web_Gate_Firma.md` (carpeta `JotForm Migration`, escrito por el agente/equipo que armó el form en Jotform). Ese doc reemplaza al plan viejo `docs/portal-signature-gate.md` (el viejo usaba Google Sheets intermedio — descartado, se consulta la API de Jotform directo).

**Objetivo:** un agente no puede usar `dashboard-agentes.html` hasta firmar el "Confidentiality Agreement" (form Jotform `262074897196068`). Si ya firmó, entra directo y no se le vuelve a pedir.

**Flujo implementado:**
1. Login Google Workspace (sin cambios, `login.html`).
2. `dashboard-agentes.html` revisa cache local `acm_signed` (localStorage, sin expiración, key = email). Si dice `signed:true` para ese email → pasa directo, sin llamar a nada.
3. Si no hay cache positivo → el dashboard se difumina (`#appShell.gated`) y aparece un modal ("Firmar Acuerdo de Confidencialidad" / bilingüe) con un botón que lleva a `firma-requerida.html`.
4. `firma-requerida.html` embebe el iframe de Jotform con `?emailAddress=` prellenado desde la sesión de Google (no editable).
5. Al firmar, Jotform debe redirigir (Thank You Page) a `dashboard-agentes.html?justSigned=1`. El dashboard reintenta `checkSignature` unas veces (delay 2.5s, hasta 4 intentos) por si el submission tarda en indexarse, cachea `signed:true` y quita el gate para siempre.

**Archivos:**
- `Codigo.gs` — nuevo `doGet(e)` con `action=checkSignature&email=`, busca el email entre las submissions del form vía API de Jotform, cache de 5 min (`CacheService`) para no golpear la API en cada login de los 163 agentes. **No toca el `doPost` existente** del formulario "Tell Us About You" (mismo Web App, mismo deployment/URL que ya usa `index.html`).
- `firma-requerida.html` — nueva, mismo estilo visual que `login.html`.
- `dashboard-agentes.html` — `guard()` ahora devuelve la sesión y dispara `runSignatureGate()`. Logout limpia también `acm_signed`.

**Aclaraciones confirmadas con Jesus el 2026-07-27 (revisado vía el conector de Jotform):**
- Existen 2 forms de confidencialidad: el viejo `250366307633152` ("Confidentiality and Release Agreement Allcare Mar Agency", 163 submissions, término de 1 año y 6 meses, sin campo de email) y el nuevo `262074897196068` ("Confidentiality Agreement", 0 submissions, término de 6 meses, con campo de email para atarlo a la sesión de Google). El gate usa el nuevo — es correcto, así lo especifica el Handoff.
- **Decisión de Jesus:** los 163 agentes que ya firmaron el viejo SÍ deben firmar también el nuevo la primera vez que entren al portal. No hay exención. No hace falta lógica adicional para esto.
- **Fix aplicado:** `checkSignature` tenía un cache de 5 min en Apps Script (`CacheService`, para no golpear la API de Jotform en cada login). Riesgo detectado: un agente que firma podía chocar contra ese cache viejo (sin su firma todavía) y los reintentos del dashboard (10s) no alcanzaban a esperar los 5 min completos. Se agregó parámetro `force=1`, usado solo en los reintentos post-firma (`?justSigned=1`), que ignora el cache y consulta Jotform en vivo. El resto de los agentes (que no acaban de firmar) siguen usando el cache normal — no afecta performance para los 163.

**✅ Decisión final de Jesus (2026-07-30):** `EXEMPT_GATE_ACTIVE` se queda en `false` — nadie se exime del gate de firma, ni siquiera `info@`/`jcabreja@`. Cerrado, no tocar salvo que Jesus pida lo contrario.

**✅ Verificado en vivo el 2026-07-27 — endpoint `checkSignature` funcionando:**
- API Key de Jotform generada, pegada en Script Properties (`JOTFORM_API_KEY`), deployment republicado (Nueva versión).
- Primer intento dio `Exception: You do not have permission to call UrlFetchApp.fetch` — Apps Script necesitaba autorización explícita para el nuevo scope de solicitudes externas (`script.external_request`), y no la pidió sola porque quedó una autorización vieja pegada (de cuando el script solo usaba Sheets/Mail).
- **Solución aplicada:** se quitó el acceso previo del script en myaccount.google.com/permissions, se agregó una función temporal `testJotformAuth()` en `Codigo.gs` (llama a `checkSignature_` directo) y se corrió una vez desde el editor de Apps Script — eso disparó el diálogo de autorización completo, Jesus lo aceptó.
- Confirmado con una llamada real al endpoint: `GET .../exec?action=checkSignature&email=test@allcaremar.com` → `{"signed":false}` (correcto, el form nuevo tiene 0 submissions).
- `testJotformAuth()` fue borrada del editor de Apps Script — ya cumplió su propósito.

**✅ Thank You Page de Jotform configurada y verificada:**
- Redirect activo a `https://www.allcaremar.com/dashboard-agentes.html?justSigned=1`, confirmado tanto por captura de pantalla ("Your redirect link has been saved successfully!") como por metadata de la API de Jotform (el texto del Thank You Page cambió a "Redirecting you now…").
- Campo de email confirmado por inspección directa del DOM del form en vivo: `name="q25_emailAddress"`, `type="email"` — coincide con lo asumido en `Codigo.gs` (`JOTFORM_EMAIL_FIELD = 'emailAddress'`, que es la convención estándar de Jotform sin el prefijo `q25_`).

**✅ Bug del "flash" del modal — encontrado y corregido:**
Jesus reportó que al firmar, cerrar sesión y volver a entrar, el modal de firma aparecía un instante y desaparecía. Causa: el logout borraba `acm_signed` (el cache de "ya firmé") junto con la sesión, así que cada reingreso forzaba una re-verificación contra Jotform, y mientras esa llamada resolvía (una fracción de segundo) se veía el modal completo antes de cerrarse.

**Fix aplicado en `dashboard-agentes.html`:**
1. El logout ya NO borra `acm_signed` — haber firmado es permanente, no depende de la sesión de login.
2. Se separó el gate visual en dos fases: `showBlur()` (difumina el fondo, sin mostrar el botón, mientras se verifica) y `revealSignModal()` (recién muestra el modal con el botón, solo si se confirma que de verdad falta firmar). Antes ambas cosas pasaban juntas de forma optimista.

**🚨 Hallazgo importante fuera del alcance original — firma de la Agencia (Marcos Rodriguez-Martinez, CEO) no llegaba en el PDF final:**
Jesus detectó que el PDF que llegaba por email (y el guardado en Jotform) solo tenía la firma del agente ("Receiving Party"), sin el bloque fijo de Marcos como "Disclosing Party" — un documento legal ejecutado de forma unilateral. Diagnóstico:
- El documento personalizado "Confidentiality Agreement" (con el bloque de Marcos, armado en sesiones anteriores por el equipo de JotForm Migration vía Jotform Documents/PDF Editor) SÍ existe y SÍ tiene el bloque correcto — confirmado abriendo el editor.
- El PDF que realmente se enviaba era el genérico automático de **JotformSign** (identificable por el branding "JotformSIGN" + "Create your own PDF Document"), no el documento personalizado — dos sistemas distintos dentro de Jotform (el editor clásico de Documents vs. JotformSign, que tiene su propio motor de generación).
- **Causa raíz:** en el form `262074897196068`, el panel **JotformSign Automation** estaba desactivado (o no vinculado al documento correcto), así que JotformSign generaba su PDF genérico sin importar lo seleccionado en el "Attach PDF" clásico de Settings → Emails.
- **Fix aplicado por Jesus:** activó **"Enable Jotform Sign Automation"**, con **"Select a PDF Document" = "Confidentiality Agreement"** (el personalizado con el bloque de Marcos) y **"Select Email Field" = "Email Address"** (manda automáticamente el PDF firmado al agente). **"Send Audit Trail" quedó en OFF** — sugerido activarlo a futuro para reforzar la validez legal de la firma electrónica (queda como pendiente opcional, sección 3).
- Como consecuencia, se **desactivó el Autoresponder 1** (Settings → Emails) para no duplicar el envío al agente — ahora JotformSign es quien manda esa copia. **Notification 1** (a info@allcaremar.com) se mantiene activa.
- **✅ Confirmado 2026-07-30 por Jesus:** `info@allcaremar.com` está recibiendo el PDF correcto (con la firma de Marcos) vía Notification 1. Cerrado.

**✅ Archivos subidos a GitHub y verificados en vivo (2026-07-27):**
`login.html`, `dashboard-agentes.html`, `firma-requerida.html`, `google-config.js` confirmados subidos por Jesus. Verificado con navegación real: `login.html` carga sin errores de consola con el botón de Google visible, `dashboard-agentes.html` y `firma-requerida.html` redirigen correctamente a `login.html` sin sesión (confirma que no hay errores de sintaxis). El pendiente histórico de "subir google-config.js" (sección 3) queda resuelto.

Jesus confirmó al cierre de la sesión: **"Ahora si. todo listo."** — probó el flujo completo (login → modal → firmar → regreso con `?justSigned=1` → dashboard sin gate) con resultado exitoso.

## 1.6 🚧 En curso — sesión 2026-07-29: reestructuración de dashboard-agentes.html (órdenes del CEO)

**Objetivo del día:** cambios grandes al panel de agentes pedidos por el CEO. Lista completa recibida de Jesus, trabajando en orden.

**✅ Completado hasta ahora:**

1. **Página nueva `resources.html`** — fusiona "Training Videos" + "Support Materials" en una sola tarjeta "Resources"/"Recursos". Solución elegida (la más factible dado que el sitio es estático, sin backend): página propia en el mismo repo, con dos listas de datos hardcodeadas al inicio del script (`TRAINING` y `DOCS`, mismo patrón que `TOOLS`/`CARRIERS`) — agregar un link nuevo (Zoom de training o documento) es agregar un objeto al array, sin tocar el resto del código. Ahora mismo ambas listas están vacías (arrays comentados de ejemplo) — **pendiente que Jesus pase los links reales de Zoom y documentos para completarlas**. Tiene el mismo guard de sesión que el dashboard (no es pública). Se descartó seguir dependiendo de Google Sites (los links viejos de `sites.google.com/.../training-videos` y `.../support-library`) para tener todo dentro del mismo ecosistema versionado.

2. **Reestructuración de secciones:** "Agency & Logistics" se dividió en dos: **Agents Support** e **Important Links** (Medicare Portals no se tocó). Nav lateral actualizado a 3 grupos. Tarjetas movidas exactamente según la lista de Jesus:
   - **Agents Support:** Daily Sales Report, IT Ticket, Appointment Request, Agents Contact List, Resources (nueva), WhatsApp Web (nueva), Zoom App (nueva), Gmail (nueva), Gemini (nueva), Medicaid NJ (nueva).
   - **Important Links:** Berwick Insurance, Integrity Connect, Integrity Connect Leads, T65.app, Conference Room, Sprinter/Van, SSA-LIS (nueva), Medicare (nueva), NIPR (nueva), Sircon (nueva), Sircon - Agencies (nueva).

3. **Tarjetas nuevas — 10 en total.** Como no había logos oficiales descargados, se implementaron como tarjetas de ícono (mismo patrón ya usado para "Appointment Request": círculo de color + ícono de Font Awesome), con colores de marca aproximados por tarjeta. **Jesus dijo explícitamente que esto se puede corregir después** si algún ícono no queda bien — es intercambiable por una imagen real cambiando `icon` por `img` en el array `AGENTS_SUPPORT`/`IMPORTANT_LINKS` de `dashboard-agentes.html`.
   - WhatsApp Web → `fa-brands fa-whatsapp` verde → `https://web.whatsapp.com`
   - Zoom App → `fa-video` azul → `https://zoom.us`
   - Gmail → `fa-envelope` rojo → **link dinámico** (ver punto 4)
   - Gemini → `fa-wand-magic-sparkles` con degradé azul/morado/rosa (estilo Gemini) → **link dinámico** (ver punto 4)
   - Medicaid NJ → `fa-house-medical` naranja → `https://njfamilycare.dhs.state.nj.us/` (NJ FamilyCare, verificado por búsqueda web)
   - SSA - LIS → `fa-landmark` azul marino → `https://secure.ssa.gov/i1020/start` (aplicación online de Extra Help/LIS, verificado por búsqueda web — es el link directo a la solicitud, no solo la página informativa)
   - Medicare → `fa-heart-pulse` azul → `https://www.medicare.gov`
   - NIPR → `fa-id-card` verde azulado → `https://nipr.com` (verificado)
   - Sircon → `fa-clipboard-check` índigo → `https://www.sircon.com`
   - Sircon - Agencies → `fa-building` índigo → `https://www.sircon.com/products/agencies/agencyLogin.jsp` (login específico de agencias, verificado por búsqueda web, distinto del login individual)

4. **Gmail y Gemini con la cuenta logueada:** en vez de `href` fijo, estas 2 tarjetas usan `dynamic:'gmail'`/`dynamic:'gemini'` — el link se arma en vivo con `AGENT_EMAIL` (tomado de la sesión de Google ya validada por el gate) vía el parámetro `?authuser=email`. Esto hace que si el agente tiene varias cuentas de Google en el navegador, Gmail/Gemini abran directo con la cuenta de Workspace de Allcare Mar, no con la que esté activa por default.

5. **Buscador de Google:** agregado arriba de las secciones del dashboard — un `<form>` simple con `action="https://www.google.com/search" method="GET"`, sin API keys ni costo, abre resultados en pestaña nueva. Confirmado que es técnicamente viable (pregunta de Jesus, punto 3 de su lista).

**✅ Logos reales procesados y asignados (reemplazan los íconos de FA donde había archivo disponible):**
Jesus pasó 10 imágenes crudas en `Website-Claude/Dash/` (copiadas a la raíz del working folder para poder procesarlas, mismo flujo de siempre). Procesadas con Python/OpenCV (recorte a bounding box, quitado de fondo por flood-fill o por umbral de saturación según el caso — el checkerboard de transparencia de `Gmail.jpg`/`WhatsappWeb.png` venía "horneado" como píxeles reales, no como alpha real, así que hubo que quitarlo a mano) y guardadas en `assets/img/dashboard/`:
- `appointment-request.webp`, `resources.webp`, `whatsapp-web.webp`, `gmail.webp` (recorte por saturación — el flood-fill normal borraba el logo entero por el ruido JPEG), `zoom.webp`, `gemini.webp`, `medicaid-nj.webp`, `sircon.webp` (se reusa igual para "Sircon" y "Sircon - Agencies", mismo logo, dos links distintos), `ssa-lis.webp` (recortado del ícono mano+corazón+globo de un banner más grande que mandó Jesus, se descartó el resto del banner por no ser útil a tamaño de tarjeta).
- **`sprinter-van.webp` reemplazado** con la foto nueva de la Ford Transit (mismo nombre de archivo, no hizo falta tocar el código).
- **Medicare y NIPR siguen con ícono de Font Awesome** — no llegó archivo para esos dos, quedan pendientes si aparece un logo.
- Carpeta `Dash/` con los crudos: **no se pudo borrar** (mismo problema de permisos de siempre en la carpeta montada) — pendiente que Jesus la borre manualmente.

**✅ Sesión 2026-07-30 — tarjeta nueva PAAD-NJ + logos reales de Medicare/NIPR:**
- Tarjeta nueva en **Agents Support**: **PAAD-NJ** → `https://nj-dhsas.my.site.com/njsave/quickstart`, logo `paad-nj.webp` (branding "NJSave", procesado desde `Dash/Paad-NJ.png`).
- **Medicare** y **NIPR** (en Important Links) ya no usan ícono de Font Awesome — se consiguieron sus logos reales (`Dash/Medicare.png`, `Dash/NIPR.jpg`), procesados y asignados (`medicare.webp`, `nipr.webp`). El de Medicare tenía una sombra punteada difícil de quitar por flood-fill normal (no era blanco puro) — se resolvió filtrando componentes conexos pequeños (ruido) del canal alpha, dejando solo las formas reales de la tarjeta.
- Archivos `Dash/Paad-NJ.png`, `Dash/Medicare.png`, `Dash/NIPR.jpg`: **no se pudieron borrar** (mismo problema de permisos de siempre) — pendiente que Jesus los borre manualmente junto con el resto de `Dash/`.

**✅ Sesión 2026-07-30 — logos de categoría (sidebar + section header) + fix de Resources/Appointment:**
- Jesus pasó 3 badges nuevos en `Dash/` para las 3 secciones del dashboard: `Agent Support.png`, `Important Links.png`, `Medicare Portals.png` (mismo estilo visual: anillo brillante navy/rojo, cara blanca, ícono temático). Procesados a `cat-agents-support.webp`, `cat-important-links.webp`, `cat-medicare-portals.webp` y asignados en **las dos partes** que pidió Jesus: el ícono del menú lateral azul (`.nav-group-toggle`, antes Font Awesome) y el ícono del encabezado de cada sección en el contenido principal (`.section-head .si`, antes Font Awesome).
- **Técnica de recorte mejorada:** las imágenes anteriores (Sprinter, Gemini, etc.) se procesaban con flood-fill desde las esquinas — funciona bien con fondo plano, pero estos 3 badges nuevos tienen un fondo con viñeta/gradiente de color variable, y el flood-fill simple comía partes del anillo o dejaba fondo pegado. Se cambió a **detección de círculo (`cv2.HoughCircles`) + máscara de alpha circular** (recorta justo al borde del anillo, sin depender del color de fondo) — mucho más confiable para este estilo de badge circular. Se documenta acá para reusar en el futuro si Jesus trae más logos con fondos complejos.
- **Bug encontrado y corregido — Resources y Appointment Request se veían blancos/lavados en producción:** esas dos tarjetas se habían procesado en una sesión anterior con flood-fill de tolerancia alta, que borró por error la mayoría del color del anillo y la tarjeta, dejando solo un remanente casi transparente (por eso se veían "blancas" sobre el fondo blanco del dashboard). Se reprocesaron `resources.webp` y `appointment-request.webp` desde los originales (`Dash/Resources.png`, `Dash/Appointment.png`) con la misma técnica de círculo — ahora conservan todos sus colores originales (navy, rojo, teal).
- Archivos `Dash/Agent Support.png`, `Dash/Important Links.png`, `Dash/Medicare Portals.png`: no se pudieron borrar (mismo problema de permisos) — pendiente que Jesus los borre manualmente, junto con `Resources.png`, `Appointment.png`, `Medicare.png`, `NIPR.jpg`, `Paad-NJ.png` que ya cumplieron su función.

**✅ Sesión 2026-07-30 — logo de Resources en los encabezados de sección + decisión sobre embeber videos:**
- Los encabezados "Training Videos" y "Support Materials" dentro de `resources.html` usaban íconos genéricos de Font Awesome (`fa-video`, `fa-file-lines`) — se reemplazaron por el logo real de Resources (`assets/img/dashboard/resources.webp`, el mismo badge navy/rojo con libro+reloj+play), igual que se hizo con las categorías del dashboard principal.
- Jesus preguntó si era posible que los videos de Zoom se reprodujeran embebidos dentro del portal (sin redirigir) y con barra de progreso + reporte de cuánto vio cada agente. Se le explicó la limitación técnica real: las páginas de "share" de Zoom bloquean ser embebidas en iframe por seguridad — no es algo resoluble con código. Se le dieron 2 alternativas (YouTube no listado — permite embeber Y trackear progreso vía su API + nuestro backend de Sheet/Apps Script ya probado; o Google Drive — permite embeber pero sin tracking). **Decisión de Jesus: dejarlo en Zoom por ahora** (links abren en pestaña nueva, sin embeber ni trackear). Se puede reconsiderar más adelante.
- **Flujo acordado para poblar `TRAINING`/`DOCS`:** Jesus va a crear un documento (Excel/Doc) con los links de videos y materiales, guardarlo en la carpeta conectada (mismo patrón que `Dash/` para logos), y Claude lo lee de ahí para completar los arrays — más simple que dictar los links uno por uno en el chat.

**💡 Decisión de arquitectura para Resources — videos vía Google Drive con tracking casero:**
Jesus preguntó si se podía reproducir los training videos embebidos (sin redirigir a Zoom) CON barra de progreso y reporte de cuánto vio cada agente. Aclarado con él:
- El iframe normal de vista previa de Drive es una caja negra — no expone eventos de JS, no se puede trackear con ese método.
- Sí es posible con un `<video>` nativo del navegador apuntando a una URL de descarga directa del archivo en Drive — ahí el navegador mismo da eventos (`timeupdate`, etc.) sin depender de ninguna API externa (ni de YouTube ni de nadie), y ese progreso se puede mandar a un Google Sheet vía Apps Script (mismo patrón ya probado en Form-Carriers).
- **Riesgo real, no del código sino de la fuente:** Drive no está diseñado como servidor de streaming — con archivos grandes puede mostrar la pantalla de "no se pudo escanear por virus" en vez de reproducir, y el método de URL directa no es oficialmente soportado (puede dejar de funcionar si Google cambia algo). YouTube no listado sería más robusto para esto (tiene API oficial de progreso), pero Jesus prefiere probar primero con Drive.
- **Origen de los videos confirmado:** la mayoría se crearon en Synthesia y ya están subidos como grabaciones en la nube de Zoom — no afecta nada, Synthesia queda fuera de la ecuación una vez que el .mp4 está en Zoom. Flujo para Jesus: descargar el .mp4 desde Zoom (Recordings → Cloud Recordings → Download), subirlo a Drive, compartirlo (idealmente restringido al dominio, ya que los agentes entran logueados igual), y pasar el link.
- **Decisión de Jesus:** probar primero con Drive; si algún video da problemas por tamaño, ESE en particular se pasa a YouTube no listado sin tocar el resto. Pausado por ahora — Jesus tiene otra prioridad, retomar cuando tenga tiempo.

**✅ Confirmado 2026-07-30:** `dashboard-agentes.html`, `resources.html`, `google-config.js`, `login.html`, `firma-requerida.html` — subidos a GitHub, probados en vivo por Jesus, funcionando.

**⏳ Pendiente (sin fecha, retomar cuando haya tiempo):**
- Completar `TRAINING`/`DOCS` en `resources.html` con los links reales que dé Jesus (documento pendiente de crear).
- Decidir si se implementa ya el código de Drive + barra de progreso en `resources.html`, o se espera a tener el primer video real subido para probarlo en vivo (pausado).
- Revisar visualmente los íconos nuevos con Jesus y ajustar colores/íconos si hace falta.

## 1.7 ✅ COMPLETADO — Form-Carriers publicado dentro de este repo (`carriers/`)

**Contexto:** proyecto aparte de otro equipo (carpeta `JotForm Migration\Form-Carriers`),
documentado en detalle en su propio `CONTEXTO-Formulario-Carriers.md`. Jesus preguntó si
podía reutilizar el repo del website y el Client ID de OAuth para que los agentes entren a
ese formulario — respuesta: sí, mismo Client ID (solo agregar el dominio a "Orígenes de
JavaScript autorizados"), y sí se puede publicar en el mismo repo de GitHub Pages, en una
subcarpeta. Ya están copiados y listos en este repo, en `carriers/index.html` (formulario
de agentes) y `carriers/dashboard.html` (panel interno) — **faltan por hacer commit +
push** (ver pendientes abajo).

**Qué se construyó (resumen — detalle completo en el .md del otro proyecto):**
- **Login de Google Workspace** en `index.html` del formulario: reemplaza el dropdown
  manual de nombre por auto-selección del agente según el correo verificado (`hd`
  restringido a `allcaremar.com`, mismo patrón que `login.html` de este sitio). El login
  cae directo en la selección de carriers, sin pasos intermedios.
- **Excepción de dominio:** `carloshealthagent@gmail.com` es el único correo externo
  autorizado (agente real registrado con ese Gmail).
- **Acceso de administradores:** los mismos 5 correos que ven el dashboard interno del
  formulario también pueden entrar a seleccionar carriers, aunque no tengan perfil de
  agente (ven todos los carriers sin filtro de licencia).
- **Bilingüe EN/ES** en `index.html` y `dashboard.html` (inglés por defecto, botón de
  idioma, mismo patrón `I18N` que el resto del sitio).
- **Hoja nueva `Detalle_Pivot`** en el Google Sheet backend: formato largo (una fila por
  combinación real Estado+Carrier) para que Jesus pueda filtrar y hacer tablas dinámicas
  por Carrier, Estado de licencia y Agencia — la hoja `Respuestas` original no servía para
  eso (todo junto en una celda).
- **Backend (`Code.gs`, vive en Apps Script, no en este repo):** verificación server-side
  del idToken (`checkAgentAuth_`), columna `LoginEmail` con el correo verificado, y la
  lógica que escribe la hoja `Detalle_Pivot`.

**✅ Confirmado 2026-07-30 por Jesus: resuelto y probado en vivo.** Deployment corregido,
`Code.gs` actualizado y publicado, `carriers/index.html`/`dashboard.html` subidos, flujo
completo probado (login, excepción de Carlos, hoja `Detalle_Pivot`, dashboard interno).
Sin pendientes bloqueantes.

## 1.8 ✅ Completado — sesión 2026-07-30: excepción de Carlos en todo el sitio de agentes

Al probar Form-Carriers en vivo, `carloshealthagent@gmail.com` (Carlos Perez, agente real
con Gmail personal en vez de cuenta Workspace) no podía loguearse — Google mismo lo
bloqueaba por el parámetro `hd: WORKSPACE_DOMAIN` en `google.accounts.id.initialize()`
(filtra el selector de cuentas antes de que nuestro código evalúe nada) y, más de fondo,
porque el Client ID compartido tenía la pantalla de consentimiento de OAuth en **"Interno"**
(bloquea cualquier cuenta fuera de la organización de Workspace a nivel de Google). Jesus
cambió el Client ID a **"Externo"** en Google Cloud Console.

Con el Client ID ya en modo Externo, se replicó la misma excepción que ya existía en
Form-Carriers a **todo el ecosistema del sitio principal** (login, dashboard, resources,
firma-requerida), centralizándola en `google-config.js`:

- Nuevo export `EXTRA_ALLOWED_EMAILS = ["carloshealthagent@gmail.com"]` y función
  `isEmailAllowed(email)` (dominio `@allcaremar.com` O está en la lista de excepciones).
- `login.html`: se quitó `hd: WORKSPACE_DOMAIN` del `initialize()` (bloqueaba el selector
  de Google); `getValidSession()` y `handleCredentialResponse()` ahora usan
  `isEmailAllowed()` en vez de comparar el dominio a mano.
- `dashboard-agentes.html`, `resources.html`, `firma-requerida.html`: sus respectivos
  `guard()` ahora también usan `isEmailAllowed()` en vez del chequeo de dominio manual.

**Importante — esto NO abre el sitio a cualquiera:** cambiar el Client ID a "Externo" solo
le permite a Google dejar que cualquier cuenta *intente* el login (antes bloqueaba a nivel
de consentimiento). Quién realmente entra lo sigue decidiendo el código de cada página vía
`isEmailAllowed()` — sigue siendo solo `@allcaremar.com` + la única excepción de Carlos.

**✅ Confirmado 2026-08-03 por Jesus:** los 5 archivos ya están subidos y probados en
producción. Sin pendientes.

## 1.9 ✅ Completado — sesión 2026-08-03: sincronización de `staff.json` desde `Agent-Contact-Website.xlsx`

Jesus actualizó el Excel (links, carriers vendidos por agente, una reubicación de agencia)
y pidió sincronizar el sitio. Diff programático completo Excel ↔ `staff.json` (63 agentes +
6 office staff, cero diferencias sin explicar al cerrar):

- **Carriers agregados** (columna F del Excel, antes desactualizada en el JSON) a 16 agentes:
  Nicole Arratia, Adriana Ayala, Iris Balgobin, Yaisha Colon, Jonathan Fernandez, Jesus Garcia,
  Tayler Gray, Oliver Jimenez, Maria Monsalve, Paola Peguero, Carlos Perez, Sixto Rodriguez,
  Marcos Rodriguez-Martinez, Maria Santiago, Julian Vega (JPM), Ana Martell (Martell Multi
  Service). Carlos Perez ahora vende 9 carriers (todos menos Molina/Emblem/Anthem/Wellpoint).
- **Links de PlanEnroll nuevos** agregados: Oliver Jimenez (Sunfire Matrix, no PlanEnroll —
  URL distinta, revisado y correcto), Mariela Read, Maria Santiago, Margot Flores, Jocelyn
  Rodriguez (myintegrity.com, no planenroll.com — revisado y correcto).
- **Reubicación de agencia:** Joshua Munoz — el Excel ahora lo lista bajo "Allcare Mar Agency"
  (fila 27); antes estaba en `partner_agencies > Top Tier Health Consultants`. Movido a
  `independent_agents`, mismo orden relativo que el Excel (entre Francia Munoz y Paola
  Peguero). Sin cambios de teléfono/estados/carriers.
- **Sin agentes nuevos ni eliminados.** Estados licenciados: sin cambios en ningún agente.
  Julian Vega en `office_staff` (Training Manager) se mantiene tal cual — es una duplicación
  intencional documentada en la sección 1 (2026-07-22), no está en el Excel porque esa tabla
  solo cubre el personal de oficina "puro".
- Verificado: los 14 códigos de carrier usados en el Excel corresponden 1:1 a la leyenda de
  la columna H (AET/HUM/DEV/JEF/HOR/ANT/HS/EMB/FID/HF/MOL/SCAN/WC/WP) — cero códigos
  desconocidos en los datos reales (el "CIG" que aparece en el texto de ejemplo de la
  columna H es un resto viejo de antes del rename Cigna→HealthSpring, no afecta datos).
- Único archivo modificado: `staff.json` (`_readme` actualizado a fecha 2026-08-03).
  `agents.html`/`index.html` no necesitan cambios de código — leen `staff.json`
  dinámicamente.

**⏳ Pendiente:** copiar `staff.json` actualizado al repo real de GitHub Pages.

## 2. 💡 Idea pendiente (anotada, NO implementada) — automatizar staff.json desde el Sheet

Jesus preguntó si se puede automatizar la actualización de carriers/links sin depender de una sesión de Claude cada vez. Propuesta acordada para explorar en sesión futura:

- Apps Script nuevo (separado de `Codigo.gs`, que es del formulario "Tell Us About You") vinculado al Google Sheet `Agent-Contact-Website.xlsx`.
- El script lee el Sheet, lo convierte a la estructura de `staff.json` (misma lógica usada manualmente: códigos AET/HUM/HS/etc. → slugs, estados por guion → array, `PENDIENTE` → placeholder) y lo sube directo al repo vía GitHub Contents API (PUT).
- Requiere: Personal Access Token de GitHub (scope `repo`) guardado en Script Properties (no en el código).
- Disparador recomendado: botón manual "Publicar cambios al sitio" en el Sheet (no automático en cada edición). Alternativa: trigger diario a hora fija.
- Pendiente: escribir el script cuando Jesus confirme que quiere avanzar con esto.

## 3. Pendientes de sesiones anteriores (sin resolver, solo referencia)

- Confirmar "Enforce HTTPS" marcado en GitHub Pages.
- Verificación visual real del sitio en un móvil físico.
- Borrar `agentes/michael-ocasio.webp` (huérfano, opcional).
- `editor-fotos-agentes.html` (herramienta interna de recorte de fotos) tiene su propia lista `PEOPLE` hardcodeada, desincronizada de `staff.json` (todavía incluye a Olga Reyes) — no es parte del sitio público, no se tocó.
- Considerar reemplazar `mira.webp` si aparece un logo oficial de mejor resolución.
- Considerar activar "Send Audit Trail" en JotformSign Automation (form 262074897196068) para reforzar la validez legal de la firma electrónica — quedó en OFF, decisión de Jesus pendiente.

## 4. Siguiente paso exacto (arrancar aquí la próxima sesión)

1. **Pendiente inmediato:** Jesus debe subir el `staff.json` actualizado (sección 1.9) al repo real de GitHub.
2. Confirmar que los 63 agentes ya pueden ver y completar el gate de firma sin problemas — monitorear las primeras firmas reales.
3. Si Jesus quiere, activar "Send Audit Trail" en JotformSign Automation (ver sección 3).
4. Si ya tiene el link de Tailscale para "Daily Sales Report", conectarlo.
5. Si Jesus quiere, retomar la idea de automatización del Sheet → staff.json (sección 2).
6. Completar `TRAINING`/`DOCS` en `resources.html` cuando Jesus pase el documento de links.
