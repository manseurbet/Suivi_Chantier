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

  // ===== 1) Détection en-tête (tolérante : accents, espaces, casse) =====
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
        d,
        u:f(x=>/^u$|^unit/.test(x)),
        q, pu,
        m:f(x=>/^(montant|total|mont\.?)/.test(x))
      };
      s=i+1;
    }
  }
  if(!c)return[];

  // ===== 2) Parcours ligne par ligne =====
  const it=[];
  let lot="LOT 1", heads=[];
  const addSub=label=>{
    if(it.length){const x=it[it.length-1];(x.sub=x.sub||[]).push(label)}
  };

  rows.slice(s).forEach((r,idx)=>{
    // Normalisation de la désignation : espaces multiples réduits, trim
    const dd=String(r[c.d]??"").replace(/\s+/g," ").trim();
    const k=c.k>=0?String(r[c.k]??"").trim():"";

    // Lecture des nombres
    const qRaw=num(r[c.q]), puRaw=num(r[c.pu]);
    const mRaw=c.m>=0?num(r[c.m]):NaN;

    // ---------- 2a) LOT explicite ----------
    if(/^lot\s*\d/i.test(dd)&&!/^total\s+lot/i.test(dd)){
      lot=dd;heads=[];return;
    }

    // ---------- 2b) SOUS-TOTAL / TOTAL de lot ----------
    //   Accepte : "S/Total 01", "Sous-total", "TOTAL 1", "TOTAL2", "Total lot 3"
    if(/^(s\/?\s*total|sous\s*-?\s*total|total\s*(?:lot\s*)?\d+)\b/i.test(dd)){
      addSub(dd);
      const m=dd.match(/^total\s*(?:lot\s*)?(\d+)/i);
      if(m && !/^s\/?|sous/i.test(dd)){
        lot="LOT "+(Number(m[1])+1);
        heads=[];
      }
      return;
    }

    // ---------- 2c) TOTAUX GÉNÉRAUX / TVA / MENTIONS LÉGALES ----------
    if(/^(total\s*(en\s*)?h\.?t\.?|tva\b|total\s*(g[ée]n[ée]ral|general)|total\s*en\s*t\.?t\.?c\.?|arr[eê]ter?\s+le|le\s+service|le\s+partenaire|le\s+repr[eé]sentant)/i.test(dd)) return;

    // ---------- 2d) Ligne totalement vide (ni texte, ni chiffres) ----------
    //    On l'ignore proprement : elle ne crée ni article ni head.
    if(!dd && !Number.isFinite(qRaw) && !Number.isFinite(puRaw) && !Number.isFinite(mRaw)) return;

    // ---------- 2e) ARTICLE ----------
    //    Critère : a une désignation ET (quantité>0 OU PU>0 OU Montant>0)
    const hasQ=Number.isFinite(qRaw)&&qRaw>0;
    const hasPU=Number.isFinite(puRaw)&&puRaw>0;
    const hasM=Number.isFinite(mRaw)&&mRaw>0;
    const isItem = dd && (hasQ || hasPU || hasM);

    if(isItem){
      // Reconstituer q/pu/montant de façon cohérente
      let q = hasQ ? qRaw : 0;
      let pu = hasPU ? puRaw : 0;
      // Si un seul est présent, on déduit l'autre depuis le montant
      if(!q && pu && hasM) q = mRaw / pu;
      if(!pu && q && hasM) pu = mRaw / q;
      // Si ni q ni pu mais montant présent → ligne de synthèse, on l'importe
      // avec q=1 et pu=montant pour ne pas la perdre
      if(!q && !pu && hasM){ q = 1; pu = mRaw; }

      it.push({
        n:k, par:"", pk:"", heads:heads.slice(),
        d:dd,
        u:c.u>=0?String(r[c.u]??"").trim():"",
        q, pu,
        lot,
        m:Array(12).fill(0),
        av:Array(12).fill(0)
      });
      return;
    }

    // ---------- 2f) TITRE / SOUS-TITRE (texte sans quantité ni PU) ----------
    if(!dd) return;
    if(/^[ivxlcdm]+\s*\./i.test(dd)) heads=[{n:k,d:dd}];
    else if(/^\d{1,2}\s*[°º.\-–]/.test(dd))
      heads=(heads.length&&/^[ivxlcdm]+\s*\./i.test(heads[0].d)?[heads[0]]:[]).concat([{n:k,d:dd}]);
    else heads=(heads.length?heads.slice(0,-1):[]).concat([{n:k,d:dd}]);
  });

  // ===== 3) Diagnostic temporaire =====
  console.log("[parseSheet] articles extraits :", it.length);
  console.log("[parseSheet] 5 premiers :", it.slice(0,5).map(x=>({d:x.d.slice(0,30), q:x.q, pu:x.pu, lot:x.lot})));
  return it;
}