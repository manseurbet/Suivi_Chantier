render();
if("serviceWorker" in navigator&&location.protocol.indexOf("http")===0)addEventListener("load",()=>navigator.serviceWorker.register("sw.js").catch(()=>{}));
