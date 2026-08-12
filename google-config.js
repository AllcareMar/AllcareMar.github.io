// ============================================================================
// Allcare Mar Agency — Google Sign-In (Google Identity Services) configuration
// ============================================================================
// 1. Go to https://console.cloud.google.com and select/create the project
//    linked to your allcaremar.com Google Workspace.
// 2. APIs & Services -> OAuth consent screen -> User Type: EXTERNAL
//    (cambiado de INTERNAL a EXTERNAL para permitir la excepcion de
//    EXTRA_ALLOWED_EMAILS abajo — Carlos Perez usa un Gmail personal, no una
//    cuenta @allcaremar.com. La restriccion real de acceso NO depende de este
//    ajuste de Google: la aplica el codigo de cada pagina via isEmailAllowed()
//    abajo, verificando el dominio + esta lista de excepciones).
// 3. APIs & Services -> Credentials -> Create Credentials -> OAuth client ID
//    -> Application type: Web application.
// 4. Add Authorized JavaScript origins: your GitHub Pages URL
//    (e.g. https://yourorg.github.io) and http://localhost:PORT for testing.
// 5. Copy the Client ID below. See GOOGLE_SETUP.md for the full guide.
// ============================================================================

export const GOOGLE_CLIENT_ID = "564752963603-nanb8q4atdnmrl70s4mg8ljom7md3336.apps.googleusercontent.com";
export const WORKSPACE_DOMAIN = "allcaremar.com";

// Excepciones al dominio @allcaremar.com en todo el sitio (login, dashboard,
// resources, firma-requerida): agentes reales que usan un Gmail personal en
// vez de cuenta de Workspace. Pedido explicito de Jesus.
// - carloshealthagent@gmail.com: Carlos Perez.
// - glendahealthagent@gmail.com: Glenda Colon, lider de GW Ins Group LLC
//   (agregado 2026-08-10 - sin esto, tampoco podia entrar al dashboard de
//   agentes, aunque ya esta en staff.json/roster de GW).
export const EXTRA_ALLOWED_EMAILS = ["carloshealthagent@gmail.com", "glendahealthagent@gmail.com"];

// Verdadero si el email puede entrar al ecosistema de agentes: dominio
// @allcaremar.com, o esta en la lista de excepciones de arriba. Esta es la
// verificacion "amplia" (cualquier cuenta de la empresa) - usada por login.html,
// dashboard-agentes.html, resources.html, firma-requerida.html y
// agent-tools/assets/js/agent-api-session.js como primer filtro y para
// revalidar la sesion guardada en cada carga de pagina.
export function isEmailAllowed(email) {
  const e = (email || "").toLowerCase();
  const domain = e.split("@")[1] || "";
  if (domain === WORKSPACE_DOMAIN.toLowerCase()) return true;
  return EXTRA_ALLOWED_EMAILS.map(x => x.toLowerCase()).includes(e);
}

// Correos administrativos/compartidos que deben poder entrar al dashboard de
// agentes aunque no sean una persona individual listada en staff.json.
// Agregar aqui, no a staff.json (eso lo pondria en el carrusel publico del
// sitio - staff.json es una lista de exhibicion, no de control de acceso).
// - info@allcaremar.com: casilla que administra Sales/Events.
// - epeguero@allcaremar.com: admin de Form-Carriers (carriers/index.html,
//   carriers/dashboard.html) y de Contracting (contracting reports) - no
//   tiene entrada propia en staff.json.
// Si aparece otro admin de algun modulo que tampoco este en staff.json,
// agregarlo aqui tambien.
export const DASHBOARD_ADMIN_EMAILS = ["info@allcaremar.com", "epeguero@allcaremar.com"];

// Verdadero/false/null (null = no se pudo verificar, ej. red caida) segun si
// `email` puede entrar al dashboard de agentes: esta en staff.json
// (office_staff, independent_agents, o algun agente de partner_agencies) o
// es uno de los DASHBOARD_ADMIN_EMAILS de arriba. A diferencia de
// isEmailAllowed() (solo dominio), esto exige estar realmente en el roster
// de personal - pedido explicito de Jesus (2026-08-10) para que un correo
// @allcaremar.com de otro departamento, sin relacion con agentes/oficina, no
// pueda entrar solo por tener cuenta de Workspace.
//
// Se llama UNA sola vez, en el momento real del login (login.html) - no en
// cada guard() de las demas paginas. La sesion local de 15 dias ya confia en
// ese resultado, igual que ya confia en el dominio verificado por
// isEmailAllowed(). Efecto secundario: si alguien se retira de staff.json,
// una sesion ya activa en su navegador sigue funcionando hasta que expire
// (o cierre sesion) - la revocacion inmediata solo se logra desactivando su
// cuenta de Google Workspace.
export async function isDashboardRosterAllowed(email) {
  const e = (email || "").toLowerCase();
  if (DASHBOARD_ADMIN_EMAILS.map(x => x.toLowerCase()).includes(e)) return true;
  try {
    const resp = await fetch("/staff.json", { cache: "no-store" });
    if (!resp.ok) return null;
    const data = await resp.json();
    if ((data.office_staff || []).some(p => (p.email || "").toLowerCase() === e)) return true;
    if ((data.independent_agents || []).some(p => (p.email || "").toLowerCase() === e)) return true;
    for (const agency of (data.partner_agencies || [])) {
      if ((agency.agents || []).some(p => (p.email || "").toLowerCase() === e)) return true;
    }
    return false;
  } catch (err) {
    return null;
  }
}
