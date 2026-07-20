# Estado del Proyecto — Allcare Mar Agency Website

Última actualización: 2026-07-20. Sesión activa — continúa en la próxima sesión con este archivo como memoria.

**Socio / interlocutor:** Jesus. Dirigirse a él por su nombre en cada respuesta.

## 0. 🆕 Actualización sobre el bug de `device_commit_files` (2026-07-20)

La sesión del 2026-07-14 documentó que `device_commit_files` reportaba éxito sin escribir realmente en el repo. Hoy se repitió la prueba con verificación estricta y el resultado fue distinto:

- `device_commit_files` escribió `index.html`, `agents.html`, `staff.json` + 10 `.webp` en `assets/img/carriers/` directo en `C:\Users\jicab\Claude\Projects\Allcaremar.com New Site\`.
- **Verificación con `device_stage_files` + md5 dio FALSO NEGATIVO** (mostró contenido viejo) — pero **`device_list_dir` mostró tamaños en bytes y `mtime` exactos y frescos, coincidiendo byte-a-byte con los archivos entregados**. Conclusión: el archivo en disco SÍ se actualizó; lo que falló fue el caché de lectura de `device_stage_files` dentro de la misma sesión (probablemente porque esos mismos paths ya se habían leído antes en la sesión).
- **Método de verificación correcto de ahora en adelante:** usar `device_list_dir` (tamaño en bytes + mtime) para confirmar una escritura reciente, NO volver a `device_stage_files` sobre el mismo path en la misma sesión.
- Aun así, se entregaron TODOS los archivos por chat (`SendUserFile`) como respaldo — si Jesus ve algo raro en el repo, puede reemplazarlos manualmente arrastrándolos desde el chat.
- **Pendiente de Jesus:** confirmar visualmente que `index.html`/`agents.html` en su carpeta ya tienen el carrusel nuevo, y hacer commit + push al repo.

## 1. Archivos entregados esta sesión (2026-07-20) — ya escritos en disco (ver punto 0), falta commit + push

- **`staff.json`** — regenerado desde `Agent-Contact-Website.xlsx` (fuente autoritativa actualizada por Jesus el 2026-07-20). Cambios: 2 agentes removidos (**Yissela Velazquez** — ya no está en el Excel de independientes; **Michael Ocasio** — ya no está en AMC Care Group), 27 agentes de las agencias socias (GW Ins Group, Martell, KMRA, Top Tier, AMC) pasaron de `licensed_states: ["PENDIENTE"]` a estados reales, **fix de bug**: Marcos Rodriguez-Martinez ya tenía Aetna/Humana/Devoted Health en `carriers` pero le faltaba `jefferson-health` (el Excel sí lo listaba) — corregido, y ahora **Jefferson Health ya no muestra 0 agentes**. Nuevo campo opcional **`planenroll`** (URL) en 15 agentes, tomado de la columna G "Link Plan Enroll" del Excel. Total: 29 independientes + 35 en agencias socias + 6 oficina = 70 personas (antes 72).
- **`agents.html`** — el botón de perfil de cada tarjeta (ícono ↗) ya no depende de un objeto hardcodeado (`AGENT_ENROLL_URLS`, que solo tenía a Marcos); ahora lee `a.planenroll` directo de `staff.json` — los 15 agentes con link activo lo tienen automáticamente, y si Jesus agrega más en el Excel, el botón se activa solo con solo regenerar `staff.json`. `CARRIER_NAMES` ampliado con los 9 carriers nuevos (ver punto 2) para que el banner de filtro (`?carrier=`) muestre el nombre correcto.
- **`index.html`** — sección "Top Carriers" rediseñada: la grid estática de 6 tarjetas + el ticker de texto de abajo se reemplazaron por **un solo carrusel auto-scroll** con las 15 tarjetas de carriers (logo + subtítulo + botón "View Agents"), pista duplicada para loop infinito sin salto visible, se pausa al pasar el mouse. Verificado con Playwright (desktop 1440px, mobile 390px, y el punto exacto del loop) que no hay overflow ni salto en la animación.
- **10 logos nuevos/actualizados** en `assets/img/carriers/` (recorte de fondo + padding uniforme + `.webp`, mismo proceso que los 6 originales): `horizon.webp` (logo actualizado que envió Jesus, reemplaza el anterior), `anthem.webp`, `cigna.webp`, `emblemhealth.webp`, `fidelis.webp`, `healthfirst.webp`, `molina-healthcare.webp`, `scanhealth.webp`, `wellcare.webp`, `wellpoint.webp`. Los 5 restantes (UnitedHealthcare, Aetna, Humana, Devoted Health, Jefferson Health) no se tocaron.

## 2. Decisiones tomadas esta sesión (con Jesus)

- **Anthem y Wellpoint van como 2 tarjetas separadas** (son marcas distintas de Elevance Health).
- **Carrusel = auto-scroll continuo tipo cinta** (no manual con flechas), igual mecánica que tenía el ticker viejo.
- **Los 9 carriers nuevos se dejan con el botón "View Agents" activo** aunque hoy no tengan agentes asignados (mismo comportamiento que ya tenían Jefferson Health/Horizon: banner "Showing 0 agents" + link para ver todos).
- **Orden del carrusel:** los 6 originales primero (ya tienen agentes vinculados), luego los 9 nuevos en orden alfabético.
- Subtítulo de las 9 tarjetas nuevas: se dejó genérico **"Medicare Advantage"** para no inventar detalles de producto por carrier (Jesus puede pedir subtítulos más específicos si quiere, ej. "Medicare Advantage · Part D" para Cigna).

## 2.1 🆕 Códigos cortos para la columna "Carriers" del Excel (2026-07-20)

Para no escribir nombres largos (imaginar a Marcos con los 15 carriers), la celda H1 de `Agent-Contact-Website.xlsx` ahora pide **códigos cortos** en vez de nombres completos:

`AET=Aetna | HUM=Humana | DEV=Devoted Health | JEF=Jefferson Health | HOR=Horizon | ANT=Anthem | CIG=Cigna | EMB=EmblemHealth | FID=Fidelis Care | HF=Healthfirst | MOL=Molina Healthcare | SCAN=SCAN Health Plan | WC=Wellcare | WP=Wellpoint`

Ejemplo para un agente con los 15: `AET, HUM, DEV, JEF, HOR, ANT, CIG, EMB, FID, HF, MOL, SCAN, WC, WP`. El script que regenera `staff.json` (`parse_carriers()`) acepta tanto estos códigos como los nombres completos de antes (compatibilidad), así que no rompe nada de lo ya escrito en el Excel.

## 3. ⚠️ Pendiente importante — Carriers sin agentes asignados

Los 9 carriers nuevos (Anthem, Cigna, EmblemHealth, Fidelis Care, Healthfirst, Molina Healthcare, SCAN Health Plan, Wellcare, Wellpoint) **no tienen ningún agente asignado todavía** — la columna "Carriers" del Excel (celda H1 con instrucciones) solo listaba como valores válidos: Aetna, Humana, Devoted Health, Jefferson Health, Horizon. **Sugerencia:** la próxima vez que Jesus edite el Excel, actualizar esa celda de instrucciones para incluir los 9 nombres nuevos exactos (Anthem, Cigna, EmblemHealth, Fidelis Care, Healthfirst, Molina Healthcare, SCAN Health Plan, Wellcare, Wellpoint) para que pueda empezar a asignarlos por agente.

## 4. Pendientes que NO bloquean (heredados de sesión anterior)

- Subir `google-config.js` (Client ID) al repo — pendiente de hace 2+ sesiones.
- Confirmar "Enforce HTTPS" marcado en GitHub Pages.
- Verificación visual real del sitio en un móvil físico.
- Fotos para agentes/staff sin foto (quedan con iniciales, es correcto).

## 5. Siguiente paso exacto (arrancar aquí en la próxima sesión)

1. **(Prioridad #1)** Confirmar con Jesus que `index.html`, `agents.html`, `staff.json` y los 10 `.webp` en `assets/img/carriers/` ya están correctos en `C:\Users\jicab\Claude\Projects\Allcaremar.com New Site\` (ver punto 0 — probablemente ya estén bien, solo falta confirmación visual) y hacer commit + push al repo.
2. Jesus decide si quiere actualizar la celda de instrucciones (H1) del Excel con los 9 carriers nuevos, para empezar a asignar agentes a Anthem, Cigna, etc.
3. Subir `google-config.js` al repo.
4. Si Jesus quiere subtítulos de producto más específicos por carrier nuevo (en vez de "Medicare Advantage" genérico), pedírselos.
