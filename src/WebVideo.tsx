import {useEffect,useRef,useState} from 'react';
const videoCache=new Map<string,Promise<string>>();
export function WebVideo({src,poster,label}:{src:string;poster?:string;label:string}){
 const ref=useRef<HTMLVideoElement>(null);const [url,setUrl]=useState('');const [progress,setProgress]=useState(0);const [error,setError]=useState(false);const [retry,setRetry]=useState(0);
 useEffect(()=>{let active=true;const el=ref.current;if(!el)return;
 const prepare=()=>{setError(false);let pending=videoCache.get(src);
 if(!pending){pending=(async()=>{const response=await fetch(src);if(!response.ok)throw Error('Video download failed');const total=Number(response.headers.get('Content-Length'));const reader=response.body?.getReader();if(!reader) return URL.createObjectURL(await response.blob());const chunks:Uint8Array<ArrayBuffer>[]=[];let received=0;while(true){const {done,value}=await reader.read();if(done)break;chunks.push(new Uint8Array(value));received+=value.length;if(active&&total)setProgress(Math.min(99,Math.round(received/total*100)))}return URL.createObjectURL(new Blob(chunks,{type:'video/mp4'}))})();videoCache.set(src,pending);pending.catch(()=>videoCache.delete(src));}
 pending.then(value=>{if(active){setUrl(value);setProgress(100)}}).catch(()=>{if(active)setError(true)});
 };const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){prepare();observer.disconnect()}},{rootMargin:'900px'});observer.observe(el);return()=>{active=false;observer.disconnect()};
 },[src,retry]);
 return <div className="prepared-video"><video ref={ref} src={url||undefined} poster={poster} controls={!!url} playsInline preload="auto" aria-label={label} onError={()=>setError(true)}/>{!url&&<div className="video-prepare" role="status"><span>{error?'视频加载失败':'正在准备完整视频'+(progress?' · '+progress+'%':'…')}</span>{error?<button onClick={()=>{videoCache.delete(src);setRetry(v=>v+1)}}>重新加载</button>:<small>准备完成后可连续播放</small>}</div>}</div>;
}
