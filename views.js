/* ================================================================
   ACCUEIL — blocs affichés sur l’accueil (contact, projets à plusieurs devis)
   ================================================================ */
const ctc=()=>`<div class="card np" style="text-align:center;font-size:13px"><b>Une question, une suggestion ?</b><div class="row" style="justify-content:center;margin-top:8px"><a href="https://wa.me/213556751401" target="_blank" rel="noopener" style="color:var(--ac);font-weight:600">💬 WhatsApp : +213 556 75 14 01</a><a href="mailto:manseur.bet@gmail.com" style="color:var(--ac);font-weight:600">✉️ manseur.bet@gmail.com</a></div></div>`;
const dsc=()=>{const dl=[...new Set(S.projects.map(x=>x.grp).filter(Boolean))].filter(g=>S.projects.filter(x=>x.grp===g).length>1);if(!dl.length)return"";return`<div class="card np"><b>📂 Projets à plusieurs devis</b>${dl.map(g=>{const n=S.projects.filter(x=>x.grp===g).length;return`<div class="row" style="margin-top:8px;flex-wrap:nowrap"><span style="flex:1">📂 ${esc(g)} <small style="color:var(--mut)">(${n} devis)</small></span><button onclick="opd(${JSON.stringify(g).replace(/"/g,"&quot;")})">📑 Récapitulatives générales</button></div>`}).join("")}</div>`};

/* ================================================================
   PROJETS — créer, renommer, supprimer un projet et ses devis
   ================================================================ */
const PJ=p=>p.grp&&S.mode!="entreprise"?`<div>PROJET : ${esc(p.grp)}</div><div>DEVIS : ${esc(p.name)}</div>`:`<div>PROJET : ${esc(p.name)}</div>`;
function mg(){if(S.mode=="entreprise"||!S.mode)return;const used=new Set(S.projects.map(x=>x.grp).filter(Boolean));S.projects.forEach(x=>{if(x.grp)return;let g=x.name||"Projet",c=g,n=1;while(used.has(c))c=g+" ("+(++n)+")";x.grp=c;used.add(c)})}
function npj(){mg();const used=new Set(S.projects.map(x=>x.grp));let g="Nouveau projet",n=1;while(used.has(g))g="Nouveau projet "+(++n);const p=mk("Devis 1");p.id=Date.now()+Math.floor(Math.random()*1000);p.grp=g;S.projects.push(p);S.lg=g;S.lk=null;S.del=null;S.dg=null;S.bm="";go("ouvrir")}
function lgt(g){S.lg=S.lg===g?null:g;go()}
function rpj(g,v){v=(v||"").trim();if(v&&v!==g){if(S.projects.some(x=>x.grp===v))S.bm="Un projet porte déjà ce nom.";else{S.projects.forEach(x=>{if(x.grp===g)x.grp=v});S.bm=""}}S.lg=null;go()}
function dpj(g){if(S.dg===g){S.projects=S.projects.filter(x=>x.grp!==g);if(S.cur&&!S.projects.some(x=>x.id==S.cur))S.cur=null;S.dg=null;S.lg=null}else S.dg=g;go()}

/* ================================================================
   ACCUEIL — page principale (choix du mode, + Nouveau projet, Ouvrir)
   ================================================================ */
function vProj(){return mg(),vProj1()}
function vProj1(){return vProj0()+(S.mode=="bureau"?dsc():"")+(S.mode?ctc():"")}
function vProj0(){if(!S.mode)return`<div class="card" style="text-align:center"><div style="font-size:42px">🏗️</div><div style="margin:4px 0 12px">Vous êtes :</div><button class="pri" style="width:100%;font-size:17px;padding:14px" onclick="setMode('bureau')">🏛️ Bureau d’architecture<br><small>Plusieurs projets · abonnement mensuel</small></button><button style="width:100%;font-size:17px;padding:14px;margin-top:10px" onclick="setMode('entreprise')">👷 Entreprise de réalisation<br><small>Un seul projet · facturé par projet</small></button></div>`;return`<div class="card" style="text-align:center"><div style="font-size:42px">🏗️</div><div style="display:flex;flex-direction:column;gap:12px;margin-top:14px"><button class="pri" style="font-size:18px;padding:16px" onclick="${S.mode=='bureau'?'npj()':'np()'}">+ Nouveau projet</button><button style="font-size:18px;padding:16px" onclick="go('ouvrir')">📂 Ouvrir</button>${RSB}</div>${S.bm?`<p class="bad">${esc(S.bm)}</p>`:""}</div>${OK?"":`<div class="card bad">⚠️ Le navigateur bloque l’enregistrement : vos projets seront perdus à la fermeture.</div>`}`}

/* ================================================================
   OUVRIR — actions : ouvrir un devis, supprimer, ajouter un devis dans un projet
   ================================================================ */
function opn(id){S.cur=id;S.del=null;go(P().items.length?"attachement":"devis")}
function dq(id){if(S.del==id){if(S.mode=="entreprise"){const q=S.projects.find(x=>x.id==id),f=mk(q.name);["ent","adr","rc","nif","nis","art","rib","bq","tva"].forEach(k=>f[k]=q[k]);f.id=q.id;S.projects[S.projects.indexOf(q)]=f;S.del=null;S.bm="✅ Projet réinitialisé : le devis et les attachements sont effacés, les informations de l’entreprise sont conservées."}else{S.projects=S.projects.filter(x=>x.id!=id);S.del=null;if(S.cur==id)S.cur=null}}else S.del=id;go()}
function svw(v){S.vw=v;go()}
function opd(g){const q=S.projects.find(x=>x.grp===g);if(q){S.cur=q.id;go("recapg")}}
function ndd(g){const r=S.projects.find(x=>x.grp===g),p=mk("Nouveau devis");p.id=Date.now()+Math.floor(Math.random()*1000);p.grp=g;if(r)["moa","ent","gar","contrat","objet","doit","adr","rc","nif","nis","art","rib","bq","tva","ret"].forEach(k=>p[k]=r[k]);S.projects.push(p);S.cur=p.id;S.tab="devis";S.del=null;go()}

/* ================================================================
   PAGE OUVRIR — liste des projets et de leurs devis
   ================================================================ */
function vOuvrir(){mg();const bm=S.bm?`<p class="${/^✅/.test(S.bm)?"":"bad"}" style="font-weight:600">${esc(S.bm)}</p>`:"";
if(!S.projects.length)return`<div class="card">Aucun projet enregistré.${bm}<div style="margin-top:10px">${RSB}</div></div>`;
const ent=S.mode=="entreprise",dl=[...new Set(S.projects.map(x=>x.grp).filter(Boolean))];
const rw=q=>`<div class="row" style="margin-top:8px;flex-wrap:nowrap"><button style="flex:1;text-align:left" onclick="opn(${q.id})">${ent?"📁":"📄"} ${esc(q.name)}</button>${ent?"":`<button title="Renommer le devis" onclick="lkt(${q.id})">✏️</button>`}<button ${EXPORT_ON?`title="Exporter en Excel (lecture seule)" onclick="exportX(${q.id})"`:`title="Bientôt disponible" disabled style="opacity:.45"`}>📤 Excel</button><button onclick="dq(${q.id})">${S.del==q.id?(ent?"Confirmer la réinitialisation":"Confirmer la suppression"):(ent?"↺ Réinitialiser":"🗑")}</button></div>${S.lk==q.id?`<div style="margin-top:4px"><input style="width:100%" placeholder="Nom du devis" value="${esc(q.name)}" onchange="rn(${q.id},this.value)"></div>`:""}`;
let list;
if(ent)list=S.projects.map(rw).join("");
else list=dl.map(g=>{const ms=S.projects.filter(x=>x.grp===g),ga=JSON.stringify(g).replace(/"/g,"&quot;");return`<div style="margin-top:14px;padding-top:8px;border-top:1px solid var(--ln)"><div class="row" style="flex-wrap:nowrap"><b style="flex:1">📂 ${esc(g)} <small style="color:var(--mut)">(${ms.length} devis)</small></b><button title="Renommer le projet" onclick="lgt(${ga})">✏️</button><button onclick="dpj(${ga})">${S.dg===g?"Confirmer : supprimer le projet et ses devis":"🗑"}</button></div>${S.lg===g?`<input style="width:100%;margin-top:6px" placeholder="Nom du projet" value="${esc(g)}" onchange="rpj(${ga},this.value)">`:""}<div class="row" style="margin-top:6px"><button onclick="ndd(${ga})">➕ Devis</button>${ms.length>1?`<button onclick="opd(${ga})">📑 Récapitulatives générales</button>`:""}</div>${ms.map(rw).join("")}</div>`}).join("");
return`<div class="card"><b>Projets enregistrés</b>${bm}${list}<div style="margin-top:12px">${RSB}</div></div>`}


/* ================================================================
   ENREGISTRER / IMPRIMER — passage par le formulaire entrepreneur
   ================================================================ */
function fin(a){const p=P();if(!p.ent&&!p.skip){S.back={tab:S.tab,act:a};go("infos");return}act(a)}
function act(a){const p=P();if(a=="print")window.print();else{p.saved=p.saved||{};p.saved[p.sit]=new Date().toLocaleDateString("fr-FR");go()}}
function cont(){const b=S.back;S.back=null;if(b){S.tab=b.tab;go();act(b.act)}else go(S.prev&&S.prev!="infos"?S.prev:"projets")}
function p0(){P().skip=true;cont()}

/* ================================================================
   PAGE INFOS — Entrepreneur et contrat
   ================================================================ */
const EL=()=>{const m=new Map();S.projects.forEach(q=>{const k=(q.ent||"").trim().toLowerCase();if(k&&q.id!==S.cur&&!m.has(k))m.set(k,q)});return[...m.values()]};
function pick(v){if(v==="")return;const q=EL()[+v],p=P();if(q){["ent","adr","rc","nif","nis","art","rib","bq"].forEach(k=>p[k]=q[k]||"")}go()}
function vInfos(p){const f=(l,k,t)=>`<label>${l}<input type="${t||"text"}" ${t=="number"?'step="any"':""} value="${esc(p[k]==null?"":p[k])}" onchange="set('${k}',${t=="number"?"+this.value":"this.value"})"></label>`;
return`<div class="card"><b>Entrepreneur et contrat</b><div style="color:var(--mut);font-size:12px;margin-top:4px">${S.back?"Complétez ces informations avant "+(S.back.act=="print"?"d’imprimer":"d’enregistrer")+". Elles apparaissent sur les documents.":"Ces informations apparaissent sur les documents imprimés. Elles ne sont pas nécessaires pour un simple essai."}</div></div>
<div class="card"><b>Formulaire de l’entrepreneur</b>${S.mode=="bureau"&&EL().length?`<label style="margin-top:8px">Entreprise déjà enregistrée<select onchange="pick(this.value)"><option value="">— Choisir dans la liste —</option>${EL().map((q,i)=>`<option value="${i}">${esc(q.ent)}</option>`).join("")}</select></label>`:""}<div class="grid" style="margin-top:8px">${f("Nom : ETB / TCE …","ent")}${f("Adresse","adr")}${f("RC (numéro, date et lieu)","rc")}${f("NIF","nif")}${f("NIS","nis")}${f("N° d’article","art")}${f("N° de compte (agence, banque)","rib")}</div></div>
<div class="card"><b>Contrat</b><div class="grid" style="margin-top:8px">${f("Nom du devis","name")}${f("Contrat n°","contrat")}${f("Objet du contrat","objet")}${f("Montant du contrat (DA TTC)","montant","number")}${f("Doit à (ex. Monsieur le directeur de …)","doit")}${f("Maître d’ouvrage","moa")}${f("TVA (%)","tva","number")}${f("Taux de garantie (%)","ret","number")}<label>Garantie<select onchange="set('gar',this.value)"><option value="caution" ${(p.gar||"retenue")=="caution"?"selected":""}>Caution bancaire (sans retenue)</option><option value="retenue" ${(p.gar||"retenue")=="retenue"?"selected":""}>Retenue sur les paiements</option></select></label></div></div>
<div class="card row np"><button class="pri" onclick="cont()">${S.back?"Valider et continuer":"Valider"}</button>${S.back?`<button onclick="p0()">Continuer sans remplir</button>`:""}</div>`}

/* ================================================================
   OUTILS COMMUNS DES TABLEAUX — formats des quantités (m³), sous-totaux par lot
   ================================================================ */
/* Quantités et montants : voir « PRÉCISION » dans core.js (jamais d'arrondi, on coupe) */
const qs=(it,x)=>{const d=isM3(it.u)?3:2;return tr(x,d).toLocaleString("fr-FR",{minimumFractionDigits:d,maximumFractionDigits:d})};
const Q=(it,x)=>`<td class="r">${qs(it,x)}</td>`,qv=(it,x)=>isM3(it.u)?tr(x,3).toFixed(3):x;
const isP=l=>/^\s*(s\/|sous)/i.test(l),sv2=(p,i,f,lb)=>{const it=p.items[i],part=isP(lb);let a=0;for(let j=i;j>=0;j--){const x=p.items[j];if(x.lot!==it.lot)break;if(j<i&&x.sub&&(part||x.sub.some(l=>!isP(l))))break;a=ta(a+f(x))}return a};
const sbr=(p,i,k,fs,bl)=>(p.items[i].sub||[]).map(lb=>`<tr class="tot"><td colspan="${k}">${esc(lb)}</td>${fs.map((f,j)=>{const v=sv2(p,i,f,lb);return`<td class="r">${bl&&bl[j]&&Math.abs(v)<0.01?"":fp(v)}</td>`}).join("")}</tr>`).join("");
const hd=(p,i,w)=>{const it=p.items[i];if(it.pre)return it.pre.map(h=>h.l?`<tr><td colspan="${w}"><b>${esc(h.t)}</b></td></tr>`:`<tr><td class="s1">${esc(h.k||"")}</td><td class="s2"><div class="dz"><i>${esc(h.t)}</i></div></td>${"<td></td>".repeat(Math.max(w-2,0))}</tr>`).join("");
const q=p.items[i-1]||{},o=[];
if(it.lot&&it.lot!==q.lot)o.push(`<tr><td colspan="${w}"><b>${esc(it.lot)}</b></td></tr>`);
if(it.par&&(it.par!==q.par||it.lot!==q.lot))o.push(`<tr><td>${esc(it.pk||"")}</td><td colspan="${w-1}"><i>${esc(it.par)}</i></td></tr>`);
return o.join("")};

/* ================================================================
   PAGE DEVIS — tableau du devis, « Coller ici »
   ================================================================ */
function vDevis(p){const r=calc(p),lo=p.lock;
const rows=p.items.map((it,i)=>`${hd(p,i,lo?6:7)}<tr>`+(lo?`<td class="s1">${esc(it.n||"")}</td><td class="ds s2"><div class="dz">${esc(it.d)}</div></td><td>${esc(it.u)}</td>${Q(it,it.q)}<td class="r">${fmt(it.pu)}</td>`:`<td><input value="${esc(it.n||"")}" style="min-width:64px" onchange="si(${i},'n',this.value)"></td><td class="d"><input value="${esc(it.d)}" onchange="si(${i},'d',this.value)"></td><td><input value="${esc(it.u)}" style="min-width:48px" onchange="si(${i},'u',this.value)"></td><td><input type="number" step="any" value="${qv(it,it.q)}" onchange="si(${i},'q',+this.value)"></td><td><input type="number" step="any" value="${it.pu}" onchange="si(${i},'pu',+this.value)"></td>`)+`<td class="r">${fmt(Mt(it,it.q))}</td>`+(lo?"":`<td><button onclick="di(${i})">×</button></td>`)+`</tr>`+sbr(p,i,5,[it=>Mt(it,it.q)]).replace(/<\/tr>/g,lo?"</tr>":"<td></td></tr>")).join("");
const rec=c=>/devis|init/i.test(c.nm),tol=c=>1+c.it.length*0.01,
rv=(c,i)=>{const w=c.it.w||[],ck=c.it.chk,eq=ck&&Math.abs(ck.mS-ck.mN)<=tol(c),bd=w.length||(ck&&!eq);
return`<div style="margin-top:10px;padding-top:8px;border-top:1px solid var(--ln)">${CAND.length>1?`<b>Onglet « ${esc(c.nm)} »${rec(c)?" (conseillé)":""}</b><br>`:""}${c.it.length} articles lus · total HT calculé : <b>${fmt(c.t)} DA</b>${ck?`<br>Total des montants du fichier : <b>${fmt(ck.mS)} DA</b> ${eq?"✅ identique":"⚠️ écart de "+fmt(Math.abs(ck.mS-ck.mN))+" DA"}`:`<br><span style="color:var(--mut)">Aucun montant n’est indiqué dans les données : le total ne peut pas être contrôlé automatiquement. Comparez-le vous-même avec votre devis.</span>`}${w.length?`<div class="bad" style="margin-top:6px"><b>⚠️ ${w.length} point(s) à vérifier :</b><ul style="margin:4px 0 0 18px;padding:0">${w.slice(0,25).map(x=>`<li>${esc(x)}</li>`).join("")}</ul>${w.length>25?`<div>… et ${w.length-25} autre(s).</div>`:""}</div>`:`<div style="margin-top:6px">✅ Aucune anomalie détectée.</div>`}<div class="row" style="margin-top:8px"><button class="${bd?"":"pri"}" onclick="use(${i})">${bd?"Importer quand même":"✅ Valider l’import"}</button></div></div>`},
ch=CAND.length?`<div class="card" style="border-color:var(--ac)"><b>Contrôle avant import</b><div style="color:var(--mut);font-size:12px;margin:4px 0">Rien n’est importé ni modifié tant que vous n’avez pas validé. Comparez avec votre devis ; en cas de doute, annulez, corrigez le fichier et rechargez-le.${CAND[0]&&CAND[0].nm=="Texte collé"?"<br>Les numéros de ligne correspondent au texte collé (sans en-tête).":""}</div>${CAND.map(rv).join("")}<div class="row" style="margin-top:10px"><button onclick="cn()">↩️ Annuler</button></div></div>`:"";
const nc=lo?6:7,pzr=(lo&&p.items.length)?"":`<tr class="np"><td colspan="${nc}" style="padding:8px;background:var(--bg)">${S.pz?`<input style="width:100%;margin-bottom:6px" placeholder="Nom du devis (ex. : Devis 1 – Gros œuvre)" value="${esc(S.pn||"")}" oninput="spn(this.value)"><div style="font-size:12px;color:var(--mut);margin-bottom:4px">Collez ici les lignes de votre devis copiées depuis Excel ou Google Sheets, <b>sans la ligne d’en-tête</b>. Colonnes dans cet ordre : Code – Désignation – Unité – Quantité – Prix unitaire – Montant.${p.items.length?" <b>Elles remplaceront les lignes actuelles.</b>":""}</div><textarea rows="8" placeholder="Collez ici…" style="width:100%;font-size:12px;border:1px solid var(--ln);border-radius:8px;padding:8px;background:var(--in);color:var(--tx)" oninput="spt(this.value)">${esc(S.pt||"")}</textarea><div class="row" style="margin-top:6px"><button class="pri" onclick="pza()">🔍 Analyser</button><button onclick="pzs()">Fermer</button></div>`:`<button class="pri" onclick="pzs()">📋 Coller ici</button> <span style="font-size:12px;color:var(--mut)">les lignes du devis <b>sous la ligne d’en-tête</b> (sans l’en-tête), dans l’ordre : Code – Désignation – Unité – Quantité – Prix unitaire – Montant${p.items.length?" · remplacera les lignes actuelles":""}</span>`}</td></tr>`;
return ch+`<div class="card">
<div class="np" style="margin:8px 0">${IMPORT_FILE_ON?`<label class="btn pri">📄 Importer un devis<input type="file" accept=".xlsx,.xls,.csv" style="display:none" onchange="imp(this)"></label>`:`<button disabled title="Bientôt disponible" style="opacity:.45">📄 Importer un devis</button>`}</div>${S.msg?`<p class="${/^\d/.test(S.msg)?"":"bad"}" style="font-weight:600">${esc(S.msg)}</p>`:""}
${lo?`<p>🔒 Devis importé : quantités, prix et montants non modifiables.</p>`:""}
<div class="sc"><table><tr><th class="s1">Code</th><th class="s2">Désignation</th><th>U</th><th>Quantité</th><th>P-U</th><th class="r">Montant</th>${lo?"":"<th></th>"}</tr>${pzr}${rows}<tr class="tot"><td colspan="5">Total du devis HT (DA)</td><td class="r">${fmt(r.mi)}</td>${lo?"":"<td></td>"}</tr></table></div>${lo?"":`<div class="np" style="margin-top:8px"><button onclick="ai()">+ Ligne</button></div>`}</div>`}
function val(){const p=P();p.val=p.val||{};p.val[p.sit]=new Date().toLocaleDateString("fr-FR");go()}

/* ================================================================
   PAGE ATTACHEMENT
   ================================================================ */
function vAtt(p){calc(p);const n=p.sit,vd=!!(p.val&&p.val[n]),pvt=p.items.reduce((a,it)=>ta(a+Mt(it,Math.max(it.raw-it.qm,0))),0);
const rows=p.items.map((it,i)=>{const pv=Math.max(it.raw-it.qm,0);return`${hd(p,i,8)}<tr><td class="s1">${esc(it.n||"")}</td><td class="ds s2"><div class="dz">${esc(it.d)}</div></td><td>${esc(it.u)}</td>${Q(it,it.qm)}${Q(it,it.rawp)}<td><input type="number" step="any" inputmode="decimal" ${vd?"disabled":""} value="${it.mr?qv(it,it.mr):""}" onwheel="this.blur()" onchange="sm(${i},+this.value)"></td>${Q(it,it.raw)}<td class="r ${pv>1e-9?"bad":""}">${qs(it,pv)}</td></tr>`}).join("");
return selS(p)+`<div class="card sc ${vd?"off":""}"><b>Attachement n° ${n}</b><table><tr><th class="s1">Code</th><th class="s2">Désignation</th><th>U</th><th class="r">Quantité marché</th><th class="r">Précédent</th><th>Mois</th><th class="r">Cumulé</th><th class="r">Plus-value</th></tr>${rows}</table>${pvt>0?`<p class="bad">Plus-values transférées automatiquement aux Avenants : ${fmt(pvt)} DA HT</p>`:""}</div>
<div class="card np">${vd?`🔒 Attachement n° ${n} validé le ${p.val[n]} : il n’est plus modifiable.`:`Le passage à l’attachement suivant n’est possible qu’après la validation de celui-ci.`}<div class="row" style="margin-top:8px">${vd?(n<12?`<button class="pri" onclick="nx()">➡️ Passer à l’attachement n° ${n+1}</button>`:""):`<button class="pri" onclick="val()">✅ Valider l’attachement n° ${n}</button>`}<button onclick="fin('print')">🖨️ Imprimer</button></div></div>`}
const U0=["zéro","un","deux","trois","quatre","cinq","six","sept","huit","neuf","dix","onze","douze","treize","quatorze","quinze","seize","dix-sept","dix-huit","dix-neuf"],D0=["","","vingt","trente","quarante","cinquante","soixante"];
const f99=(n,s)=>{if(n<20)return U0[n];const t=Math.floor(n/10),u=n%10;if(t==7||t==9)return(t==7?"soixante":"quatre-vingt")+(t==7&&u==1?" et ":"-")+U0[10+u];if(t==8)return u?"quatre-vingt-"+U0[u]:s?"quatre-vingts":"quatre-vingt";return D0[t]+(u==1?" et un":u?"-"+U0[u]:"")};
const f3=(n,s)=>{const h=Math.floor(n/100),r=n%100;return(h?(h==1?"cent":U0[h]+" cent")+(h>1&&!r&&s?"s":""):"")+(h&&r?" ":"")+(r?f99(r,s):"")};
const fr=n=>{if(!n)return"zéro";const m=Math.floor(n/1e6),k=Math.floor(n%1e6/1e3),r=n%1e3,o=[];if(m)o.push(m==1?"un million":f3(m,1)+" millions");if(k)o.push(k==1?"mille":f3(k,0)+" mille");if(r)o.push(f3(r,1));return o.join(" ")};
const lettres=(x,w)=>{x=ta(x);let e=Math.floor(x+1e-7),c=Math.round((x-e)*100);if(c==100){e++;c=0}return(fr(e)+(e==1?" dinar":" dinars")+(c?" et "+(w?fr(c):c)+(c==1?" centime":" centimes"):"")).toUpperCase()};

/* ================================================================
   EN-TÊTE COMMUN des documents imprimés
   ================================================================ */
const hdr=p=>`<div style="font-size:12px;line-height:1.5">${esc(p.ent||"")}${p.adr?"<br>"+esc(p.adr):""}</div>`;

/* ================================================================
   PAGE DÉCOMPTE
   ================================================================ */
function vDec(p){const r=calc(p),g={},C=x=>`<td class="r">${fp(x)}</td>`;
const rows=p.items.map((it,i)=>{const k=it.lot||"Sans lot",o=g[k]=g[k]||[0,0,0,0];o[0]=ta(o[0]+Mq(it));o[1]=ta(o[1]+Mp(it));o[2]=ta(o[2]+Mm(it));o[3]=ta(o[3]+Mc(it));
return hd(p,i,12)+`<tr><td class="s1">${esc(it.n||"")}</td><td class="ds s2"><div class="dz">${esc(it.d)}</div></td><td>${esc(it.u)}</td>${Q(it,it.qm)}${Q(it,it.pr)}${Q(it,it.mo)}${Q(it,it.cu)}<td class="r">${fmt(it.pu)}</td>${C(Mq(it))}${C(Mp(it))}${C(Mm(it))}${C(Mc(it))}</tr>`+sbr(p,i,8,[Mq,Mp,Mm,Mc])}).join("");
const tv=[r.mm,r.prev,r.mois,r.cum],T3=["TOTAL EN HT","TVA "+p.tva+" %","TOTAL EN TTC"].map((l,k)=>`<tr class="tot"><td colspan="8">${l}</td>${D4(tv,p.tva)[k].map(C).join("")}</tr>`).join("");
const rec=Object.entries(g).map(([k,o])=>{const m=k.match(/^(LOT\s*\d+\s*\)?)\s*(.*)$/i);return`<tr><td>${esc(m?m[1]:"")}</td><td>${esc(m?m[2]:k)}</td>${o.map(C).join("")}</tr>`}).join(""),ct=[0,1,2,3].map(i=>Object.values(g).reduce((a,o)=>ta(a+o[i]),0));
const R3=["TOTAL GÉNÉRAL en H.T","T.V.A "+p.tva+" %","TOTAL GÉNÉRAL en T.T.C"].map((l,k)=>`<tr class="tot"><td colspan="2">${l}</td>${D4(ct,p.tva)[k].map(C).join("")}</tr>`).join("");
const ce=`style="text-align:center"`;
return selS(p)+`<div class="land"><div class="card sc">${hdr(p)}${PJ(p)}<b>DÉCOMPTE N° ${p.sit}</b> (DA)<table style="margin-top:6px"><tr><th rowspan="2" class="s1">CODE</th><th rowspan="2" class="s2">DÉSIGNATION DES OUVRAGES</th><th rowspan="2">U</th><th colspan="4" ${ce}>Quantité</th><th rowspan="2" class="r">P-U</th><th colspan="4" ${ce}>Montant</th></tr><tr><th class="r">Marché</th><th class="r">Précédent</th><th class="r">Mois</th><th class="r">Cumulé</th><th class="r">Marché</th><th class="r">Précédent</th><th class="r">Mois</th><th class="r">Cumulé</th></tr>${rows}${T3}</table></div>
<div class="card sc pgb"><b>RÉCAPITULATION DU DEVIS ESTIMATIF</b><table style="margin-top:6px"><tr><th>N°</th><th>Désignation des ouvrages</th><th class="r">Marché</th><th class="r">Précédent</th><th class="r">Mois</th><th class="r">Cumul</th></tr>${rec}${R3}</table></div></div>
<div class="row np"><button onclick="fin('print')">🖨️ Imprimer</button></div>`}

/* ================================================================
   PAGE SITUATION
   ================================================================ */
function vSit(p){const r=calc(p),n=p.sit,Z={af:0,aa:0,ao:0,rf:0,ra:0,ro:0,pen:0},A=k=>{const o=Object.assign({},Z,p.adj[k]||{});if(o.av&&!o.rf)o.rf=o.av;return o},a=A(n),b=n>1?A(n-1):Z;
const {T1,T2,br,T4,ht,tva,ttc,ret,rt,net,cau}=sitCalc(r,a,b,p);
const Rw=(l,v,c)=>`<tr class="${c||""}"><td>${l}</td><td class="r">${v}</td></tr>`,Ri=(l,k)=>`<tr><td>${l}</td><td class="r">${fp(a[k])}</td></tr>`;
return selS(p)+`<div class="card sitp">${idBlock(p)}<h3 style="margin:8px 0 4px">SITUATION N° ${n}</h3>
<table style="width:100%;min-width:0"><tr><th>SITUATION ARRÊTÉE AU …</th><th class="r">MONTANT en DA</th></tr>${Rw("Montant des travaux cumulés ( H.T )",fp(r.cum))}${Ri("Avance forfaitaire totale ( H.T )","af")}${Ri("Avance sur approvisionnement totale ( H.T )","aa")}${Ri("Autres :","ao")}${Rw("TOTAL (1) ( H.T )",fp(T1),"tot")}
<tr><td><i>Déduire</i></td><td></td></tr>${Rw("Montant des travaux réalisés précédemment",fp(r.prev))}${Rw("Avance forfaitaire totale ( H.T )",fp(b.af))}${Rw("Avance sur approvisionnement totale ( H.T )",fp(b.aa))}${Rw("Autres :",fp(b.ao))}${Rw("TOTAL (2) ( H.T )",fp(T2),"tot")}
${Rw("Montant brut de la situation TOTAL (3) = (1) − (2)",fp(br),"tot")}<tr><td><i>Remboursement à effectuer :</i></td><td></td></tr>${Ri("Avance forfaitaire","rf")}${Ri("Avance sur approvisionnement","ra")}${Ri("Autres ( à préciser ) :","ro")}${Rw("TOTAL (4) ( H.T )",fp(T4),"tot")}
${Rw("Montant HT de la situation (5) = (3) − (4)",fp(ht),"tot")}${Rw("T.V.A (6) "+p.tva+" %",fp(tva))}${Rw("Montant de la situation en TTC (7) = (5) + (6)",fp(ttc),"tot")}${ret?Rw("Retenue de garantie "+p.ret+" %","− "+fp(rt)):""}${Ri("Pénalités de retard","pen")}${Rw("NET À PAYER ( en toutes taxes )",fp(net),"net")}</table>
${ret?"":`<div style="color:var(--mut);font-size:12px;margin-top:6px">Caution de garantie (${p.ret} %) : ${fmt(cau)} DA</div>`}
<p>Le montant net à payer par la présente situation s’élève à la somme de ( en toutes taxes ) :<br><b>${lettres(net,0)}</b></p>
<div style="margin-top:8px">Fait à …………… le ……………</div>
<div class="row np" style="margin-top:10px"><button class="pri" onclick="fin('save')">💾 Enregistrer</button><button onclick="fin('print')">🖨️ Imprimer</button><button onclick="go('infos')">👷 Entrepreneur et contrat</button></div>${p.saved&&p.saved[p.sit]?`<div style="color:var(--mut);font-size:12px;margin-top:6px">✅ Enregistrée le ${p.saved[p.sit]}</div>`:""}</div>`}
const selA=p=>`<div class="card np"><label style="width:150px">Avenant n°<select onchange="set('avn',+this.value)">${[...Array(12)].map((_,i)=>`<option ${i+1==(p.avn||1)?"selected":""}>${i+1}</option>`).join("")}</select></label></div>`;
function sq(i,v){const p=P(),it=p.items[i],n=p.avn||1;IT(it);it.av[n-1]=Math.round((v-it.q-it.av.slice(0,n-1).reduce((a,b)=>a+b,0))*1e6)/1e6;go()}

/* ================================================================
   PAGE AVENANTS
   ================================================================ */
function vAv(p){const r=calc(p),n=p.avn||1,ln=Math.max(0,...p.items.flatMap(it=>it.av.map((x,k)=>x?k+1:0))),au=n==Math.max(n,ln),R6=x=>Math.round(x*1e6)/1e6;
let prT=0;const L=p.items.map((it,i)=>{const t=x=>tz(it,x),pr=t(t(it.q)+it.av.slice(0,n-1).reduce((a,b)=>a+t(b),0)),nq=t(au?it.qa:pr+t(it.av[n-1]||0));prT=ta(prT+Mt(it,pr));return{it,i,d:t(nq-pr),v:ta(Mt(it,nq)-Mt(it,pr))}});
const pg=sg=>{const ls=L.filter(x=>sg*x.d>1e-9),sl=lot=>ls.filter(y=>y.it.lot===lot).reduce((a,y)=>ta(a+sg*y.v),0);let T=0;
const rows=ls.map((x,j)=>{const it=x.it,q=sg*x.d,m=sg*x.v,pv=ls[j-1],nx=ls[j+1];T=ta(T+m);
return(it.lot&&(!pv||pv.it.lot!==it.lot)?`<tr><td colspan="6"><b>${esc(it.lot)}</b></td></tr>`:"")+`<tr><td class="s1">${esc(it.n||"")}</td><td class="ds s2"><div class="dz">${esc(it.d)}</div></td><td>${esc(it.u)}</td>${Q(it,q)}<td class="r">${fmt(it.pu)}</td><td class="r">${fp(m)}</td></tr>`+(it.lot&&(!nx||nx.it.lot!==it.lot)?`<tr class="tot"><td colspan="5">TOTAL ${esc(it.lot)}</td><td class="r">${fp(sl(it.lot))}</td></tr>`:"")}).join("")||`<tr><td colspan="6"><i>Aucun article.</i></td></tr>`;
return{rows,T}};
const A=pg(1),B=pg(-1),F=(l,v)=>`<tr class="tot"><td colspan="5">${l}</td><td class="r">${fp(v)}</td></tr>`,
th=`<tr><th class="s1">CODE</th><th class="s2">DÉSIGNATION DES OUVRAGES</th><th>U</th><th class="r">Quantité</th><th class="r">P-U</th><th class="r">Montant</th></tr>`,
hh=t=>`${hdr(p)}${PJ(p)}<b>AVENANT N° ${n} : ${t}</b>`,
nv=ta(prT+A.T-B.T),Rc=(l,v,c)=>`<tr class="${c||""}"><td>${l}</td><td class="r">${fp(v)}</td></tr>`;
return selA(p)+`<div class="card np"><label style="flex-direction:row;align-items:center;gap:8px;font-size:14px;color:var(--tx)"><input type="checkbox" style="width:auto" ${p.done?"checked":""} onchange="set('done',this.checked)"> Travaux terminés</label><div style="font-size:12px;color:var(--mut);margin-top:4px">Cochée : les quantités non réalisées passent en moins-value (page « Travaux en Diminution »).</div></div>
<div class="card sc">${hh("TRAVAUX SUPPLÉMENTAIRES")}<table style="margin-top:6px">${th}${A.rows}${F("TOTAL EN HT",A.T)}${F("TVA "+p.tva+" %",TVx(A.T,p.tva))}${F("TOTAL EN TTC",TT(A.T,p.tva))}</table><p>Arrêté le montant des travaux supplémentaires à la somme de (en TTC) :<br><b>${lettres(TT(A.T,p.tva),1)}</b></p></div>
<div class="card sc pgb">${hh("TRAVAUX EN DIMINUTION")}<table style="margin-top:6px">${th}${B.rows}${F("TOTAL EN HT",B.T)}${F("TVA "+p.tva+" %",TVx(B.T,p.tva))}${F("TOTAL EN TTC",TT(B.T,p.tva))}</table><p>Arrêté le montant des travaux en diminution à la somme de (en TTC) :<br><b>${lettres(TT(B.T,p.tva),1)}</b></p></div>
<div class="card sc pgb">${hh("RÉCAPITULATIF")}<table style="margin-top:6px">${Rc("MONTANT DU MARCHÉ INITIAL EN HT",r.mi)}${n>1?Rc("Montant du marché avant l’avenant n° "+n+" ( HT )",prT):""}${Rc("+ Travaux supplémentaires ( HT )",A.T)}${Rc("− Travaux en diminution ( HT )",B.T)}${Rc("NOUVEAU MONTANT DU MARCHÉ EN HT",nv,"tot")}${Rc("TVA "+p.tva+" %",TVx(nv,p.tva))}${Rc("NOUVEAU MONTANT DU MARCHÉ EN TTC",TT(nv,p.tva),"tot")}</table></div>
<div class="row np"><button onclick="fin('print')">🖨️ Imprimer</button></div>`}
function aa(){P().items.push({n:"",d:"Nouvel article (avenant)",u:"u",q:0,pu:0,lot:"",m:Array(12).fill(0),av:[0,0,0]});go()}

/* ================================================================
   PAGE DGD — décompte général définitif
   ================================================================ */
function vDgd(p){calc(p);const T=[0,0,0,0],G={};
const rows=p.items.map((it,i)=>{const q=[it.qm,it.tot,Math.max(it.tot-it.qm,0),Math.max(it.qm-it.tot,0)],v=DV(it);v.forEach((x,j)=>T[j]=ta(T[j]+x));const gk=it.lot||"Sans lot",g2=G[gk]=G[gk]||[0,0,0,0];v.forEach((x,j)=>g2[j]=ta(g2[j]+x));
return hd(p,i,12)+`<tr><td class="s1">${esc(it.n||"")}</td><td class="ds s2"><div class="dz">${esc(it.d)}</div></td><td>${esc(it.u)}</td>${q.map(x=>Q(it,x)).join("")}<td class="r">${fmt(it.pu)}</td>${v.map(x=>`<td class="r">${fp(x)}</td>`).join("")}</tr>`+sbr(p,i,8,[it=>DV(it)[0],it=>DV(it)[1],it=>DV(it)[2],it=>DV(it)[3]],[0,0,1,1])}).join("");
const g4=G4(T,p.tva),tv=g4[1],tt=g4[2],F=(l,a)=>`<tr class="tot"><td colspan="8">${l}</td>${a.map((x,j)=>`<td class="r">${j>1&&Math.abs(x)<0.01?"":fp(x)}</td>`).join("")}</tr>`,ce=`style="text-align:center"`;
return`<div class="card np"><label style="flex-direction:row;align-items:center;gap:8px;font-size:14px;color:var(--tx)"><input type="checkbox" style="width:auto" ${p.done?"checked":""} onchange="set('done',this.checked)"> Travaux terminés</label></div>
<div class="land"><div class="card sc">${hdr(p)}<b>DÉCOMPTE GÉNÉRAL DÉFINITIF</b>${PJ(p)}<table style="margin-top:6px"><tr><th rowspan="2" class="s1">N°</th><th rowspan="2" class="s2">Désignation</th><th rowspan="2">U</th><th colspan="4" ${ce}>Quantité</th><th rowspan="2" class="r">P.U.</th><th colspan="4" ${ce}>Montant</th></tr><tr><th class="r">Marché</th><th class="r">Réalisé</th><th class="r">Plus-value</th><th class="r">Moins-value</th><th class="r">Marché</th><th class="r">Réalisé</th><th class="r">Plus-value</th><th class="r">Moins-value</th></tr>${rows}${F("TOTAL EN HT",T)}${F("TVA "+p.tva+"%",tv)}${F("TOTAL EN TTC",tt)}</table>
<p>Arrêté le montant du présent DGD à la somme de (en TTC) :<br><b>${lettres(tt[1],1)}</b></p>
<div class="row np" style="margin-top:8px"><button onclick="fin('print')">🖨️ Imprimer</button></div></div>
<div class="card sc pgb"><b>RÉCAPITULATION DU DÉCOMPTE GÉNÉRAL DÉFINITIF</b> (DA)${PJ(p)}<table style="margin-top:6px"><tr><th>N°</th><th>Désignation des ouvrages</th><th class="r">Marché</th><th class="r">Réalisé</th><th class="r">Plus-value</th><th class="r">Moins-value</th></tr>${Object.entries(G).map(([k,o])=>{const m=k.match(/^(LOT\s*\d+\s*\)?)\s*(.*)$/i);return`<tr><td>${esc(m?m[1]:"")}</td><td>${esc(m?m[2]:k)}</td>${o.map((x,j)=>`<td class="r">${j>1&&Math.abs(x)<0.01?"":fp(x)}</td>`).join("")}</tr>`}).join("")}${[["TOTAL GÉNÉRAL en H.T",T],["T.V.A "+p.tva+" %",tv],["TOTAL GÉNÉRAL en T.T.C",tt]].map(([l,a])=>`<tr class="tot"><td colspan="2">${l}</td>${a.map((x,j)=>`<td class="r">${j>1&&Math.abs(x)<0.01?"":fp(x)}</td>`).join("")}</tr>`).join("")}</table></div></div>`}

/* ================================================================
   MENU DU BAS — liste des onglets
   ================================================================ */
const TABS=[["projets","🏠","Accueil"],["devis","📄","Devis"],["attachement","📎","Attachement"],["decompte","🧮","Décompte"],["situation","🧾","Situation"],["avenants","➕","Avenants"],["dgd","🏁","DGD"]];

/* ================================================================
   RÉCAPITULATIVES GÉNÉRALES — outils (devis d’un même projet, calculs communs)
   ================================================================ */
const GM=p=>p&&p.grp?S.projects.filter(x=>x.grp&&x.grp===p.grp):[];
function rn(id,v){const q=S.projects.find(x=>x.id==id);v=(v||"").trim();if(q&&v)q.name=v;go()}
function sg(id,v){const q=S.projects.find(x=>x.id==id);if(q)q.grp=(v||"").trim();go()}
function lkt(id){S.lk=S.lk==id?null:id;go()}
const sitNums=(q,n)=>{const s0=q.sit;q.sit=n;try{const r=calc(q),Z={af:0,aa:0,ao:0,rf:0,ra:0,ro:0,pen:0},A=k=>{const o=Object.assign({},Z,(q.adj||{})[k]||{});if(o.av&&!o.rf)o.rf=o.av;return o},a=A(n),b=n>1?A(n-1):Z,
S0=sitCalc(r,a,b,q),{T1,T2,br,T4,ht,tva,ttc,ret,rt,net}=S0,cau=ret?0:S0.cau,g={};
q.items.forEach(it=>{const k=it.lot||"Sans lot",o=g[k]=g[k]||[0,0,0,0];o[0]=ta(o[0]+Mq(it));o[1]=ta(o[1]+Mp(it));o[2]=ta(o[2]+Mm(it));o[3]=ta(o[3]+Mc(it))});
return{cum:r.cum,prev:r.prev,g,T1,T2,br,T4,ht,tva,ttc,rt,pen:S0.pen,net,cau,ret}}finally{q.sit=s0;calc(q)}};
const gnav=c=>`<div class="row np" style="margin:0 0 8px">${[["g","Décompte","recapg"],["s","Situation","recaps"],["a","Avenants","recapa"],["d","DGD","recapd"]].map(([k,l,t])=>`<button class="${k==c?"pri":""}" onclick="go('${t}')">${l}</button>`).join("")}</div>`;
const avNums=(q,n)=>{calc(q);const ln=Math.max(0,...q.items.flatMap(it=>it.av.map((x,k)=>x?k+1:0))),au=n==Math.max(n,ln),A={},B={};let TA=0,TB=0,prT=0;
q.items.forEach(it=>{const t=x=>tz(it,x),pr=t(t(it.q)+it.av.slice(0,n-1).reduce((a,b)=>a+t(b),0)),nq=t(au?it.qa:pr+t(it.av[n-1]||0)),d=t(nq-pr),k=it.lot||"Sans lot";prT=ta(prT+Mt(it,pr));if(d>1e-9){const m=ta(Mt(it,nq)-Mt(it,pr));A[k]=ta((A[k]||0)+m);TA=ta(TA+m)}else if(d<-1e-9){const m=ta(Mt(it,pr)-Mt(it,nq));B[k]=ta((B[k]||0)+m);TB=ta(TB+m)}});
return{A,B,TA,TB,prT}};

/* ================================================================
   RÉCAPITULATIVE GÉNÉRALE — AVENANTS
   ================================================================ */
function vRecA(p){const ms=GM(p),n=p.avn||1;
if(ms.length<2)return`<div class="card">Ce projet ne contient qu’un seul devis. Dans « Ouvrir », le bouton « ➕ Devis » permet d’en ajouter.</div>`;
const C=x=>`<td class="r">${fp(x)}</td>`,N=ms.map(q=>({q,s:avNums(q,n),mi:calc(q).mi})),same=ms.every(q=>q.tva==ms[0].tva),tl=(l)=>l+(same?" "+ms[0].tva+" %":"");
const pg=(key,tk,ttl,sg)=>{const tot=N.reduce((a,x)=>ta(a+x.s[tk]),0),tv=N.reduce((a,x)=>ta(a+TVx(x.s[tk],x.q.tva)),0),rows=N.map(({q,s})=>`<tr><td colspan="3"><b>${esc(q.name)}</b></td></tr>`+(Object.keys(s[key]).length?Object.entries(s[key]).map(([k,v])=>{const m=k.match(/^(LOT\s*\d+\s*\)?)\s*(.*)$/i);return`<tr><td>${esc(m?m[1]:"")}</td><td>${esc(m?m[2]:k)}</td>${C(v)}</tr>`}).join(""):`<tr><td colspan="3"><i>Aucun article.</i></td></tr>`)+`<tr class="tot"><td colspan="2">TOTAL ${esc(q.name)} ( H.T )</td>${C(s[tk])}</tr>`).join("");
return`<div class="card sc${sg?" pgb":""}">${hdr(p)}<div>PROJET : ${esc(p.grp)}</div><b>RÉCAPITULATIVE GÉNÉRALE – AVENANT N° ${n} : ${ttl}</b> (DA)<table style="margin-top:6px"><tr><th>N°</th><th>Désignation des ouvrages</th><th class="r">Montant</th></tr>${rows}<tr class="tot"><td colspan="2">TOTAL GÉNÉRAL en H.T</td>${C(tot)}</tr><tr class="tot"><td colspan="2">${tl("T.V.A")}</td>${C(tv)}</tr><tr class="tot"><td colspan="2">TOTAL GÉNÉRAL en T.T.C</td>${C(ta(tot+tv))}</tr></table><p>Arrêté le montant à la somme de (en TTC) :<br><b>${lettres(ta(tot+tv),1)}</b></p></div>`};
const rc=N.map(({q,s,mi})=>`<tr><td>${esc(q.name)}</td>${[mi,s.prT,s.TA,s.TB,ta(s.prT+s.TA-s.TB)].map(C).join("")}</tr>`).join(""),sm=f=>N.reduce((a,x)=>ta(a+f(x)),0),nv=sm(x=>ta(x.s.prT+x.s.TA-x.s.TB)),nvt=sm(x=>TVx(x.s.prT+x.s.TA-x.s.TB,x.q.tva));
return selA(p)+gnav("a")+pg("A","TA","TRAVAUX SUPPLÉMENTAIRES",false)+"\n"+pg("B","TB","TRAVAUX EN DIMINUTION",true)+`
<div class="card sc pgb">${hdr(p)}<div>PROJET : ${esc(p.grp)}</div><b>RÉCAPITULATIF GÉNÉRAL – AVENANT N° ${n}</b> (DA)<table style="margin-top:6px"><tr><th>Devis</th><th class="r">Marché initial</th><th class="r">Avant avenant</th><th class="r">+ Supplémentaires</th><th class="r">− Diminution</th><th class="r">Nouveau marché</th></tr>${rc}<tr class="tot"><td>TOTAL GÉNÉRAL en H.T</td>${[sm(x=>x.mi),sm(x=>x.s.prT),sm(x=>x.s.TA),sm(x=>x.s.TB),nv].map(C).join("")}</tr><tr class="tot"><td colspan="5">${tl("T.V.A")}</td>${C(nvt)}</tr><tr class="tot"><td colspan="5">NOUVEAU MONTANT DU MARCHÉ EN T.T.C</td>${C(ta(nv+nvt))}</tr></table></div>
<div class="row np"><button onclick="fin('print')">🖨️ Imprimer</button></div>`}

/* ================================================================
   RÉCAPITULATIVE GÉNÉRALE — DGD
   ================================================================ */
function vRecD(p){const ms=GM(p);
if(ms.length<2)return`<div class="card">Ce projet ne contient qu’un seul devis. Dans « Ouvrir », le bouton « ➕ Devis » permet d’en ajouter.</div>`;
const C=(x,j)=>`<td class="r">${j>1&&Math.abs(x)<0.01?"":fp(x)}</td>`,N=ms.map(q=>{calc(q);const G={},T=[0,0,0,0];q.items.forEach(it=>{const v=DV(it),k=it.lot||"Sans lot",o=G[k]=G[k]||[0,0,0,0];v.forEach((x,j)=>{o[j]=ta(o[j]+x);T[j]=ta(T[j]+x)})});return{q,G,T}}),
tot=[0,1,2,3].map(j=>N.reduce((a,x)=>ta(a+x.T[j]),0)),tvc=[0,1,2,3].map(j=>N.reduce((a,x)=>ta(a+G4(x.T,x.q.tva)[1][j]),0)),same=ms.every(q=>q.tva==ms[0].tva);
const rows=N.map(({q,G,T})=>`<tr><td colspan="6"><b>${esc(q.name)}</b></td></tr>`+Object.entries(G).map(([k,o])=>{const m=k.match(/^(LOT\s*\d+\s*\)?)\s*(.*)$/i);return`<tr><td>${esc(m?m[1]:"")}</td><td>${esc(m?m[2]:k)}</td>${o.map(C).join("")}</tr>`}).join("")+`<tr class="tot"><td colspan="2">TOTAL ${esc(q.name)} ( H.T )</td>${T.map(C).join("")}</tr>`).join("");
const R3=[["TOTAL GÉNÉRAL en H.T",tot],["T.V.A"+(same?" "+ms[0].tva+" %":""),tvc],["TOTAL GÉNÉRAL en T.T.C",tot.map((x,j)=>ta(x+tvc[j]))]].map(([l,a])=>`<tr class="tot"><td colspan="2">${l}</td>${a.map(C).join("")}</tr>`).join(""),ttc=ta(tot[1]+tvc[1]);
return gnav("d")+`<div class="land"><div class="card sc">${hdr(p)}<div>PROJET : ${esc(p.grp)}</div><b>RÉCAPITULATIVE GÉNÉRALE – DÉCOMPTE GÉNÉRAL DÉFINITIF</b> (DA)<div style="font-size:12px;color:var(--mut)">Devis réunis : ${ms.map(q=>esc(q.name)).join(" · ")}</div><table style="margin-top:6px"><tr><th>N°</th><th>Désignation des ouvrages</th><th class="r">Marché</th><th class="r">Réalisé</th><th class="r">Plus-value</th><th class="r">Moins-value</th></tr>${rows}${R3}</table>
<p>Arrêté le montant du présent DGD à la somme de (en TTC) :<br><b>${lettres(ttc,1)}</b></p><div class="row np" style="margin-top:8px"><button onclick="fin('print')">🖨️ Imprimer</button></div></div></div>`}

/* ================================================================
   RÉCAPITULATIVE GÉNÉRALE — DÉCOMPTE et SITUATION
   ================================================================ */
function vRecG(p){return vRecGen(p,"g")}
function vRecS(p){return vRecGen(p,"s")}
function vRecGen(p,part){const n=p.sit,ms=GM(p);
if(ms.length<2)return selS(p)+`<div class="card">Ce projet ne contient qu’un seul devis. Dans « Ouvrir », le bouton « ➕ Devis » permet d’en ajouter.</div>`;
const C=x=>`<td class="r">${fp(x)}</td>`,N=ms.map(q=>({q,s:sitNums(q,n)})),cs=s=>[0,1,2,3].map(i=>Object.values(s.g).reduce((a,o)=>ta(a+o[i]),0)),
sm=f=>N.reduce((a,x)=>ta(a+f(x.s,x.q)),0),same=ms.every(q=>q.tva==ms[0].tva);
const rows=N.map(({q,s})=>`<tr><td colspan="6"><b>${esc(q.name)}</b></td></tr>`+Object.entries(s.g).map(([k,o])=>{const m=k.match(/^(LOT\s*\d+\s*\)?)\s*(.*)$/i);return`<tr><td>${esc(m?m[1]:"")}</td><td>${esc(m?m[2]:k)}</td>${o.map(C).join("")}</tr>`}).join("")+`<tr class="tot"><td colspan="2">TOTAL ${esc(q.name)} ( H.T )</td>${cs(s).map(C).join("")}</tr>`).join("");
const ct=[0,1,2,3].map(i=>N.reduce((a,x)=>ta(a+cs(x.s)[i]),0)),tvc=[0,1,2,3].map(i=>N.reduce((a,x)=>ta(a+D4(cs(x.s),x.q.tva)[1][i]),0));
const R3=["TOTAL GÉNÉRAL en H.T","T.V.A"+(same?" "+ms[0].tva+" %":""),"TOTAL GÉNÉRAL en T.T.C"].map((l,k)=>`<tr class="tot"><td colspan="2">${l}</td>${ct.map((v,i)=>C([v,tvc[i],ta(v+tvc[i])][k])).join("")}</tr>`).join("");
const Rw=(l,v,c)=>`<tr class="${c||""}"><td>${l}</td><td class="r">${v}</td></tr>`,anyRet=N.some(x=>x.s.ret),cau=sm(s=>s.cau),net=sm(s=>s.net);
const det=N.map(({q,s})=>`<tr><td>${esc(q.name)}</td>${[s.ht,s.tva,s.ttc,s.rt,s.pen,s.net].map(C).join("")}</tr>`).join(""),
dt=`<tr class="tot"><td>TOTAL</td>${[sm(s=>s.ht),sm(s=>s.tva),sm(s=>s.ttc),sm(s=>s.rt),sm(s=>s.pen),net].map(C).join("")}</tr>`;
const c1=`<div class="card sc">${hdr(p)}<div>PROJET : ${esc(p.grp)}</div><b>RÉCAPITULATIVE GÉNÉRALE – DÉCOMPTE N° ${n}</b> (DA)<div style="font-size:12px;color:var(--mut)">Devis réunis : ${ms.map(q=>esc(q.name)).join(" · ")}</div><table style="margin-top:6px"><tr><th>N°</th><th>Désignation des ouvrages</th><th class="r">Marché</th><th class="r">Précédent</th><th class="r">Mois</th><th class="r">Cumul</th></tr>${rows}${R3}</table></div>`,
c2=`<div class="card sitp">${hdr(p)}<div>PROJET : ${esc(p.grp)}</div><h3 style="margin:8px 0 4px">SITUATION GÉNÉRALE N° ${n}</h3>
<table style="width:100%;min-width:0"><tr><th>SITUATION ARRÊTÉE AU …</th><th class="r">MONTANT en DA</th></tr>${Rw("Montant des travaux cumulés ( H.T )",fp(sm(s=>s.cum)))}${Rw("TOTAL (1) ( H.T )",fp(sm(s=>s.T1)),"tot")}${Rw("Montant des travaux réalisés précédemment",fp(sm(s=>s.prev)))}${Rw("TOTAL (2) ( H.T )",fp(sm(s=>s.T2)),"tot")}${Rw("Montant brut de la situation TOTAL (3) = (1) − (2)",fp(sm(s=>s.br)),"tot")}${Rw("TOTAL (4) remboursements ( H.T )",fp(sm(s=>s.T4)),"tot")}${Rw("Montant HT de la situation (5) = (3) − (4)",fp(sm(s=>s.ht)),"tot")}${Rw("T.V.A (6)"+(same?" "+ms[0].tva+" %":""),fp(sm(s=>s.tva)))}${Rw("Montant de la situation en TTC (7) = (5) + (6)",fp(sm(s=>s.ttc)),"tot")}${anyRet?Rw("Retenue de garantie","− "+fp(sm(s=>s.rt))):""}${Rw("Pénalités de retard",fp(sm(s=>s.pen)))}${Rw("NET À PAYER ( en toutes taxes )",fp(net),"net")}</table>
${cau>0?`<div style="color:var(--mut);font-size:12px;margin-top:6px">Caution de garantie : ${fmt(cau)} DA</div>`:""}
<p>Le montant net à payer par la présente situation s’élève à la somme de ( en toutes taxes ) :<br><b>${lettres(net,0)}</b></p>
<b style="display:block;margin-top:10px">Détail par devis</b><table style="margin-top:6px"><tr><th>Devis</th><th class="r">Montant HT</th><th class="r">T.V.A</th><th class="r">TTC</th><th class="r">Retenue</th><th class="r">Pénalités</th><th class="r">Net à payer</th></tr>${det}${dt}</table>
<div style="margin-top:8px">Fait à …………… le ……………</div></div>`;
return selS(p)+gnav(part)+(part=="s"?c2:c1)+`<div class="row np"><button onclick="fin('print')">🖨️ Imprimer</button></div>`}

/* ================================================================
   AFFICHAGE — table des pages (VW) et render()
   ================================================================ */
const VW={recapa:vRecA,recaps:vRecS,recapd:vRecD,recapg:vRecG,devis:vDevis,infos:vInfos,attachement:vAtt,decompte:vDec,situation:vSit,avenants:vAv,dgd:vDgd};
function render(){const p=P();if(!VW[S.tab]&&S.tab!="projets"&&S.tab!="ouvrir")S.tab="projets";
$("#pn").textContent=p?(p.grp&&S.mode!="entreprise"?p.grp+" › ":"")+p.name:"Gestion de cabinet d’architecture · modèle algérien";
$("#nav").innerHTML=TABS.map(([k,i,l])=>`<button class="${S.tab==k||(k=="projets"&&(S.tab=="infos"||S.tab=="ouvrir"))?"on":""}" ${k!="projets"&&!p?"disabled":""} onclick="go('${k}')"><span>${i}</span>${l}</button>`).join("");
$("#v").innerHTML=S.tab=="ouvrir"?vOuvrir():S.tab=="projets"||!p?vProj():VW[S.tab](p)}
