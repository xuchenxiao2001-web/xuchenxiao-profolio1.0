import {useEffect,useRef,useState} from 'react';

export function EmbeddedPortfolio({src,title,onZoom}:{src:string;title:string;onZoom:(delta:number)=>void}){
 const frame=useRef<HTMLIFrameElement>(null);
 const cleanup=useRef<()=>void>(()=>{});
 const zoom=useRef(onZoom);zoom.current=onZoom;
 const [height,setHeight]=useState(1000);
 const [loaded,setLoaded]=useState(false);
 useEffect(()=>()=>cleanup.current(),[]);
 function measureContent(){
  cleanup.current();
  const doc=frame.current?.contentDocument;
  if(!doc?.body)return;
  // Measure the document's own content, without importing its styles into the project page.
  const measure=()=>setHeight(Math.max(200,Math.ceil(doc.body.offsetHeight)));
  const observer=new ResizeObserver(measure);observer.observe(doc.body);
  const wheel=(event:WheelEvent)=>{if(!event.shiftKey||event.ctrlKey||event.metaKey)return;event.preventDefault();zoom.current(event.deltaY||event.deltaX)};
  doc.addEventListener('wheel',wheel,{passive:false});
  measure();setLoaded(true);
  cleanup.current=()=>{observer.disconnect();doc.removeEventListener('wheel',wheel)};
 }
 return <section aria-label="嵌入作品集" className="embedded-portfolio">
 {!loaded&&<p className="text-sm text-neutral-500 py-3" role="status">正在加载作品集…</p>}
 <iframe ref={frame} src={src} title={title} onLoad={measureContent} sandbox="allow-same-origin allow-popups allow-popups-to-escape-sandbox" style={{display:'block',width:'100%',height,border:0}}/>
 </section>;
}
