import {Link} from 'react-router-dom';import {motion} from 'motion/react';import {ArrowRight} from 'lucide-react';
import Seo from '../components/Seo';import VideoPlayer from '../components/VideoPlayer';import ProjectCard from '../components/ProjectCard';import {useContent} from '../components/Content';
export default function Home(){const{site,projects,services,loading,error,reload}=useContent();const feat=projects.filter(p=>p.featured).slice(0,8);
return <><Seo/>
<section className="wrap min-h-[85vh] flex flex-col justify-center py-16">
<p className="text-xs tracking-[.2em] text-accent font-semibold">VIDEO EDITOR · MOTION GRAPHICS ARTIST</p>
<motion.h1 initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{duration:.7}} className="display mt-6">I MAKE<br/>IDEAS MOVE.</motion.h1>
<p className="mt-8 max-w-md text-mute text-lg">Visual storytelling through motion, design and editing.</p>
<div className="mt-8 flex flex-wrap gap-3"><Link to="/work" className="btn btn-p">Explore My Work <ArrowRight size={16}/></Link><Link to="/contact" className="btn">Get In Touch</Link></div>
{site.available&&<p className="mt-10 text-sm text-mute flex items-center gap-2"><span className="size-2 rounded-full bg-green-500"/> Available for projects</p>}</section>
{site.showreel.url&&<section className="wrap py-20"><h2 className="h2 max-w-2xl mb-8">Selected Moments. One Creative Vision.</h2><VideoPlayer src={site.showreel.url} poster={site.showreel.poster} label="Showreel"/></section>}
{error&&<p className="wrap py-10 text-red-600">Couldn't load content. <button className="underline" onClick={reload}>Retry</button></p>}{!loading&&!error&&!feat.length&&<p className="wrap py-20 text-mute">New work is on its way.</p>}{feat.length>0&&<section className="wrap py-20"><h2 className="h2">A Selection of My Work.</h2><p className="text-mute mt-3 mb-10">A collection of visuals, experiments and creative projects.</p>
<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 items-start">{feat.map((p,i)=><div key={p.id} className={i%3===1?'lg:mt-16':''}><ProjectCard p={p} i={i}/></div>)}</div>
<Link to="/work" className="btn mt-12">View All Projects <ArrowRight size={16}/></Link></section>}
{services.length>0&&<section className="bg-soft py-20"><div className="wrap"><h2 className="h2 mb-10">What I Do.</h2><div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-line border border-line">{services.map(({title:t,description:d},i)=><div key={t} className="bg-white p-6 hover:bg-soft transition"><span className="text-accent text-sm font-bold">0{i+1}</span><h3 className="font-bold mt-6">{t}</h3><p className="text-sm text-mute mt-2">{d}</p></div>)}</div></div></section>}
<section className="wrap py-24 grid md:grid-cols-2 gap-12 items-center"><div className="aspect-[4/5] rounded-2xl bg-soft grid place-items-center text-mute text-sm overflow-hidden">{site.profilePhoto?<img src={site.profilePhoto} alt="Portrait of Saransh" className="size-full object-cover"/>:'Portrait placeholder'}</div>
<div><h2 className="h2">Behind Every Frame, There's an Idea.</h2>{site.bio&&<p className="mt-6 text-mute">{site.bio}</p>}<Link to="/about" className="btn mt-8">More About Me</Link></div></section>
{site.tools.length>0&&<section className="wrap pb-20"><h2 className="h2 mb-8">Tools Behind the Work.</h2><ul className="flex flex-wrap gap-3">{site.tools.map(t=><li key={t} className="px-5 py-3 border border-line rounded-full text-sm">{t}</li>)}</ul></section>}
<section className="wrap py-20 text-center bg-ink text-white rounded-3xl"><h2 className="h2 max-w-3xl mx-auto">Have an Idea? Let's Make It Move.</h2><p className="mt-4 opacity-70">Have a project in mind? Let's create something meaningful together.</p>
<div className="mt-8 flex flex-wrap gap-3 justify-center"><Link to="/contact" className="btn bg-white text-ink border-white">Let's Talk</Link>{site.email&&<a href={`mailto:${site.email}`} className="btn border-white hover:!bg-white hover:!text-ink">Email Me</a>}</div>
<p className="mt-8 text-sm opacity-70 flex gap-5 justify-center">{site.instagram&&<a href={site.instagram}>Instagram</a>}{site.linkedin&&<a href={site.linkedin}>LinkedIn</a>}</p></section></>}
