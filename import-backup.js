function parseSheet(rows){const num=v=>parseFloat(String(v).replace(/\s/g,"").replace(",","."));let c=null,s=0;
for(let i=0;i<Math.min(rows.length,25)&&!c;i++){const r=rows[i].map(x=>String(x).toLowerCase().trim()),f=g=>r.findIndex(g),d=f(x=>/désignation|designation|libellé|libelle/.test(x)),q=f(x=>/^(quant|qté|qte)/.test(x)),pu=f(x=>/^(p[.\-\s]?u|prix)/.test(x));
if(d>=0&&q>=0&&pu>=0){c={k:f(x=>/^(code|n°)/.test(x)),d,u:f(x=>x=="u"||/^unit/.test(x)),q,pu};s=i+1}}
if(!c)return[];
const it=[],isT=t=>/(^|[\s\/])total([^a-zà-ÿ]|$)/i.test(t),glob=t=>/g[ée]n[ée]ral|t\.?t\.?c|toutes\s+taxes/i.test(t)||/^\s*total\s*(en\s*)?h\.?t\.?\s*:?\s*$/i.test(t);let lot="",pre=[];
rows.slice(s).forEach(r=>{const dd=String(r[c.d]).replace(/\s+/g," ").trim(),k=c.k>=0?String(r[c.k]).trim():"",q=num(r[c.q]),pu=num(r[c.pu]),last=it[it.length-1];
const sub=lb=>{if(last&&!glob(lb)){(last.sub=last.sub||[]).push(lb);const m=lb.match(/^\s*total\s*lot\s*(\d+)/i);if(m)for(let j=it.length-1;j>=0&&!it[j].lot;j--)it[j].lot="LOT "+m[1]}};
if(!dd){const lb=String(r[c.pu]).trim();if(isT(lb)){sub(lb);return}if(!(q>0))return}
if(!(q>0)){if(isT(dd)){sub(dd);return}if(/^lot\s*\d/i.test(dd)){lot=dd;pre.push({t:dd,l:1})}else pre.push({t:dd,k});return}
it.push({n:k,pre,d:dd,u:c.u>=0?String(r[c.u]).trim():"",q,pu:pu>=0?pu:0,lot,m:Array(12).fill(0),av:[0,0,0]});pre=[]});
return it}
let CAND=[],FN="";
function use(i){const p=P(),c=CAND[i];p.items=c.it;p.adj={};p.sit=1;p.val={};p.lock=true;if(p.name==="Nouveau projet"&&FN)p.name=FN.replace(/\.[^.]+$/,"");S.msg=c.it.length+" articles importés depuis « "+c.nm+" » : total HT "+fmt(c.t)+" DA. Comparez avec le total de votre devis.";CAND=[];S.tab="devis";go()}
function cands(l){CAND=l.filter(x=>x.it.length).map(x=>Object.assign(x,{t:x.it.reduce((a,y)=>a+y.q*y.pu,0)}));
if(!CAND.length){S.msg="Aucun article reconnu : vérifiez les colonnes Code, Désignation, U, Quantité et P-U.";go();return}
if(CAND.length==1)use(0);else{S.msg="";go()}}
function imp(inp){const fl=inp.files[0];if(!fl)return;const p=P();if(Object.keys(p.val||{}).length){S.msg="Devis verrouillé : des attachements sont déjà validés.";go();return}
const rd=new FileReader();FN=fl.name;
rd.onload=e=>{try{if(typeof XLSX==="undefined"){S.msg="La bibliothèque de lecture Excel n’est pas chargée (connexion internet ?). Utilisez « Ou coller depuis Excel » ci-dessous.";go();return}const wb=XLSX.read(e.target.result,{type:"array"});
cands(wb.SheetNames.filter(n=>!/infrastructure/i.test(n)).map(nm=>({nm,it:parseSheet(XLSX.utils.sheet_to_json(wb.Sheets[nm],{header:1,defval:""}))})))}catch(x){S.msg="Fichier illisible. Utilisez un fichier Excel ou CSV.";go()}};
rd.onerror=()=>{S.msg="Lecture du fichier impossible. Utilisez « Ou coller depuis Excel » ci-dessous.";go()};rd.readAsArrayBuffer(fl)}
function impTxt(t){const p=P();if(Object.keys(p.val||{}).length){S.msg="Devis verrouillé : des attachements sont déjà validés.";go();return}FN="";cands([{nm:"texte collé",it:parseSheet(t.split(/\r?\n/).map(l=>l.split("\t")))}])}
function tg(){const p=P();p.lock=!p.lock;go()}
const bk=()=>JSON.stringify(S);
function dl(){try{const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([bk()],{type:"application/json"}));a.download="archigest-sauvegarde-"+new Date().toISOString().slice(0,10)+".json";a.click();S.bm="Sauvegarde téléchargée."}catch(e){S.bm="Téléchargement impossible ici : utilisez « Copier »."}go()}
function cp(){try{navigator.clipboard.writeText(bk()).then(()=>{S.bm="Sauvegarde copiée : collez-la dans un fichier texte.";go()},()=>{S.bm="Copie impossible.";go()})}catch(e){S.bm="Copie impossible.";go()}}
function rs(t){try{const d=JSON.parse(t);if(!d||!Array.isArray(d.projects))throw 0;S=d;S.tab="projets";S.bm="Sauvegarde restaurée.";go()}catch(e){S.bm="Sauvegarde invalide : fichier ou texte non reconnu.";go()}}
function rsFile(i){const f=i.files[0];if(!f)return;const r=new FileReader();r.onload=e=>rs(e.target.result);r.readAsText(f)}
const stat=()=>`<div style="font-size:12px;margin:4px 0;color:${OK?"var(--mut)":"var(--bad)"}">${OK?"💾 Enregistrement automatique actif dans ce navigateur. Adresse : "+(location.protocol=="file:"?"fichier ouvert directement":esc(location.origin))+" (une autre adresse ou un autre navigateur = d’autres données).":"⚠️ Le navigateur bloque l’enregistrement : vos projets seront perdus à la fermeture. Faites une sauvegarde (Télécharger ou Copier) ou ouvrez l’application depuis votre site GitHub."}</div>`;
