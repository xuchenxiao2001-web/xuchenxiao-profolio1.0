import {WebVideo} from './WebVideo';
import {DetailImage} from './DetailImage';
import {ProjectHeading} from './ProjectHeading';
import type {Project} from './content';

export function FilmStudy({zoom,project}:{zoom:number;project:Project}){
 return <main className="detail-page film-detail min-h-screen text-neutral-900">
 <div className="h-20"/>
 <article style={{zoom,width:'100vw'}} className="max-w-6xl mx-auto px-6 py-12">
 <ProjectHeading project={project}/>
 <p className="text-lg leading-relaxed max-w-2xl mt-4 mb-8 whitespace-pre-wrap">{project.description}</p>
 <div className="film-study-board">
 <DetailImage className="film-study-layout" src="/assets/project-4/film-study-layout.png" alt="子弹时刻。左侧：灵感与拆解、四段动作分镜、创作路径。右侧：素材准备、人物造型、三件产品、场景与光线及制作控制。"/>
 <div className="film-study-player">
 <WebVideo src="/assets/project-4/film-study-web.mp4" label="子弹时刻 · 最终影片"/>
 <span className="film-study-badge">FINAL FILM</span>
 </div>
 </div>
 </article>
 </main>
}
