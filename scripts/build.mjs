import {build,transform} from 'esbuild';
import sharp from 'sharp';
import {readFile,writeFile,mkdir,rm,copyFile,readdir,stat} from 'node:fs/promises';
import {resolve,dirname,relative} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const dist=resolve(root,'dist');
if(relative(root,dist)!=='dist') throw new Error('Destino de build inválido');
await rm(dist,{recursive:true,force:true});
await mkdir(resolve(dist,'imagens'),{recursive:true});
await mkdir(resolve(dist,'css'),{recursive:true});
function recursos(text){
  text=text.replace(/<source[^>]*image\/png[^>]*>/g,'');
  for(const name of ['acolhimento','cuidado','adocao']) {
    text=text.replaceAll('../imagens/'+name+'.webp','./imagens/'+name+'-480.webp 480w, ./imagens/'+name+'.webp 1120w');
  }
  text=text.replaceAll('type="image/webp"','type="image/webp" sizes="(min-width: 768px) 560px, 100vw"');
  text=text.replaceAll('type=\\"image/webp\\"','type=\\"image/webp\\" sizes=\\"(min-width: 768px) 560px, 100vw\\"');
  return text.replaceAll('../imagens/','./imagens/');
}
const result=await build({absWorkingDir:root,entryPoints:['js/main.mjs'],outdir:'dist/js',bundle:true,splitting:true,format:'esm',target:['es2022'],minify:true,metafile:true,legalComments:'eof',entryNames:'[name]-[hash]',chunkNames:'[name]-[hash]',plugins:[{name:'recursos-relativos',setup(b){b.onLoad({filter:/modules[\\/](templates|projetos-dados)\.mjs$/},async args=>({contents:recursos(await readFile(args.path,'utf8')),loader:'js'}));}}]});
const entry=Object.entries(result.metafile.outputs).find(([,v])=>v.entryPoint==='js/main.mjs')[0].replace(/^dist\//,'');
let html=recursos(await readFile(resolve(root,'html/index.html'),'utf8')).replace('../css/estilos.css','./css/estilos.css').replace('../js/main.mjs','./'+entry);
html=html.replace(/<!--[^]*?-->/g,'').replace(/>\s+</g,'><').trim();
await writeFile(resolve(dist,'index.html'),html);
const css=await transform(await readFile(resolve(root,'css/estilos.css'),'utf8'),{loader:'css',minify:true});
await writeFile(resolve(dist,'css/estilos.css'),css.code);
const images=[];
for(const name of ['acolhimento','cuidado','adocao']){
  const input=resolve(root,'imagens',name+'.jpg');
  for(const width of [480,1120]){
    const path=resolve(dist,'imagens',name+(width===480?'-480':'')+'.webp');
    await sharp(input).resize({width,withoutEnlargement:true}).webp({quality:78,effort:5}).toFile(path);
    images.push({arquivo:relative(dist,path),bytes:(await stat(path)).size,largura:width});
  }
  await copyFile(input,resolve(dist,'imagens',name+'.jpg'));
}
await copyFile(resolve(root,'imagens/marca.svg'),resolve(dist,'imagens/marca.svg'));
await copyFile(resolve(root,'js/vendor/VUE-LICENSE.txt'),resolve(dist,'VUE-LICENSE.txt'));
await writeFile(resolve(dist,'.nojekyll'),'');
const files=[];
async function sizes(dir){for(const e of await readdir(dir,{withFileTypes:true})){const p=resolve(dir,e.name);if(e.isDirectory())await sizes(p);else files.push({arquivo:relative(dist,p),bytes:(await stat(p)).size});}}
await sizes(dist);
const report={arquivos:files,totalBytes:files.reduce((n,f)=>n+f.bytes,0),imagens:images,entradas:result.metafile.inputs,saidas:result.metafile.outputs};
await mkdir(resolve(root,'evidencias'),{recursive:true});
await writeFile(resolve(root,'evidencias/exp4-build.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify({arquivos:files.length,totalBytes:report.totalBytes,entrada:entry}));
