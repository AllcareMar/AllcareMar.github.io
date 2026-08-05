// ============================================================================
// Contracting & Onboarding — shared data + business logic
// Used by BOTH preview-contracting.html (the step-by-step form) and
// reports.html (the reporting dashboard), so the two never drift apart.
// Everything here is 100% in English, per internal convention — only the
// UI copy in each page's own <script> block gets translated (I18N).
// Source of truth: Tracker .xlsx (agencies/agents/progress) + reference-data/
// (staff.json for licenses, carriers-dashboard-source.html for carrier list
// and state restrictions). See estado-proyecto.md for full history/decisions.
// ============================================================================

// ---- The 10-step contracting checklist (per Jesus, 2026-08-03 + 2026-08-04) ----
// `sendEmailButton:true` -> renders a manual "Send Email" button on that row
// (per Jesus: steps 3/c, 6/f, 7/g, 8/h — steps 1/a and 10/j had their
// buttons removed per Jesus, 2026-08-06, so 4 remain). The button is a
// separate, explicit action, independent of marking the step complete.
// `file:true` (step 7/g only) -> renders an upload control restricted to
// image or PDF files.
const STEPS = [
  {key:'a', label:'Email Requested Berwick'},
  {key:'b', label:'Agent Contract Received'},
  {key:'c', label:'Agent Contract Signed', sendEmailButton:true},
  {key:'d', label:'Initial Email from Carriers'},
  {key:'e', label:'Email from Carrier Certifications'},
  {key:'f', label:'Completed Certifications', sendEmailButton:true},
  {key:'g', label:'Upload Certifications', file:true, sendEmailButton:true},
  {key:'h', label:'Carrier Welcome Email', sendEmailButton:true},
  {key:'i', label:'Berwick Welcome Email'},
  {key:'j', label:'Trainings'},
];

// ---- Who receives the automatic contracting emails, per step (updated
// 2026-08-05, per Jesus) — used only for the STATIC/mock preview's
// on-screen "sent to" confirmation text (see sendStepEmail() in
// preview-contracting.html); the real send in live mode reads from
// Code.gs's DEFAULT_EMAIL_RECIPIENTS / the Config sheet instead, which must
// be kept in sync with this manually since they're two separate files. CC
// (mrodriguez/acastillo/epeguero/info) isn't shown here, only the TO. ----
const EMAIL_RECIPIENTS = ['contracts@berwickinsurance.com', 'nicole.bojorquez@berwickinsurance.com', 'Adriana.Audino@berwickinsurance.com'];

// ---- Who is authorized to open preview-contracting.html / reports.html
// (Google Workspace login gate) — declared in assets/js/config.js instead
// (loaded before this file), NOT here. Having it in both files used to throw
// "Identifier 'AUTHORIZED_REPORT_EMAILS' has already been declared" and
// silently broke this entire file in production (2026-08-04, caught live by
// Jesus — see estado-proyecto.md). Keep this comment as a guardrail: do not
// re-add this const here. ----

// ---- Agencies + their designated leader (leaderAgentId represents the whole
// agency for hierarchy-gating purposes, per Jesus 2026-08-03) ----
let AGENCIES = {
  "allcare-mar-agency": {name:"Allcare Mar Agency", isMaster:true, leaderAgentId:"rodriguez-martinez-marcos", contractPhone:"9177670877", contractNpn:19758120, contractEmail:"info@allcaremar.com", level:"FMO", principal:"Marcos Rodriguez"},
  "jpm-solutions": {name:"JPM Solutions", isMaster:false, leaderAgentId:"vega-julian", contractPhone:"6467755910", contractNpn:21553123, contractEmail:"jvega824@gmail.com", level:"GA", principal:"Julian Vega"},
  "gw-ins-group-llc": {name:"GW Ins Group LLC", isMaster:false, leaderAgentId:"colon-glenda", contractPhone:"7874495964", contractNpn:20588838, contractEmail:"glendahealthagent@gmail.com", level:"MGA", principal:"Glenda Colon"},
  "top-tier-health-consultants": {name:"Top Tier Health Consultants", isMaster:false, leaderAgentId:"galarza-priscilla", contractPhone:"7187576047", contractNpn:20858905, contractEmail:"pgalarzabklyn1@gmail.com", level:"GA", principal:"Priscilla Galarza"},
  "martell-multi-service-llc": {name:"Martell Multi Service LLC", isMaster:false, leaderAgentId:"martell-ana", contractPhone:"8622320288", contractNpn:19973350, contractEmail:"martellmultiservice@gmail.com", level:"GA", principal:"Ana Martell"},
  "kmra-group-llc": {name:"KMRA Group LLC", isMaster:false, leaderAgentId:"pinzon-roland", contractPhone:"2012101266", contractNpn:20405407, contractEmail:"kmragroupllc@gmail.com", level:"MGA", principal:"Roland Pinzon"},
  "amc-care-group-llc": {name:"AMC Care Group LLC", isMaster:false, leaderAgentId:"christopher-ana", contractPhone:"7876037233", contractNpn:21476476, contractEmail:"tuvidasegurapr@gmail.com", level:"GA", principal:"Ana Christopher"},
  "nce-consulting-group": {name:"NCE CONSULTING GROUP", isMaster:false, leaderAgentId:"nathan-dominguez", contractPhone:"9735706218", contractNpn:22280165, contractEmail:"nceconsultinggroup2026@gmail.com", level:"GA", principal:"Nathan Dominguez"},
};

// ---- Agents (from Tracker .xlsx, base list: 8 agencies / 74 agents, +13
// new agents/LLC entities merged in from Bulk Upload Template.xlsx per
// Jesus, 2026-08-04 — 87 total. New entries use contractPhone/contractNpn/
// contractEmail (personal, carrier-registered contact info) instead of
// touching `email` (Google Workspace / site login address) — see sec. 22
// of estado-proyecto.md for the full reconciliation. ----
let AGENTS = {
  "arratia-araneda-nicole": {name:"Arratia Araneda, Nicole", agency:"allcare-mar-agency", email:"nicole_arratia@allcaremar.com", contractPhone:"4078797841", contractNpn:21365351, contractEmail:"n.arratia34.na@gmail.com", level:"Agent"},
  "ayala-negron-adriana": {name:"Ayala Negron, Adriana", agency:"allcare-mar-agency", email:"a.ayala@allcaremar.com", contractPhone:"7876305598", contractNpn:18693465, contractEmail:"adrianaayalanegron@gmail.com", level:"Agent"},
  "balgobin-iris": {name:"Balgobin, Iris", agency:"allcare-mar-agency", email:"iris.pina@allcaremar.com", contractPhone:"3522170461", contractNpn:20023702, contractEmail:"pinairis1978@outlook.com", level:"Agent"},
  "colon-perez-yaisha": {name:"Colon Perez, Yaisha", agency:"allcare-mar-agency", email:"yaisha.colon@allcaremar.com", contractPhone:"3523962994", contractNpn:20141057, contractEmail:"yaishahealthagent@gmail.com", level:"Agent"},
  "fernandez-jonathan": {name:"Fernandez, Jonathan", agency:"allcare-mar-agency", email:"jfernandez@allcaremar.com", contractPhone:"7323067601", contractNpn:10038794, contractEmail:"jfernandez456@gmail.com", level:"Agent"},
  "gil-ramon": {name:"Gil, Ramon", agency:"allcare-mar-agency", email:"rgil@allcaremar.com", contractPhone:"6463019813", contractNpn:21270640, contractEmail:"rgil25@icloud.com", level:"Agent"},
  "gray-tayler": {name:"Gray, Tayler", agency:"allcare-mar-agency", email:"tgray@allcaremar.com", contractPhone:"4846649898", contractNpn:22075036, contractEmail:"taylergray01@gmail.com", level:"Agent"},
  "hyman-ulysses": {name:"Hyman, Ulysses", agency:"allcare-mar-agency", email:"uhyman@allcaremar.com", contractPhone:"7187081569", contractNpn:21628567, contractEmail:"ulyhyman3@gmail.com", level:"Agent"},
  "liriano-felix": {name:"Liriano, Felix", agency:"allcare-mar-agency", email:"fliriano@allcaremar.com", contractPhone:"2019524765", contractNpn:15622164, contractEmail:"felixliriano31@gmail.com", level:"Agent"},
  "martin-alvorine": {name:"Martin, Alvorine", agency:"allcare-mar-agency", email:"amartin@allcaremar.com", contractPhone:"6319841094", contractNpn:18931592, contractEmail:"famehealthagent@yahoo.com", level:"Agent"},
  "monsalve-maria": {name:"Monsalve, Maria", agency:"allcare-mar-agency", email:"mmonsalve@allcaremar.com", contractPhone:"2017443748", contractNpn:20333792, contractEmail:"monsalvehealthagent@gmail.com", level:"Agent"},
  "munoz-francia": {name:"Munoz, Francia", agency:"allcare-mar-agency", email:"fmunoz@allcaremar.com", contractPhone:"2017242432", contractNpn:5701964, contractEmail:"fmcare.solutions@gmail.com", level:"Agent"},
  "peguero-ruiz-paola": {name:"Peguero Ruiz, Paola", agency:"allcare-mar-agency", email:"ppeguero@allcaremar.com", contractPhone:"3024092483", contractNpn:21308259, contractEmail:"pegueropaola11@gmail.com", level:"Agent"},
  "perez-ferreira-carlos": {name:"Perez Ferreira, Carlos", agency:"allcare-mar-agency", email:"carloshealthagent@gmail.com", contractPhone:"3476146141", contractNpn:20119286, contractEmail:"carloshealthagent@gmail.com", level:"Agent"},
  "pujols-de-gonzalez-luz": {name:"Pujols De Gonzalez, Luz", agency:"allcare-mar-agency", email:"lpujols@allcaremar.com", contractPhone:"9172019507", contractNpn:22125097, contractEmail:"lpujols09@gmail.com", level:"Agent"},
  "quinones-medina-cristian": {name:"Quinones Medina, Cristian", agency:"allcare-mar-agency", email:"cquinones@allcaremar.com", contractPhone:"7874737157", contractNpn:16343082, contractEmail:"Cquinones@allcaremar.com", level:"Agent"},
  "read-jacobo-mariela": {name:"Read Jacobo, Mariela", agency:"allcare-mar-agency", email:"mread@allcaremar.com", contractPhone:"5615748263", contractNpn:21537659, contractEmail:"marielaread@hotmail.com", level:"Agent"},
  "rodriguez-contreras-sixto": {name:"Rodriguez Contreras, Sixto", agency:"allcare-mar-agency", email:"sirodriguez@allcaremar.com", contractPhone:"9084279918", contractNpn:22081987, contractEmail:"sixrod1981@gmail.com", level:"Agent"},
  "rodriguez-martinez-marcos": {name:"Rodriguez-Martinez, Marcos", agency:"allcare-mar-agency", email:"mrodiguez@allcaremar.com", isLeader:true, contractPhone:"9177670877", contractNpn:18837337, contractEmail:"marcoshealthagent@gmail.com", level:"Agent"},
  "rodriguez-morales-jorge": {name:"Rodriguez Morales, Jorge", agency:"allcare-mar-agency", email:"jirodriguez@allcaremar.com", contractPhone:"3219456611", contractNpn:18720447, contractEmail:"irinspectorgrouppr@gmail.com", level:"Agent"},
  "rosario-maria": {name:"Rosario, Maria", agency:"allcare-mar-agency", email:"mrosario@allcaremar.com", contractPhone:"3216074346", contractNpn:21683254, contractEmail:"mrosarioliriano@gmail.com", level:"Agent"},
  "sanchez-carlos": {name:"Sanchez, Carlos", agency:"allcare-mar-agency", email:"csanchez@allcaremar.com", contractPhone:"7874698932", contractNpn:20385905, contractEmail:"giovasper.1992@gmail.com", level:"Agent"},
  "santiago-maria": {name:"Santiago Maria", agency:"allcare-mar-agency", email:"msanti@allcaremar.com", contractPhone:"3473555084", contractNpn:18762745, contractEmail:"mariahealthagent@gmail.com", level:"Agent"},
  "garcia-jesus": {name:"Garcia, Jesus", agency:"allcare-mar-agency", email:"j.garcia@allcaremar.com", contractPhone:"9565168666", contractNpn:19966871, contractEmail:"jesusg705@hotmail.com", level:"Agent"},
  "lopez-kimberly": {name:"Lopez, Kimberly", agency:"allcare-mar-agency", email:"klopez@allcaremar.com", contractPhone:"3473996071", contractNpn:21272776, contractEmail:"lopezkim007@gmail.com", level:"Agent"},
  "lopez-nelson": {name:"Lopez, Nelson", agency:"allcare-mar-agency", email:"nlopez@allcaremar.com", contractPhone:"9393396723", contractNpn:21552557, contractEmail:"lopeznelson007@gmail.com", level:"Agent"},
  "diego-zetina": {name:"Diego Zetina", agency:"allcare-mar-agency", email:"dzetina@allcaremar.com", contractPhone:"9564361846", contractNpn:17675231, contractEmail:"diegozetina6@gmail.com", level:"Agent"},
  "munoz-joshua": {name:"Munoz, Joshua", agency:"allcare-mar-agency", email:"j.munoz@allcaremar.com", contractPhone:"9172448926", contractNpn:19723792, contractEmail:"joshuam.services@gmail.com", level:"Agent"},
  "sanchez-patricia": {name:"Sanchez, Patricia", agency:"allcare-mar-agency", email:"psanchez@allcaremar.com", contractPhone:"7865536905", contractNpn:18996617, contractEmail:"pinsuranceflorida@gmail.com", level:"Agent"},
  "rodriguez-luis": {name:"Rodriguez, Luis", agency:"allcare-mar-agency", email:null, contractPhone:"9177670877", contractNpn:20977232, contractEmail:"luis.rod@allcaremar.com", level:"Agent"},
  "the-jrf-agency": {name:"THE JRF AGENCY", agency:"allcare-mar-agency", email:null, contractPhone:"7323067601", contractNpn:21704396, contractEmail:"jfernandez456@gmail.com", level:"Agent", isCompany:true},
  "mr-wellness": {name:"MR Wellness", agency:"allcare-mar-agency", email:null},
  "barry-karitssa": {name:"Barry, Karitssa", agency:"jpm-solutions", email:"kfernandez@allcaremar.com", contractPhone:"7328011520", contractNpn:22060869, contractEmail:"karitssa.f@gmail.com", level:"Agent"},
  "sixon-patricia": {name:"Sixon, Patricia", agency:"jpm-solutions", email:"psixon@allcaremar.com", contractPhone:"3474661107", contractNpn:21551296, contractEmail:"patriciasixon@gmail.com", level:"Agent"},
  "vega-julian": {name:"Vega, Julian", agency:"jpm-solutions", email:"julian_vega@allcaremar.com", isLeader:true, contractPhone:"6467755910", contractNpn:19246582, contractEmail:"jvega824@gmail.com", level:"Agent"},
  "rosario-yisel-miguelina": {name:"Rosario, Yisel Miguelina", agency:"jpm-solutions", email:"yrosario@allcaremar.com", contractPhone:"8622390098", contractNpn:22205943, contractEmail:"yiselrosario05@outlook.com", level:"Agent"},
  "barry-christopher": {name:"Barry, Christopher", agency:"gw-ins-group-llc", email:"cbarry@allcaremar.com", contractPhone:"7329219610", contractNpn:21564575, contractEmail:"cbar1115@gmail.com", level:"Agent"},
  "colon-carlos": {name:"Colon, Carlos", agency:"gw-ins-group-llc", email:"ccolon@allcaremar.com", contractPhone:"7879496208", contractNpn:20267503, contractEmail:"crcl2485@gmail.com", level:"Agent"},
  "colon-glenda": {name:"Colon, Glenda", agency:"gw-ins-group-llc", email:"glendahealthagent@gmail.com", isLeader:true, contractPhone:"7874495964", contractNpn:20295835, contractEmail:"glendahealthagent@gmail.com", level:"Agent"},
  "de-los-angeles-johnny": {name:"De Los Angeles, Johnny", agency:"gw-ins-group-llc", email:"jdelosangeles@allcaremar.com", contractPhone:"8622080044", contractNpn:21493158, contractEmail:"jwdlaf@gmail.com", level:"Agent"},
  "gamboa-marilyn": {name:"Gamboa, Marilyn", agency:"gw-ins-group-llc", email:"mgamboa@allcaremar.com", contractPhone:"7862530272", contractNpn:20038285, contractEmail:"mgambi1965@gmail.com", level:"Agent"},
  "rodriguez-benitez-alison": {name:"Rodriguez Benitez, Alison", agency:"gw-ins-group-llc", email:"alisonrodriguez@allcaremar.com", contractPhone:"7876474512", contractNpn:11726699, contractEmail:"rdrgzalison@gmail.com", level:"Agent"},
  "sinigaglia-lopez-livia": {name:"Sinigaglia Lopez, Livia", agency:"gw-ins-group-llc", email:"lsinigaglia@allcaremar.com"},
  "flores-margot": {name:"Flores, Margot", agency:"top-tier-health-consultants", email:"mflores@allcaremar.com", contractPhone:"2012060464", contractNpn:22181974, contractEmail:"margot.florespescoran1@gmail.com", level:"Agent"},
  "galarza-priscilla": {name:"Galarza, Priscilla", agency:"top-tier-health-consultants", email:"pgalarza@allcaremar.com", isLeader:true, contractPhone:"7187576047", contractNpn:18976363, contractEmail:"pgalarzabklyn1@gmail.com", level:"Agent"},
  "rodriguez-jocelyn": {name:"Rodriguez, Jocelyn", agency:"top-tier-health-consultants", email:"jocelyn.rod@allcaremar.com", contractPhone:"9292616688", contractNpn:21013054, contractEmail:"jocy613@gmail.com", level:"Agent"},
  "diuveuille-gina": {name:"Diuveuille, Gina", agency:"top-tier-health-consultants", email:null, contractPhone:"2109443611", contractNpn:8432725, contractEmail:"dieu8785@gmail.com", level:"Agent"},
  "contreras-nathalie": {name:"Contreras, Nathalie", agency:"top-tier-health-consultants", email:null, contractPhone:"4075162957", contractNpn:20414711, contractEmail:"ncontrer1@aol.com", level:"Agent"},
  "perez-sandy": {name:"Perez, Sandy", agency:"top-tier-health-consultants", email:null, contractPhone:"6468531080", contractNpn:21768781, contractEmail:"sperez0786@gmail.com", level:"Agent"},
  "rodriguez-alice": {name:"Rodriguez, Alice", agency:"top-tier-health-consultants", email:null, contractPhone:"9176675969", contractNpn:18105126, contractEmail:"alice.rodriguez@ymail.com", level:"Agent"},
  "brito-uribe-gabriela": {name:"Brito Uribe, Gabriela", agency:"martell-multi-service-llc", email:"gbrito@allcaremar.com", contractPhone:"8455368721", contractNpn:22068952, contractEmail:"britogabriela044@gmail.com", level:"Agent"},
  "fernandez-jose": {name:"Fernandez, Jose", agency:"martell-multi-service-llc", email:"jofernandez@allcaremar.com", contractPhone:"7873090082", contractNpn:21151513, contractEmail:"fernandeznatalizio@gmail.com", level:"Agent"},
  "giunto-glorivette-eve": {name:"Giunto, Glorivette Eve", agency:"martell-multi-service-llc", email:"egiunto@allcaremar.com", contractPhone:"6468749891", contractNpn:20561677, contractEmail:"egiuntohealthagent@gmail.com", level:"Agent"},
  "martell-ana": {name:"Martell, Ana", agency:"martell-multi-service-llc", email:"amartell@allcaremar.com", isLeader:true, contractPhone:"8622645633", contractNpn:7968747, contractEmail:"martellmultiservice@gmail.com", level:"Agent"},
  "padilla-julissa": {name:"Padilla, Julissa", agency:"martell-multi-service-llc", email:"jpadilla@allcaremar.com", contractPhone:"2018757052", contractNpn:18261672, contractEmail:"jmphealthbenefits@gmail.com", level:"Agent"},
  "ramirez-sergio": {name:"Ramirez, Sergio", agency:"martell-multi-service-llc", email:"sramirez@allcaremar.com", contractPhone:"9172160398", contractNpn:21715074, contractEmail:"srmartinez@gmail.com", level:"Agent"},
  "uribe-gisela": {name:"Uribe, Gisela", agency:"martell-multi-service-llc", email:"guribe@allcaremar.com", contractPhone:"3472834224", contractNpn:21546542, contractEmail:"priscymoi@gmail.com", level:"Agent"},
  "acosta-melissa": {name:"Acosta, Melissa", agency:"kmra-group-llc", email:"macosta@allcaremar.com", contractPhone:"6094235332", contractNpn:19682429, contractEmail:"melissaacosta.uhc@gmail.com", level:"Agent"},
  "gibbs-brittany": {name:"Gibbs, Brittany", agency:"kmra-group-llc", email:"brittany.gibbs@allcaremar.com", contractPhone:"3473006060", contractNpn:20505858, contractEmail:"brittanygibbs0617@gmail.com", level:"Agent"},
  "ortiz-amanda": {name:"Ortiz, Amanda", agency:"kmra-group-llc", email:"aortiz@allcaremar.com", contractPhone:"7873090082", contractNpn:20778238, contractEmail:"amandaortiz.uhc@gmail.com", level:"Agent"},
  "pinzon-roland": {name:"Pinzon, Roland", agency:"kmra-group-llc", email:"rpinzon@allcaremar.com", isLeader:true, contractPhone:"2012101266", contractNpn:16488836, contractEmail:"kmragroupllc@gmail.com", level:"Agent"},
  "quinones-carol": {name:"Quinones, Carol", agency:"kmra-group-llc", email:"cmquinones@allcaremar.com", contractPhone:"4439099459", contractNpn:22059618, contractEmail:"carolquinonesv.78@gmail.com", level:"Agent"},
  "reyes-olga": {name:"Reyes, Olga", agency:"kmra-group-llc", email:"oreyes@allcaremar.com", contractPhone:"2012792943", contractNpn:20186266, contractEmail:"ximereyes42@gmail.com", level:"Agent"},
  "sanchez-samir": {name:"Sanchez, Samir", agency:"kmra-group-llc", email:"ssanchez@allcaremar.com", contractPhone:"2016997907", contractNpn:22107933, contractEmail:"sanchezsamir2914@gmail.com", level:"Agent"},
  "tanksley-tammy": {name:"Tanksley, Tammy", agency:"kmra-group-llc", email:"ttanksley@allcaremar.com", contractPhone:"7327628881", contractNpn:7615009, contractEmail:"tammysellsnj@gmail.com", level:"Agent"},
  "imprint-with-kindness": {name:"Imprint With Kindness", agency:"kmra-group-llc", email:null, contractPhone:"3473006060", contractNpn:21135526, contractEmail:"brittanygibbs0617@gmail.com", level:"Agent"},
  "michelina": {name:"Michelina", agency:"kmra-group-llc", email:null},
  "chicnes-pizarro-gary": {name:"Chicnes Pizarro, Gary", agency:"amc-care-group-llc", email:"gchicnes@allcaremar.com", contractPhone:"2056175961", contractNpn:21748622, contractEmail:"gchicnes@gmail.com", level:"Agent"},
  "christopher-ana": {name:"Christopher, Ana", agency:"amc-care-group-llc", email:"anamichelle@allcaremar.com", isLeader:true, contractPhone:"7876037233", contractNpn:10386235, contractEmail:"tuvidasegurapr@gmail.com", level:"Agent"},
  "cruz-nunez-emanuel": {name:"Cruz Nunez, Emanuel", agency:"amc-care-group-llc", email:"ecruz@allcaremar.com", contractPhone:"7874506611", contractNpn:10385498, contractEmail:"emanuel.7682@gmail.com", level:"Agent"},
  "ocasio-michael": {name:"Ocasio, Michael", agency:"amc-care-group-llc", email:"mocasio@allcaremar.com"},
  "pagan-keylin": {name:"Pagan, Keylin", agency:"amc-care-group-llc", email:"kpagan@allcaremar.com", contractPhone:"7876498775", contractNpn:21546245, contractEmail:"nyliam_213@hotmail.com", level:"Agent"},
  "nathan-dominguez": {name:"Nathan Dominguez", agency:"nce-consulting-group", email:"ndominguez@allcaremar.com", isLeader:true},

  // ---- New agents/entities found in Bulk Upload Template.xlsx (2026-08-04),
  // not previously in the roster. Contract-only contact info (personal
  // email/phone/NPN registered with carriers) — company email left null
  // unless Jesus confirms one exists. See estado-proyecto.md sec. 22. ----
  "cirino-jovanna": {name:"Cirino, Jovanna", agency:"allcare-mar-agency", email:null, contractNpn:21553804, contractEmail:"jovannacirino@icloud.com", level:"Agent"},
  "velazquez-yissela": {name:"Velazquez, Yissela", agency:"allcare-mar-agency", email:null, contractPhone:"6308543439", contractNpn:22203007, contractEmail:"yiss88118@gmail.com", level:"Agent"},
  "ortega-carlos": {name:"Ortega, Carlos", agency:"amc-care-group-llc", email:null, contractPhone:"7875623317", contractNpn:13516620, contractEmail:"carlosortegacolon@gmail.com", level:"Agent"},
  "bartolomey-cotto-jose": {name:"Bartolomey Cotto, Jose", agency:"gw-ins-group-llc", email:null, contractPhone:"7872241781", contractNpn:17761278, contractEmail:"bartolojo@yahoo.com", level:"Agent"},
  "rodriguez-cuevas-yemili": {name:"Rodriguez Cuevas, Yemili", agency:"gw-ins-group-llc", email:null, contractPhone:"9294544071", contractNpn:21730932, contractEmail:"yemilirodriguez30@gmail.com", level:"Agent"},
  "colon-karlymaris": {name:"Colon, Karlymaris", agency:"gw-ins-group-llc", email:null, contractPhone:"7875952883", contractNpn:20546243, contractEmail:"karlymaris76@gmail.com", level:"Agent"},
  "alicea-glorie": {name:"Alicea, Glorie", agency:"jpm-solutions", email:"galicea@allcaremar.com", contractPhone:"7867654288", contractNpn:22269201, contractEmail:"galicea@allcaremar.com", level:"Agent"},
  "pinzon-kelly": {name:"Pinzon, Kelly", agency:"kmra-group-llc", email:null, contractPhone:"2012101266", contractNpn:19067807, contractEmail:"rpbenefits1@gmail.com", level:"Agent"},
  "cqm-group-llc": {name:"CQM Group LLC", agency:"allcare-mar-agency", email:null, contractPhone:"7874737157", contractNpn:21486290, contractEmail:"christianquinonez@hotmail.com", level:"Agent", isCompany:true},
  "fm-care-solutions-corp": {name:"FM Care Solutions Corp", agency:"allcare-mar-agency", email:null, contractPhone:"2017242432", contractNpn:21571862, contractEmail:"fmcare.solutions@gmail.com", level:"Agent", isCompany:true},
  "ah-prime-group-llc": {name:"A&H Prime Group LLC", agency:"gw-ins-group-llc", email:null, contractPhone:"7876474512", contractNpn:21452951, contractEmail:"rdrgzalison@gmail.com", level:"Agent", isCompany:true},
  "legacy-care-agency-llc": {name:"Legacy Care Agency L.L.C.", agency:"kmra-group-llc", email:null, contractPhone:"6094235332", contractNpn:21543109, contractEmail:"melissaacosta.uhc@gmail.com", level:"Agent", isCompany:true},
  "eternal-blessings-llc": {name:"Eternal Blessings LLC", agency:"martell-multi-service-llc", email:null, contractPhone:"7873090082", contractNpn:21737132, contractEmail:"fernandeznatalizio@gmail.com", level:"Agent", isCompany:true},
};

// ---- State restriction per carrier (from reference-data/carriers-dashboard-source.html,
// CARRIERS[].states, hidden:false entries only). Empty = sold nationwide.
// "Jefferson Health" isn't in that source (added per Jesus, 2026-08-03) — no
// state-restriction data exists for it yet, treated as nationwide until confirmed. ----
let CARRIER_STATES = {
  "Aetna MAPD/SilverScript PDP": [],
  "Aetna Senior Supplemental": [],
  "AllWell / Centene / WellCare / Fidelis Care / Ascension Complete / HealthNet": [],
  "BCBS of AZ": ["AZ"],
  "BCBS HCS": ["TX","IL","NM","OK","MT"],
  "BlueShield of CA (Classic & Promise Health Plan)": ["CA"],
  "Clover": [],
  "Devoted Health": [],
  "Elevance (Anthem/Amerigroup/Caremore/Horizon)": [],
  "Florida Blue": ["FL"],
  "HealthFirst (NY)": ["NY"],
  "HealthSpring (Cigna) MAPD": [],
  "HealthSpring (Cigna) Med Supp (ARLIC - CHLIC - LOYAL)": [],
  "Humana + CarePlus": [],
  "Jefferson Health": [],
  "Molina": [],
  "SCAN": ["CA","TX","AZ"],
  "UnitedHealthcare (Care Improvement Plus, Preferred Care Partners, Medica, Senior Dimensions)": [],
};

// ---- Licensed states per agent, cross-referenced from reference-data/staff.json
// (2026-08-03). Agents NOT in this map have no license data on file — treated
// as licensed nowhere, so state-restricted carriers stay locked for them until
// Jesus adds their states. No match found in staff.json for: rodriguez-luis,
// the-jrf-agency, mr-wellness, sinigaglia-lopez-livia, diuveuille-gina,
// contreras-nathalie, perez-sandy, rodriguez-alice, reyes-olga,
// imprint-with-kindness, michelina, ocasio-michael, nathan-dominguez
// (see estado-proyecto.md sec. 7). ----
let AGENT_STATES = {
  "acosta-melissa": ["NJ","FL","PA","SC"],
  "arratia-araneda-nicole": ["NJ","FL","AL"],
  "ayala-negron-adriana": ["NJ","FL","TX","PA","NY","NC","MI","GA","DE","CT","CA","AZ"],
  "balgobin-iris": ["NJ","FL","TX","VA","PA","AZ"],
  "barry-christopher": ["NJ"],
  "barry-karitssa": ["NJ"],
  "brito-uribe-gabriela": ["NJ","PA"],
  "chicnes-pizarro-gary": ["NJ","TX","NC"],
  "christopher-ana": ["NJ","FL","WI","TN","TX","SC","PA","OH","NY","NC","MI","VA","RI","MD","LA","GA","DE","CT","CO","CA","AZ","AL"],
  "colon-carlos": ["NJ","NC","OH","TX","PA","FL","AZ"],
  "colon-glenda": ["NJ","NY","TX","SC","PA","OH","NC","VA","RI","FL","DE","CT","AZ"],
  "colon-perez-yaisha": ["NJ","FL","VA"],
  "cruz-nunez-emanuel": ["NJ","NY","TX","NC","MI"],
  "de-los-angeles-johnny": ["NJ","CT","NY","PA","FL","DE"],
  "diego-zetina": ["TX"],
  "fernandez-jonathan": ["NJ","FL","DE","PA"],
  "fernandez-jose": ["NJ","TX","PA","DE"],
  "flores-margot": ["NJ"],
  "galarza-priscilla": ["NJ","NY","PA","FL","DE"],
  "gamboa-marilyn": ["NJ","TX","OH","NC","FL"],
  "garcia-jesus": ["NJ","TN","TX","SC","PA","NC","MI","VA","FL","CT","CA","AZ"],
  "gibbs-brittany": ["NJ","PA","FL","DE"],
  "gil-ramon": ["NJ","NY","DE"],
  "giunto-glorivette-eve": ["NJ","NY","FL","PA"],
  "gray-tayler": ["NJ","PA","VA"],
  "hyman-ulysses": ["NJ","PA","MD","DE","AL"],
  "liriano-felix": ["NJ","NY","VA"],
  "lopez-kimberly": ["NJ","TN","TX","SC","PA","OH","NC","MI","VA","IL","FL","CO"],
  "lopez-nelson": ["FL","OH","CO"],
  "martell-ana": ["NJ","NY","GA","DE","OH","PA","TX","FL"],
  "martin-alvorine": ["NJ","TX","SC","PA","NY","NC","FL"],
  "monsalve-maria": ["NJ","NY","PA","FL","DE","CA"],
  "munoz-francia": ["NJ","OH","PA","NY","NC","VA","MD","FL","DE","CO","AL"],
  "munoz-joshua": ["NJ","NY","FL","DE","PA"],
  "ortiz-amanda": ["NJ","PA"],
  "padilla-julissa": ["NJ","PA"],
  "pagan-keylin": ["NJ","NY","TX","PA","NC","FL","AL"],
  "peguero-ruiz-paola": ["NJ","FL","TX","PA","DE","CA"],
  "perez-ferreira-carlos": ["NJ","NY","TX","NC","SC","PA","FL","CA"],
  "pinzon-roland": ["NJ","TX","SC","PA","NC","MD","FL","DE"],
  "pujols-de-gonzalez-luz": ["NJ","PA","RI","FL"],
  "quinones-carol": ["NJ","MD","PA","FL"],
  "quinones-medina-cristian": ["NJ","FL","TX","SC","PA","NC","MI","VA","GA","CT","CO","AZ"],
  "ramirez-sergio": ["NJ"],
  "read-jacobo-mariela": ["NJ","FL"],
  "rodriguez-benitez-alison": ["NJ","TX","SC","PA","OH","NY","NC","VA","RI","FL","DE","CT","AZ"],
  "rodriguez-contreras-sixto": ["NJ"],
  "rodriguez-jocelyn": ["NJ","NY","DE","FL"],
  "rodriguez-martinez-marcos": ["NJ","NY","TX","SC","PA","OH","WI","TN","NC","MI","VA","RI","MD","LA","IL","GA","FL","DE","CT","CO","CA","AZ","AL"],
  "rodriguez-morales-jorge": ["FL"],
  "rosario-maria": ["NJ","FL"],
  "rosario-yisel-miguelina": ["NJ","PA"],
  "sanchez-carlos": ["NJ","FL","TN","TX","PA","NC","MI","VA","GA","CA"],
  "sanchez-patricia": ["FL"],
  "sanchez-samir": ["NJ"],
  "santiago-maria": ["NJ","NY","PA","TX","OH","VA","RI","AL","CA","CT","DE","FL","GA","LA"],
  "sixon-patricia": ["NJ","NY","FL","DE","AL"],
  "tanksley-tammy": ["NJ"],
  "uribe-gisela": ["NJ","NY","FL"],
  "vega-julian": ["NJ","NY","TX","PA","FL","DE","AL"],
};

// ---- Active carriers (17 from reference-data/carriers-dashboard-source.html,
// hidden:false, + "Jefferson Health" added per Jesus 2026-08-03: tracked in
// Tracker .xlsx but wasn't in the site's active-carrier list) ----
let CARRIERS = [
  "Aetna MAPD/SilverScript PDP",
  "Aetna Senior Supplemental",
  "AllWell / Centene / WellCare / Fidelis Care / Ascension Complete / HealthNet",
  "BCBS of AZ",
  "BCBS HCS",
  "BlueShield of CA (Classic & Promise Health Plan)",
  "Clover",
  "Devoted Health",
  "Elevance (Anthem/Amerigroup/Caremore/Horizon)",
  "Florida Blue",
  "HealthFirst (NY)",
  "HealthSpring (Cigna) MAPD",
  "HealthSpring (Cigna) Med Supp (ARLIC - CHLIC - LOYAL)",
  "Humana + CarePlus",
  "Jefferson Health",
  "Molina",
  "SCAN",
  "UnitedHealthcare (Care Improvement Plus, Preferred Care Partners, Medica, Senior Dimensions)",
];

// ---- REAL progress, migrated from Tracker .xlsx per Jesus's confirmed
// mapping (2026-08-03): "No email"/"N/A"/empty -> 0 steps | "Email Received"
// -> step a | "singed" -> steps a,b,c | "Certifications" -> all 10 (a-j).
// Re-synced from an updated Tracker .xlsx per Jesus (2026-08-06) — same
// mapping rules, same carrier-name mapping (sec. 6 of estado-proyecto.md).
// Net change vs. the previous sync: 12 agents advanced on Devoted Health
// (mostly newly at step a, a few further along), 1 newly-appearing agent
// with progress (Quinones Medina, Cristian), nobody lost progress. ----
let PROGRESS = {
  "arratia-araneda-nicole": { "Devoted Health":{a:1}, "Humana + CarePlus":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1}, "UnitedHealthcare (Care Improvement Plus, Preferred Care Partners, Medica, Senior Dimensions)":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1}},
  "ayala-negron-adriana": { "Devoted Health":{a:1}, "HealthFirst (NY)":{a:1,b:1,c:1}, "SCAN":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1}, "UnitedHealthcare (Care Improvement Plus, Preferred Care Partners, Medica, Senior Dimensions)":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1}},
  "balgobin-iris": { "Devoted Health":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1}, "SCAN":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1}, "UnitedHealthcare (Care Improvement Plus, Preferred Care Partners, Medica, Senior Dimensions)":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1}},
  "colon-perez-yaisha": { "Devoted Health":{a:1}, "Humana + CarePlus":{a:1,b:1,c:1}, "UnitedHealthcare (Care Improvement Plus, Preferred Care Partners, Medica, Senior Dimensions)":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1}},
  "fernandez-jonathan": { "Humana + CarePlus":{a:1,b:1,c:1}, "UnitedHealthcare (Care Improvement Plus, Preferred Care Partners, Medica, Senior Dimensions)":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1}},
  "gil-ramon": { "Humana + CarePlus":{a:1}, "UnitedHealthcare (Care Improvement Plus, Preferred Care Partners, Medica, Senior Dimensions)":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1}},
  "gray-tayler": { "Humana + CarePlus":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1}, "UnitedHealthcare (Care Improvement Plus, Preferred Care Partners, Medica, Senior Dimensions)":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1}},
  "hyman-ulysses": { "Devoted Health":{a:1}, "Humana + CarePlus":{a:1}, "UnitedHealthcare (Care Improvement Plus, Preferred Care Partners, Medica, Senior Dimensions)":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1}},
  "liriano-felix": { "Devoted Health":{a:1}, "HealthFirst (NY)":{a:1}, "Humana + CarePlus":{a:1}, "UnitedHealthcare (Care Improvement Plus, Preferred Care Partners, Medica, Senior Dimensions)":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1}},
  "martin-alvorine": { "HealthFirst (NY)":{a:1}, "Humana + CarePlus":{a:1,b:1,c:1}, "UnitedHealthcare (Care Improvement Plus, Preferred Care Partners, Medica, Senior Dimensions)":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1}},
  "monsalve-maria": { "Devoted Health":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1}, "HealthFirst (NY)":{a:1,b:1,c:1}, "Humana + CarePlus":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1}, "UnitedHealthcare (Care Improvement Plus, Preferred Care Partners, Medica, Senior Dimensions)":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1}},
  "peguero-ruiz-paola": { "HealthFirst (NY)":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1}, "Humana + CarePlus":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1}, "SCAN":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1}, "UnitedHealthcare (Care Improvement Plus, Preferred Care Partners, Medica, Senior Dimensions)":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1}},
  "perez-ferreira-carlos": { "HealthFirst (NY)":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1}, "SCAN":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1}, "UnitedHealthcare (Care Improvement Plus, Preferred Care Partners, Medica, Senior Dimensions)":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1}},
  "pujols-de-gonzalez-luz": { "Humana + CarePlus":{a:1,b:1,c:1}, "UnitedHealthcare (Care Improvement Plus, Preferred Care Partners, Medica, Senior Dimensions)":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1}},
  "quinones-medina-cristian": { "Devoted Health":{a:1}, "UnitedHealthcare (Care Improvement Plus, Preferred Care Partners, Medica, Senior Dimensions)":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1}},
  "read-jacobo-mariela": { "Humana + CarePlus":{a:1,b:1,c:1}, "UnitedHealthcare (Care Improvement Plus, Preferred Care Partners, Medica, Senior Dimensions)":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1}},
  "rodriguez-contreras-sixto": { "Devoted Health":{a:1,b:1,c:1}, "Humana + CarePlus":{a:1,b:1,c:1}, "UnitedHealthcare (Care Improvement Plus, Preferred Care Partners, Medica, Senior Dimensions)":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1}},
  "rodriguez-martinez-marcos": { "Devoted Health":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1}, "HealthFirst (NY)":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1}, "Humana + CarePlus":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1}, "SCAN":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1}, "HealthSpring (Cigna) MAPD":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1}, "Jefferson Health":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1}, "Molina":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1}, "HealthSpring (Cigna) Med Supp (ARLIC - CHLIC - LOYAL)":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1}, "Aetna MAPD/SilverScript PDP":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1}, "Aetna Senior Supplemental":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1}, "UnitedHealthcare (Care Improvement Plus, Preferred Care Partners, Medica, Senior Dimensions)":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1}},
  "rodriguez-morales-jorge": { "Devoted Health":{a:1}, "Humana + CarePlus":{a:1}, "UnitedHealthcare (Care Improvement Plus, Preferred Care Partners, Medica, Senior Dimensions)":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1}},
  "sanchez-carlos": { "Devoted Health":{a:1,b:1,c:1}, "Humana + CarePlus":{a:1}, "SCAN":{a:1,b:1,c:1}, "UnitedHealthcare (Care Improvement Plus, Preferred Care Partners, Medica, Senior Dimensions)":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1}},
  "santiago-maria": { "Devoted Health":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1}, "HealthFirst (NY)":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1}, "Humana + CarePlus":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1}, "SCAN":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1}, "UnitedHealthcare (Care Improvement Plus, Preferred Care Partners, Medica, Senior Dimensions)":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1}},
  "garcia-jesus": { "SCAN":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1}, "UnitedHealthcare (Care Improvement Plus, Preferred Care Partners, Medica, Senior Dimensions)":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1}},
  "lopez-kimberly": { "SCAN":{a:1,b:1,c:1}, "UnitedHealthcare (Care Improvement Plus, Preferred Care Partners, Medica, Senior Dimensions)":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1}},
  "lopez-nelson": { "Devoted Health":{a:1}, "Humana + CarePlus":{a:1}, "UnitedHealthcare (Care Improvement Plus, Preferred Care Partners, Medica, Senior Dimensions)":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1}},
  "diego-zetina": { "Devoted Health":{a:1,b:1,c:1}, "Humana + CarePlus":{a:1,b:1,c:1}, "UnitedHealthcare (Care Improvement Plus, Preferred Care Partners, Medica, Senior Dimensions)":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1}},
  "munoz-joshua": { "Devoted Health":{a:1}, "HealthFirst (NY)":{a:1}, "Humana + CarePlus":{a:1}, "UnitedHealthcare (Care Improvement Plus, Preferred Care Partners, Medica, Senior Dimensions)":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1}},
  "sanchez-patricia": { "Devoted Health":{a:1}, "Humana + CarePlus":{a:1}, "UnitedHealthcare (Care Improvement Plus, Preferred Care Partners, Medica, Senior Dimensions)":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1}},
  "rodriguez-luis": { "HealthFirst (NY)":{a:1}, "Humana + CarePlus":{a:1}, "UnitedHealthcare (Care Improvement Plus, Preferred Care Partners, Medica, Senior Dimensions)":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1}},
  "the-jrf-agency": { "HealthFirst (NY)":{a:1}, "Humana + CarePlus":{a:1}, "UnitedHealthcare (Care Improvement Plus, Preferred Care Partners, Medica, Senior Dimensions)":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1}},
  "mr-wellness": { "Humana + CarePlus":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1} },
  "vega-julian": { "HealthFirst (NY)":{a:1,b:1,c:1}, "Humana + CarePlus":{a:1,b:1,c:1}, "SCAN":{a:1,b:1,c:1}, "UnitedHealthcare (Care Improvement Plus, Preferred Care Partners, Medica, Senior Dimensions)":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1}},
  "colon-carlos": { "SCAN":{a:1}, "UnitedHealthcare (Care Improvement Plus, Preferred Care Partners, Medica, Senior Dimensions)":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1}},
  "colon-glenda": { "HealthFirst (NY)":{a:1}, "Humana + CarePlus":{a:1,b:1,c:1}, "SCAN":{a:1}, "UnitedHealthcare (Care Improvement Plus, Preferred Care Partners, Medica, Senior Dimensions)":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1}},
  "rodriguez-benitez-alison": { "SCAN":{a:1}, "UnitedHealthcare (Care Improvement Plus, Preferred Care Partners, Medica, Senior Dimensions)":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1}},
  "galarza-priscilla": { "HealthFirst (NY)":{a:1}, "Humana + CarePlus":{a:1,b:1,c:1}, "UnitedHealthcare (Care Improvement Plus, Preferred Care Partners, Medica, Senior Dimensions)":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1}},
  "fernandez-jose": { "SCAN":{a:1}, "UnitedHealthcare (Care Improvement Plus, Preferred Care Partners, Medica, Senior Dimensions)":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1}},
  "martell-ana": { "HealthFirst (NY)":{a:1,b:1,c:1}, "Humana + CarePlus":{a:1,b:1,c:1}, "SCAN":{a:1}, "UnitedHealthcare (Care Improvement Plus, Preferred Care Partners, Medica, Senior Dimensions)":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1}},
  "pinzon-roland": { "SCAN":{a:1}, "UnitedHealthcare (Care Improvement Plus, Preferred Care Partners, Medica, Senior Dimensions)":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1}},
  "christopher-ana": { "HealthFirst (NY)":{a:1}, "SCAN":{a:1}, "UnitedHealthcare (Care Improvement Plus, Preferred Care Partners, Medica, Senior Dimensions)":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1}},
  "acosta-melissa": { "UnitedHealthcare (Care Improvement Plus, Preferred Care Partners, Medica, Senior Dimensions)":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1} },
  "barry-christopher": { "UnitedHealthcare (Care Improvement Plus, Preferred Care Partners, Medica, Senior Dimensions)":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1} },
  "barry-karitssa": { "UnitedHealthcare (Care Improvement Plus, Preferred Care Partners, Medica, Senior Dimensions)":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1} },
  "brito-uribe-gabriela": { "UnitedHealthcare (Care Improvement Plus, Preferred Care Partners, Medica, Senior Dimensions)":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1} },
  "chicnes-pizarro-gary": { "UnitedHealthcare (Care Improvement Plus, Preferred Care Partners, Medica, Senior Dimensions)":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1} },
  "contreras-nathalie": { "UnitedHealthcare (Care Improvement Plus, Preferred Care Partners, Medica, Senior Dimensions)":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1} },
  "cruz-nunez-emanuel": { "UnitedHealthcare (Care Improvement Plus, Preferred Care Partners, Medica, Senior Dimensions)":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1} },
  "de-los-angeles-johnny": { "UnitedHealthcare (Care Improvement Plus, Preferred Care Partners, Medica, Senior Dimensions)":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1} },
  "diuveuille-gina": { "UnitedHealthcare (Care Improvement Plus, Preferred Care Partners, Medica, Senior Dimensions)":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1} },
  "flores-margot": { "UnitedHealthcare (Care Improvement Plus, Preferred Care Partners, Medica, Senior Dimensions)":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1} },
  "gamboa-marilyn": { "UnitedHealthcare (Care Improvement Plus, Preferred Care Partners, Medica, Senior Dimensions)":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1} },
  "gibbs-brittany": { "UnitedHealthcare (Care Improvement Plus, Preferred Care Partners, Medica, Senior Dimensions)":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1} },
  "giunto-glorivette-eve": { "UnitedHealthcare (Care Improvement Plus, Preferred Care Partners, Medica, Senior Dimensions)":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1} },
  "imprint-with-kindness": { "UnitedHealthcare (Care Improvement Plus, Preferred Care Partners, Medica, Senior Dimensions)":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1} },
  "munoz-francia": { "UnitedHealthcare (Care Improvement Plus, Preferred Care Partners, Medica, Senior Dimensions)":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1} },
  "ortiz-amanda": { "UnitedHealthcare (Care Improvement Plus, Preferred Care Partners, Medica, Senior Dimensions)":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1} },
  "padilla-julissa": { "UnitedHealthcare (Care Improvement Plus, Preferred Care Partners, Medica, Senior Dimensions)":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1} },
  "pagan-keylin": { "UnitedHealthcare (Care Improvement Plus, Preferred Care Partners, Medica, Senior Dimensions)":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1} },
  "perez-sandy": { "UnitedHealthcare (Care Improvement Plus, Preferred Care Partners, Medica, Senior Dimensions)":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1} },
  "quinones-carol": { "UnitedHealthcare (Care Improvement Plus, Preferred Care Partners, Medica, Senior Dimensions)":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1} },
  "ramirez-sergio": { "UnitedHealthcare (Care Improvement Plus, Preferred Care Partners, Medica, Senior Dimensions)":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1} },
  "reyes-olga": { "UnitedHealthcare (Care Improvement Plus, Preferred Care Partners, Medica, Senior Dimensions)":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1} },
  "rodriguez-alice": { "UnitedHealthcare (Care Improvement Plus, Preferred Care Partners, Medica, Senior Dimensions)":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1} },
  "rodriguez-jocelyn": { "UnitedHealthcare (Care Improvement Plus, Preferred Care Partners, Medica, Senior Dimensions)":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1} },
  "rosario-maria": { "UnitedHealthcare (Care Improvement Plus, Preferred Care Partners, Medica, Senior Dimensions)":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1} },
  "rosario-yisel-miguelina": { "UnitedHealthcare (Care Improvement Plus, Preferred Care Partners, Medica, Senior Dimensions)":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1} },
  "sanchez-samir": { "UnitedHealthcare (Care Improvement Plus, Preferred Care Partners, Medica, Senior Dimensions)":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1} },
  "sixon-patricia": { "UnitedHealthcare (Care Improvement Plus, Preferred Care Partners, Medica, Senior Dimensions)":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1} },
  "tanksley-tammy": { "UnitedHealthcare (Care Improvement Plus, Preferred Care Partners, Medica, Senior Dimensions)":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1} },
  "uribe-gisela": { "UnitedHealthcare (Care Improvement Plus, Preferred Care Partners, Medica, Senior Dimensions)":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1} },
  "cirino-jovanna": { "UnitedHealthcare (Care Improvement Plus, Preferred Care Partners, Medica, Senior Dimensions)":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1} },
  "velazquez-yissela": { "UnitedHealthcare (Care Improvement Plus, Preferred Care Partners, Medica, Senior Dimensions)":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1} },
  "ortega-carlos": { "UnitedHealthcare (Care Improvement Plus, Preferred Care Partners, Medica, Senior Dimensions)":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1} },
  "bartolomey-cotto-jose": { "UnitedHealthcare (Care Improvement Plus, Preferred Care Partners, Medica, Senior Dimensions)":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1} },
  "rodriguez-cuevas-yemili": { "UnitedHealthcare (Care Improvement Plus, Preferred Care Partners, Medica, Senior Dimensions)":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1} },
  "colon-karlymaris": { "UnitedHealthcare (Care Improvement Plus, Preferred Care Partners, Medica, Senior Dimensions)":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1} },
  "alicea-glorie": { "UnitedHealthcare (Care Improvement Plus, Preferred Care Partners, Medica, Senior Dimensions)":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1} },
  "pinzon-kelly": { "UnitedHealthcare (Care Improvement Plus, Preferred Care Partners, Medica, Senior Dimensions)":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1} },
  "cqm-group-llc": { "UnitedHealthcare (Care Improvement Plus, Preferred Care Partners, Medica, Senior Dimensions)":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1} },
  "fm-care-solutions-corp": { "UnitedHealthcare (Care Improvement Plus, Preferred Care Partners, Medica, Senior Dimensions)":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1} },
  "ah-prime-group-llc": { "UnitedHealthcare (Care Improvement Plus, Preferred Care Partners, Medica, Senior Dimensions)":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1} },
  "legacy-care-agency-llc": { "UnitedHealthcare (Care Improvement Plus, Preferred Care Partners, Medica, Senior Dimensions)":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1} },
  "eternal-blessings-llc": { "UnitedHealthcare (Care Improvement Plus, Preferred Care Partners, Medica, Senior Dimensions)":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1} },
  "nathan-dominguez": { "UnitedHealthcare (Care Improvement Plus, Preferred Care Partners, Medica, Senior Dimensions)":{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1,i:1,j:1} },
};

// ============================================================================
// Shared business logic (hierarchy gating + license filter + progress status)
// ============================================================================

function getMasterAgencyId(){
  return Object.keys(AGENCIES).find(id => AGENCIES[id].isMaster);
}

// Progress is always stored per person. When the selected entity is an
// Agency, its record is the same as its designated leader agent's record.
function progressKeyFor(type, entityId){
  return type === 'agency' ? AGENCIES[entityId].leaderAgentId : entityId;
}

function isCarrierDoneFor(personId, carrierName){
  const p = PROGRESS[personId]?.[carrierName];
  return !!(p && p.j);
}

// Who does the license check apply to? For an Agent, the agent themself. For
// an Agency, the entity resolves to its leader (same person whose progress
// record represents the agency, see progressKeyFor).
function licensePersonFor(type, entityId){
  return type === 'agency' ? AGENCIES[entityId].leaderAgentId : entityId;
}

// Carrier-level filter (per Jesus, 2026-08-03 + follow-ups):
// TWO independent conditions must both pass, or the carrier stays locked:
//   1) HIERARCHY GATING — master leader (Marcos) unrestricted; other agency
//      leaders gated by Marcos completing the carrier; regular agents gated
//      by their OWN agency leader completing the carrier.
//   2) STATE LICENSE — if the carrier is restricted to specific states, the
//      person must be licensed in at least one of them (unrestricted carriers
//      are unaffected by license, per Jesus 2026-08-03).
function getCarrierEnabled(type, entityId, carrierName){
  const masterAgencyId = getMasterAgencyId();
  const masterLeaderId = AGENCIES[masterAgencyId].leaderAgentId;

  let agencyId, isThisTheLeader;
  if(type === 'agency'){
    agencyId = entityId;
    isThisTheLeader = true;
  } else {
    agencyId = AGENTS[entityId].agency;
    isThisTheLeader = (entityId === AGENCIES[agencyId].leaderAgentId);
  }

  let gatingOk;
  if(agencyId === masterAgencyId && isThisTheLeader) gatingOk = true;
  else if(isThisTheLeader) gatingOk = isCarrierDoneFor(masterLeaderId, carrierName);
  else gatingOk = isCarrierDoneFor(AGENCIES[agencyId].leaderAgentId, carrierName);

  if(!gatingOk) return {enabled:false, reason:'gating', requiredStates:[]};

  const requiredStates = CARRIER_STATES[carrierName] || [];
  if(requiredStates.length === 0) return {enabled:true, reason:null, requiredStates:[]};

  const personId = licensePersonFor(type, entityId);
  const personStates = AGENT_STATES[personId] || [];
  const licenseOk = requiredStates.some(s => personStates.includes(s));
  return {enabled:licenseOk, reason: licenseOk ? null : 'license', requiredStates};
}

// Progress status of the entity itself for a given carrier: 'not_started' |
// 'in_progress' | 'completed', based on how many of the 10 checklist steps
// are done. Independent from getCarrierEnabled (an enabled carrier can still
// be untouched).
function getCarrierStatus(type, entityId, carrierName){
  const key = progressKeyFor(type, entityId);
  const steps = (PROGRESS[key] && PROGRESS[key][carrierName]) || {};
  const doneCount = Object.keys(steps).filter(k => steps[k]).length;
  if(doneCount === 0) return 'not_started';
  if(doneCount >= 10) return 'completed';
  return 'in_progress';
}

// ============================================================================
// Backend connection (2026-08-04) — added once Code.gs was deployed as a Web
// App (see estado-proyecto.md sec. 16-19). Everything above this line still
// works exactly as before with the static consts as a fallback: if
// ENDPOINT_URL (assets/js/config.js) is empty, none of the functions below
// ever get called and the pages behave exactly like the original preview.
//
// IMPORTANT — not fully testable yet (2026-08-04): GOOGLE_CLIENT_ID in
// Code.gs/config.js is still a placeholder (the website-repo Claude agent is
// filling that in + the Cloud Console authorized origins), and this sandbox
// has no network access to script.google.com to test the live calls directly.
// Once the Client ID + origins are set, this should work as written, but it
// needs a real in-browser test to confirm — flagging that honestly rather
// than claiming it's verified.
// ============================================================================

const ID_TOKEN_STORAGE_KEY = 'contracting_google_id_token';

function hasLiveBackend(){
  return typeof ENDPOINT_URL !== 'undefined' && !!ENDPOINT_URL;
}

// Backend deployed AND Google Sign-In actually wired up (GOOGLE_CLIENT_ID
// filled in) — until both are true, pages keep behaving like the original
// static preview instead of showing a login gate nobody can get through.
// This matters right now (2026-08-04): ENDPOINT_URL is already set (Code.gs
// is deployed), but GOOGLE_CLIENT_ID is still pending from the website-repo
// agent, so liveModeReady() stays false and Jesus can keep previewing
// normally in the meantime.
function liveModeReady(){
  return hasLiveBackend() && typeof GOOGLE_CLIENT_ID !== 'undefined' && !!GOOGLE_CLIENT_ID;
}

// Switched from sessionStorage to localStorage (2026-08-05, per Jesus:
// login wasn't "sticking" — sessionStorage clears on every tab/browser
// close, forcing a fresh Google login each time). localStorage persists
// across tab/browser restarts, so a valid session now survives reloads.
// Note: this does NOT make login last forever — Google's idToken itself
// expires (~1 hour), and initData() already calls clearStoredIdToken() +
// shows the login gate again the moment the stored token is rejected as
// invalid/expired. That re-login prompt after ~1hr of inactivity is
// expected Google security behavior, not a bug.
function getStoredIdToken(){
  try{ return localStorage.getItem(ID_TOKEN_STORAGE_KEY) || null; } catch(e){ return null; }
}
function setStoredIdToken(token){
  try{ localStorage.setItem(ID_TOKEN_STORAGE_KEY, token); } catch(e){}
}
function clearStoredIdToken(){
  try{ localStorage.removeItem(ID_TOKEN_STORAGE_KEY); } catch(e){}
}

// Converts the flat rows returned by Code.gs (getAllData_) into the same
// shapes used everywhere above (AGENCIES/AGENTS/CARRIERS/CARRIER_STATES/
// AGENT_STATES/PROGRESS), then swaps the module-level `let` variables so
// every existing function (getCarrierEnabled, getCarrierStatus, etc.) starts
// reading live data automatically — no other code needed to change.
function applyLiveData_(data){
  const newAgencies = {};
  (data.agencies || []).forEach(row=>{
    const isMaster = row.is_master === true || String(row.is_master).toUpperCase() === 'TRUE';
    newAgencies[row.agency_id] = { name: row.name, isMaster, leaderAgentId: row.leader_agent_id };
  });

  const newAgents = {};
  const newAgentStates = {};
  (data.agents || []).forEach(row=>{
    const isLeader = row.is_leader === true || String(row.is_leader).toUpperCase() === 'TRUE';
    newAgents[row.agent_id] = {
      name: row.name, agency: row.agency_id,
      email: row.email || null,
      ...(isLeader ? {isLeader:true} : {}),
    };
    const states = String(row.licensed_states || '').split(',').map(s=>s.trim()).filter(Boolean);
    if(states.length) newAgentStates[row.agent_id] = states;
  });

  const newCarriers = [];
  const newCarrierStates = {};
  (data.carriers || []).forEach(row=>{
    newCarriers.push(row.carrier_name);
    newCarrierStates[row.carrier_name] = String(row.states || '').split(',').map(s=>s.trim()).filter(Boolean);
  });

  const newProgress = {};
  (data.progress || []).forEach(row=>{
    if(!newProgress[row.agent_id]) newProgress[row.agent_id] = {};
    const steps = {};
    STEPS.forEach(s=>{ if(row['step_'+s.key]) steps[s.key] = row['step_'+s.key]; });
    newProgress[row.agent_id][row.carrier_name] = steps;
  });

  AGENCIES = newAgencies;
  AGENTS = newAgents;
  AGENT_STATES = newAgentStates;
  CARRIERS = newCarriers;
  CARRIER_STATES = newCarrierStates;
  PROGRESS = newProgress;
}

// Fetches getAllData from the deployed Web App using the given Google
// idToken. Throws on network/HTTP error; returns {error} for app-level auth
// errors (invalid token, not on the authorized list) so callers can react
// (e.g. show the login gate again) without treating it as a hard crash.
async function fetchLiveData_(idToken){
  const url = ENDPOINT_URL + '?action=getAllData&idToken=' + encodeURIComponent(idToken);
  const resp = await fetch(url);
  const data = await resp.json();
  if(data.error) return {error: data.error};
  applyLiveData_(data);
  return {ok:true, fetchedAt: data.fetchedAt};
}

// Called once on page load by preview-contracting.html / reports.html.
// Returns one of:
//   {mode:'static'}          -> ENDPOINT_URL not configured, use built-in data (today's default)
//   {mode:'live'}            -> logged in + data loaded successfully, render as normal
//   {mode:'needs-login'}     -> ENDPOINT_URL configured but no valid session yet, show login gate
async function initData(){
  if(!liveModeReady()) return {mode:'static'};
  const token = getStoredIdToken();
  if(!token) return {mode:'needs-login'};
  try{
    const result = await fetchLiveData_(token);
    if(result.error){ clearStoredIdToken(); return {mode:'needs-login', error: result.error}; }
    return {mode:'live'};
  } catch(err){
    // Network/parse failure — don't silently fall back to static (that would
    // hide real problems); surface it so the page can show an error state.
    return {mode:'error', error:String(err)};
  }
}

// Generic authenticated POST helper for updateStep / uploadFile /
// sendStepEmail. Returns the parsed JSON body from Code.gs (which itself
// contains {error:...} on failure, or {ok:true,...} on success).
async function callBackend_(action, payload){
  if(!liveModeReady()) return {error:'No backend configured yet (ENDPOINT_URL and/or GOOGLE_CLIENT_ID missing)'};
  const idToken = getStoredIdToken();
  if(!idToken) return {error:'Not logged in'};
  try{
    const resp = await fetch(ENDPOINT_URL, {
      method:'POST',
      headers:{'Content-Type':'text/plain;charset=utf-8'}, // avoids a CORS preflight against Apps Script
      body: JSON.stringify({action, idToken, ...payload}),
    });
    return await resp.json();
  } catch(err){
    return {error:String(err)};
  }
}

async function backendUpdateStep(agentId, carrierName, stepKey, checked){
  return callBackend_('updateStep', {agentId, carrierName, stepKey, checked});
}
async function backendUploadFile(agentId, carrierName, fileBase64, fileName, mimeType){
  return callBackend_('uploadFile', {agentId, carrierName, fileBase64, fileName, mimeType});
}
async function backendSendStepEmail(agentId, carrierName, stepKey){
  return callBackend_('sendStepEmail', {agentId, carrierName, stepKey});
}
// "Notify Uplines" (2026-08-04, scoped per-agency since 2026-08-06) —
// standalone button in preview-contracting.html, shown on ANY agency leader's
// view (not just the master's) once THAT agency's own checklist for the
// selected carrier reaches 100%. Server-side (Code.gs notifyUplines_)
// cross-references the separate Form-Carriers Sheet to find who requested
// this carrier within that one agency only, and emails the uplines.
async function backendNotifyUplines(carrierName, agencyId){
  return callBackend_('notifyUplines', {carrierName, agencyId});
}
