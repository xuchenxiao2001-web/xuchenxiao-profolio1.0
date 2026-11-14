import globeThumbnails from './globeThumbnails.json';
import {useEffect,useLayoutEffect,useMemo,useRef,useState} from 'react';
import type {Project} from './content';
function previewSource(src:string){
 const local=(globeThumbnails as Record<string,string>)[src];
 if(local)return local;
 if(src.startsWith('https://images.higgs.ai/')){const url=new URL(src);url.searchParams.set('w','480');url.searchParams.set('q','65');return url.href}
 return src;
}
type Selection={index:number;rect:DOMRect;width:number;height:number};
export function PhotoGlobe({project,fallbackImages,paused,zoom=1}:{project:Project;fallbackImages:string[];paused:boolean;zoom?:number}){
 const photos=(project.sphereImages?.filter(Boolean).length?project.sphereImages:project.gallery.filter(Boolean).length?project.gallery:fallbackImages)!.filter(Boolean);
 const tiles=useMemo(()=>[-60,-30,0,30,60].flatMap((latitude,row)=>{
  const count=[6,10,12,10,6][row];return Array.from({length:count},(_,i)=>({latitude,longitude:i*360/count+(row%2&&latitude!==-30?15:0)}));
 }),[]);
 // Assign the three front-facing latitude bands by subject, then retain all
 // other photographs on the remaining surface without changing stored content.
 const photoOrder=useMemo(()=>{
  const groups=[
   {latitude:-30,names:['added-20261111-09.jpg','photography/p07-03.jpg','photography/p08-06.jpg','photography/p08-05.jpg','photography/p07-04.jpg']},
   {latitude:0,names:['photography/p05-04.jpg','added-20261111-03.jpg','photography/p05-03.jpg','added-20261111-05.jpg','photography/p04-03.jpg']},
   {latitude:30,names:['photography/p01-01.jpg','photography/p07-05.jpg','photography/p07-06.jpg','added-20261111-08.jpg','photography/p07-07.jpg']}
  ];
  const result:number[]=Array(tiles.length).fill(-1),used=new Set<number>();
  for(const group of groups){
   const slots=tiles.map((t,i)=>({...t,index:i})).filter(t=>t.latitude===group.latitude&&Math.cos(t.longitude*Math.PI/180)>0.05).sort((a,b)=>Math.cos(b.longitude*Math.PI/180)-Math.cos(a.longitude*Math.PI/180));
   const candidates=group.names.map(name=>photos.findIndex(url=>url.endsWith('/'+name))).filter(i=>i>=0);
   slots.forEach((slot,i)=>{if(!candidates.length)return;const index=candidates[i%candidates.length];result[slot.index]=index;used.add(index)});
  }
  // Second row from the top: photo 1 left, photo 2 center, photo 5 right.
  // Keep editor numbering unchanged; only the sphere's placement is adjusted.
  for(const [longitude,photoIndex] of [[324,0],[0,1],[36,4]]){
   const slot=tiles.findIndex(t=>t.latitude===-30&&t.longitude===longitude);
   if(slot>=0&&photoIndex<photos.length)result[slot]=photoIndex;
  }
  used.clear();result.forEach(index=>{if(index>=0)used.add(index)});
  const remaining=photos.map((_,i)=>i).filter(i=>!used.has(i));let cursor=0;
  result.forEach((value,i)=>{if(value<0)result[i]=remaining.length?remaining[cursor++%remaining.length]:i%photos.length});
  // Swap display positions only; preserve photo numbering in the editor.
  return photos.length>=8?result.map(index=>index===3?7:index===7?3:index):result;
 },[photos.join('|'),tiles]);
 const stage=useRef<HTMLDivElement>(null),world=useRef<HTMLDivElement>(null),plate=useRef<HTMLImageElement>(null),closeButton=useRef<HTMLButtonElement>(null);
 const [accelerated,setAccelerated]=useState(false);
 const [selection,setSelection]=useState<Selection|null>(null);const [radius,setRadius]=useState(0);
 const motion=useRef({yaw:0,pitch:0,targetYaw:0,targetPitch:0,inside:false,vx:0,vy:0,down:false,x:0,y:0,startX:0,startY:0,moved:false,index:-1,rect:null as DOMRect|null});
 const previousFocus=useRef<HTMLElement|null>(null);
 useLayoutEffect(()=>{const el=stage.current;if(!el)return;const measure=()=>setRadius(Math.min(el.clientWidth*.35,el.clientHeight*.36));measure();const observer=new ResizeObserver(measure);observer.observe(el);return()=>observer.disconnect()},[]);

 function insideGlobe(x:number,y:number){const box=stage.current?.getBoundingClientRect();return !!box&&Math.hypot(x-box.left-box.width/2,y-box.top-box.height/2)<radius*1.2*zoom}
 function stopHover(){const m=motion.current;m.inside=false;m.targetYaw=m.yaw;m.targetPitch=m.pitch;m.vx=m.vy=0}
 useEffect(()=>{
  const el=stage.current;if(!el)return;let frame=0;

  function tick(){const m=motion.current;
   if(!selection&&!paused){const ease=m.down||accelerated?.14:.065;m.yaw+=(m.targetYaw-m.yaw)*ease;m.pitch+=(m.targetPitch-m.pitch)*ease}
   if(world.current){
    world.current.style.transform='rotateX('+m.pitch+'deg) rotateY('+m.yaw+'deg)';
    const yaw=m.yaw*Math.PI/180,pitch=m.pitch*Math.PI/180;
    Array.from(world.current.children).forEach((child,i)=>{
     const t=tiles[i],lat=t.latitude*Math.PI/180,lng=t.longitude*Math.PI/180;
     const z=Math.sin(pitch)*Math.sin(lat)+Math.cos(pitch)*(-Math.sin(yaw)*Math.sin(lng)*Math.cos(lat)+Math.cos(yaw)*Math.cos(lng)*Math.cos(lat));
     (child as HTMLElement).style.opacity=String(z<0?.5+.22*(z+1):.85+.15*z);
    });
   }
   frame=requestAnimationFrame(tick)
  }tick();
  return()=>cancelAnimationFrame(frame);
 },[selection,paused,radius,tiles,accelerated]);
 function open(index:number,rect:DOMRect){
  previousFocus.current=document.activeElement as HTMLElement;stopHover();
  const source=world.current?.querySelector<HTMLImageElement>('[data-photo="'+index+'"] img');
  const ratio=(source?.naturalWidth||3)/(source?.naturalHeight||2);
  const width=Math.min(innerWidth*(innerWidth<700?.92:.76),innerHeight*.76*ratio);
  setSelection({index,rect,width,height:width/ratio});
 }
 function close(){if(!selection)return;const img=plate.current;if(!img){setSelection(null);return}const target=selection.rect,box=img.getBoundingClientRect();const animation=img.animate([{opacity:1,transform:'none'},{opacity:0,transform:'translate('+(target.x+target.width/2-box.x-box.width/2)+'px,'+(target.y+target.height/2-box.y-box.height/2)+'px) scale('+Math.max(.04,target.width/box.width)+')'}],{duration:600,easing:'cubic-bezier(.4,0,.2,1)',fill:'forwards'});animation.onfinish=()=>{setSelection(null);previousFocus.current?.focus()}}
 useLayoutEffect(()=>{if(!selection||!plate.current)return;const img=plate.current,b=img.getBoundingClientRect(),r=selection.rect;img.animate([{opacity:.65,transform:'translate('+(r.x+r.width/2-b.x-b.width/2)+'px,'+(r.y+r.height/2-b.y-b.height/2)+'px) scale('+Math.max(.04,r.width/b.width)+')'},{opacity:1,transform:'none'}],{duration:850,easing:'cubic-bezier(.22,1,.36,1)'});closeButton.current?.focus()},[selection]);
 useEffect(()=>{if(!selection)return;const key=(e:KeyboardEvent)=>{if(e.key==='Escape')close();if(e.key==='Tab'){e.preventDefault();closeButton.current?.focus()}};document.addEventListener('keydown',key);return()=>document.removeEventListener('keydown',key)},[selection]);
 return <main className={'photo-orbit '+(selection?'photo-selected':'')}>
 <header className="orbit-header"><span className="orbit-label">IMAGE ATLAS</span><span className="orbit-count">{selection?String(selection.index+1).padStart(2,'0'):'00'} / {String(photos.length).padStart(2,'0')}</span></header>
 <div className="orbit-title"><div className="project-eyebrow">Project06</div><span>Orbit</span><h1>{project.title}</h1><p><i/> A world of images</p></div>
 <p className="orbit-topnote">Different perspectives.<br/>One connected world.</p>
 <div ref={stage} className="orbit-stage" role="region" aria-label="照片球体，按住鼠标拖动旋转，Shift 加速，方向键支持360度旋转，点击照片按原始比例放大" tabIndex={0}
 onKeyDown={e=>{if(selection||paused)return;if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();motion.current.targetYaw+=e.key==='ArrowLeft'?-24:e.key==='ArrowRight'?24:0;motion.current.targetPitch+=e.key==='ArrowUp'?-18:e.key==='ArrowDown'?18:0}}}
 onPointerDown={e=>{if(selection||paused||e.button!==0)return;if(!(e.target as HTMLElement).closest('[data-photo]')&&!insideGlobe(e.clientX,e.clientY))return;e.currentTarget.focus({preventScroll:true});const m=motion.current;const card=(e.target as HTMLElement).closest<HTMLButtonElement>('[data-photo]');m.down=true;m.moved=false;m.vx=m.vy=0;m.x=m.startX=e.clientX;m.y=m.startY=e.clientY;m.index=card?Number(card.dataset.photo):-1;m.rect=card?.getBoundingClientRect()||null;e.currentTarget.setPointerCapture(e.pointerId)}}
 onPointerMove={e=>{
  if(selection||paused)return;
  const m=motion.current;
  if(!m.down)return;
  if(m.down){m.moved ||= Math.hypot(e.clientX-m.startX,e.clientY-m.startY)>6}
  if(!insideGlobe(e.clientX,e.clientY)){stopHover();m.x=e.clientX;m.y=e.clientY;return}
  if(e.pointerType==='mouse'||m.down){
   if(m.inside||m.down){const dx=e.clientX-m.x,dy=e.clientY-m.y;const speed=e.shiftKey||accelerated?.36:.22;m.targetYaw+=Math.max(-35,Math.min(35,dx))*speed;m.targetPitch-=Math.max(-35,Math.min(35,dy))*speed*.75}
   m.inside=true;m.x=e.clientX;m.y=e.clientY;
  }
 }}
 onPointerLeave={stopHover}
 onPointerUp={e=>{const m=motion.current;if(!m.down)return;m.down=false;if(e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId);if(!m.moved&&m.index>=0&&m.rect)open(m.index,m.rect)}}
 onPointerCancel={()=>{motion.current.down=false}}>
 <div className="orbit-zoom" style={{visibility:radius>0?'visible':'hidden',transform:'scale('+(zoom*(selection?1.08:1))+')'}}><div ref={world} className="orbit-world">{tiles.map((tile,i)=><button type="button" key={i} data-photo={photoOrder[i]} aria-label={'放大照片 '+(photoOrder[i]+1)} className="orbit-tile" style={{width:radius*.5,height:radius*.37,marginLeft:-radius*.25,marginTop:-radius*.185,transform:'rotateY('+tile.longitude+'deg) rotateX('+(-tile.latitude)+'deg) translateZ('+radius+'px)'}} onClick={e=>{if(!selection&&!paused&&(e.detail===0||!motion.current.moved))open(photoOrder[i],e.currentTarget.getBoundingClientRect())}}><img src={previewSource(photos[photoOrder[i]])} decoding="async" fetchPriority={Math.cos(tile.longitude*Math.PI/180)>.5?'high':'low'} alt={'作品照片 '+(photoOrder[i]+1)} draggable={false}/></button>)}</div></div>
 </div>
 <p className="orbit-description">{project.description==='Add your project description here.'?'Drag the globe to explore. Select an image to look closer.':project.description}</p>
 <div className="orbit-signature"><em>Perspectives</em><span>Worth exploring.</span></div>
 <div className="orbit-control"><button className="orbit-speed" type="button" aria-pressed={accelerated} onClick={()=>setAccelerated(v=>!v)}>{accelerated?'恢复慢速':'加速旋转'}</button><span>按住拖动 · 点击放大</span><span className="orbit-control-divider"/><span>按住拖动 / Shift 加速 · 方向键旋转</span></div>
 {selection&&<div className="orbit-lightbox" role="dialog" aria-modal="true" aria-label={'照片 '+(selection.index+1)} onClick={close}><img ref={plate} style={{width:selection.width,height:selection.height}} src={photos[selection.index]} alt={'放大的作品照片 '+(selection.index+1)} onClick={e=>e.stopPropagation()}/><button ref={closeButton} className="orbit-close" aria-label="关闭放大照片" onClick={e=>{e.stopPropagation();close()}}>×</button></div>}
 </main>
}
