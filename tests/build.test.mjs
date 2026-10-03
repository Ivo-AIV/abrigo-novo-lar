import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir,access} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
test('produção funciona sob prefixo de repositório e mantém importação dos projetos',async()=>{
  const html=await readFile(resolve(root,'dist/index.html'),'utf8');
  assert.ok(!html.includes('../'));
  assert.ok(!html.includes('.png'));
  assert.ok(html.includes('-480.webp 480w'));
  const script=html.match(/src="(\.\/js\/[^\"]+)"/)[1];
  await access(resolve(root,'dist',script));
  const js=await readdir(resolve(root,'dist/js'));
  assert.ok(js.length>=2);
  for(const file of js){
    const content=await readFile(resolve(root,'dist/js',file),'utf8');
    assert.ok(!content.includes('../imagens/'));
    for(const path of content.matchAll(/(?:from|import\()\s*"(\.\/[^\"]+)"/g))await access(resolve(root,'dist/js',path[1]));
  }
  for(const name of ['acolhimento','cuidado','adocao'])await access(resolve(root,'dist/imagens',name+'-480.webp'));
});
