export function WebVideo({src,poster,label}:{src:string;poster?:string;label:string}){
 return <video src={src} poster={poster} controls playsInline preload="auto" aria-label={label}/>;
}
