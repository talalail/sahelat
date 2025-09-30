(function(){
  // Load Firebase SDKs via CDN
  const scripts = [
    'https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js',
    'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js'
  ];
  function loadScript(src){
    return new Promise((res, rej)=>{
      const s = document.createElement('script');
      s.src = src; s.async = true; s.onload = ()=>res(); s.onerror = ()=>rej(new Error('Failed to load '+src));
      document.head.appendChild(s);
    });
  }
  async function init(){
    for(const src of scripts){ await loadScript(src); }
    if (!window.FIREBASE_CONFIG){ console.error('Missing FIREBASE_CONFIG. See js/firebase-config.js'); return; }
    const cfg = window.FIREBASE_CONFIG || {};
    const looksPlaceholder = Object.values(cfg).some(v => typeof v==='string' && /^(YOUR_|YOUR\b)/i.test(v));
    if (looksPlaceholder){
      console.warn('Firebase config looks like placeholders. Fill js/firebase-config.js with real project credentials. Running in offline/local mode.');
      return;
    }
    const app = firebase.initializeApp(window.FIREBASE_CONFIG);
    const db = firebase.firestore();
    // Enable offline persistence (best effort)
    try{ db.enablePersistence({ synchronizeTabs: true }); }catch(e){ /* ignore */ }

    // Firestore helper API
  function seekersCol(){ return db.collection('job_seekers'); }
    function companiesCol(){ return db.collection('companies'); }

    function normLower(s){ return (s||'').trim().toLowerCase(); }
    function toAsciiDigits(str){
      if (!str) return '';
      return String(str).replace(/[\u0660-\u0669\u06F0-\u06F9]/g, function(ch){
        const code = ch.charCodeAt(0);
        // Arabic-Indic 0660..0669, Eastern-Arabic 06F0..06F9
        if (code>=0x0660 && code<=0x0669) return String(code - 0x0660);
        if (code>=0x06F0 && code<=0x06F9) return String(code - 0x06F0);
        return ch;
      });
    }
    function normPhoneDigits(s){ return toAsciiDigits(s).replace(/\D/g,''); }
    async function upsertSeeker(seeker){
      const id = seeker.id || makeId(seeker.email||seeker.phone||seeker.nationalId||seeker.fullName||Math.random().toString(36));
      const obj = Object.assign({}, seeker, {
        id,
        emailLower: normLower(seeker.email),
        phoneNorm: normPhoneDigits(seeker.phone)
      });
      await seekersCol().doc(id).set(obj, { merge: true });
      return id;
    }
    async function upsertCompany(company){
      const id = company.id || makeId(company.email||company.phone||company.name||Math.random().toString(36));
      const obj = Object.assign({}, company, {
        id,
        emailLower: normLower(company.email),
        phoneNorm: normPhoneDigits(company.phone)
      });
      await companiesCol().doc(id).set(obj, { merge: true });
      return id;
    }
    function subscribeSeekers(cb){ return seekersCol().onSnapshot((snap)=>{ cb(snap.docs.map(d=> ({ id:d.id, ...(d.data()||{}) }))); }); }
    function subscribeCompanies(cb){ return companiesCol().onSnapshot((snap)=>{ cb(snap.docs.map(d=> ({ id:d.id, ...(d.data()||{}) }))); }); }
    async function findSeekerByContact(contact){
      const cLower = normLower(contact);
      const cDigits = normPhoneDigits(contact);
      const promises = [
        seekersCol().where('phone','==',contact).get().catch(()=>null),
        seekersCol().where('email','==',contact).get().catch(()=>null),
        cLower ? seekersCol().where('emailLower','==',cLower).get().catch(()=>null) : null,
        cDigits ? seekersCol().where('phoneNorm','==',cDigits).get().catch(()=>null) : null
      ].filter(Boolean);
      const snaps = await Promise.all(promises);
      const docs = snaps.flatMap(s=> s && s.docs ? s.docs : []);
      return docs.length ? { id: docs[0].id, ...(docs[0].data()||{}) } : null;
    }
    async function findCompanyByContact(contact){
      const cLower = normLower(contact);
      const cDigits = normPhoneDigits(contact);
      const promises = [
        companiesCol().where('phone','==',contact).get().catch(()=>null),
        companiesCol().where('email','==',contact).get().catch(()=>null),
        cLower ? companiesCol().where('emailLower','==',cLower).get().catch(()=>null) : null,
        cDigits ? companiesCol().where('phoneNorm','==',cDigits).get().catch(()=>null) : null
      ].filter(Boolean);
      const snaps = await Promise.all(promises);
      const docs = snaps.flatMap(s=> s && s.docs ? s.docs : []);
      return docs.length ? { id: docs[0].id, ...(docs[0].data()||{}) } : null;
    }
    function makeId(key){ let h=0; for(const ch of (key||'')){ h=((h<<5)-h)+ch.charCodeAt(0); h|=0;} return 'x'+Math.abs(h); }

    window.SahlatDB = { db, upsertSeeker, upsertCompany, subscribeSeekers, subscribeCompanies, findSeekerByContact, findCompanyByContact };
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
