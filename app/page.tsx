'use client';
import {FormEvent,useState} from 'react';

const phases=[['F1','Inicio'],['F2','Documentos'],['F3','Preparación'],['F4','Revisión'],['F5','Sustentación'],['F6','Grado']];
type Data={ok:boolean;alumno?:any;proceso?:any;documentos?:any;cita?:any;grupo?:any;comunicaciones?:any[];auth?:any;error?:string;message?:string};

export default function Home(){
 const [tab,setTab]=useState('inicio');
 const [ai,setAi]=useState(false);
 const [grupoLogin,setGrupoLogin]=useState('');\n const [usuarioLogin,setUsuarioLogin]=useState('');\n const [codigoLogin,setCodigoLogin]=useState('');
 const [data,setData]=useState<Data|null>(null);
 const [loading,setLoading]=useState(false);
 const [error,setError]=useState('');
 const [modal,setModal]=useState<string|null>(null);
 const [question,setQuestion]=useState('');
 const [answer,setAnswer]=useState('');

 const nav=[['inicio','⌂','Inicio'],['comunidad','💬','Comunidad'],['documentos','📁','Docs'],['comunicaciones','✉️','Mensajes'],['citas','📅','Citas'],['perfil','👤','Yo']];

 async function cargar(){
  if(!grupoLogin.trim()||!usuarioLogin.trim()||!codigoLogin.trim()){setError('Ingresa grupo, usuario y código.');return}
  setLoading(true);setError('');setData(null);
  try{
   const r=await fetch('/api/n8n/student-event',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({grupo:grupoLogin,usuario:usuarioLogin,codigo:codigoLogin})});
   const j=await r.json();
   if(!r.ok||!j.ok){setError(j.message||j.error||'Credenciales no válidas');return}
   setData(j);
  }catch{
   setError('No se pudo conectar con el sistema de titulación.');
  }finally{setLoading(false)}
 } <form className="login" onSubmit={submit}>
  <input value={grupoLogin} onChange={e=>setGrupoLogin(e.target.value)} placeholder="Grupo / equipo" autoComplete="off"/>
  <input value={usuarioLogin} onChange={e=>setUsuarioLogin(e.target.value)} placeholder="Usuario (ej. EPG-110)" autoComplete="username"/>
  <input value={codigoLogin} onChange={e=>setCodigoLogin(e.target.value)} placeholder="Código de acceso" type="password" autoComplete="current-password"/>
  <button type="submit" disabled={loading}>{loading?'Validando…':'Ingresar'}</button>
 </form>ient';
import {FormEvent,useState} from 'react';

const phases=[['F1','Inicio'],['F2','Documentos'],['F3','Preparación'],['F4','Revisión'],['F5','Sustentación'],['F6','Grado']];
type Data={ok:boolean;alumno?:any;proceso?:any;documentos?:any;cita?:any;grupo?:any;comunicaciones?:any[];auth?:any;error?:string;message?:string};

export default function Home(){
 const [tab,setTab]=useState('inicio');
 const [ai,setAi]=useState(false);
 const [grupoLogin,setGrupoLogin]=useState('');\n const [usuarioLogin,setUsuarioLogin]=useState('');\n const [codigoLogin,setCodigoLogin]=useState('');
 const [data,setData]=useState<Data|null>(null);
 const [loading,setLoading]=useState(false);
 const [error,setError]=useState('');
 const [modal,setModal]=useState<string|null>(null);
 const [question,setQuestion]=useState('');
 const [answer,setAnswer]=useState('');

 const nav=[['inicio','⌂','Inicio'],['comunidad','💬','Comunidad'],['documentos','📁','Docs'],['comunicaciones','✉️','Mensajes'],['citas','📅','Citas'],['perfil','👤','Yo']];

 async function cargar(){
  if(!grupoLogin.trim()||!usuarioLogin.trim()||!codigoLogin.trim()){setError('Ingresa grupo, usuario y código.');return}
  setLoading(true);setError('');setData(null);
  try{
   const r=await fetch('/api/n8n/student-event',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({grupo:grupoLogin,usuario:usuarioLogin,codigo:codigoLogin})});
   const j=await r.json();
   if(!r.ok||!j.ok){setError(j.message||j.error||'Credenciales no válidas');return}
   setData(j);
  }catch{
   setError('No se pudo conectar con el sistema de titulación.');
  }finally{setLoading(false)}
 }
