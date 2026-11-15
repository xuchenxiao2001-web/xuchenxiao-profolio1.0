import {DetailImage} from './DetailImage';
import {tvcStoryboardPrompt} from './tvcCopy';
import {useEffect,useState} from 'react';
import type {Project} from './content';
import {ProjectHeading} from './ProjectHeading';
const ipSections=[{label:'项目背景与IP设定',start:0,end:5},{label:'IP日常及产品线海报',start:5,end:6},{label:'物料延展与工作流总结',start:6,end:9}];
export function IPStudy({project,zoom}:{project:Project;zoom:number}){
 const sections=project.id==='project-2'?[{label:'项目背景与AI模特生成',start:0,end:9},{label:'双AI模特换装展示',start:9,end:17},{label:'场景延伸与项目总结',start:17,end:26},{label:'TVC视频广告',start:26,end:26}]:ipSections;
 const [active,setActive]=useState(0);
 useEffect(()=>{
  const update=()=>{let current=0;sections.forEach((_,i)=>{if((document.getElementById('ip-panel-'+i)?.getBoundingClientRect().top??Infinity)<innerHeight*.35)current=i});setActive(current)};
  window.addEventListener('scroll',update,{passive:true});update();return()=>window.removeEventListener('scroll',update);
 },[project.id]);
 const images=[project.detailImage||project.image,...project.gallery];
 return <main className={'detail-page ip-study indexed-study min-h-screen '+(project.id==='project-2'?'model-study':'')}>
 <nav className="study-directory" aria-label="作品目录"><span className="directory-label">CONTENTS / 目录</span>{sections.map((s,i)=><a key={s.label} href={'#ip-panel-'+i} aria-current={active===i?'location':undefined} onClick={e=>{e.preventDefault();document.getElementById('ip-panel-'+i)?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'})}}><span>{String(i+1).padStart(2,'0')}</span><span>{s.label}</span></a>)}</nav>
 <header className="study-heading"><ProjectHeading project={project}/><p className="ip-introduction">{project.description}</p></header><article className="study-document">
 {sections.map((s,i)=><section key={s.label} id={'ip-panel-'+i} aria-label={s.label} className={'ip-panel study-section'+(project.id==='project-2'&&i===3?' tvc-separated-section':'')}>{project.id==='project-2'&&i===3?<div className="model-tvc"><h2 className="tvc-section-title">TVC广告视频</h2><video src="/assets/project-2/tvc/film.mp4" poster="/assets/project-2/tvc/poster.jpg" controls playsInline preload="none"/><h3 className="tvc-storyboard-title">九宫格分镜</h3><DetailImage src="/assets/project-2/tvc/storyboard.png" alt="TVC广告分镜" loading="lazy"/><div className="model-tvc-copy"><span>STORYBOARD / 分镜提示词</span><p>{project.tvcPrompt||tvcStoryboardPrompt}</p></div><DetailImage src="/assets/project-2/tvc/technique.jpg" alt="TVC广告技术路径" loading="lazy"/></div>:images.slice(s.start,s.end).map((src,n)=>src&&<DetailImage key={s.start+n} src={src} alt={s.label+' · 作品图片 '+(s.start+n+1)} loading={i===0&&n===0?'eager':'lazy'}/>)}</section>)}
 </article></main>;
}
