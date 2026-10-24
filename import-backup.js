function parseSheet(rows){
  const num=v=>{
    if(typeof v==="number")return v;
    let z=String(v??"").trim().replace(/\s/g,"");
    if(!z)return NaN;
    if(z.includes(",")&&z.includes(".")){
      z=z.lastIndexOf(",")>z.lastIndexOf(".")?z.replace(/\./g,"").replace(",","."):z.replace(/,/g,"")
    }else z=z.replace(",",".");
    const n=Number(z);
    return Number.isFinite(n)?n:NaN
  };

  let c=null,s=0;
  for(let i=0;i<Math.min(rows.length,40)&&!c;i++){
    const r=rows[i].map(x=>String(x??"").toLowerCase().trim()),f=g=>r.findIndex(g);
    const d=f(x=>/désignation|designation|libellé|libelle/.test(x));
    const q=f(x=>/^(quant|qté|qte|quantité|quantite)/.test(x));
    const pu=f(x=>/^(p[.\-\s]?u|prix\s*unitaire|prix)/.test(x));
    if(d>=0&&q>=0&&pu>=0){
      c={k:f(x=>/^(code|n°|nº|no\b)/.test(x)),d,u:f(x=>x==="u"||/^unit/.test(x)),q,pu,m:f(x=>/^(montant|total|mont\.?)/.test(x))};
      s=i+1;
    }
  }
  if(!c)return[];

  const it=[];let lot="LOT 1",heads=[];
  const addSub=label=>{if(it.length){const x=it[it.length-1];(x.sub=x.sub||[]).push(label)}};

  rows.slice(s).forEach(r=>{
    const dd=String(r[c.d]??"").replace(/\s+/g," ").trim();
    const k=c.k>=0?String(r[c.k]??"").trim():"";
    const q=num(r[c.q]), pu=num(r[c.pu]);
    const hasQ=Number.isFinite(q)&&q>0;
    const hasPU=Number.isFinite(pu)&&pu>0;
    const isItem=hasQ&&hasPU;

    if(/^lot\s*\d/i.test(dd)&&!/^total\s+lot/i.test(dd)&&!isItem){
      lot=dd;heads=[];return;
    }

    if(!isItem && /^(s\/?\s*total|sous\s*-?\s*total|total\s*(?:lot\s*)?\d+)\b/i.test(dd)){
      addSub(dd);
      const m = dd.match(/^total\s*(?:lot\s*)?(\d+)/i);
      if(m && !/^s\/?|sous/i.test(dd)){
        lot = "LOT " + (Number(m[1]) + 1);
        heads = [];
      }
      return;
    }

    if(!isItem && /^(total\s*(en\s*)?h\.?t\.?|tva\b|total\s*(général|general)|total\s*en\s*t\.?t\.?c\.?|arr[eê]ter?\s+le|le\s+service|le\s+partenaire|le\s+repr[eé]sentant)/i.test(dd)) return;

    if(isItem){
      it.push({
        n:k, par:"", pk:"", heads:heads.slice(),
        d:dd, u:c.u>=0?String(r[c.u]??"").trim():"",
        q, pu, lot,
        m:Array(12).fill(0),
        av:Array(12).fill(0)
      });
      return;
    }

    if(!dd) return;
    if(/^[ivxlcdm]+\s*\./i.test(dd)) heads=[{n:k,d:dd}];
    else if(/^\d{1,2}\s*[°º.\-–]/.test(dd)) heads=(heads.length&&/^[ivxlcdm]+\s*\./i.test(heads[0].d)?[heads[0]]:[]).concat([{n:k,d:dd}]);
    else heads=(heads.length?heads.slice(0,-1):[]).concat([{n:k,d:dd}]);
  });
  return it;
}

let CAND=[],FN="";
function use(i){
  const p=P(),c=CAND[i];
  p.items=c.it;
  p.adj={};p.sit=1;p.val={};p.lock=true;
  if(p.name==="Nouveau projet"&&FN)p.name=FN.replace(/\.[^.]+$/,"");
  S.msg=c.it.length+" articles importés depuis « "+c.nm+" » : total HT "+fmt(c.t)+" DA. Comparez avec le total de votre devis.";
  CAND=[];S.tab="devis";go();
}
function cands(l){
  CAND=l.filter(x=>x.it.length).map(x=>Object.assign(x,{t:x.it.reduce((a,y)=>a+y.q*y.pu,0)}));
  if(!CAND.length){S.msg="Aucun article reconnu : vérifiez les colonnes Code, Désignation, U, Quantité et P-U.";go();return}
  if(CAND.length==1)use(0);else{S.msg="";go()}
}
function imp(inp){
  const fl=inp.files[0];if(!fl)return;
  const p=P();
  if(Object.keys(p.val||{}).length){S.msg="Devis verrouillé : des attachements sont déjà validés.";go();return}
  const rd=new FileReader();FN=fl.name;
  rd.onload=e=>{
    try{
      if(typeof XLSX==="undefined"){S.msg="La bibliothèque Excel n’est pas chargée. Connectez-vous une fois à internet puis réessayez. En attendant, utilisez « Ou coller depuis Excel ».";go();return}
      const wb=XLSX.read(e.target.result,{type:"array",cellFormula:false,cellNF:false,sheetStubs:true});
      cands(wb.SheetNames.filter(n=>!/infrastructure/i.test(n)).map(nm=>({
        nm,
        it:parseSheet(XLSX.utils.sheet_to_json(wb.Sheets[nm],{header:1,defval:"",raw:true}))
      })));
    }catch(x){
      console.error(x);
      S.msg="Fichier illisible. Utilisez un fichier Excel ou CSV.";go();
    }
  };
  rd.onerror=()=>{S.msg="Lecture du fichier impossible. Utilisez « Ou coller depuis Excel » ci-dessous.";go()};
  rd.readAsArrayBuffer(fl);
}
function impTxt(t){const p=P();if(Object.keys(p.val||{}).length){S.msg="Devis verrouillé : des attachements sont déjà validés.";go();return}FN="";cands([{nm:"texte collé",it:parseSheet(t.split(/\r?\n/).map(l=>l.split("\t")))}])}
function tg(){const p=P();p.lock=!p.lock;go()}
const bk=()=>JSON.stringify(S);
function dl(){try{const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([bk()],{type:"application/json"}));a.download="archigest-sauvegarde-"+new Date().toISOString().slice(0,10)+".json";a.click();S.bm="Sauvegarde téléchargée."}catch(e){S.bm="Téléchargement impossible ici : utilisez « Copier »."}go()}
function cp(){try{navigator.clipboard.writeText(bk()).then(()=>{S.bm="Sauvegarde copiée : collez-la dans un fichier texte.";go()},()=>{S.bm="Copie impossible.";go()})}catch(e){S.bm="Copie impossible.";go()}}
function rs(t){try{const d=JSON.parse(t);if(!d||!Array.isArray(d.projects))throw 0;S=d;S.tab="projets";S.bm="Sauvegarde restaurée.";go()}catch(e){S.bm="Sauvegarde invalide : fichier ou texte non reconnu.";go()}}
function rsFile(i){const f=i.files[0];if(!f)return;const r=new FileReader();r.onload=e=>rs(e.target.result);r.readAsText(f)}
const stat=()=>`<div style="font-size:12px;margin:4px 0;color:${OK?"var(--mut)":"var(--bad)"}">${OK?"💾 Enregistrement automatique actif dans ce navigateur. Adresse : "+(location.protocol=="file:"?"fichier ouvert directement":esc(location.origin))+" (une autre adresse ou un autre navigateur = d’autres données).":"⚠️ Le navigateur bloque l’enregistrement : vos projets seront perdus à la fermeture. Faites une sauvegarde (Télécharger ou Copier) ou ouvrez l’application depuis votre site GitHub."}</div>`;