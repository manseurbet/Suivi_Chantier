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
