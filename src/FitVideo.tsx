import {useEffect,useRef,useState} from 'react';

export function FitVideo({src,title}:{src:string;title:string}){
 const frame=useRef<HTMLDivElement>(null);
 const [available,setAvailable]=useState(400);
 const [ratio,setRatio]=useState(9/16);
 useEffect(()=>{
  const el=frame.current;if(!el)return;
  const measure=()=>{
   // Use document coordinates so scrolling never changes the fitted player size.
   const top=el.getBoundingClientRect().top+window.scrollY;
   setAvailable(Math.max(100,window.innerHeight-top-24));
  };
  const observer=new ResizeObserver(measure);
  if(el.parentElement)observer.observe(el.parentElement);
  measure();window.addEventListener('resize',measure);
  document.fonts.ready.then(measure);
  return()=>{observer.disconnect();window.removeEventListener('resize',measure)};
 },[]);
 return <div ref={frame} className="fitted-video-frame">
 <video controls playsInline preload="metadata" className="fitted-video" aria-label={title+' · 视频'} style={{width:available*ratio,maxHeight:available}}
 onLoadedMetadata={e=>{const v=e.currentTarget;if(v.videoWidth&&v.videoHeight)setRatio(v.videoWidth/v.videoHeight)}}>
 <source src={src} type="video/mp4"/>您的浏览器暂不支持播放此视频。
 </video></div>
}
