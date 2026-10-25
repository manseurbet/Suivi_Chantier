const $=s=>document.querySelector(s);
const fmt=n=>(Math.round((+n||0)*100)/100).toLocaleString("fr-FR",{minimumFractionDigits:2,maximumFractionDigits:2});
const esc=s=>String(s).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;");
let OK=true,S;try{S=JSON.parse(localStorage.getItem("archigest_dz"));localStorage.setItem("archigest_t","1");localStorage.removeItem("archigest_t")}catch(e){OK=false}
try{navigator.storage&&navigator.storage.persist&&navigator.storage.persist()}catch(e){}
if(!S||!S.projects)S={projects:[],cur:null,tab:"projets",del:null};
S.tab="projets";S.cur=null;S.del=null;S.back=null;
const save=()=>{try{localStorage.setItem("archigest_dz",JSON.stringify(S));OK=true}catch(e){OK=false}};
const P=()=>S.projects.find(p=>p.id===S.cur);
function mk(name){return{id:Date.now(),name,moa:"",ent:"",gar:"caution",contrat:"",objet:"",montant:0,doit:"",adr:"",rc:"",nif:"",nis:"",art:"",rib:"",bq:"",tva:19,ret:5,items:[],adj:{},sit:1}}
function setMode(m){S.mode=m;S.del=null;go()}
function np(){if(S.mode=="entreprise"&&S.projects.length){S.bm="Profil entreprise : un seul dossier. Utilisez OUVRIR pour le reprendre.";go();return}const p=mk("Nouveau projet");S.projects.push(p);S.cur=p.id;S.tab="devis";S.del=null;go()}
function dp(){if(S.del==S.cur){S.projects=S.projects.filter(x=>x.id!=S.cur);S.cur=S.projects[0]?S.projects[0].id:null;S.del=null}else S.del=S.cur;go()}
function go(t){if(t){if(t=="infos"&&S.tab!="infos")S.prev=S.tab;S.tab=t;S.msg="";S.bm=""}save();render()}
function set(k,v){P()[k]=v;go()}
function ai(){P().items.push({d:"",u:"m²",q:0,pu:0,m:Array(12).fill(0),av:[0,0,0]});go()}
function di(i){P().items.splice(i,1);go()}
function si(i,k,v){P().items[i][k]=v;go()}
function sm(i,v){const p=P();if(p.val&&p.val[p.sit])return;p.items[i].m[p.sit-1]=v;go()}
function sa(k,v){const p=P();(p.adj[p.sit]=p.adj[p.sit]||{av:0,pen:0})[k]=v;go()}
const IT=it=>{it.av=it.av||[];while(it.av.length<12)it.av.push(0);it.qm=it.q+it.av.reduce((a,b)=>a+b,0);it.qa=it.qm;return it};
function calc(p){const n=p.sit,r={prev:0,mois:0,cum:0,mi:0,avm:0,mk:0,real:0,pv:0,mv:0,mm:0};
p.items.forEach(it=>{IT(it);const sum=k=>it.m.slice(0,k).reduce((a,b)=>a+b,0),tot=sum(12),pl=Math.max(tot-it.qm,0),mn=p.done?Math.max(it.qm-tot,0):0;
it.qa=it.qm+pl-mn;it.au=pl-mn;
const cap=k=>Math.min(sum(k),it.qm),pr=cap(n-1),cu=cap(n);
Object.assign(it,{pr,cu,mo:cu-pr,tot,rawp:sum(n-1),raw:sum(n),mr:it.m[n-1]||0});
r.mi+=it.q*it.pu;r.mm+=it.qm*it.pu;r.avm+=(it.qm-it.q)*it.pu;r.mk+=it.qa*it.pu;r.prev+=pr*it.pu;r.mois+=it.mo*it.pu;r.cum+=cu*it.pu;r.real+=Math.min(tot,it.qa)*it.pu;r.pv+=pl*it.pu;r.mv+=mn*it.pu});
return r}
const fp=x=>Math.abs(x)<0.005?"0":fmt(x);
const idBlock=p=>{const g=(l,v)=>v?`<div>${l} ${esc(v)}</div>`:"";return`<div style="font-size:12px;line-height:1.5"><div style="text-align:center;font-weight:700">République Algérienne Démocratique et Populaire</div>${g("",p.ent)}${g("Adresse :",p.adr)}${g("RC :",p.rc)}${g("NIF :",p.nif)}${g("NIS :",p.nis)}${g("N° d’article :",p.art)}${g("N° de compte :",(p.rib||"")+(p.bq?" · "+p.bq:""))}${g("Contrat n°",p.contrat)}${g("Objet :",p.objet)}${p.montant?g("Montant du contrat :",fmt(p.montant)+" DA"):""}${g("Doit à :",p.doit)}${g("Projet :",p.name)}</div>`};
function sv(i,k,v){P().items[i].av[k]=v;go()}
const L=(l,v,c)=>`<tr class="${c||""}"><td>${l}</td><td class="r">${v}</td></tr>`;
const selS=p=>`<div class="card row"><label style="width:150px">Situation n°<select onchange="set('sit',+this.value)">${[...Array(12)].map((_,i)=>`<option value="${i+1}" ${i+1==p.sit?"selected":""}>${i+1}${p.val&&p.val[i+1]?" ✓":""}</option>`).join("")}</select></label>${p.sit==1?'<span style="color:var(--mut);font-size:12px">Première situation : le « précédent » est à 0.</span>':""}</div>`;
