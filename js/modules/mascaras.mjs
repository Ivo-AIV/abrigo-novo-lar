"use strict";
// Funções puras: removem caracteres não numéricos e limitam o tamanho.
export function formatCPF(value) {
  const n = String(value).replace(/\D/g, "").slice(0, 11);
  return n.slice(0,3) + (n.length>3?"."+n.slice(3,6):"") + (n.length>6?"."+n.slice(6,9):"") + (n.length>9?"-"+n.slice(9):"");
}
export function formatPhone(value) {
  const n = String(value).replace(/\D/g, "").slice(0, 11);
  if (!n) return "";
  const split = n.length > 10 ? 7 : 6;
  return "("+n.slice(0,2)+(n.length>=2?") ":"")+n.slice(2,split)+(n.length>split?"-"+n.slice(split):"");
}
export function formatCEP(value) {
  const n = String(value).replace(/\D/g, "").slice(0, 8);
  return n.slice(0,5)+(n.length>5?"-"+n.slice(5):"");
}
export function validCPF(value) {
  const n = String(value).replace(/\D/g, "");
  if (n.length!==11 || /^(\d)\1{10}$/.test(n)) return false;
  for (let length=9; length<=10; length++) {
    let sum=0;
    for (let i=0; i<length; i++) sum+=Number(n[i])*(length+1-i);
    const digit=(sum*10)%11;
    if ((digit===10?0:digit)!==Number(n[length])) return false;
  }
  return true;
}
