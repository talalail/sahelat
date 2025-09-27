// صفحة الملف الشخصي
document.addEventListener('DOMContentLoaded', ()=>{
  const pf = document.getElementById('profileForm');
  if(pf){
    const arr = getJobseekers();
    if(arr.length > 0){
      const me = arr[0]; // نفترض المستخدم الحالي هو آخر واحد سجل
      // نعبّي البيانات في النموذج
      for(const k in me){
        if(pf[k]){
          if(pf[k].type === 'select-multiple'){
            Array.from(pf[k].options).forEach(opt=>{
              opt.selected = (me.jobs||[]).includes(opt.value);
            });
          } else if(pf[k].type === 'checkbox'){
            pf[k].checked = me[k];
          } else {
            pf[k].value = me[k];
          }
        }
      }
    }

    pf.addEventListener('submit', e=>{
      e.preventDefault();
      const fd = new FormData(pf);
      const updated = {
        ...arr[0],
        name: fd.get('name'),
        middleName: fd.get('middleName'),
        lastName: fd.get('lastName'),
        nationality: fd.get('nationality'),
        idNumber: fd.get('idNumber'),
        city: fd.get('city'),
        phone: fd.get('phone'),
        email: fd.get('email'),
        password: fd.get('password'),
        certificates: fd.get('certificates'),
        about: fd.get('about'),
        age: fd.get('age'),
        gender: fd.get('gender'),
        jobs: Array.from(pf.jobs.selectedOptions).map(o=>o.value)
      };
      arr[0] = updated;
      saveJobseekers(arr);
      alert('تم تحديث البيانات ✅');
    });
  }
});
// صفحة الشركة - عرض الباحثين
document.addEventListener('DOMContentLoaded', () => {
  const list = document.getElementById('jobseekersList');
  if (list) {
    const seekers = getJobseekers();
    if (seekers.length === 0) {
      list.innerHTML = '<p>لا يوجد باحثين مسجلين حالياً.</p>';
    } else {
      list.innerHTML = seekers.map((s, i) => `
        <div class="card">
          <img src="${s.profilePhoto || 'https://via.placeholder.com/80'}" alt="صورة ${s.name}" class="avatar">
          <div>
            <h3>${s.name} ${s.lastName}</h3>
            <p>العمر: ${s.age}</p>
            <p>المدينة: ${s.city}</p>
            <p>الجنسية: ${s.nationality}</p>
            <button onclick="viewProfile(${i})">عرض التفاصيل</button>
          </div>
        </div>
      `).join('');
    }
  }
});

// دالة عرض التفاصيل
function viewProfile(index) {
  location.href = `profile.html?id=${index}`;
}
