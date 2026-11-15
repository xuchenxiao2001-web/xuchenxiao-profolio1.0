import {DetailImage} from './DetailImage';
import {tvcStoryboardPrompt} from './tvcCopy';
import {useLayoutEffect,useRef,useState} from 'react';
import type {Project} from './content';
import {ProjectHeading} from './ProjectHeading';
const ipSections=[{label:'项目背景与IP设定',start:0,end:5},{label:'IP日常及产品线海报',start:5,end:6},{label:'物料延展与工作流总结',start:6,end:9}];
export function IPStudy({project,zoom}:{project:Project;zoom:number}){
 const sections=project.id==='project-2'?[{label:'项目背景与AI模特生成',start:0,end:9},{label:'双AI模特换装展示',start:9,end:17},{label:'场景延伸与项目总结',start:17,end:26},{label:'TVC视频广告',start:26,end:26}]:ipSections;
 const [active,setActive]=useState(0);const tabs=useRef<(HTMLButtonElement|null)[]>([]);
 const footerNavigation=useRef(false);
 useLayoutEffect(()=>{
  if(!footerNavigation.current)return;
  footerNavigation.current=false;
  const panel=document.getElementById('ip-panel-'+active);
  panel?.focus({preventScroll:true});
  panel?.scrollIntoView({behavior:'instant',block:'start'});
 },[active]);
 function navigate(next:number){footerNavigation.current=true;setActive(next)}
 const images=[project.detailImage||project.image,...project.gallery];
 return <main className={'detail-page ip-study min-h-screen '+(project.id==='project-2'?'model-study':'')}><div className="h-20"/><article className="max-w-6xl mx-auto px-6 py-12" style={{zoom,width:'100vw'}}>
 <ProjectHeading project={project}/><p className="ip-introduction">{project.description}</p>
 <div className="ip-tabs" role="tablist" aria-label="作品分类">{sections.map((s,i)=><button key={s.label} ref={el=>{tabs.current[i]=el}} id={'ip-tab-'+i} type="button" role="tab" aria-selected={active===i} aria-controls={'ip-panel-'+i} tabIndex={active===i?0:-1} onClick={()=>setActive(i)} onKeyDown={e=>{let next=i;if(e.key==='ArrowRight')next=(i+1)%sections.length;else if(e.key==='ArrowLeft')next=(i+sections.length-1)%sections.length;else if(e.key==='Home')next=0;else if(e.key==='End')next=sections.length-1;else return;e.preventDefault();setActive(next);tabs.current[next]?.focus()}}><span>{String(i+1).padStart(2,'0')}</span>{s.label}</button>)}</div>
 {sections.map((s,i)=><section key={s.label} id={'ip-panel-'+i} role="tabpanel" aria-labelledby={'ip-tab-'+i} hidden={active!==i} tabIndex={0} className="ip-panel">{active!==i?null:project.id==='project-2'&&i===3?<div className="model-tvc"><video src="/assets/project-2/tvc/film.mp4" poster="/assets/project-2/tvc/poster.jpg" controls playsInline preload="metadata" ref={el=>{if(el&&active!==3)el.pause()}}/><h3 className="tvc-storyboard-title">九宫格分镜</h3><DetailImage src="/assets/project-2/tvc/storyboard.png" alt="TVC广告分镜" loading="lazy"/><div className="model-tvc-copy"><span>STORYBOARD / 分镜提示词</span><p>{project.tvcPrompt||tvcStoryboardPrompt}</p></div><DetailImage src="/assets/project-2/tvc/technique.jpg" alt="TVC广告技术路径" loading="lazy"/></div>:images.slice(s.start,s.end).map((src,n)=>src&&<DetailImage key={s.start+n} src={src} alt={s.label+' · 作品图片 '+(s.start+n+1)} loading={n===0?'eager':'lazy'}/>)}</section>)}
 <nav className="ip-section-navigation" aria-label="切换作品分类">
 {active>0?<button type="button" onClick={()=>navigate(active-1)}><span>← 上一部分</span><strong>{sections[active-1].label}</strong></button>:<span/>}
 {active<sections.length-1?<button type="button" className="ip-next-section" onClick={()=>navigate(active+1)}><span>下一部分 →</span><strong>{sections[active+1].label}</strong></button>:<span/>}
 </nav>
 </article></main>
}
