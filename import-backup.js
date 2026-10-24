function parseSheet(rows){
  const num=v=>{
    if(typeof v==="number")return v;
    let z=String(v??"").trim().replace(/\s/g,"");
    if(!z)return NaN;
    if(z.includes(",")&&z.includes(".")){
      z=z.lastIndexOf(",")>z.lastIndexOf(".")?z.replace(/\./g,"").replace(",","."):z.replace(/,/g,"");
    }else{
      z=z.replace(",",".");
    }
    const n=Number(z);
    return Number.isFinite(n)?n:NaN;
  };

  // 1) Détection en-tête
  let c=null,s=0;
  for(let i=0;i<Math.min(rows.length,40)&&!c;i++){
    const r=rows[i].map(x=>String(x??"").toLowerCase().trim());
    const f=g=>r.findIndex(g);
    const d=f(x=>/d[ée]signation|libell[ée]/.test(x));
    const q=f(x=>/^(quant|qt[ée]|quantit[ée])/.test(x));
    const pu=f(x=>/^(p[.\-\s]?u|prix)/.test(x));
    if(d>=0&&q>=0&&pu>=0){
      c={
        k:f(x=>/^(code|n[°º]|no\b)/.test(x)),
        d: d,
        u: f(x=>/^u$|^unit/.test(x)),
        q: q,
        pu: pu,
        m: f(x=>/^(montant|total|mont\.?)/.test(x))
      };
      s=i+1;
    }
  }
  if(!c)return[];

  // 2) Fonction utilitaire : la ligne suivante est-elle une sous-ligne (a), b), 1), -...) ?
  const isSubLine = (r) => {
    if(!r) return false;
    const t = String(r[c.d] ?? "").replace(/\s+/g," ").trim();
    return /^(?:[-–]\s*)?(?:[a-z]\)|[0-9]{1,2}\s*[\).\-–]|[a-z]\s*[-–])\s+/i.test(t) || /^[-–]\s+[a-z]/i.test(t);
  };

  // 3) Parcours ligne par ligne
  const it=[];
  let lot="LOT 1", heads=[];
  const addSub=label=>{
    if(it.length){const x=it[it.length-1];(x.sub=x.sub||[]).push(label)}
  };

  const slice = rows.slice(s);
  slice.forEach((r, idx) => {
    const dd = String(r[c.d] ?? "").replace(/\s+/g," ").trim();
    const k  = c.k>=0 ? String(r[c.k] ?? "").trim() : "";
    const qRaw = num(r[c.q]);
    const puRaw = num(r[c.pu]);
    const mRaw = c.m>=0 ? num(r[c.m]) : NaN;

    // --- LOT explicite ---
    if(/^lot\s*\d/i.test(dd) && !/^total\s+lot/i.test(dd)){
      lot = dd; heads = []; return;
    }

    // --- Sous-total / Total de lot ---
    if(/^(s\/?\s*total|sous\s*-?\s*total|total\s*(?:lot\s*)?\d+|total\s*lot)\b/i.test(dd)){
      addSub(dd);
      const mm = dd.match(/^total\s*(?:lot\s*)?(\d+)/i);
      if(mm && !/^s\/?|sous/i.test(dd)){
        lot = "LOT " + (Number(mm[1]) + 1);
        heads = [];
      }
      return;
    }

    // --- Totaux généraux / mentions légales ---
    if(/^(total\s*(en\s*)?h\.?t\.?|tva\b|total\s*(g[ée]n[ée]ral|general)|total\s*en\s*t\.?t\.?c\.?|arr[eê]ter?\s+le|le\s+service|le\s+partenaire|le\s+repr[eé]sentant)/i.test(dd)) return;

    // --- Ligne totalement vide ---
    if(!dd && !Number.isFinite(qRaw) && !Number.isFinite(puRaw) && !Number.isFinite(mRaw)) return;

    const hasQ  = Number.isFinite(qRaw) && qRaw > 0;
    const hasPU = Number.isFinite(puRaw) && puRaw > 0;
    const hasM  = Number.isFinite(mRaw) && mRaw > 0;

    // --- Cas 1 : article COMPLET (a une désignation + au moins un chiffre) ---
    if(dd && (hasQ || hasPU || hasM)){
      let q = hasQ ? qRaw : 0;
      let pu = hasPU ? puRaw : 0;
      if(!q && pu && hasM) q = mRaw / pu;
      if(!pu && q && hasM) pu = mRaw / q;
      if(!q && !pu && hasM){ q=1; pu=mRaw; }
      it.push({
        n:k, par:"", pk:"", heads:heads.slice(),
        d:dd,
        u: c.u>=0 ? String(r[c.u] ?? "").trim() : "",
        q, pu, lot,
        m:Array(12).fill(0),
        av:Array(12).fill(0)
      });
      return;
    }

    // --- Cas 2 : ARTICLE PARENT (titre suivi de sous-lignes a), b), c)...) ---
    //    → on le garde comme article avec q=0, pu=0 pour l'AFFICHER
    if(dd && isSubLine(slice[idx+1])){
      it.push({
        n:k, par:"", pk:"", heads:heads.slice(),
        d:dd,
        u:"",
        q:0, pu:0, lot,
        m:Array(12).fill(0),
        av:Array(12).fill(0)
      });
      return;
    }

    // --- Cas 3 : TITRE / SOUS-TITRE (aucun article) ---
    if(!dd) return;
    if(/^[ivxlcdm]+\s*\./i.test(dd)) heads=[{n:k,d:dd}];
    else if(/^\d{1,2}\s*[°º.\-–]/.test(dd))
      heads=(heads.length && /^[ivxlcdm]+\s*\./i.test(heads[0].d) ? [heads[0]] : []).concat([{n:k,d:dd}]);
    else heads=(heads.length ? heads.slice(0,-1) : []).concat([{n:k,d:dd}]);
  });

  console.log("[parseSheet] articles extraits :", it.length);
  console.log("[parseSheet] lignes avec q=0 (parents) :", it.filter(x=>x.q===0).length);
  return it;
}