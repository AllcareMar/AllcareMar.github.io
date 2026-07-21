# Estado del Proyecto — Allcare Mar Agency Website

Última actualización: 2026-07-20 (sesión larga, varias rondas). Sesión cerrada aquí a pedido de Jesus — él va a subir todo al repo real más tarde. Continúa en la próxima sesión con este archivo como memoria.

**Socio / interlocutor:** Jesus. Dirigirse a él por su nombre en cada respuesta.

## 0. ⚠️ Hallazgo importante sobre el flujo de publicación — leer antes de tocar archivos

La carpeta `C:\Users\jicab\Claude\Projects\Allcaremar.com New Site\` (donde Claude lee/escribe todo) **NO tiene carpeta `.git`** (confirmado con `device_bash` esta sesión: `git status` → "not a git repository"). O sea, esa carpeta **no es el clon real del repo** — es una carpeta de trabajo. Jesus copia/sube estos archivos a otro lado (posiblemente otra carpeta con GitHub Desktop, o directo a github.com) para hacer el commit+push real. Esto explica por qué a veces un cambio "no aparece" en el sitio en vivo aunque el archivo en esta carpeta ya esté correcto: el paso de copiar-a-la-carpeta-real-y-pushear es manual y puede saltarse un archivo.

**Para la próxima sesión:** cuando Jesus diga que ya subió todo, verificar el sitio en vivo (`https://www.allcaremar.com`) con WebFetch (HTML/texto — no puede leer imágenes binarias) para confirmar que los cambios de HTML llegaron, y preguntarle a Jesus si además confirmó visualmente los logos/imágenes (esos no se pueden verificar por WebFetch).

**Bug de `device_commit_files` — ya resuelto en el flujo de trabajo:** la herramienta SÍ escribe bien en disco. El único bug real es que `device_stage_files` puede devolver contenido cacheado/viejo si el mismo path ya se leyó antes en la sesión. **Verificar SIEMPRE con `device_list_dir`** (tamaño en bytes + mtime) después de un `device_commit_files`, nunca con `device_stage_files` sobre un path ya leído.

## 1. Estado actual de los archivos (todos escritos en esta carpeta de trabajo, PENDIENTE que Jesus los suba al repo real)

- **`staff.json`** — 29 independientes + 35 en 6 agencias socias + 6 oficina = 70 personas. Sincronizado con `Agent-Contact-Website.xlsx` (fuente autoritativa). Cada agente vendedor tiene `carriers` (slugs) y, si aplica, `planenroll` (URL de PlanEnroll, 15 agentes la tienen).
- **`agents.html`** — directorio con búsqueda por nombre + filtro por carrier (`?carrier=slug`). Botón de perfil por agente lee `a.planenroll` de `staff.json` (ya no hay mapeo hardcodeado). `CARRIER_NAMES` cubre los 15 carriers.
- **`index.html`** — sección "Top Carriers": un solo carrusel auto-scroll con las 15 tarjetas (antes eran 6 en grid + un ticker de texto separado, ambos reemplazados). Sin subtítulos de producto (se quitaron a pedido de Jesus) y logos más grandes (76px alto desktop / 58px móvil, antes 52px/40px).
- **`assets/img/carriers/`** — 15 logos `.webp`: los 6 originales (UnitedHealthcare, Aetna, Humana, Devoted Health, Jefferson Health) sin tocar + Horizon actualizado (logo nuevo que mandó Jesus) + 9 nuevos (Anthem, Cigna, EmblemHealth, Fidelis, Healthfirst, Molina Healthcare, SCAN Health Plan, Wellcare, Wellpoint).
- **`agentes/`** — se agregaron 3 fotos nuevas: `diego-zetina.webp`, `glorie-alicea.webp`, `jorge-rodriguez.webp` (recorte automático cabeza/hombros centrado en rostro, 300×300, mismo estilo que las demás). Queda huérfano `michael-ocasio.webp` (agente que ya no está en `staff.json`) — no rompe nada, se puede borrar cuando Jesus quiera.
- **`Agent-Contact-Website.xlsx`** (en `J:\My Drive\Operations\Website-Claude\`) — celda de instrucciones (H1) actualizada con códigos cortos por carrier (ver sección 2).

## 2. Códigos cortos para la columna "Carriers" del Excel

`AET`=Aetna · `HUM`=Humana · `DEV`=Devoted Health · `JEF`=Jefferson Health · `HOR`=Horizon · `ANT`=Anthem · `CIG`=Cigna · `EMB`=EmblemHealth · `FID`=Fidelis Care · `HF`=Healthfirst · `MOL`=Molina Healthcare · `SCAN`=SCAN Health Plan · `WC`=Wellcare · `WP`=Wellpoint

Ejemplo con los 15: `AET, HUM, DEV, JEF, HOR, ANT, CIG, EMB, FID, HF, MOL, SCAN, WC, WP`. El script que regenera `staff.json` acepta estos códigos Y los nombres completos de antes (compatibilidad total).

## 3. ⚠️ Pendiente importante — Carriers sin agentes asignados

Los 9 carriers nuevos no tienen ningún agente asignado todavía en el Excel — sus tarjetas en el carrusel llevan a `agents.html?carrier=X` con "Showing 0 agents" (decisión ya tomada con Jesus: se deja así, banner + link para ver todos, en vez de ocultar el botón). Cuando Jesus llene la columna Carriers con los códigos nuevos para algún agente, avisar para regenerar `staff.json`.

## 4. Notas técnicas para no repetir errores

- **Recorte de fotos de agentes:** el script de recorte por rostro (OpenCV Haar cascade + crop cuadrado 300×300) tenía un bug — cuando el ancho de la imagen fuente obligaba a reducir el tamaño de recorte ideal, el "headroom" (espacio arriba de la cabeza) se calculaba ANTES de aplicar esa reducción, resultando en recortes que cortaban la parte superior de la cabeza (pasó con la foto de Diego Zetina). Fix: calcular el headroom SIEMPRE después de aplicar el límite de tamaño final. Ya corregido y verificado visualmente.
- **Procesamiento de logos de carriers:** recorte de fondo blanco/transparente + padding uniforme + export a `.webp`. Ojo con archivos que tengan un marco delgado de 1-4px de color sólido pegado al borde (pasó con `healthfirst.png`) — el trim debe recortar unos px de margen fijo antes de detectar el bounding box de contenido, si no ese marco queda incluido como si fuera parte del logo.

## 5. Pendientes que NO bloquean

- Subir `google-config.js` (Client ID) al repo — pendiente de varias sesiones atrás.
- Confirmar "Enforce HTTPS" marcado en GitHub Pages.
- Verificación visual real del sitio en un móvil físico.
- Borrar `agentes/michael-ocasio.webp` (huérfano, opcional).
- Si Jesus quiere subtítulos de producto más específicos por carrier nuevo (en vez de sin subtítulo, ahora que se quitaron todos), pedírselos.

## 6. Siguiente paso exacto (arrancar aquí en la próxima sesión)

1. **(Prioridad #1)** Jesus dijo que va a subir todo al repo real "más tarde" — confirmar que ya lo hizo, y verificar `https://www.allcaremar.com` con WebFetch (HTML) para confirmar que el carrusel de 15 carriers sin subtítulos y con logos grandes ya está en vivo. Preguntarle específicamente si el logo de Horizon ya se ve actualizado (esto no se puede verificar por WebFetch, solo él lo puede confirmar visualmente).
2. Si algo no llegó al repo real, volver a entregar por chat el archivo puntual (todos quedaron guardados en esta carpeta de trabajo como respaldo).
3. Jesus llena la columna Carriers del Excel para los 9 carriers nuevos cuando tenga agentes que asignarles (usar códigos cortos, sección 2) → regenerar `staff.json`.
4. Subir `google-config.js` al repo.
