(function(w){
  'use strict';
  const mem = {};
  // window.name fallback store (persists across navigations in same tab)
  const NAME_PREFIX = 'Sahlat::';
  function readNameBag(){
    try{
      const nm = w.name || '';
      if (nm && nm.startsWith(NAME_PREFIX)){
        return JSON.parse(nm.slice(NAME_PREFIX.length)) || {};
      }
    }catch(e){}
    return {};
  }
  function writeNameBag(obj){
    try{ w.name = NAME_PREFIX + JSON.stringify(obj||{}); }catch(e){}
  }
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
  const mode = hasLS ? 'ls' : (hasSS ? 'ss' : 'name');

  function setItem(k, v){
    try{
      if (mode === 'ls') return w.localStorage.setItem(k, v);
      if (mode === 'ss') return w.sessionStorage.setItem(k, v);
      // name fallback
      const bag = readNameBag(); bag[k] = v; writeNameBag(bag); mem[k] = v;
    }catch(e){
      // ultimate fallback to memory
      mem[k] = v;
    }
  }
  function getItem(k){
    try{
      if (mode === 'ls'){
        const v = w.localStorage.getItem(k);
        return (v===null||v===undefined) ? (mem.hasOwnProperty(k)? mem[k] : null) : v;
      }
      if (mode === 'ss'){
        const v = w.sessionStorage.getItem(k);
        return (v===null||v===undefined) ? (mem.hasOwnProperty(k)? mem[k] : null) : v;
      }
      // name fallback
      const bag = readNameBag();
      if (bag && Object.prototype.hasOwnProperty.call(bag, k)) return bag[k];
      return mem.hasOwnProperty(k)? mem[k] : null;
    }catch(e){ return mem.hasOwnProperty(k)? mem[k] : null; }
  }
  function removeItem(k){
    try{
      if (mode === 'ls') w.localStorage.removeItem(k);
      else if (mode === 'ss') w.sessionStorage.removeItem(k);
      else {
        const bag = readNameBag();
        if (bag && Object.prototype.hasOwnProperty.call(bag, k)){
          delete bag[k]; writeNameBag(bag);
        }
      }
    }catch(e){}
    try{ delete mem[k]; }catch(e){}
  }
  w.SahlatStore = { setItem, getItem, removeItem, _mode: mode };
})(window);
