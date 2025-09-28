(function(w){
  'use strict';
  const mem = {};
  function canUse(store){
    try{
      const k = '__sahlat_probe__' + Date.now();
      store.setItem(k, '1');
      store.removeItem(k);
      return true;
    }catch(e){ return false; }
  }
  const hasLS = (function(){ try{ return canUse(w.localStorage); }catch(e){ return false; }})();
  const hasSS = (function(){ try{ return canUse(w.sessionStorage); }catch(e){ return false; }})();
  function backend(){
    if (hasLS) return w.localStorage;
    if (hasSS) return w.sessionStorage;
    return null;
  }
  function setItem(k, v){
    const b = backend();
    try{
      if (b) b.setItem(k, v);
      else mem[k] = v;
    }catch(e){
      try{ if (hasSS && !hasLS) w.sessionStorage.setItem(k, v); else mem[k] = v; }catch{ mem[k] = v; }
    }
  }
  function getItem(k){
    const b = backend();
    try{
      if (b) {
        const v = b.getItem(k);
        return (v===null||v===undefined) ? (mem.hasOwnProperty(k)? mem[k] : null) : v;
      }
      return mem.hasOwnProperty(k)? mem[k] : null;
    }catch(e){ return mem.hasOwnProperty(k)? mem[k] : null; }
  }
  function removeItem(k){
    const b = backend();
    try{ if (b) b.removeItem(k); }catch(e){}
    try{ delete mem[k]; }catch(e){}
  }
  w.SahlatStore = { setItem, getItem, removeItem };
})(window);
