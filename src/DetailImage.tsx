import {useState,type ImgHTMLAttributes} from 'react';
import manifest from './imageManifest.json';
export function DetailImage(props:ImgHTMLAttributes<HTMLImageElement>){
 const [ready,setReady]=useState(false);
 const key=(props.src||'').replace(import.meta.env.BASE_URL,'/');
 const item=(manifest as Record<string,{src:string;width:number;height:number}>)[props.src||'']||(manifest as Record<string,{src:string;width:number;height:number}>)[key];
 const src=item?(item.src.startsWith(import.meta.env.BASE_URL)?item.src:import.meta.env.BASE_URL+item.src.slice(1)):props.src;
 return <img {...props} src={src} width={item?.width||props.width} height={item?.height||props.height} decoding="async" style={{...props.style,opacity:ready?1:0,transition:'opacity 180ms ease'}} ref={el=>{if(el?.complete&&el.naturalWidth&&!ready)setReady(true)}} onLoad={async e=>{const el=e.currentTarget;try{await el.decode()}catch{}setReady(true);props.onLoad?.(e)}} onError={e=>{setReady(true);props.onError?.(e)}}/>;
}
