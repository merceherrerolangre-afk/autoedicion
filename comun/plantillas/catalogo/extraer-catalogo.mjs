// Saca de las páginas del catálogo el código de cada animación (HTML + CSS) tal cual, para <Animacion>.
// Uso (desde la carpeta de la skill):
//   node comun/plantillas/catalogo/extraer-catalogo.mjs <remotion>/src/catalogo youtube comun/catalogo/banco-1.html comun/catalogo/banco-2.html comun/catalogo/banco-3.html
//   node comun/plantillas/catalogo/extraer-catalogo.mjs <remotion>/src/catalogo reels reels/antiguo/catalogo/banco-1.html reels/antiguo/catalogo/banco-2.html reels/antiguo/catalogo/banco-3.html
// Volver a ejecutarlo solo si cambian las páginas del catálogo.
import fs from 'fs'; import vm from 'vm';
const [,, salida, nombre, ...paginas] = process.argv;
const stub = new Proxy(function(){}, { get:(t,k)=> k===Symbol.toPrimitive? ()=>'' : (k==='length'?0:stub), apply:()=>stub, construct:()=>stub, set:()=>true });
let escenas=[], css={};
for (const p of paginas) {
  const h = fs.readFileSync(p,'utf8');
  const estilos = [...h.matchAll(/<style>([\s\S]*?)<\/style>/g)].map(m=>m[1]).join('\n');
  // solo las piezas: desde la primera regla de animación/piezas (lo de la página no hace falta)
  css[p.split('/').pop()] = estilos;
  const js = [...h.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]).join('\n;\n');
  const ctx = { document:stub, window:stub, localStorage:stub, navigator:stub, matchMedia:stub, setTimeout:()=>0, setInterval:()=>0, requestAnimationFrame:()=>0, console, IntersectionObserver:function(){return stub} };
  vm.createContext(ctx);
  // exponer D al final
  try { vm.runInContext(js.replace(/const D=\[\]/, 'var D=globalThis.__D=[]'), ctx); } catch(e) { console.error(p, 'aviso:', e.message); }
  const D = ctx.__D || [];
  for (const d of D) escenas.push({ ...d, pagina: p.split('/').pop() });
  console.log(p.split('/').pop(), D.length, 'animaciones');
}
fs.writeFileSync(`${salida}/${nombre}.json`, JSON.stringify({css, escenas}));
