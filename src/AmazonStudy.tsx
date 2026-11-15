import {WebVideo} from './WebVideo';
import {DetailImage} from './DetailImage';
import type {Project} from './content';
import {ProjectHeading} from './ProjectHeading';
export const amazonCopy={
 overview:'亚马逊上线实景。',overviewKicker:'01 / AMAZON OVERVIEW',overviewNote:'亚马逊实习实战 · 轻薄透气护腰带',
 video:'让产品走进日常。',videoKicker:'02 / AI UGC FILM',videoNote:'使用 C2.5 制作 UGC 风格广告，以日常使用场景介绍护腰带的产品特点。',
 short:'广告删减版',full:'广告完整版',cycleLabel:'制作周期',cycle:'5 天',ctrLabel:'上线后点击率',ctr:'超过 1.5%',conversionLabel:'转化率',conversion:'超过 10%',
 selling:'完整电商图组。',sellingKicker:'03 / LISTING GALLERY',sellingNote:'围绕产品特点、使用场景与穿戴体验，构建完整的产品视觉介绍。',
 comparison:'让透气性，看得见。',comparisonKicker:'04 / IMAGE OPTIMIZATION',before:'优化前',after:'优化后',comparisonFocus:'核心优化：腰带网眼与透气质感',comparisonNote:'优化腰带的透气度表现，还原更真实的透气效果。首图优化后，点击率从 0.5% 提升至 0.7%，提高 0.2 个百分点。'
};
export function AmazonStudy({project,zoom}:{project:Project;zoom:number}){
 const c={...amazonCopy,...project.caseCopy};
 return <main className="detail-page amazon-detail min-h-screen text-neutral-900"><div className="h-20"/><article className="amazon-study max-w-6xl mx-auto px-6 py-12" style={{zoom,width:'100vw'}}>
 <ProjectHeading project={project}/><p className="text-lg leading-relaxed max-w-2xl mt-4 mb-8 whitespace-pre-wrap">{project.description}</p>
 <section><header><span>{c.overviewKicker}</span><div><h2>{c.overview}</h2><p>{c.overviewNote}</p></div></header><DetailImage src={project.detailImage} alt={c.overview}/></section>
 <section><header><span>{c.videoKicker}</span><div><h2>{c.video}</h2><p>{c.videoNote}</p></div></header><div className="amazon-video"><WebVideo src="/assets/project-3/ad-full-ready.mp4" poster="/assets/project-3/poster-full.jpg" label="广告完整版"/></div><dl className="amazon-metrics">{[[c.cycleLabel,c.cycle],[c.ctrLabel,c.ctr],[c.conversionLabel,c.conversion]].map(([label,value],i)=><div key={i}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></section>
 <section><header><span>{c.sellingKicker}</span><div><h2>{c.selling}</h2><p>{c.sellingNote}</p></div></header><div className="amazon-selling">{project.gallery.filter(Boolean).map((src,i)=><DetailImage key={i} src={src} alt={c.selling+' '+(i+1)} loading="lazy"/>)}</div></section>
 <section><header><span>{c.comparisonKicker}</span><h2>{c.comparison}</h2></header><div className="amazon-comparison-pair">{[c.before,c.after].map((label,i)=><figure key={i}>{i===1?<DetailImage src={project.comparisonAfterImage??'/assets/project-3/comparison-after.jpg'} alt={label} loading="lazy"/>:<svg viewBox={`${i===0?18:662} 43 580 580`} role="img" aria-label={label}><image href={project.comparisonImage} width="1279" height="662" preserveAspectRatio="none"/></svg>}<figcaption>{label}</figcaption></figure>)}</div><h3 className="amazon-focus">{c.comparisonFocus}</h3><p className="amazon-comparison-note">{c.comparisonNote}</p></section>
 </article></main>
}
