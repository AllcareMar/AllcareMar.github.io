# Estado del Proyecto — Allcare Mar Agency Website

Última actualización: 2026-07-14 (tarde/noche). Sesión cerrada aquí — continúa en la próxima sesión con este archivo como memoria.

**Socio / interlocutor:** Jesus. Dirigirse a él por su nombre en cada respuesta.

**⚠️ BUG CRÍTICO CONFIRMADO ESTA SESIÓN (2026-07-14) — `device_commit_files` no escribe en la carpeta del repo:** verificado con checksums (md5), no solo tamaño de archivo. Se intentó escribir `index.html`, `agents.html`, `staff.json`, `login.html`, `dashboard-agentes.html` + 6 imágenes directo a `C:\Users\jicab\Claude\Projects\Allcaremar.com New Site\` dos veces en esta sesión. La herramienta reportó éxito (`"written"`) ambas veces, pero al releer el archivo desde esa carpeta seguía siendo la versión vieja sin cambios (confirmado con `md5sum`, no solo mtime/bytes — el propio metadata que devuelve la herramienta sobre bytes escritos no coincidía con lo que realmente quedó en disco). Es el mismo patrón que el bug ya documentado con `estado-proyecto.md` en la sesión anterior, pero ahora afecta TODA la carpeta del repo, no solo ese archivo.
**Mitigación obligatoria de ahora en adelante:** NUNCA confiar en `device_commit_files` para esta carpeta sin verificar después con `device_stage_files` + comparación de contenido real (no solo bytes/mtime). Entregar SIEMPRE los archivos por chat (`SendUserFile`) y pedirle a Jesus que los reemplace él mismo arrastrándolos a la carpeta. Si el problema persiste, sugerir correr la próxima tarea grande "en su computadora" desde la app de escritorio (evita el puente remoto por completo).

## 1. Archivos listos — ENTREGADOS POR CHAT en 2 tandas el 2026-07-14, PENDIENTE que Jesus los reemplace manualmente en el repo y haga commit+push (NINGUNO confirmado en disco todavía — ver bug crítico arriba)

- **`index.html`** — ✅ Listo (versión final = 2da entrega, ya incluye todo). Incluye: reemplazo completo "Advisors"→"Agents" (título, meta tags, tagline del logo, footer, disclosures — ver sección 2), alternancia de vocabulario "Agents"/"Licensed Agents"/"Insurance Professionals"/"Representatives" en el copy de venta (ver sección 2), rediseño de Top Carriers con 6 logos reales clicables (ver sección 3), link de Facebook corregido a `https://www.facebook.com/Allcaremar/` (antes `Allcaremedicare`, estaba mal), horario del pie de página corregido para incluir sábado (ver 1.1).
- **`agents.html`** — ✅ Listo (versión final = 2da entrega, ya incluye todo). Incluye: mismo reemplazo Advisors→Agents + alternancia de vocabulario, sistema de filtro por carrier vía `?carrier=<slug>` con banner bilingüe (ver sección 3), link de Facebook corregido, horario del pie de página corregido (ver 1.1).
- **`staff.json`** — ✅ Listo. Regenerado desde el Excel actualizado por Jesus (ver sección 4): 30 independent_agents (antes 28, +Patricia Sanchez +Diego Zetina), partner_agencies con 36 agentes totales (antes 35, +Glorie Alicea en JPM Solutions) = **72 personas en el directorio** (6 oficina + 66 vendedores, antes 69). Cada agente vendedor tiene ahora campo `"carriers"` (array de slugs, todos con `"unitedhealthcare"` mínimo). 28 agentes con `licensed_states` reales (ya no "PENDIENTE").
- **`login.html`, `dashboard-agentes.html`** — ✅ Listos, solo cambio Advisors→Agents (logo/tagline/footer).
- **`assets/img/carriers/*.webp`** — ✅ 6 archivos NUEVOS (unitedhealthcare, aetna, humana, devoted-health, jefferson-health, horizon.webp) — logos reales recortados/optimizados desde los PNG/JPG que Jesus subió a `Website-Claude`. Van en una carpeta nueva `assets/img/carriers/` dentro del repo (crearla si no existe).
- **`editor-fotos-agentes.html`** — sin cambios esta sesión.
- **`privacy-security-policy.pdf`** — revisado, no tiene la palabra "advisor", no requiere cambios.
- **Repo:** `github.com/AllcareMar/AllcareMar.github.io` — GitHub Pages activo (branch `main`/root).

## 1.1 🆕 Fix de horario en pie de página (2026-07-14, noche)

- El pie de página (columna "Support"/"Soporte") solo decía "Mon–Fri 9AM–5:30PM" — le faltaba el sábado, mientras que la barra superior y la sección de contacto ya tenían "Sat 9AM–2PM". Corregido en `index.html` y `agents.html` (EN/ES): ahora dice **"Mon–Fri 9AM–5:30PM, Sat 9AM–2PM"** / **"Lun–Vie 9AM–5:30PM, Sáb 9AM–2PM"**. Verificado con Playwright que no se desborda en desktop ni móvil.

## 2. 🆕 Cambio de vocabulario "Advisors" → "Agents" + alternancia (2026-07-14)

- **Regla aplicada:** "Agents" se mantiene fijo SOLO en el logo, el nombre del sitio (`<title>`, meta tags, tagline "Insurance Agents") y etiquetas funcionales de navegación/botones (ej. "Agent Login", "Agents & Partner Agencies Directory", "Our Independent Agents"). En el resto del copy de venta (hero, intro de carriers, portal, testimonios, FAQs, resumen de privacidad, mensaje de confirmación del formulario) se alterna entre **"Agents" / "Licensed Agents" / "Insurance Professionals" / "Representatives"** en EN, y **"Agentes" / "Representantes" / "Profesionales de Seguros"** en ES — para que no se sienta repetitivo.
- **Decisión de cumplimiento (aprobada por Jesus):** NO se usa "Authorized Representative" porque CMS lo define oficialmente como la persona que un beneficiario designa (poder notarial/familiar) para actuar en su nombre — no es sinónimo de "agente de seguros". Se usa "Representative"/"Representante" (sin "Authorized") en su lugar.
- Aplicado en `index.html`, `agents.html`, `login.html`, `dashboard-agentes.html`.

## 3. 🆕 Top Carriers — logos reales + botones filtrados por agente (2026-07-14)

- **6 tarjetas con logos reales** (antes círculos de iniciales de texto): UnitedHealthcare, Aetna, Humana, Devoted Health, Jefferson Health, Horizon. Se quitó Clover de las 6 tarjetas principales (se dejó solo en el ticker inferior secundario, a pedido de Jesus).
- **Logos procesados:** recorte automático de espacio en blanco, padding uniforme, exportados a `.webp` (~13KB c/u), `object-fit:contain` para que nunca se distorsionen. Grid responsivo propio: 6 columnas desktop, 3 tablet, 2 móvil. Verificado con Playwright en 4 anchos (390/820/1280/1440px): 0px de overflow horizontal en todos.
- **Tarjetas ahora son botones (`<a>`)** con label "View Agents"/"Ver Agentes" bilingüe + ícono flecha. Al hacer clic van a `agents.html?carrier=<slug>` (slugs: `unitedhealthcare`, `aetna`, `humana`, `devoted-health`, `jefferson-health`, `horizon`).
- **`agents.html` filtra el directorio** por el parámetro `?carrier=`, mostrando solo agentes cuyo campo `carriers` (en `staff.json`) incluye ese slug. Banner bilingüe arriba del buscador: "Showing X agents licensed to sell [Carrier] — View All Agents" con link para quitar el filtro.
- **UnitedHealthcare está atado a los 66 agentes vendedores automáticamente** (todos lo tienen por defecto en `staff.json`, no depende del Excel).
- **Estado actual de cobertura por carrier** (verificado 2026-07-14): UnitedHealthcare 66 agentes, Humana 8, Aetna 1 (solo Marcos Rodriguez-Martinez), Devoted Health 1 (solo Marcos), **Jefferson Health 0**, **Horizon 0**.
- **⚠️ Pendiente importante:** mientras Jefferson Health y Horizon tengan 0 agentes asignados, un visitante que haga clic en esas 2 tarjetas verá la página de agentes vacía ("Showing 0 agents"). Jesus debe llenar esas columnas en el Excel pronto (ver sección 4), o pedir que se oculte temporalmente el botón en esas 2 tarjetas hasta tener agentes asignados.

## 4. 🆕 Excel `Agent-Contact-Website.xlsx` — columna "Carriers" + flujo de actualización (2026-07-14)

- **Columna "Carriers" (F) agregada** en cada bloque de agencia (Allcare Mar Agency, JPM, GW, Martell, KMRA, Top Tier, AMC) con instrucciones en la celda H1. Valores válidos exactos: `Aetna`, `Humana`, `Devoted Health`, `Jefferson Health`, `Horizon` (separados por coma si aplica más de uno; United NO hace falta escribirlo).
- **🐛 Historial de esta sesión (importante para la próxima vez):** el primer y segundo intento de que Jesus editara el archivo vía la carpeta de Google Drive (`J:\My Drive\Operations\Website-Claude\Agent-Contact-Website.xlsx`) NO funcionaron — el archivo releído seguía sin ningún cambio (mismo bug de sincronización que con `device_commit_files`, aparentemente también afecta la ESCRITURA de Jesus hacia esa carpeta, no solo la nuestra hacia la suya). **Lo que sí funcionó:** Jesus adjuntó el archivo directo en el chat (subida manual). **Recomendación para el futuro:** para archivos de trabajo (Excel, etc.) que Jesus edite, pedirle SIEMPRE que lo adjunte directo en el chat en vez de depender de la carpeta de Drive sincronizada.
- **3 agentes nuevos agregados vía este Excel:** Patricia Sanchez (FL, Allcare Mar Agency), Diego Zetina (TX, Allcare Mar Agency, vende Humana), Glorie Alicea (FL, JPM Solutions). Sus tarjetas en `agents.html` usan iniciales (sin foto todavía) — mismo mecanismo que los demás agentes sin foto, no es un bug.
- **28 agentes actualizados con estados de licencia reales** (ya no "PENDIENTE"): Nicole Arratia, Adriana Ayala, Iris Balgobin, Yaisha Colon, Jonathan Fernandez, Jesus Garcia, Ramon Gil, Tayler Gray, Ulysses Hyman, Felix Liriano, Kimberly Lopez, Nelson Lopez, Alvorine Martin, Maria Monsalve, Paola Peguero, Carlos Perez, Luz Pujols, Cristian Quinones, Mariela Read, Sixto Rodriguez, Maria Rosario, Carlos Sanchez, y otros.
- **Carriers asignados hasta ahora:** Humana → Alvorine Martin, Paola Peguero, Luz Pujols, Mariela Read, Maria Santiago, Diego Zetina, Glenda Colon. Aetna + Humana + Devoted Health → Marcos Rodriguez-Martinez. El resto de los 66 agentes vendedores solo tiene UnitedHealthcare por defecto.
- **Fuente de trabajo:** `J:\My Drive\Operations\Website-Claude\Agent-Contact-Website.xlsx` — pero ver nota de bug arriba, mejor pedir que lo adjunte en el chat cuando lo actualice de nuevo.

## 5. Pendientes que NO bloquean

- Llenar columna "Carriers" para Jefferson Health y Horizon (ver sección 3, ⚠️ importante).
- 7+3=10 personas sin foto (las 7 de antes + los 3 agentes nuevos) — quedan con iniciales, es correcto.
- Subir `google-config.js` (Client ID) al repo — pendiente de sesión anterior.
- Confirmar "Enforce HTTPS" marcado en GitHub Pages.
- Verificación visual real del fix responsive en un dispositivo móvil de verdad.

## 6. Siguiente paso exacto (arrancar aquí en la próxima sesión)

1. **(Prioridad #1)** Confirmar con Jesus si ya reemplazó manualmente en `C:\Users\jicab\Claude\Projects\Allcaremar.com New Site\` los archivos entregados por chat esta sesión: `index.html`, `agents.html` (versión final con horario corregido), `staff.json`, `login.html`, `dashboard-agentes.html` + 6 `.webp` en `assets/img/carriers/` + este mismo `estado-proyecto.md`. Y si ya hizo commit + push al repo. Si no, retomar desde ahí.
2. Jesus llena la columna "Carriers" para Jefferson Health y Horizon en el Excel, y la adjunta por chat (no por la carpeta de Drive — ver bug de sección 4) para que se regenere `staff.json` de nuevo.
3. Subir `google-config.js` al repo (pendiente de sesión anterior a ésta).
4. Fotos para los 10 agentes/staff sin foto, cuando Jesus las tenga.
5. **Antes de usar `device_commit_files` de nuevo en esta carpeta:** verificar SIEMPRE después con `device_stage_files` + `md5sum`/diff de contenido real, no solo mtime/bytes reportados por la herramienta. Si vuelve a fallar, correr la próxima tarea grande "en tu computadora" desde la app de escritorio en vez de en la nube.
