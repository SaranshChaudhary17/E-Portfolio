import {getDocs,collection} from 'firebase/firestore';import {db} from './fb';
const T=(k,label,type='text')=>({k,label,type}),vis=T('visible','Visible on website','bool'),ord=T('sortOrder','Display order','num');
const slugify=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
export const S={
projects:{coll:'projects',defaults:{status:'Draft',featured:false,homepageVisible:true,sortOrder:0,projectYear:new Date().getFullYear(),tags:[],softwareUsed:[],additionalMediaIds:[]},
 fields:[T('title','Title'),T('slug','Slug (auto if empty)'),T('shortDescription','Short description'),T('description','Full description','area'),{k:'categoryId',label:'Category',type:'ref',coll:'categories'},T('clientName','Client / brand'),T('projectYear','Year','num'),T('tags','Tags (comma separated)','csv'),
 T('primaryVideoId','Main video','mvid'),T('thumbnailMediaId','Thumbnail','mimg'),T('posterMediaId','Poster','mimg'),T('additionalMediaIds','Additional media (ctrl-click)','mmulti'),
 T('overview','Overview','area'),T('creativeDirection','Creative direction','area'),T('role','My role'),T('softwareUsed','Software used (comma separated)','csv'),
 {k:'status',label:'Status',type:'select',options:['Draft','Published','Archived']},T('featured','Featured','bool'),T('homepageVisible','Homepage visible','bool'),ord,T('seoTitle','SEO title'),T('seoDescription','SEO description')],
 before:async(d,id)=>{if(!d.title?.trim())throw new Error('Title is required.');d.slug=slugify(d.slug||d.title);
  const all=(await getDocs(collection(db,'projects'))).docs;if(all.some(x=>x.id!==id&&x.data().slug===d.slug))throw new Error('Slug already in use.');
  if(d.status==='Published'&&!d.primaryVideoId)throw new Error('Select a main video before publishing.');
  const c=(await getDocs(collection(db,'categories'))).docs.find(x=>x.id===d.categoryId);d.categoryName=c?.data().name||'';if(d.status==='Published'&&!d.publishedAt)d.publishedAt=new Date();return d}},
categories:{coll:'categories',defaults:{visible:true,sortOrder:0},fields:[T('name','Name'),T('slug','Slug'),T('description','Description'),vis,ord],before:async d=>{d.slug=slugify(d.slug||d.name||'');return d}},
showreel:{coll:'showreels',defaults:{active:false},fields:[T('title','Title'),T('description','Description','area'),T('videoMediaId','Video','mvid'),T('posterMediaId','Poster','mimg'),T('active','Active showreel (only one!)','bool')]},
services:{coll:'services',defaults:{visible:true,sortOrder:0},fields:[T('title','Title'),T('description','Description','area'),vis,ord]},
skills:{coll:'skills',defaults:{visible:true,sortOrder:0},fields:[T('name','Software name'),T('iconMediaId','Icon / logo','mimg'),vis,ord]},
testimonials:{coll:'testimonials',defaults:{visible:false},fields:[T('clientName','Client name'),T('designation','Designation'),T('company','Company'),T('feedback','Feedback','area'),vis]},
enquiries:{coll:'contactMessages',noAdd:true,fields:[T('name','Name'),T('email','Email'),T('projectType','Project type'),T('budget','Budget'),T('message','Message','area'),{k:'status',label:'Status',type:'select',options:['New','Read','Replied','Archived']}]},
profile:{single:true,coll:'profile',fields:[T('name','Name'),T('title','Professional title'),T('shortBio','Short bio','area'),T('introduction','Detailed introduction','area'),T('philosophy','Creative philosophy','area'),T('profileImageMediaId','Profile image','mimg')]},
social:{single:true,coll:'socialLinks',fields:['instagram','linkedin','behance','youtube','email','whatsapp'].map(k=>T(k,k[0].toUpperCase()+k.slice(1)))},
settings:{single:true,coll:'siteSettings',fields:[T('brandName','Brand name'),T('tagline','Tagline'),T('availability','Available for work','bool'),T('contactEmail','Contact email'),T('seoTitle','Website title'),T('seoDescription','Meta description','area'),T('announcement','Announcement')]}};
