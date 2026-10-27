function parseSheet(rows,fx){const num=v=>{let t=String(v).replace(/\s/g,"");const a=t.lastIndexOf("."),b=t.lastIndexOf(",");if(a>=0&&b>=0)t=a>b?t.replace(/,/g,""):t.replace(/\./g,"").replace(",",".");else t=t.replace(",",".");return parseFloat(t)};let c=null,s=0;
for(let i=0;i<Math.min(rows.length,25)&&!c;i++){const r=rows[i].map(x=>String(x).toLowerCase().trim()),f=g=>r.findIndex(g),d=f(x=>/désignation|designation|libellé|libelle/.test(x)),q=f(x=>/^(quant|qté|qte)/.test(x)),pu=f(x=>/^(p[.\-\s]?u|prix)/.test(x));
if(d>=0&&q>=0&&pu>=0){c={k:f(x=>/^(code|n°)/.test(x)),d,u:f(x=>x=="u"||/^unit/.test(x)),q,pu,mt:f(x=>/^montant/.test(x))};s=i+1}}
if(!c&&fx){c={k:0,d:1,u:2,q:3,pu:4,mt:5};rows=rows.map(r=>{const a=Array.from(r);while(a.length<6)a.push("");return a});for(let i=0;i<Math.min(rows.length,5);i++){const t=rows[i].map(x=>String(x).trim()).join(" ");if(/d[ée]signation|libell[ée]/i.test(t)&&!(num(rows[i][3])>0))s=i+1}}
if(!c)return[];
const it=[],W=[],seen={},sn=t=>t.length>40?t.slice(0,40)+"…":t,isT=t=>/(^|[\s\/])total([^a-zà-ÿ]|$)/i.test(t),glob=t=>/g[ée]n[ée]ral|t\.?t\.?c|toutes\s+taxes/i.test(t)||/^\s*total\s*(en\s*)?h\.?t\.?\s*:?\s*$/i.test(t);let lot="",pre=[],mS=0,mN=0,nu=0;
rows.slice(s).forEach((r,ix)=>{const ln=s+ix+1,dd=String(r[c.d]).replace(/\s+/g," ").trim(),k=c.k>=0?String(r[c.k]).trim():"",q=num(r[c.q]),pu=num(r[c.pu]),mt=c.mt>=0?num(r[c.mt]):NaN,last=it[it.length-1];
const sub=lb=>{if(last&&!glob(lb)){(last.sub=last.sub||[]).push(lb);const m=lb.match(/^\s*total\s*lot\s*(\d+)/i);if(m)for(let j=it.length-1;j>=0&&!it[j].lot;j--)it[j].lot="LOT "+m[1]}};
if(!dd){const lb=String(r[c.pu]).trim();if(isT(lb)){sub(lb);return}if(!(q>0)){if(pu>0||mt>0)W.push("Ligne "+ln+" : des montants sont présents mais ni désignation ni quantité. Ligne non reprise.");return}W.push("Ligne "+ln+" : article sans désignation.")}
if(!(q>0)){if(isT(dd)){sub(dd);return}const qc=String(r[c.q]).trim();
if(pu>0)W.push("Ligne "+ln+" « "+sn(dd)+" » : un prix est indiqué mais la quantité est "+(qc===""?"vide":"« "+qc+" »")+". Ligne reprise comme simple titre.");
else if(qc!==""&&q!==0)W.push("Ligne "+ln+" « "+sn(dd)+" » : quantité « "+qc+" » non reconnue. Ligne reprise comme simple titre.");
if(/^lot\s*\d/i.test(dd)){lot=dd;pre.push({t:dd,l:1})}else pre.push({t:dd,k});return}
const puv=pu>=0?pu:0;if(!(pu>=0))W.push("Ligne "+ln+" « "+sn(dd)+" » : prix unitaire absent ou illisible. Il est compté 0.");
if(mt>=0){mS+=mt;mN+=q*puv;if(Math.abs(q*puv-mt)>0.5)W.push("Ligne "+ln+" « "+sn(dd)+" » : quantité × prix = "+fmt(q*puv)+" DA, mais le fichier indique "+fmt(mt)+" DA.")}
const u=c.u>=0?String(r[c.u]).trim():"";if(!u)nu++;
if(k){if(seen[k])W.push("Code "+k+" en double (lignes "+seen[k]+" et "+ln+").");else seen[k]=ln}
it.push({n:k,pre,d:dd,u,q,pu:puv,lot,m:Array(12).fill(0),av:[0,0,0]});pre=[]});
if(pre.length)W.push("Titre(s) en fin de devis sans article, non repris : "+pre.map(x=>"« "+sn(x.t)+" »").join(", ")+".");
if(nu)W.push(nu+" article(s) sans unité.");
if(fx===2&&it.length)W.unshift("Aucune ligne d’en-tête reconnue : lecture par position (Code – Désignation – Unité – Quantité – Prix unitaire – Montant). Vérifiez que cet ordre est bien celui du fichier.");
it.w=W;it.chk=c.mt>=0&&mS>0?{mS,mN}:null;return it}
let CAND=[],FN="";
function use(i){const p=P(),c=CAND[i];p.items=c.it.slice();p.adj={};p.sit=1;p.val={};p.lock=true;if(p.name==="Nouveau projet"&&FN)p.name=FN.replace(/\.[^.]+$/,"");S.msg=c.it.length+" articles importés depuis « "+c.nm+" » : total HT "+fmt(c.t)+" DA. Comparez avec le total de votre devis.";CAND=[];S.pt="";S.pz=false;S.tab="devis";go()}
function cands(l){CAND=l.filter(x=>x.it.length).map(x=>Object.assign(x,{t:x.it.reduce((a,y)=>a+y.q*y.pu,0)}));
if(!CAND.length){S.msg="Aucun article reconnu : vérifiez que les colonnes sont dans l’ordre Code, Désignation, Unité, Quantité, Prix unitaire, Montant.";go();return}
S.msg="";go()}
function cn(){if(CAND[0]&&CAND[0].nm=="Texte collé")S.pz=true;CAND=[];S.msg="";go()}
function imp(inp){const fl=inp.files[0];if(!fl)return;const p=P();if(Object.keys(p.val||{}).length){S.msg="Devis verrouillé : des attachements sont déjà validés.";go();return}
const rd=new FileReader();FN=fl.name;
rd.onload=e=>{try{if(typeof XLSX==="undefined"){S.msg="La bibliothèque de lecture Excel n’est pas chargée (connexion internet ?). Utilisez le bouton « Coller ici ».";go();return}const wb=XLSX.read(e.target.result,{type:"array"});
const sh=wb.SheetNames.filter(n=>!/infrastructure/i.test(n)).map(nm=>({nm,rw:XLSX.utils.sheet_to_json(wb.Sheets[nm],{header:1,defval:""})}));let l=sh.map(x=>({nm:x.nm,it:parseSheet(x.rw)}));if(!l.some(x=>x.it.length))l=sh.map(x=>({nm:x.nm,it:parseSheet(x.rw,2)}));cands(l)}catch(x){S.msg="Fichier illisible. Utilisez un fichier Excel ou CSV.";go()}};
rd.onerror=()=>{S.msg="Lecture du fichier impossible. Utilisez le bouton « Coller ici ».";go()};rd.readAsArrayBuffer(fl)}
function ptab(t){const R=[];let r=[],f="",q=false;for(let i=0;i<t.length;i++){const ch=t[i];if(q){if(ch=='"'){if(t[i+1]=='"'){f+='"';i++}else q=false}else f+=ch}else if(ch=='"'&&f==="")q=true;else if(ch=="\t"){r.push(f);f=""}else if(ch=="\n"||ch=="\r"){if(ch=="\r"&&t[i+1]=="\n")i++;r.push(f);f="";R.push(r);r=[]}else f+=ch}
if(f!==""||r.length){r.push(f);R.push(r)}while(R.length&&R[R.length-1].every(x=>!String(x).trim()))R.pop();return R}
function spt(v){S.pt=v}
function pzs(){S.pz=!S.pz;go()}
function pza(){const p=P();if(Object.keys(p.val||{}).length){S.msg="Devis verrouillé : des attachements sont déjà validés.";go();return}
const t=S.pt||"";if(!t.trim()){S.msg="Rien à analyser : collez d’abord les lignes de votre devis.";go();return}
if(t.indexOf("\t")<0){S.msg="Aucune séparation de colonnes trouvée. Copiez les cellules directement depuis Excel ou Google Sheets (un texte copié depuis un PDF n’est pas lisible).";go();return}
const R=ptab(t),wide=R.some(r=>r.slice(6).some(x=>String(x).trim()));FN="";const it=parseSheet(R,1);
if(wide&&it.length)it.w.unshift("Plus de 6 colonnes collées : les colonnes au-delà de la 6e sont ignorées. Vérifiez l’ordre des colonnes.");
S.pz=!it.length;cands([{nm:"Texte collé",it}])}
function tg(){const p=P();p.lock=!p.lock;go()}

/* ===== Export Excel (lecture seule, sans mot de passe) et restauration ===== */
const NUMFR=s=>{s=s.replace(/[\u202f\u00a0]/g," ");let m=/^([−-])?\s*(\d{1,3}(?: \d{3})*|\d+),(\d+)$/.exec(s);if(m)return{t:"n",v:(m[1]?-1:1)*parseFloat(m[2].replace(/ /g,"")+"."+m[3]),z:"#,##0."+"0".repeat(m[3].length)};m=/^([−-])?\s*(\d{1,3}(?: \d{3})+)$/.exec(s);if(m)return{t:"n",v:(m[1]?-1:1)*parseInt(m[2].replace(/ /g,""),10),z:"#,##0"};return s};
function t2a(tb){const rows=[...tb.rows],g=[],mg=[];
rows.forEach((tr,ri)=>{g[ri]=g[ri]||[];let c=0;[...tr.cells].forEach(td=>{while(g[ri][c]!==undefined)c++;const cs=td.colSpan||1,rs=td.rowSpan||1,inp=td.querySelector("input,select");let v;
if(inp&&inp.type==="number")v=inp.value===""?"":{t:"n",v:+inp.value,z:"#,##0.00##"};else if(inp&&inp.type!=="checkbox")v=inp.value;else v=NUMFR(td.textContent.replace(/\s+/g," ").trim());
for(let a=0;a<rs;a++){g[ri+a]=g[ri+a]||[];for(let b=0;b<cs;b++)g[ri+a][c+b]=(a==0&&b==0)?v:""}
if(cs>1||rs>1)mg.push({s:{r:ri,c},e:{r:ri+rs-1,c:c+cs-1}});c+=cs})});
const w=Math.max(0,...g.map(r=>r.length));return{a:g.map(r=>Array.from({length:w},(_,i)=>r[i]===undefined?"":r[i])),mg}}
function pageRows(card){const A=[],MG=[];const walk=n=>{[...n.children].forEach(e=>{if(e.matches(".np,button,select,input,label,textarea,script,style"))return;
if(e.tagName=="TABLE"){const t=t2a(e),o=A.length;t.mg.forEach(m=>MG.push({s:{r:m.s.r+o,c:m.s.c},e:{r:m.e.r+o,c:m.e.c}}));t.a.forEach(r=>A.push(r));A.push([])}
else if(e.querySelector("table"))walk(e);else{const tx=e.textContent.replace(/\s+/g," ").trim();if(tx&&!/^(🔒|✅|⚠️)/.test(tx))A.push([tx])}})};walk(card);return{A,MG}}
function mkSheet(pg,note){const A=[[note],[]].concat(pg.A),MG=pg.MG.map(m=>({s:{r:m.s.r+2,c:m.s.c},e:{r:m.e.r+2,c:m.e.c}}));
const ws=XLSX.utils.aoa_to_sheet(A);if(MG.length)ws["!merges"]=MG;
const nc=Math.max(1,...A.map(r=>r.length)),w=[];for(let c=0;c<nc;c++){let m=6;A.forEach(r=>{if(r.filter(x=>x!==""&&x!==undefined).length>=2){const x=r[c],l=x&&typeof x==="object"?String(Math.round(x.v*100)/100).length+4:String(x===undefined?"":x).length;if(l>m)m=l}});w.push({wch:Math.min(m+2,60)})}
ws["!cols"]=w;ws["!protect"]={};return ws}
function shName(n,used){n=n.replace(/[\[\]:*?\/\\]/g," ").slice(0,31);let b=n,i=2;while(used.has(n.toLowerCase())){n=b.slice(0,28)+" "+i++}used.add(n.toLowerCase());return n}
function exportX(id){const p0=S.projects.find(x=>x.id==id);if(!p0)return;
if(typeof XLSX==="undefined"){S.bm="La bibliothèque Excel n’est pas chargée (connexion internet ?). Réessayez.";go();return}
const sv={cur:S.cur,tab:S.tab,msg:S.msg,pz:S.pz,cand:CAND,sit:p0.sit,avn:p0.avn};let fn="";
try{S.cur=id;S.msg="";S.pz=false;CAND=[];const p=p0,wb=XLSX.utils.book_new(),used=new Set(),dt=new Date().toLocaleDateString("fr-FR"),note="Fichier en lecture seule – exporté d’ArchiGest DZ le "+dt+" – projet : "+p.name;
const add=(nm,pg)=>XLSX.utils.book_append_sheet(wb,mkSheet(pg,note),shName(nm,used));
const cards=(html,keep)=>{const d=document.createElement("div");d.innerHTML=String(html).replace(/<br\s*\/?>/gi," ");return[...d.children].filter(c=>!c.matches(".np")&&c.querySelector("table"))};
const merge=cs=>{const A=[],MG=[];cs.forEach(c=>{const g=pageRows(c),o=A.length;g.MG.forEach(m=>MG.push({s:{r:m.s.r+o,c:m.s.c},e:{r:m.e.r+o,c:m.e.c}}));g.A.forEach(r=>A.push(r))});return{A,MG}};
const put=(names,html)=>{const cs=cards(html);if(!cs.length)return;if(cs.length===names.length)cs.forEach((c,i)=>add(names[i],pageRows(c)));else add(names[0],merge(cs))};
// Lisez-moi
add("Lisez-moi",{A:[["ArchiGest DZ – export du projet « "+p.name+" »"],["Date de l’export : "+dt],[],["Ce fichier est en lecture seule (protection de feuille sans mot de passe) : il sert d’archive et peut s’ouvrir dans Excel, Google Sheets ou LibreOffice."],["Il contient aussi, dans une feuille cachée, toutes les données du projet : dans ArchiGest DZ, « Ouvrir » puis « Restaurer depuis un fichier Excel » recrée le projet."],["Les modifications faites à la main dans ce fichier ne sont pas reprises par la restauration."]],MG:[]});
put(["Devis"],VW.devis(p));
const hasD=k=>(p.val&&p.val[k])||p.items.some(it=>(it.m[k-1]||0)>0)||k==sv.sit;
for(let k=1;k<=12;k++)if(hasD(k)){p.sit=k;put(["Attachement "+k],VW.attachement(p));put(["Décompte "+k,"Récap décompte "+k],VW.decompte(p));put(["Situation "+k],VW.situation(p))}
p.sit=sv.sit;
const av=new Set([sv.avn||1]);p.items.forEach(it=>(it.av||[]).forEach((x,j)=>{if(x)av.add(j+1)}));
[...av].sort((a,b)=>a-b).forEach(n=>{p.avn=n;put(["Avenant "+n+" - Supplémentaires","Avenant "+n+" - Diminution","Avenant "+n+" - Récapitulatif"],VW.avenants(p))});
p.avn=sv.avn;
put(["DGD"],VW.dgd(p));
// données de restauration (feuille très cachée)
const js=JSON.stringify({v:1,app:"archigest-dz",at:new Date().toISOString(),project:p}),R=[["ARCHIGEST-DZ-V1"]];for(let i=0;i<js.length;i+=30000)R.push([js.slice(i,i+30000)]);
XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet(R),"_archigest");
wb.Workbook={Sheets:wb.SheetNames.map(n=>({Hidden:n==="_archigest"?2:0}))};
fn=(p.name.replace(/[\\/:*?"<>|]+/g," ").trim().slice(0,60)||"projet")+" – ArchiGest – "+new Date().toISOString().slice(0,10)+".xlsx";
const out=XLSX.write(wb,{bookType:"xlsx",type:"array"}),bl=new Blob([out],{type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"}),a=document.createElement("a");
a.href=URL.createObjectURL(bl);a.download=fn;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},4000);
sv.ok=true}catch(x){sv.err=x}finally{p0.sit=sv.sit;p0.avn=sv.avn;S.cur=sv.cur;S.tab=sv.tab;S.msg=sv.msg;S.pz=sv.pz;CAND=sv.cand}
S.bm=sv.ok?"✅ Fichier « "+fn+" » créé (lecture seule). Conservez-le : il permet aussi de restaurer le projet.":"L’export a échoué : "+(sv.err&&sv.err.message||"erreur inconnue")+". Rien n’a été modifié dans vos données.";go()}
function restX(inp){const fl=inp.files[0];inp.value="";if(!fl)return;
if(S.mode=="entreprise"&&S.projects.length){S.bm="Profil entreprise : un seul dossier. Supprimez le dossier actuel avant d’en restaurer un autre.";go();return}
const rd=new FileReader();rd.onload=e=>{try{if(typeof XLSX==="undefined"){S.bm="La bibliothèque Excel n’est pas chargée (connexion internet ?). Réessayez.";go();return}
const wb=XLSX.read(e.target.result,{type:"array"}),ws=wb.Sheets["_archigest"];
if(!ws){S.bm="Ce fichier ne contient pas de données de restauration ArchiGest DZ (il n’a pas été exporté par l’application). Pour un devis, utilisez « Importer un devis ».";go();return}
const rows=XLSX.utils.sheet_to_json(ws,{header:1,defval:""});if(!rows.length||rows[0][0]!=="ARCHIGEST-DZ-V1")throw new Error("format");
const o=JSON.parse(rows.slice(1).map(r=>r[0]).join("")),q=o&&o.project;
if(!q||typeof q.name!=="string"||!Array.isArray(q.items)||!q.items.every(it=>it&&typeof it.d==="string"&&isFinite(it.q)&&isFinite(it.pu)&&Array.isArray(it.m)))throw new Error("contenu");
q.id=Date.now()+Math.floor(Math.random()*1000);if(S.projects.some(x=>x.name===q.name))q.name+=" (restauré)";
S.projects.push(q);S.tab="ouvrir";S.del=null;S.bm="✅ Projet « "+q.name+" » restauré ("+q.items.length+" articles, "+Object.keys(q.val||{}).length+" attachement(s) validé(s)). Ouvrez-le dans la liste ci-dessous.";go()}
catch(x){S.bm="Fichier illisible ou endommagé : la restauration est impossible. Aucune donnée n’a été modifiée.";go()}};
rd.onerror=()=>{S.bm="Lecture du fichier impossible.";go()};rd.readAsArrayBuffer(fl)}
const RSB=`<label class="btn" style="display:block;text-align:center;font-size:16px;padding:14px">📥 Restaurer depuis un fichier Excel<input type="file" accept=".xlsx" style="display:none" onchange="restX(this)"></label>`;
