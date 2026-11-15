import {useEffect,useRef,useState} from 'react';
export function WebVideo({src,poster,label}:{src:string;poster?:string;label:string}){
 const ref=useRef<HTMLVideoElement>(null);const [waiting,setWaiting]=useState(false);const [error,setError]=useState(false);
 useEffect(()=>{const video=ref.current;if(!video)return;const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){video.preload='auto';observer.disconnect()}},{rootMargin:'500px'});observer.observe(video);return()=>observer.disconnect()},[src]);
 return <><video ref={ref} src={src} poster={poster} controls playsInline preload="metadata" aria-label={label} onWaiting={()=>setWaiting(true)} onPlaying={()=>{setWaiting(false);setError(false)}} onCanPlay={()=>setWaiting(false)} onPause={()=>setWaiting(false)} onError={()=>{setError(true);setWaiting(false)}}/>{waiting&&<span className="video-status" role="status">正在缓冲…</span>}{error&&<button className="video-retry" onClick={()=>{setError(false);ref.current?.load();void ref.current?.play().catch(()=>setError(true))}}>重新加载视频</button>}</>;
}
