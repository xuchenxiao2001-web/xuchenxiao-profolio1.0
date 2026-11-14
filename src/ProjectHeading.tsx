import type {Project} from './content';

export function ProjectHeading({project}:{project:Project}){
 const number=project.id.replace('project-','').padStart(2,'0');
 return <><div className="project-eyebrow">Project{number}</div><h1 className="project-detail-title">{project.title}</h1></>;
}
