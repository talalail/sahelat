// استخدم SDK المعياري (modular) عبر الحزم المحلية
import { db } from "./firebaseConfig.js";
import { collection, addDoc } from "firebase/firestore";

// إضافة باحث عن عمل
export async function addJobSeeker(data) {
  try {
    await addDoc(collection(db, "job_seekers"), data);
    console.log("تمت إضافة الباحث بنجاح ✅");
  } catch (error) {
    console.error("حدث خطأ:", error);
    throw error;
  }
}

// إضافة شركة
export async function addCompany(data) {
  try {
    await addDoc(collection(db, "companies"), data);
    console.log("تمت إضافة الشركة بنجاح ✅");
  } catch (error) {
    console.error("حدث خطأ:", error);
    throw error;
  }
}
