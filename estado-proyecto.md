# Estado del Proyecto — Allcare Mar Agency Website

Última actualización: 2026-07-09 (noche).

## 1. Archivos listos y aprobados

- **`index.html`, `login.html`, `dashboard-agentes.html`, `agents.html`** — ✅ LISTOS, en el repo de GitHub.
- **`staff.json`** — ✅ ACTUALIZADO 2026-07-09 desde `Agent-Contact-Website.xlsx` (fuente autoritativa entregada por el socio ese mismo día). Listo para subir/reemplazar en el repo.
- **`/agentes/*.webp`** — ✅ NUEVO. 62 fotos reales de agentes/staff procesadas y listas para subir al repo (ver sección 2).
- **`editor-fotos-agentes.html`** — ✅ NUEVO. Herramienta standalone (también persistida como artifact en Cowork) para recortar/centrar manualmente cualquier foto dentro del círculo; útil para corregir encuadres y para las 7 personas sin foto aún.
- **Repo:** `github.com/AllcareMar/AllcareMar.github.io` — GitHub Pages activo (branch `main`/root).

## 1.1 🆕 index.html — Stats bar sincronizado + mapa de estados con licencia (2026-07-09)

- **Números unificados** entre la barra superior (hero) y la franja azul: Members Served 20K+, States Licensed 23+, Licensed Agents 80+, Years of Experience 10+ (este último solo existe arriba; la franja azul mantiene "Bilingual" en su 4to slot, sin cambio).
- **Bug corregido:** la animación de conteo (`animateCounters()`) le quitaba el sufijo (K+/+) a los números de la franja azul al terminar de animar (por eso se veía "80" en vez de "80+"). Se agregó `data-suffix` a cada `.stat-num` — ya no ocurre.
- **"Licensed Agents" (ambas barras) ahora es clicable** → redirige a `agents.html`.
- **"States Licensed" (ambas barras) ahora es clicable** → abre un modal con un mapa punteado de EE.UU. Los estados en azul son los que aparecen en `licensed_states` de **Marcos Rodriguez-Martinez** dentro de `staff.json` — se lee en vivo (fetch), no está hardcodeado. Si el día de mañana se le agrega o quita un estado a Marcos en el Excel → `staff.json`, el mapa lo refleja automáticamente sin tocar código.
- El mapa es un SVG liviano hecho a mano (coordenadas aproximadas por lat/lon, sin dependencias externas ni GeoJSON pesado) — no afecta el peso de carga de la página.
- Bilingüe (EN/ES), accesible (roles/tabindex/Escape para cerrar), verificado con Playwright headless: sin errores de consola, navegación a `agents.html` confirmada, modal probado en ambos idiomas.
- **✅ AJUSTE (2026-07-09, noche) pedido por el socio:** (1) se quitó la frase "based on our Chairman's active state licenses" / "según las licencias activas de nuestro Presidente" del texto descriptivo del modal (EN y ES) — ahora solo dice "Our agency's licensed coverage area across the United States."; (2) se agregó una **silueta de fondo del mapa de EE.UU.** (marca de agua, tono azul claro corporativo `--blue-light` con borde sutil) detrás de los círculos de los estados, para que ya no se vean "flotando" sobre fondo blanco. La silueta se genera con una curva suave que pasa por las mismas coordenadas de los estados (no es un archivo/imagen externa), así queda automáticamente alineada sin agregar peso ni dependencias. Verificado visualmente con captura de pantalla vía Playwright.

## 1.2 🆕 Corrección de encuadre de fotos (2026-07-09, tarde)

- **Aclaración del socio:** "Marcos Rodriguez" y "Marcos Rodriguez-Martinez" son la misma persona en todo el proyecto. Bug encontrado y corregido: la tarjeta de Líder de Marcos en `index.html` apuntaba a `/agentes/marcos-rodriguez.webp` (archivo que no existe) en vez de `/agentes/marcos-rodriguez-martinez.webp` (el real) — por eso no se le veía la foto, solo iniciales.
- **Bug de raíz encontrado en el pipeline de recorte:** el crop original (`side=min(w,h)` centrado en la cara detectada) no hacía zoom según el tamaño real de la cara — en fotos donde la persona ocupa poco espacio del encuadre (fotos de cuerpo completo/medio cuerpo, o fotos muy verticales), el resultado dejaba mucha pared/espacio vacío arriba y la cara chica y abajo. Afectó a Sergio Ramirez, Carlos Sanchez, Felix Liriano y Samir Sanchez (reportados por el socio) — y muy probablemente a más del lote original.
- **Detección facial fallida (falso positivo):** Ana Michelle Christopher y Paola Peguero tenían la cara mal detectada — en el caso de Ana, el algoritmo enfocó por error su mano/anillo en vez de su rostro (Haar Cascade confundido por el ángulo de la foto).
- **Solución aplicada:** se cambió la fórmula de recorte a una basada en el tamaño de cara detectado (nacimiento del cabello ≈15% desde arriba del marco, mentón ≈80%), en vez de usar el ancho/alto completo de la imagen. Se re-procesaron **56 de las 62 fotos** con esta fórmula (las 6 que ya se habían corregido a mano — Paola, Ana Michelle, Sergio, Carlos Sanchez, Felix, Samir — se dejaron con su recorte manual). Verificado visualmente con una hoja de contacto de las 62 antes de entregar.
- Si el socio detecta alguna foto más con mal encuadre, avisar el nombre y se corrige puntualmente (o usar `editor-fotos-agentes.html` para hacerlo directamente).
- **Fuentes de trabajo (Google Drive, `J:\My Drive\Operations\Website-Claude\`):** `Agent-Contact-Website.xlsx` (roster oficial) y carpeta `Agent Picture\` (fotos originales sin procesar) — mantener esta carpeta de Drive como el lugar donde el socio sube el Excel/fotos actualizados; el repo real vive en `Allcaremar.com New Site\` (carpeta sincronizada distinta).

## 2. 🆕 Actualización del directorio — Excel del 2026-07-09

Se comparó el Excel actualizado contra el `staff.json` anterior (2026-07-06) y se aplicaron estos cambios:

- **Bajas (ya no están en el Excel, se removieron del directorio):** Alicia Nunez, Luis Rodriguez.
- **Movimiento de categoría:** Yisel Rosario pasó de "Independent Agents" (Allcare Mar directo) a agente de **JPM Solutions**.
- **Nuevos estados con licencia agregados** (antes `PENDIENTE`): Karitssa Barry (NJ), Patricia Sixon (NJ,NY,FL,DE,AL), Yisel Rosario (NJ,PA), **Julian Vega** (NJ,NY,TX,PA,FL,DE,AL) — este último también se actualizó en su tarjeta de Líder en `index.html` (antes mostraba "—").
- **Corrección de nombre:** "Ana Christopher" → **"Ana Michelle Christopher"** (nombre completo según Excel; coincide con el archivo de foto).
- **Total actual del directorio:** 6 office staff + 28 agentes directos + 35 agentes de agencias asociadas (JPM 4, GW 6, Martell 7, KMRA 8, Top Tier 4, AMC 6) = **69 personas** (antes 71).

## 3. 🆕 Fotos de agentes — 62 de 69 subidas (primera tanda)

- **Origen:** carpeta `Agent Picture\` en Google Drive (fotos con nombre completo, formatos jpg/jpeg/JPG/png, variando en tamaño de 8KB a 2MB).
- **Procesamiento aplicado a cada foto:** detección facial automática (OpenCV Haar Cascade) → recorte cuadrado centrado en el rostro (con margen para cabello/frente) → resize a 300×300px → export a **`.webp`** calidad 80.
- **Resultado:** 62 archivos, ~6.7 KB promedio, **556 KB en total** — carga liviana tanto en `index.html` (staff) como en `agents.html` (71 tarjetas). El CSS ya usa `object-fit:cover` + `border-radius:50%`, así que el cuadrado se recorta a círculo automáticamente en el navegador.
- **Nomenclatura:** `/agentes/{slug-del-nombre}.webp`, exactamente igual al campo `image` de `staff.json` — coincide con la convención que ya existía en el código.
- **Fallback automático ya existente en el código (`onerror`):** si una imagen no carga (404, nombre no coincide), el círculo muestra las **iniciales** automáticamente. No se tocó ese mecanismo — sigue funcionando igual.
- **Coincidencias no exactas resueltas manualmente (alta confianza, mismo apellido/email):**
  - `Marcos Rodriguez.jpg` → `marcos-rodriguez-martinez.webp`
  - `Glorievette Giunto.jpg` (typo en el archivo) → `glorivette-giunto.webp`
  - `Ana Michelle Christopher.jpg` → coincide directo tras corregir el nombre en staff.json.
- **Personas SIN foto todavía (siguen con iniciales, 7 de 69):** Aurelyn Castillo, Jorge Rodriguez, Yissela Velazquez, Marilyn Gamboa, Amanda Ortiz, Margot Flores, Gary Chicnes.
- **Nota de calidad:** la foto de Jessica Dominguez es un selfie muy cerrado (recorte facial queda casi pegado a la cara) — el resto salieron bien encuadradas. Si el socio consigue una foto tipo retrato/profesional de ella, se puede reprocesar.

## 4. 🚀 SITIO 100% EN PRODUCCIÓN — CORTE DE DNS + CLOUDFLARE COMPLETADOS

**`https://www.allcaremar.com/` sirve el sitio nuevo de Allcare Mar, con Cloudflare de por medio.** Verificado sin errores.

- **DNS real: Cloudflare.** Nameservers: `david.ns.cloudflare.com` / `destiny.ns.cloudflare.com`.
- `A` `allcaremar.com` → IPs de GitHub Pages, Proxied. `CNAME` `www` → `allcaremar.github.io`, Proxied.
- SSL/TLS Cloudflare en modo **"Full"**. GitHub Pages con dominio custom y certificado Let's Encrypt activo.

## 4.1 ✅ PASO 5 COMPLETADO (2026-07-09) — Agent Login activado

- Proyecto de Google Cloud: **`Allcare-Mar-Web`**. Branding (consent screen): **"Allcare Mar Intranet"**. Audiencia: **Internal** (confirmado por el socio — bloquea cualquier cuenta que no sea @allcaremar.com directo en la pantalla de Google).
- **OAuth Client ID configurado en `google-config.js`:**
  `564752963603-nanb8q4atdnmrl70s4mg8ljom7md3336.apps.googleusercontent.com`
- **Authorized JavaScript origins:** `https://www.allcaremar.com`.
- `WORKSPACE_DOMAIN` = `allcaremar.com` (sin cambios, ya estaba correcto).
- Verificado: `login.html` carga sin errores de JS con el nuevo `google-config.js` (el botón de Google Sign-In en sí solo se puede probar en producción con internet real, no en el entorno de pruebas).
- **Pendiente:** el socio debe subir `google-config.js` al repo de GitHub y probar el login real con una cuenta @allcaremar.com desde `https://www.allcaremar.com/login.html`.

## 4.2 ✅ COMPLETADO (2026-07-09, noche) — Rediseño total de `dashboard-agentes.html`

Reemplazado por completo el panel privado de agentes (antes header superior + 7 botones placeholder `href="#"`). Ahora:

- **Layout nuevo: Sidebar fija** (no header), con colores corporativos (gradiente `--blue-dark`→`--blue`), responsiva — en pantallas ≤900px la barra lateral colapsa a una franja superior horizontal y el menú de navegación interno se oculta (queda el toggle de idioma + logout siempre visibles).
- **Botón "Cerrar Sesión / Logout"** ahora redirige a **`index.html`** (antes iba a `login.html` — cambio deliberado pedido por el socio).
- **Sección 1 — "Agencia y Logística"**: 6 tarjetas con enlaces reales (ya no placeholders), extraídos directamente del sitio viejo `https://sites.google.com/allcaremar.com/allcaremaragency/agents-portal`:
  - Conference Room - 546 Office → `calendar.app.google/eYGK81gqAonoFSkY6`
  - IT - Ticket → `form.jotform.com/250776977609173`
  - Sprinter / Van Reservations → `calendar.app.google/tsgeZzUyYEaUzfTdA`
  - Agents Contact List → Google Drive (PDF/doc del directorio)
  - Training Videos → subpágina del Google Site
  - Support Materials → subpágina del Google Site
- **Sección 2 — "Medicare Portals"**: cuadrícula de 8 tarjetas grandes con enlaces oficiales de cada aseguradora (investigados vía búsqueda web, dominios oficiales de primera parte): UnitedHealthcare (UHC Jarvis), Humana, Wellcare, Aetna, Jefferson Health Plans, Devoted, Horizon (BCBSNJ), Healthfirst.
  - ✅ **Corrección aplicada (2026-07-09, noche) según indicación directa del socio:** *Healthfirst* es la aseguradora de **Nueva York** (`healthfirst.org/brokers`), no la de Florida — corregido (antes tenía `hf.org` por error de criterio). *Jefferson* confirmado como **"Jefferson Health Plans"** — se mantuvo el enlace a la página de recursos para brokers (`jeffersonhealthplans.com/medicare/broker-resources.html`) y se actualizó el nombre visible en la tarjeta.
- **Sección 1 ampliada** con 4 herramientas adicionales pedidas por el socio (ahora 10 en total): Berwick Insurance (`berwickinsurance.com/login/`), Integrity Connect (`integrity.com/integrityconnect/`), Integrity Connect Leads (`integrity.com/leads/`), T65.app (`t65.app/login.php`).
- **Los 18 enlaces (10 + 8) abren en pestaña nueva** (`target="_blank" rel="noopener"`) para que el agente nunca pierda su dashboard principal.
- Se preservó intacta la lógica de seguridad de sesión (`guard()` — valida `acm_gsession` contra `WORKSPACE_DOMAIN` de `google-config.js`, expiración y dominio; redirige a `login.html` si falla) y el toggle de idioma EN/ES.
- **Verificado con Playwright headless:** sin sesión → redirige a `login.html` ✅; con sesión válida → carga y muestra nombre/email del agente ✅; los 18 enlaces tienen el `href` correcto y `target="_blank"` ✅; cero errores de consola/página ✅.

## 4.3 ✅ COMPLETADO (2026-07-09, noche) — Link de inscripción de Marcos Rodriguez-Martinez

- Tanto la tarjeta de **Marcos Rodriguez** en `index.html` (sección "Our Team") como la de **Marcos Rodriguez-Martinez** en `agents.html` (Independent Agents) ahora son **clicables**: al hacer clic redirigen a `https://www.planenroll.com/?purl=Marcos-Rodriguez-Martinez`, **abriendo en pestaña nueva** (mismo patrón `target="_blank"` usado en `dashboard-agentes.html`) para que el visitante no pierda el sitio principal de Allcare Mar.
- El enlace de email (`mailto:`) dentro de la tarjeta sigue funcionando de forma independiente (no dispara el enlace de inscripción por accidente).
- Accesible: la tarjeta tiene `role="link"`, `tabindex`, `aria-label`, y responde tanto a clic de mouse como a teclado (Enter/Espacio).
- En `agents.html` el mecanismo se implementó de forma general (`AGENT_ENROLL_URLS`), así que si en el futuro se necesita el mismo comportamiento para otro agente, basta con agregar su nombre exacto y URL a ese objeto — no requiere tocar la lógica.
- Verificado con Playwright: el clic dispara `window.open()` con la URL y `target="_blank"` correctos en ambas páginas; el resto de las 62 tarjetas de agentes no se vieron afectadas; cero errores de consola.

## 4.4 ✅ COMPLETADO (2026-07-09, noche) — 4 correcciones finales pedidas por el socio

1. **Menú desplegable "Medicare" / "Resources" no dejaba seleccionar la opción:** el menú se cerraba al mover el cursor hacia abajo porque había un hueco de 8px sin elemento entre el botón y el menú (el hover se perdía en ese hueco). Corregido usando `padding-top` en vez de un hueco posicional, así el área "hover" queda contigua entre el botón y el menú — ahora se puede bajar el cursor en diagonal sin que se cierre. Verificado con Playwright simulando el movimiento real del mouse paso a paso.
2. **Mapa de EE.UU. con forma muy tosca ("dibujo de niño"):** se rediseñó el contorno de fondo (marca de agua). Antes se generaba una curva Catmull-Rom sobre los mismos puntos aproximados de los círculos de estados (que no estaban pensados para trazar un contorno, solo para leerse bien), lo que producía picos y nudos raros. Ahora usa un conjunto de puntos de contorno propios más detallado, suavizado con el algoritmo de Chaikin (subdivisión de esquinas) — un método más predecible que no genera los rebotes/bucles de Catmull-Rom. El resultado es una silueta reconocible de EE.UU. (con la península de Florida y el golfo de Texas marcados) sin depender de ningún archivo o mapa externo. Verificado visualmente con captura de pantalla.
3. **Sección "Nuestro Equipo":** se agregó el teléfono a los 3 líderes (Marcos Rodriguez (201) 987-1097, Maria Santiago (201) 987-1079, Julian Vega (201) 710-7752, todos como enlace `tel:` clicable) tomados de `staff.json`. Las tarjetas del personal de oficina (Jessica Dominguez, Mariel Capellan, Karen Perez, Jesus Cabreja, Aurelyn Castillo, Waldo Martinez) ahora muestran **Ext. + email** (sin teléfono, tal como se pidió) — antes no mostraban ningún dato de contacto.
4. **Bug de idioma en `agents.html`:** los agentes sin estados de licencia confirmados (marcados internamente como `PENDIENTE` en `staff.json`) mostraban literalmente la palabra en español "PENDIENTE" también en la versión en inglés del sitio. Corregido: ahora se traduce correctamente — "Pending" en inglés, "Pendiente" en español. Verificado en ambos idiomas con Playwright (ya no aparece "PENDIENTE" sin traducir en ningún idioma).

## 5. Pendientes que NO bloquean

- Subir `google-config.js` (Client ID nuevo) al repo — ver 4.1.
- 7 personas sin foto todavía (ver lista arriba) — quedan con iniciales, es correcto y no es un error.
- Confirmar "Enforce HTTPS" marcado en GitHub Pages.
- Auditoría de contenido del Google Site viejo (PASO 7 del roadmap) — no bloquea.

## 6. Siguiente paso exacto

1. Subir `google-config.js` al repo de GitHub (reemplazar el archivo existente).
2. Abrir `https://www.allcaremar.com/login.html` y probar el login real con una cuenta @allcaremar.com — confirmar que redirige a `dashboard-agentes.html` y que una cuenta fuera del dominio es rechazada.
3. Revisar el nuevo `dashboard-agentes.html` en producción (sidebar, 10 herramientas + 8 portales Medicare) una vez subido al repo.
4. Cuando el socio tenga fotos de las 7 personas faltantes (ver sección 3), seguir la misma convención `/agentes/{slug}.webp` y reprocesar con el mismo pipeline (recorte facial → 300×300 → webp).

El formulario "Tell Us About You" (PASO 3) ya está resuelto y verificado end-to-end.
