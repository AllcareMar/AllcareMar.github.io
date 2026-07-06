# Allcare Mar — Intranet de Agentes: Configuración de Google Workspace Sign-In

El acceso a la Intranet de Agentes (`login.html` → `dashboard-agentes.html`) se controla por completo
mediante inicio de sesión de Google restringido al dominio de Google Workspace `allcaremar.com`.
No existe un sistema separado de usuario/contraseña, base de datos, ni paso de aprobación manual —
si alguien tiene una cuenta activa de Google Workspace `@allcaremar.com`, puede iniciar sesión;
cuando TI desactiva esa cuenta de Workspace, su acceso a la intranet desaparece junto con ella.

Completa estos pasos una sola vez antes de publicar este repositorio.

## 1. Crea (o reutiliza) un proyecto de Google Cloud vinculado a tu Workspace

1. Ve a https://console.cloud.google.com — inicia sesión con tu cuenta admin `@allcaremar.com`.
2. Crea un proyecto nuevo (por ejemplo `allcaremar-intranet`), o reutiliza uno existente.

## 2. Configura la pantalla de consentimiento OAuth como INTERNAL — esta es la barrera de seguridad real

1. Ve a **APIs & Services → OAuth consent screen**.
2. Selecciona **User Type: Internal**. Esta opción solo aparece para organizaciones de Google
   Workspace, y significa que Google mismo rechaza cualquier intento de inicio de sesión que no
   sea de `allcaremar.com` en su propia pantalla de login — antes de que este sitio web reciba
   absolutamente nada. Este es el control de acceso principal, no solo la verificación de dominio
   del lado del cliente descrita más abajo.
3. Completa nombre de la app, correo de soporte, etc. Guarda los cambios.

## 3. Crea el OAuth Client ID

1. Ve a **APIs & Services → Credentials → Create Credentials → OAuth client ID**.
2. Tipo de aplicación: **Web application**.
3. En **Authorized JavaScript origins**, agrega la URL de tu GitHub Pages (por ejemplo
   `https://yourorg.github.io`) y, para pruebas locales, `http://localhost:PORT`.
4. Copia el **Client ID** generado dentro de `google-config.js` en este repositorio
   (variable `GOOGLE_CLIENT_ID`). Confirma que `WORKSPACE_DOMAIN` sea `allcaremar.com`.

## 4. Publica en GitHub Pages

1. Sube esta carpeta a un repositorio de GitHub.
2. Ve a **Settings → Pages → Deploy from branch** → selecciona `main` / `/ (root)`.
3. Una vez publicado, abre `login.html` en esa URL y confirma que el botón de Google se muestre
   e inicie sesión correctamente con una cuenta `@allcaremar.com`.

## Cómo funciona realmente el control de acceso

- **Pantalla de consentimiento OAuth de Google (User Type: Internal)** — la barrera real,
  aplicada del lado de Google. Una cuenta de Google que no sea de tu Workspace no puede
  completar el inicio de sesión en absoluto.
- **Verificación de dominio del lado del cliente** (`login.html`) — después de un inicio de
  sesión exitoso con Google, la página lee `email`, `email_verified` y el dominio del token
  firmado, y solo otorga una sesión si coincide con `allcaremar.com`. Si no coincide (o como
  respaldo si la pantalla de consentimiento llegara a configurarse mal como External), la
  página muestra: *"Acceso denegado. Sección exclusiva para personal autorizado de Allcare
  Mar."* y abre un `mailto:` hacia `info@allcaremar.com` y `jcabreja@allcaremar.com`
  reportando el correo que se usó.
- **`dashboard-agentes.html`** vuelve a verificar la sesión guardada (dominio y expiración del
  token) en cada carga, y cierra la sesión si alguna de las dos verificaciones falla.

### Limitación importante — léela antes de considerar esto totalmente seguro

Este sitio **no tiene backend**. La "sesión" del panel es un valor guardado en el
`sessionStorage` del navegador, y la verificación de dominio se hace analizando el token en el
navegador, no verificando su firma criptográfica contra las claves públicas de Google. En la
práctica:

- Sí se requiere un inicio de sesión real y válido de Google Workspace para llegar al panel de
  forma normal — esto no es evadible por un usuario común, y la pantalla de consentimiento
  Internal bloquea cuentas ajenas al Workspace del lado de Google de todas formas.
- Los siete botones del panel son enlaces de marcador de posición (`#`) sin datos reales detrás
  por ahora. Si más adelante los conectas a herramientas o datos reales (reportes, directorios,
  archivos), **ese backend deberá verificar por su cuenta la firma, el `audience` y el claim
  `hd`/dominio del token de Google del lado del servidor** — no confíes en la verificación del
  lado del cliente de esta página estática para proteger nada más allá de "no mostrar la
  cuadrícula de botones a la persona equivocada". Las verificaciones del lado del cliente son
  una barrera de experiencia de usuario, no una barrera de protección de datos.
