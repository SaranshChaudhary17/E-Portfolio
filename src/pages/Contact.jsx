import {useState} from 'react';import Seo from '../components/Seo';import {useContent} from '../components/Content';import {addDoc,collection,serverTimestamp} from 'firebase/firestore';import {db} from '../lib/firebase';
const types=['Video Editing','Motion Graphics','Social Media Reel','Commercial Ad','Other'];
export default function Contact(){const{site}=useContent();const[f,setF]=useState({name:'',email:'',type:'',budget:'',msg:''}),[err,setErr]=useState({}),[st,setSt]=useState('idle');
const on=k=>e=>setF({...f,[k]:e.target.value});
const submit=async e=>{e.preventDefault();const x={};if(!f.name.trim())x.name='Please enter your name.';if(!/^\S+@\S+\.\S+$/.test(f.email))x.email='Please enter a valid email.';if(!f.type)x.type='Choose a project type.';if(f.msg.trim().length<10)x.msg='Tell me a little more (10+ characters).';setErr(x);if(Object.keys(x).length)return;
if(f.hp){setSt('sent');return;}
setSt('loading');try{await addDoc(collection(db,'contactMessages'),{name:f.name.trim(),email:f.email.trim(),projectType:f.type,budget:f.budget.trim(),message:f.msg.trim(),status:'New',createdAt:serverTimestamp()});setF({name:'',email:'',type:'',budget:'',msg:''});setSt('sent')}catch(err){console.error('Enquiry submit error:',err);setSt('error')}};
const fld='w-full border border-line rounded-xl px-4 py-3 mt-1';const E=({k})=>err[k]?<p role="alert" className="text-sm text-red-600 mt-1">{err[k]}</p>:null;
return <div className="wrap py-16 grid md:grid-cols-2 gap-12"><Seo title="Contact" path="/contact"/>
<div><h1 className="display !text-[clamp(2.5rem,7vw,5rem)]">Let's Create Something Together.</h1><div className="mt-8 flex flex-col gap-2">{site.email&&<a href={`mailto:${site.email}`}>{site.email}</a>}{site.instagram&&<a href={site.instagram}>Instagram</a>}{site.linkedin&&<a href={site.linkedin}>LinkedIn</a>}{site.whatsapp&&<a href={site.whatsapp}>WhatsApp</a>}</div></div>
<form onSubmit={submit} noValidate className="space-y-4"><input name="website" tabIndex="-1" autoComplete="off" aria-hidden="true" className="hidden" value={f.hp||''} onChange={on('hp')}/><label className="block text-sm">Name *<input className={fld} value={f.name} onChange={on('name')}/><E k="name"/></label>
<label className="block text-sm">Email *<input type="email" className={fld} value={f.email} onChange={on('email')}/><E k="email"/></label>
<label className="block text-sm">Project Type *<select className={fld} value={f.type} onChange={on('type')}><option value="">Select…</option>{types.map(t=><option key={t}>{t}</option>)}</select><E k="type"/></label>
<label className="block text-sm">Budget Range (optional)<input className={fld} value={f.budget} onChange={on('budget')}/></label>
<label className="block text-sm">Project Description *<textarea rows="5" className={fld} value={f.msg} onChange={on('msg')}/><E k="msg"/></label>
<button className="btn btn-p" disabled={st==='loading'}>{st==='loading'?'Sending…':'Send Enquiry'}</button>
{st==='sent'&&<p role="status" className="text-green-700">Thanks – your message was sent.</p>}{st==='error'&&<p role="alert" className="text-red-600">Sending failed. Please email me directly.</p>}
{false&&<p role="status" className="text-mute">Your email app should open with a draft. Nothing is sent until you send it.</p>}</form></div>}
