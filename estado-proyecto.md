# Estado del Proyecto — Allcare Mar Agency Website

Última actualización: 2026-07-09.

## 1. Archivos listos y aprobados

- **`index.html`, `login.html`, `dashboard-agentes.html`, `agents.html`** — ✅ LISTOS, en el repo de GitHub.
- **`staff.json`** — ✅ ACTUALIZADO 2026-07-09 desde `Agent-Contact-Website.xlsx` (fuente autoritativa entregada por el socio ese mismo día). Listo para subir/reemplazar en el repo.
- **`/agentes/*.webp`** — ✅ NUEVO. 62 fotos reales de agentes/staff procesadas y listas para subir al repo (ver sección 2).
- **Repo:** `github.com/AllcareMar/AllcareMar.github.io` — GitHub Pages activo (branch `main`/root).
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

## 5. Pendientes que NO bloquean

- Subir a GitHub: `staff.json`, `index.html` (actualizados hoy) y la carpeta `/agentes/` con las 62 fotos nuevas.
- 7 personas sin foto todavía (ver lista arriba) — quedan con iniciales, es correcto y no es un error.
- **"Agent Login"** no funciona — `GOOGLE_CLIENT_ID` en `google-config.js` sigue sin configurar. **PASO 5 pendiente.**
- Los 7 botones del dashboard siguen siendo placeholders (`href="#"`).
- Confirmar "Enforce HTTPS" marcado en GitHub Pages.

## 6. Siguiente paso exacto

1. Subir al repo `github.com/AllcareMar/AllcareMar.github.io`: reemplazar `staff.json` e `index.html`, y agregar la carpeta `/agentes/` completa (62 archivos `.webp`).
2. Esperar el despliegue de GitHub Pages (1-2 min) y verificar en `https://www.allcaremar.com/` y `/agents.html` que las fotos cargan dentro de los círculos y que Julian Vega ya muestra sus estados con licencia.
3. Cuando el socio tenga fotos de las 7 personas faltantes (ver sección 3), seguir la misma convención `/agentes/{slug}.webp` y reprocesar con el mismo pipeline (recorte facial → 300×300 → webp).
4. Continuar con PASO 5 (OAuth Google Workspace) — ver `ROADMAP.md`.

El formulario "Tell Us About You" (PASO 3) ya está resuelto y verificado end-to-end.
