import {Link} from 'react-router-dom';import {motion} from 'motion/react';import {Play} from 'lucide-react';
export default function ProjectCard({p,i=0}){const por=p.orientation==='portrait';
return <motion.div initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:'-60px'}} transition={{duration:.5,delay:(i%3)*.08}}>
<Link to={`/work/${p.slug}`} className="group block">
<div className={`relative overflow-hidden rounded-2xl bg-soft ${por?'aspect-[4/5]':'aspect-video'}`}>
{p.thumbnail?<img src={p.thumbnail} alt={p.title} loading="lazy" className="size-full object-cover transition duration-700 group-hover:scale-105"/>:<div className="size-full transition duration-700 group-hover:scale-105" style={{background:`linear-gradient(135deg,#E8E8E5,hsl(${p.id*40} 25% 80%))`}}/>}
<span className="absolute bottom-3 right-3 size-10 rounded-full bg-white grid place-items-center"><Play size={16}/></span></div>
<div className="mt-3 flex justify-between gap-4"><div><h3 className="font-bold">{p.title}</h3><p className="text-sm text-mute">{p.category}</p></div><span className="text-sm text-mute">{p.year}</span></div></Link></motion.div>}
