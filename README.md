# سهلات – تشغيل Firebase (ESM)

هذه التعليمات تشغّل نسخة تجريبية باستخدام Vite و SDK المعياري لـ Firebase.

## الإعداد

1) ثبّت الحزم:

```powershell
npm install
```

2) شغّل الخادم المحلي:

```powershell
npm run dev
```

3) افتح صفحة التجربة `demo-esm.html`، وجرب إضافة باحث/شركة.

- الملف `firebase/firebaseConfig.js` يهيّئ `db` باستخدام Firebase modular SDK.
- الملف `firebase/firestore.js` يكتب إلى مجموعتي `job_seekers` و `companies`.

## ملاحظة الأمان

أثناء التطوير يمكنك تعيين Firestore Rules إلى السماح الكامل، ثم احرص على تشديد القواعد قبل الإطلاق للإنتاج.
