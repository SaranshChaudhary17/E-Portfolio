import {useRef,useState,useEffect} from 'react';import {Play,Pause,Volume2,VolumeX,Maximize} from 'lucide-react';
const fmt=s=>isNaN(s)?'0:00':`${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`;
export default function VideoPlayer({src,poster,portrait=false,label='Video'}){
const box=useRef(),v=useRef();const[started,setStarted]=useState(false),[play,setPlay]=useState(false),[t,setT]=useState(0),[d,setD]=useState(0),[vol,setVol]=useState(1),[err,setErr]=useState(!src),[load,setLoad]=useState(false);
useEffect(()=>{const io=new IntersectionObserver(([e])=>{if(!e.isIntersecting)v.current?.pause()});io.observe(box.current);return()=>io.disconnect()},[]);
const fs=()=>document.fullscreenElement?document.exitFullscreen():box.current.requestFullscreen?.();
const toggle=()=>{if(err)return;if(!started){setStarted(true);setLoad(true);setTimeout(()=>v.current?.play(),0);return}v.current.paused?v.current.play():v.current.pause()};
const key=e=>{if(e.key===' '||e.key==='k'){e.preventDefault();toggle()}if(e.key==='m')setVol(x=>x?0:1);if(e.key==='f')fs();if(started&&e.key==='ArrowRight')v.current.currentTime+=5;if(started&&e.key==='ArrowLeft')v.current.currentTime-=5};
useEffect(()=>{if(v.current)v.current.volume=vol},[vol,started]);
return <div ref={box} tabIndex={0} onKeyDown={key} role="group" aria-label={`${label} player`} className={`relative text-white overflow-hidden rounded-2xl ${portrait?'aspect-[9/16] max-w-sm mx-auto':'aspect-video'}`}
style={poster?{backgroundImage:`url(${poster})`,backgroundSize:'cover'}:{background:'linear-gradient(135deg,#171717,#2457E6)'}}>
{started&&!err&&<video ref={v} src={src} preload="metadata" playsInline className="absolute inset-0 size-full object-contain bg-black" onClick={toggle} onPlay={()=>setPlay(true)} onPause={()=>setPlay(false)} onTimeUpdate={e=>setT(e.target.currentTime)} onLoadedMetadata={e=>setD(e.target.duration)} onCanPlay={()=>setLoad(false)} onError={()=>setErr(true)}/>}
{err&&<p className="absolute inset-0 grid place-items-center text-center p-6 text-sm opacity-80">{src?'Video failed to load.':'Placeholder – add a video URL in the data/config file.'}</p>}
{load&&<p className="absolute top-3 left-3 text-xs">Loading…</p>}
{!play&&!err&&<button onClick={toggle} aria-label="Play" className="absolute inset-0 grid place-items-center"><span className="size-16 rounded-full bg-white text-ink grid place-items-center"><Play/></span></button>}
{started&&!err&&<div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/70 flex items-center gap-3 text-xs">
<button onClick={toggle} aria-label={play?'Pause':'Play'}>{play?<Pause size={18}/>:<Play size={18}/>}</button>
<input aria-label="Seek" type="range" min="0" max={d||0} step="0.1" value={t} onChange={e=>v.current.currentTime=e.target.value} className="flex-1 accent-white"/>
<span>{fmt(t)} / {fmt(d)}</span><button onClick={()=>setVol(vol?0:1)} aria-label="Mute">{vol?<Volume2 size={18}/>:<VolumeX size={18}/>}</button>
<input aria-label="Volume" type="range" min="0" max="1" step="0.05" value={vol} onChange={e=>setVol(+e.target.value)} className="w-16 hidden sm:block accent-white"/>
<button onClick={fs} aria-label="Fullscreen"><Maximize size={18}/></button></div>}</div>}
