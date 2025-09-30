import { addJobSeeker, addCompany } from "./firestore.js";

// Simple demo bindings (optional)
document.addEventListener('DOMContentLoaded', ()=>{
  const btn = document.querySelector('#submitJobSeeker');
  if (btn){
    btn.addEventListener('click', async ()=>{
      const data = {
        firstName: document.querySelector('#firstName')?.value?.trim() || '',
        lastName: document.querySelector('#lastName')?.value?.trim() || '',
        city: document.querySelector('#city')?.value?.trim() || '',
        phone: document.querySelector('#phone')?.value?.trim() || '',
        email: document.querySelector('#email')?.value?.trim() || '',
        createdAt: Date.now()
      };
      try{ await addJobSeeker(data); alert('تم الإرسال ✅'); }catch(e){ alert('تعذر الإرسال'); }
    });
  }

  const btnCo = document.querySelector('#submitCompany');
  if (btnCo){
    btnCo.addEventListener('click', async ()=>{
      const data = {
        name: document.querySelector('#companyName')?.value?.trim() || '',
        city: document.querySelector('#companyCity')?.value?.trim() || '',
        phone: document.querySelector('#companyPhone')?.value?.trim() || '',
        email: document.querySelector('#companyEmail')?.value?.trim() || '',
        createdAt: Date.now()
      };
      try{ await addCompany(data); alert('تم إضافة الشركة ✅'); }catch(e){ alert('تعذر إضافة الشركة'); }
    });
  }
});
