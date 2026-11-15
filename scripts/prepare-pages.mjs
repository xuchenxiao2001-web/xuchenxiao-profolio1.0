import {readFile,writeFile,mkdir,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const base='/';
const snapshot=JSON.parse(await readFile('publication/content.json','utf8'));
async function assets(value){
 if(Array.isArray(value))return Promise.all(value.map(assets));
 if(value&&typeof value==='object')return Object.fromEntries(await Promise.all(Object.entries(value).map(async([k,v])=>[k,await assets(v)])));
 if(typeof value!=='string')return value;
 if(value.startsWith('data:image/')){const match=value.match(/^data:image\/(png|jpeg|jpg|webp|gif|svg\+xml);base64,(.+)$/s);if(!match)throw Error('Unsupported saved image');const bytes=Buffer.from(match[2],'base64');const name=createHash('sha256').update(bytes).digest('hex')+'.'+(match[1]==='svg+xml'?'svg':match[1]);await mkdir('dist/assets/saved',{recursive:true});await writeFile('dist/assets/saved/'+name,bytes);return base+'assets/saved/'+name;}
 return value.replace(/^\/(assets|portfolios)\//,base+'$1/');
}
await writeFile('dist/content.json',JSON.stringify(await assets(snapshot)));
for(const name of await readdir('dist/assets'))if(/\.(js|css)$/.test(name)){
 const path='dist/assets/'+name;const text=await readFile(path,'utf8');await writeFile(path,text.replace(/(["'`])\/(assets|portfolios|projects)\//g,'$1'+base+'$2/'));
}
const content=JSON.stringify(await assets(snapshot)).replace(/</g,'\\u003c');
const html=(await readFile('dist/index.html','utf8')).replace('</head>', '<script id="published-content" type="application/json">'+content+'</script></head>');
await writeFile('dist/index.html',html);
for(let i=1;i<=6;i++){const dir='dist/projects/project-'+i;await mkdir(dir,{recursive:true});await writeFile(dir+'/index.html',html);}
await writeFile('dist/.nojekyll','');
console.log('Prepared six read-only project pages and saved content.');
