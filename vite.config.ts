import {defineConfig} from 'vite';
import {mkdir,writeFile} from 'node:fs/promises';
export default defineConfig({base:process.env.NODE_ENV==='production'?'/xuchenxiao-profolio1.0/':'/',plugins:[{name:'local-portfolio-backup',configureServer(server){
 server.middlewares.use('/__portfolio_snapshot',async(req,res)=>{
  if(req.method!=='POST'||!/^https?:\/\/(127\.0\.0\.1|localhost):5173$/.test(req.headers.origin||'')){res.statusCode=403;res.end();return;}
  try{let body='';for await(const chunk of req){body+=chunk;if(body.length>300_000_000)throw Error('Too large');}
   const data=JSON.parse(body);if(!Array.isArray(data.projects)||data.projects.length!==6||!data.texts)throw Error('Invalid snapshot');
   await mkdir('../../backups',{recursive:true});await writeFile('../../backups/portfolio-publish-snapshot.json',body);res.end('saved');
  }catch{res.statusCode=400;res.end('Invalid snapshot');}
 });
}}]});
