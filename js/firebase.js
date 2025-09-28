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
    function seekersCol(){ return db.collection('seekers'); }
    function companiesCol(){ return db.collection('companies'); }

    async function upsertSeeker(seeker){
      const id = seeker.id || makeId(seeker.email||seeker.phone||seeker.nationalId||seeker.fullName||Math.random().toString(36));
      seeker.id = id;
      await seekersCol().doc(id).set(seeker, { merge: true });
      return id;
    }
    async function upsertCompany(company){
      const id = company.id || makeId(company.email||company.phone||company.name||Math.random().toString(36));
      company.id = id;
      await companiesCol().doc(id).set(company, { merge: true });
      return id;
    }
    function subscribeSeekers(cb){ return seekersCol().onSnapshot((snap)=>{ cb(snap.docs.map(d=> ({ id:d.id, ...(d.data()||{}) }))); }); }
    function subscribeCompanies(cb){ return companiesCol().onSnapshot((snap)=>{ cb(snap.docs.map(d=> ({ id:d.id, ...(d.data()||{}) }))); }); }
    async function findSeekerByContact(contact){
      const norm = (s)=> (s||'').trim().toLowerCase();
      const q1 = await seekersCol().where('phone','==',contact).get().catch(()=>null);
      const q2 = await seekersCol().where('email','==',contact).get().catch(()=>null);
      const all = [].concat(q1 && q1.docs || [], q2 && q2.docs || []);
      return all.length ? { id: all[0].id, ...(all[0].data()||{}) } : null;
    }
    async function findCompanyByContact(contact){
      const q1 = await companiesCol().where('phone','==',contact).get().catch(()=>null);
      const q2 = await companiesCol().where('email','==',contact).get().catch(()=>null);
      const all = [].concat(q1 && q1.docs || [], q2 && q2.docs || []);
      return all.length ? { id: all[0].id, ...(all[0].data()||{}) } : null;
    }
    function makeId(key){ let h=0; for(const ch of (key||'')){ h=((h<<5)-h)+ch.charCodeAt(0); h|=0;} return 'x'+Math.abs(h); }

    window.SahlatDB = { db, upsertSeeker, upsertCompany, subscribeSeekers, subscribeCompanies, findSeekerByContact, findCompanyByContact };
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
