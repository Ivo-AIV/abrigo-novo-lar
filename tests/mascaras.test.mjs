import test from 'node:test';
import assert from 'node:assert/strict';
import {formatCPF,formatPhone,formatCEP,validCPF} from '../js/modules/mascaras.mjs';
test('máscaras preservam zeros iniciais e limitam os números',()=>{
  assert.equal(formatCPF('0123456789012'),'012.345.678-90');
  assert.equal(formatCEP('01001000123'),'01001-000');
  assert.equal(formatPhone('11999990000'),'(11) 99999-0000');
  assert.equal(formatPhone('1123456789'),'(11) 2345-6789');
});
test('CPF exige verificadores corretos e rejeita repetidos',()=>{
  assert.equal(validCPF('529.982.247-25'),true);
  assert.equal(validCPF('529.982.247-24'),false);
  assert.equal(validCPF('111.111.111-11'),false);
  assert.equal(validCPF('123'),false);
});
