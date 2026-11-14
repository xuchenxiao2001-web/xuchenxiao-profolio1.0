import {tvcStoryboardPrompt} from './tvcCopy';
import {IPStudy} from './IPStudy';
import {AmazonStudy,amazonCopy} from './AmazonStudy';
import {ProjectHeading} from './ProjectHeading';
import {FilmStudy} from './FilmStudy';
import {FitVideo} from './FitVideo';
import {EmbeddedPortfolio} from './EmbeddedPortfolio';
import {PhotoGlobe} from './PhotoGlobe';
import {StudioSketches} from './StudioSketches';
import {initialProjects,homeContent,projectOneImages,projectOneImportVersion,projectTwoImages,projectTwoImportVersion,type Project} from './content';
import {useEffect,useRef,useState,useId,createContext,useContext} from 'react';
import {createRoot} from 'react-dom/client';
import './style.css';
const TextContext=createContext<Record<string,string>>({});
function Copy({value}:{value:string}){const texts=useContext(TextContext);return <>{texts[value]??value}</>}
function ArtisticTitle(){
 const texts=useContext(TextContext);
 return <h1 className="artistic-title max-w-3xl mx-auto" aria-label={homeContent.title.map(t=>texts[t]??t).join(' ')}>
 {homeContent.title.map((fallback,i)=>{const title=texts[fallback]??fallback;return <span className={'art-title-line art-title-line-'+i} key={i} aria-hidden="true"><span className="art-initial">{title.slice(0,1)}</span><span className="art-outline">{title.slice(1)}</span></span>})}
 <svg className="title-flourish" viewBox="0 0 100 80" aria-hidden="true"><path d="M8 49Q48 50 70 21M28 61L87 56M16 32Q30 15 28 4" fill="none" stroke="currentColor" strokeWidth=".7"/></svg>
 </h1>
}
function Logo(){return <svg width="28" height="28" viewBox="0 0 256 256" fill="#1a1a1a" aria-label="Bespoke Architecture Studio"><path d="M 144 256 L 27.598 256 L 144 139.598 Z M 256 207.5 L 200 256 L 200 56 L 0 56 L 48 0 L 256 0 Z M 0 204.402 L 0 112 L 92.402 112 Z"/></svg>}
function ContactButton({variant='pill',align='right'}:{variant?:'pill'|'text';align?:'right'|'center'|'left'}){
 const [open,setOpen]=useState(false);
 const root=useRef<HTMLDivElement>(null);const button=useRef<HTMLButtonElement>(null);const id=useId();
 useEffect(()=>{
  if(!open)return;
  const outside=(event:PointerEvent)=>{if(!root.current?.contains(event.target as Node))setOpen(false)};
  const escape=(event:KeyboardEvent)=>{if(event.key==='Escape'){setOpen(false);button.current?.focus()}};
  document.addEventListener('pointerdown',outside);document.addEventListener('keydown',escape);
  return()=>{document.removeEventListener('pointerdown',outside);document.removeEventListener('keydown',escape)};
 },[open]);
 return <div ref={root} className={'contact-anchor contact-'+align}>
 <button ref={button} type="button" aria-expanded={open} aria-controls={id} onClick={()=>setOpen(value=>!value)} className={variant==='pill'?'text-sm font-medium text-white bg-neutral-900 rounded-full px-5 py-2.5 hover:bg-neutral-800 transition-colors':'contact-text font-semibold underline underline-offset-4 decoration-neutral-400 hover:decoration-neutral-900 transition-colors'}><Copy value="Contact Me"/></button>
 {open&&<div id={id} role="region" aria-label="联系方式" className="contact-popover"><p>微信：xcx17720571519</p><p>邮箱：xuchenxiao2001@163.com</p></div>}
 </div>
}
function Navbar(){
 return <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-6 md:px-10 py-4 sm:py-5"><Logo/><div className="hidden sm:block"><ContactButton/></div><div className="w-7 sm:hidden"/></nav>
}
function CoverImage({project}:{project:Project}){
 const crop=project.coverCrop||{x:50,y:50,zoom:1};
 return <img decoding="async" src={project.image} onError={e=>{if(project.fallback&&e.currentTarget.src!==project.fallback)e.currentTarget.src=project.fallback}} style={{objectPosition:crop.x+'% '+crop.y+'%',transformOrigin:crop.x+'% '+crop.y+'%',transform:'scale('+crop.zoom+')'}} className="w-full h-full object-cover pointer-events-none block" draggable={false} alt={project.title}/>;
}
function ImageMarquee({projects}:{projects:Project[]}){
 const captions=useRef<HTMLDivElement>(null);const captionActive=useRef(false);
 const track=useRef<HTMLDivElement>(null);const physics=useRef({offset:0,velocity:0,drag:false,startX:0,startOffset:0,lastX:0,lastTime:0,moved:false});const [dragging,setDragging]=useState(false);
 useEffect(()=>{
 let frame:number,lastTime=0;
 let width=240,pitch=249,viewport=1,height=1;
 const measure=()=>{const el=track.current;if(!el?.firstElementChild)return;width=el.firstElementChild.getBoundingClientRect().width;pitch=width+parseFloat(getComputedStyle(el).gap);viewport=el.parentElement!.clientWidth;height=el.parentElement!.clientHeight};
 measure();physics.current.offset=-width/2;
 const observer=new ResizeObserver(measure);if(track.current?.parentElement)observer.observe(track.current.parentElement);
 function animate(now:number){
  const delta=lastTime?Math.min(2,(now-lastTime)/(1000/60)):1;lastTime=now;
  const el=track.current,s=physics.current;
  if(el&&el.firstElementChild){
   const cycle=pitch*el.children.length;
   if(!s.drag&&!captionActive.current){
    if(Math.abs(s.velocity)>.1){s.offset+=s.velocity*delta;s.velocity*=Math.pow(.95,delta)}
    else{s.velocity=0;s.offset-=.8*delta}
    s.offset=((s.offset%cycle)+cycle)%cycle-cycle;
   }
   // Reposition the same six nodes when they leave the viewport; no cloned projects.
   el.style.transform='translate3d('+s.offset+'px,0,0)';
   Array.from(el.children).forEach((child,i)=>{
    const loops=Math.ceil((-s.offset-i*pitch-width)/cycle);
    (child as HTMLElement).style.transform='translate3d('+(loops*cycle)+'px,0,0)';
    const label=captions.current?.children[i] as HTMLElement|undefined;
    if(label){
     // Match the lower SVG mask curve at each photo's left-hand text anchor.
     const x=Math.max(0,Math.min(1,(s.offset+i*pitch+loops*cycle+10)/viewport));
     const u=Math.sqrt(2*Math.min(x,1-x));
     const edge=.91-.09*(3*u*u-2*u*u*u);
     const y=(edge-1)*height;
     const slope=(x<.5?-1:1)*.54*(1-u)*height/viewport;
     const angle=Math.atan(slope)*180/Math.PI;
     const screenX=s.offset+i*pitch+loops*cycle;
     label.style.transform='translate3d('+screenX+'px,'+y+'px,0) rotate('+angle+'deg)';
    }
   });
  }
  frame=requestAnimationFrame(animate);
 }
 frame=requestAnimationFrame(animate);
 return()=>{cancelAnimationFrame(frame);observer.disconnect()};
 },[]);
 return <div className="project-gallery-group"><section className="curved-gallery relative overflow-hidden"><div className="pointer-events-none absolute top-0 left-0 right-0 gallery-mask z-10"><svg viewBox="0 0 1440 100" preserveAspectRatio="none" className="w-full h-full"><path fill="white" d="M0 0H1440V50C1440 50 1200 100 720 100C240 100 0 50 0 50V0Z"/></svg></div>
 <div ref={track} className={'flex w-max gap-[9px] select-none '+(dragging?'cursor-grabbing':'cursor-grab')} style={{willChange:'transform',touchAction:'pan-y'}} onPointerDown={e=>{const s=physics.current;s.drag=true;s.moved=false;s.velocity=0;s.startX=s.lastX=e.clientX;s.startOffset=s.offset;s.lastTime=performance.now();(e.target as HTMLElement).closest('a')?.setPointerCapture(e.pointerId);setDragging(true)}} onPointerMove={e=>{const s=physics.current;if(!s.drag)return;const now=performance.now();s.velocity=((e.clientX-s.lastX)/Math.max(1,now-s.lastTime))*16;if(Math.abs(e.clientX-s.startX)>5)s.moved=true;s.offset=s.startOffset+e.clientX-s.startX;s.lastX=e.clientX;s.lastTime=now}} onPointerUp={e=>{physics.current.drag=false;setDragging(false);(e.target as HTMLElement).closest('a')?.releasePointerCapture(e.pointerId)}} onPointerCancel={()=>{physics.current.drag=false;setDragging(false)}}>
 {projects.slice(0,6).map((project,i)=><a href={'/projects/'+project.id} aria-label={project.title} key={i} onDragStart={e=>e.preventDefault()} onClick={e=>{if(physics.current.moved)e.preventDefault()}} className="project-slide flex-shrink-0 overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"><CoverImage project={project}/></a>)}</div>
 <div className="pointer-events-none absolute bottom-0 left-0 right-0 gallery-mask gallery-mask-bottom z-10"><svg viewBox="0 0 1440 100" preserveAspectRatio="none" className="w-full h-full"><path fill="white" d="M0 100H1440V50C1440 50 1200 0 720 0C240 0 0 50 0 50V100Z"/></svg></div></section>
 <div className="project-captions" onMouseEnter={()=>{captionActive.current=true}} onMouseLeave={()=>{captionActive.current=false}} onFocus={()=>{captionActive.current=true}} onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget as Node))captionActive.current=false}}>
 <div ref={captions} className="project-caption-layer">
 {projects.slice(0,6).map((project,i)=><div key={project.id} className="project-caption-slot"><a href={'/projects/'+project.id} className="project-caption-link"><span className="project-caption-number">{String(i+1).padStart(2,'0')}:</span><span>{project.title}</span></a></div>)}
 </div></div></div>
}
function Home({projects}:{projects:Project[]}){return <main className="studio-home min-h-screen bg-white overflow-hidden"><StudioSketches/><Navbar/><section className="pt-24 sm:pt-28 pb-1 text-center px-4 sm:px-6"><ArtisticTitle/><p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-neutral-900 max-w-xl mx-auto leading-relaxed">{<Copy value={homeContent.subtitle}/>}</p></section><ImageMarquee projects={projects}/><section className="text-center px-4 sm:px-6 pt-2 pb-12 sm:pb-16 max-w-2xl mx-auto"><p className="text-base sm:text-lg md:text-xl text-neutral-900 leading-relaxed">{<Copy value={homeContent.description}/>}</p><div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8"><ContactButton variant="text" align="center"/><a href="#" className="text-neutral-900 font-semibold underline underline-offset-4 decoration-neutral-400 hover:decoration-neutral-900 transition-colors"><Copy value="See Projects"/></a></div></section></main>}



type SiteData={projects:Project[];texts:Record<string,string>};
function database():Promise<IDBDatabase>{return new Promise((resolve,reject)=>{const request=indexedDB.open('bespoke-editor',1);request.onupgradeneeded=()=>request.result.createObjectStore('content');request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error)})}
async function readData(){const db=await database();return new Promise<SiteData|undefined>((resolve,reject)=>{const tx=db.transaction('content');const req=tx.objectStore('content').get('site');req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);tx.oncomplete=()=>db.close()})}
async function writeData(data:SiteData){const db=await database();return new Promise<void>((resolve,reject)=>{const tx=db.transaction('content','readwrite');tx.objectStore('content').put(data,'site');tx.oncomplete=()=>{db.close();resolve()};tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error)})}
function App(){
 const [data,setData]=useState<SiteData>({projects:initialProjects,texts:{}});const [ready,setReady]=useState(false);
 useEffect(()=>{
 let active=true;
 async function load(){
  if(import.meta.env.PROD){
   try{const response=await fetch(import.meta.env.BASE_URL+'content.json');if(!response.ok)throw Error('Published content missing');const published=await response.json();if(active){setData(published);setReady(true)}}catch(error){console.error(error);if(active)document.getElementById('root')!.textContent='作品内容加载失败，请刷新页面重试。'}
   return;
  }
  let loaded:SiteData={projects:initialProjects,texts:{}};
  try{
   const saved=await readData();
   if(saved)loaded=saved;
   else{try{const old=JSON.parse(localStorage.getItem('bespoke-projects')||'null');if(old)loaded={projects:old,texts:{}}}catch{}}
   if(loaded.projects.some(p=>p.id==='project-1'&&p.contentImportVersion!==projectOneImportVersion)){
    loaded={...loaded,projects:loaded.projects.map(p=>p.id==='project-1'?{...p,detailImage:projectOneImages[0],gallery:projectOneImages.slice(1),seamless:true,contentImportVersion:projectOneImportVersion}:p)};
    await writeData(loaded);
   }
   if(loaded.projects.some(p=>p.id==='project-2'&&p.contentImportVersion!==projectTwoImportVersion)){
    loaded={...loaded,projects:loaded.projects.map(p=>p.id==='project-2'?{...p,detailImage:projectTwoImages[0],gallery:projectTwoImages.slice(1),seamless:true,contentImportVersion:projectTwoImportVersion}:p)};
    await writeData(loaded);
   }
   if(loaded.projects.some(p=>p.id==='project-5'&&p.contentImportVersion!=='obsbot-html-2026-11-10-v1')){
    loaded={...loaded,projects:loaded.projects.map(p=>p.id==='project-5'?{...p,embeddedPage:'/portfolios/project-5.html',contentImportVersion:'obsbot-html-2026-11-10-v1'}:p)};
    await writeData(loaded);
   }
   if(loaded.projects.some(p=>p.id==='project-5'&&p.coverImportVersion!=='obsbot-expanded-2026-11-10-v2')){
    loaded={...loaded,projects:loaded.projects.map(p=>p.id==='project-5'?{...p,image:'/assets/project-5/obsbot-cover-expanded-v2.png',fallback:undefined,coverCrop:{x:50,y:50,zoom:1},coverImportVersion:'obsbot-expanded-2026-11-10-v2'}:p)};
    await writeData(loaded);
   }
   if(loaded.projects.some(p=>p.id==='project-3'&&!['amazon-study-v1','amazon-study-v2','amazon-study-v3'].includes(p.contentImportVersion||''))){
    loaded={...loaded,projects:loaded.projects.map(p=>p.id==='project-3'?{...p,title:'亚马逊实战 · 透气护腰带',description:'亚马逊实习期间的产品实战项目，涵盖产品卖点图、AI 广告制作与首图优化。',detailImage:'/assets/project-3/overview.jpg',videoSource:'/assets/project-3/ad-short.mp4',alternateVideo:'/assets/project-3/ad-full.mp4',comparisonImage:'/assets/project-3/comparison.jpg',gallery:Array.from({length:10},(_,i)=>'/assets/project-3/selling-'+(i+1)+([6,8,9].includes(i+1)?'.png':'.jpg')),caseCopy:{...amazonCopy},contentImportVersion:'amazon-study-v1'}:p)};
    await writeData(loaded);
   }
   if(loaded.projects.some(p=>p.id==='project-3'&&!['amazon-study-v2','amazon-study-v3'].includes(p.contentImportVersion||''))){
    loaded={...loaded,projects:loaded.projects.map(p=>p.id==='project-3'?{...p,detailImage:'/assets/project-3/overview-v2.jpg',caseCopy:{...p.caseCopy,overview:amazonCopy.overview,video:amazonCopy.video,selling:amazonCopy.selling,comparison:amazonCopy.comparison,comparisonNote:'重点优化腰带网眼的通透感，还原更真实的透气效果，让轻薄、透气的产品特点在首图中更清晰可见。优化后，点击率从 0.5% 提升至 0.7%，提高 0.2 个百分点。'},contentImportVersion:'amazon-study-v2'}:p)};
    await writeData(loaded);
   }
   if(loaded.projects.some(p=>p.id==='project-3'&&p.contentImportVersion!=='amazon-study-v3')){
    loaded={...loaded,projects:loaded.projects.map(p=>p.id==='project-3'?{...p,detailImage:'/assets/project-3/overview-clean.png',comparisonImage:'/assets/project-3/comparison-clean.png',videoSource:'/assets/project-3/ad-full.mp4',contentImportVersion:'amazon-study-v3'}:p)};
    await writeData(loaded);
   }
   if(loaded.projects.some(p=>p.id==='project-6'&&p.sphereImportVersion!=='photos-20261111-v1')){
    const additions=Array.from({length:9},(_,i)=>'/assets/project-6/added-20261111-'+String(i+1).padStart(2,'0')+'.jpg');
    loaded={...loaded,projects:loaded.projects.map(p=>{
     if(p.id!=='project-6')return p;
     const existing=p.sphereImages?.filter(Boolean).length?p.sphereImages:p.gallery.filter(Boolean).length?p.gallery:loaded.projects.map(item=>item.image);
     return {...p,sphereImages:[...existing,...additions.filter(url=>!existing.includes(url))],sphereImportVersion:'photos-20261111-v1'};
    })};
    await writeData(loaded);
   }
   if(loaded.projects.some(p=>p.id==='project-6'&&p.photographyImportVersion!=='photography-pdf-v1')){
    const additions=["/assets/project-6/photography/p01-01.jpg", "/assets/project-6/photography/p01-02.jpg", "/assets/project-6/photography/p02-01.jpg", "/assets/project-6/photography/p03-03.jpg", "/assets/project-6/photography/p03-04.jpg", "/assets/project-6/photography/p03-05.jpg", "/assets/project-6/photography/p03-06.jpg", "/assets/project-6/photography/p04-03.jpg", "/assets/project-6/photography/p04-04.jpg", "/assets/project-6/photography/p04-05.jpg", "/assets/project-6/photography/p04-06.jpg", "/assets/project-6/photography/p05-03.jpg", "/assets/project-6/photography/p05-04.jpg", "/assets/project-6/photography/p05-05.jpg", "/assets/project-6/photography/p05-06.jpg", "/assets/project-6/photography/p06-03.jpg", "/assets/project-6/photography/p06-04.jpg", "/assets/project-6/photography/p06-05.jpg", "/assets/project-6/photography/p06-06.jpg", "/assets/project-6/photography/p07-03.jpg", "/assets/project-6/photography/p07-04.jpg", "/assets/project-6/photography/p07-05.jpg", "/assets/project-6/photography/p07-06.jpg", "/assets/project-6/photography/p07-07.jpg", "/assets/project-6/photography/p07-08.jpg", "/assets/project-6/photography/p08-05.jpg", "/assets/project-6/photography/p08-06.jpg"];
    loaded={...loaded,projects:loaded.projects.map(p=>{
     if(p.id!=='project-6')return p;
     const existing=p.sphereImages?.filter(Boolean).length?p.sphereImages:p.gallery.filter(Boolean).length?p.gallery:loaded.projects.map(item=>item.image);
     return {...p,sphereImages:[...existing,...additions.filter(url=>!existing.includes(url))],photographyImportVersion:'photography-pdf-v1'};
    })};
    await writeData(loaded);
   }
   if(loaded.projects.some(p=>p.id==='project-4'&&p.contentImportVersion!=='film-study-2026-11-10-v2')){
    loaded={...loaded,projects:loaded.projects.map(p=>p.id==='project-4'?{...p,title:p.title==='Project 04'?'爆款视频复刻':p.title,videoSource:'/assets/project-4/film-study.mp4',contentImportVersion:'film-study-2026-11-10-v2'}:p)};
    await writeData(loaded);
   }
   const descriptions=["为OBSBOT打造品牌IP，探索角色设定、视觉延展与衍生应用。", "以自然情绪为线索，探索AI模特、服装造型与品牌影像表达。", "亚马逊实习实战：护腰带卖点图、UGC广告与首图透气质感优化。", "拆解子弹时间镜头，以AI重构人物、产品与动作，完成广告短片。", "围绕OBSBOT Me智能跟拍，构建产品叙事与完整电商视觉。", "汇集人像、风景摄影与建筑设计，以互动照片球体呈现多元视角。"];
   if(loaded.projects.some(p=>p.descriptionVersion!=='intro-20261113-v1')){
    loaded={...loaded,projects:loaded.projects.map(p=>{
     const description=descriptions[Number(p.id.replace('project-',''))-1];
     return description&&p.descriptionVersion!=='intro-20261113-v1'?{...p,description,descriptionVersion:'intro-20261113-v1'}:p;
    })};
    await writeData(loaded);
   }
   if(loaded.projects.some(p=>p.id==='project-2'&&p.tvcPromptVersion!=='timed-v1')){
    loaded={...loaded,projects:loaded.projects.map(p=>p.id==='project-2'?{...p,tvcPrompt:tvcStoryboardPrompt,tvcPromptVersion:'timed-v1'}:p)};
    await writeData(loaded);
   }
  }catch(error){console.error('Unable to load saved portfolio',error)}
  if(active){setData(loaded);setReady(true);if(import.meta.env.DEV)void fetch('/__portfolio_snapshot',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(loaded)}).catch(error=>console.error('Snapshot save failed',error));}
 }
 load();return()=>{active=false};
 },[]);
 const project=data.projects.find(p=>'/projects/'+p.id===location.pathname.replace(/\/$/,''));
 const [detailZoom,setDetailZoom]=useState(1);
 useEffect(()=>{
  if(!project)return;
  const onWheel=(e:WheelEvent)=>{
   if(!e.shiftKey||e.ctrlKey||e.metaKey||(e.target as HTMLElement).closest('[role="dialog"],input,textarea,select'))return;
   e.preventDefault();
   const delta=e.deltaY||e.deltaX;
   setDetailZoom(value=>Math.max(.5,Math.min(2.5,value*Math.exp(-delta*.002))));
  };
  window.addEventListener('wheel',onWheel,{passive:false});
  return()=>window.removeEventListener('wheel',onWheel);
 },[project?.id]);
 useEffect(()=>{document.title=project?project.title+' — Bespoke Architecture Studio':data.texts[homeContent.title[0]]||'Bespoke Architecture Studio'},[project,data.texts]);
 if(!ready)return <div className="p-8">正在加载作品…</div>;
 return <TextContext.Provider value={data.texts}>
 {project&&<div className="detail-tools"><a href={import.meta.env.BASE_URL} className="detail-back" aria-label="返回首页" title="返回首页"><svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M14 5L7 12L14 19M7 12H22"/></svg></a><div className="detail-zoom-controls"><button onClick={()=>setDetailZoom(v=>Math.max(.5,v-.1))} aria-label="缩小内容">−</button><button onClick={()=>setDetailZoom(1)} title="恢复原始大小">{Math.round(detailZoom*100)}%</button><button onClick={()=>setDetailZoom(v=>Math.min(2.5,v+.1))} aria-label="放大内容">＋</button><span>Shift + 滚轮缩放</span></div></div>}
 {(project?.id==='project-1'||project?.id==='project-2')?<IPStudy project={project} zoom={detailZoom}/>:project?.id==='project-3'?<AmazonStudy project={project} zoom={detailZoom}/>:project?.id==='project-4'?<FilmStudy zoom={detailZoom} project={project}/>:project?.id==='project-6'?<PhotoGlobe project={project} fallbackImages={data.projects.map(p=>p.image)} paused={false} zoom={detailZoom}/>:project?<main className={'detail-page portfolio-detail min-h-screen text-neutral-900'+(project.videoSource?' video-detail-page':'')}><div className="h-20"/><article style={{zoom:detailZoom,width:'100vw'}} className="max-w-6xl mx-auto px-6 py-12"><ProjectHeading project={project}/><p className="text-lg leading-relaxed max-w-2xl mt-4 mb-8 whitespace-pre-wrap">{project.description}</p>{project.videoSource?<><FitVideo src={project.videoSource} title={project.title}/>{project.gallery.filter(Boolean).map((url,i)=><img key={i} src={url} alt={project.title+' — '+(i+1)} className="block w-full h-auto mt-6" loading="lazy"/>)}</>:project.embeddedPage?<EmbeddedPortfolio src={project.embeddedPage} title={project.title+' · 作品集'} onZoom={delta=>setDetailZoom(v=>Math.max(.5,Math.min(2.5,v*Math.exp(-delta*.002))))}/>:<><img src={project.detailImage||project.image} alt={project.title} className="block w-full h-auto" onError={e=>{if(!project.detailImage&&project.fallback&&e.currentTarget.src!==project.fallback)e.currentTarget.src=project.fallback}}/><div className={project.seamless?'seamless-project-images':'space-y-6 mt-6'}>{project.gallery.filter(Boolean).map((url,i)=><img key={i} src={url} alt={project.title+' — '+(i+1)} className="block w-full h-auto" loading="lazy"/>)}</div></>}</article></main>:<Home projects={data.projects}/>}
 </TextContext.Provider>
}
createRoot(document.getElementById('root')!).render(<App/>);
