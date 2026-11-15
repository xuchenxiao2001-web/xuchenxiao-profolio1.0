import {useEffect,useState,type ImgHTMLAttributes} from 'react';
import manifest from './imageManifest.json';
export function DetailImage(props:ImgHTMLAttributes<HTMLImageElement>){
 const [ready,setReady]=useState(false);const [attempt,setAttempt]=useState(0);
 const key=(props.src||'').replace(import.meta.env.BASE_URL,'/');
 const item=(manifest as Record<string,{src:string;width:number;height:number}>)[props.src||'']||(manifest as Record<string,{src:string;width:number;height:number}>)[key];
 const source=item?(item.src.startsWith(import.meta.env.BASE_URL)?item.src:import.meta.env.BASE_URL+item.src.slice(1)):props.src;
 const src=attempt===2?props.src:source;
 useEffect(()=>{setReady(false);setAttempt(0)},[source]);
 return <img {...props} src={attempt===1&&src?src+(src.includes('?')?'&':'?')+'retry=1':src} width={item?.width||props.width} height={item?.height||props.height} loading={props.loading||'lazy'} fetchPriority={props.loading==='eager'?'high':'auto'} decoding="async" style={{...props.style,opacity:1}} ref={el=>{if(el?.complete&&el.naturalWidth&&!ready)setReady(true)}} onLoad={e=>{setReady(true);props.onLoad?.(e)}} onError={e=>{if(attempt<2)setAttempt(v=>v+1);else{setReady(true);props.onError?.(e)}}}/>;
}
