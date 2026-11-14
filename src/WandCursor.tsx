import {useEffect,useRef,useState} from 'react';

type Spark = {id:number;x:number;y:number};
export function WandCursor(){
 const [sparks,setSparks]=useState<Spark[]>([]);
 const sequence=useRef(0);
 useEffect(()=>{
  const timers=new Set<ReturnType<typeof setTimeout>>();
  function click(e:PointerEvent){
   if(e.pointerType!=='mouse'||e.button!==0)return;
   const id=++sequence.current;
   setSparks(old=>[...old.slice(-7),{id,x:e.clientX,y:e.clientY}]);
   const timer=setTimeout(()=>{setSparks(old=>old.filter(s=>s.id!==id));timers.delete(timer)},600);
   timers.add(timer);
  }
  document.addEventListener('pointerdown',click,{passive:true});
  return()=>{document.removeEventListener('pointerdown',click);timers.forEach(clearTimeout)};
 },[]);
 return <div className="wand-effects" aria-hidden="true">{sparks.map(s=><span key={s.id} className="wand-burst" style={{left:s.x,top:s.y}}>{[0,90,180,270].map(angle=><span className="wand-ray" key={angle} style={{transform:'rotate('+angle+'deg)'}}><i/></span>)}</span>)}</div>;
}
