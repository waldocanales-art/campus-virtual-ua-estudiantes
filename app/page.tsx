'use client';
import {FormEvent,useState} from 'react';

type Data={ok:boolean;alumno?:any;proceso?:any;documentos?:any;cita?:any;grupo?:any;comunicaciones?:any[];auth?:any;error?:string;message?:string};
const phases=[['F1','Inicio'],['F2','Documentos'],['F3','Preparación'],['F4','Revisión'],['F5','Sustentación'],['F6','Grado']];

export default function Home(){
 const [tab,setTab]=useState('inicio');
 const [grupo,setGrupo]=useState('');
 const [usuario,setUsuario]=useState('');
 const [codigo,setCodigo]=useState('');
 const [data,setData]=useState<Data|null>(null);
 const [loading,setLoading]=useState(false);
 const [error,setError]=useState('');

 async function submit(e:FormEvent){
  e.preventDefault();
  if(!grupo.trim()||!usuario.trim()||!codigo.trim()){setError('Ingresa grupo, usuario y código.');return}
  setLoading(true);setError('');
  try{
   const r=await fetch('/api/n8n/student-event',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({grupo,usuario,codigo})});
   const j=await r.json();
   if(!r.ok||!j.ok){setError(j.message||'Credenciales no válidas');return}
   setData(j);setTab('inicio');
  }catch{setError('No se pudo conectar con el sistema.');}
  finally{setLoading(false)}
 }

 if(!data) return <main className="shell">
  <section className="loginCard">
   <div className="brand">UA</div>
   <p className="eyebrow">Universidad Autónoma del Perú · Posgrado</p>
   <h1>MI CAMPUS UA</h1>
   <p className="muted">Acceso al seguimiento de tu proceso de titulación.</p>
   <form onSubmit={submit}>
    <label>Grupo / Equipo<input value={grupo} onChange={e=>setGrupo(e.target.value)} placeholder="Ej. 110 o nombre del grupo" autoComplete="off"/></label>
    <label>Usuario<input value={usuario} onChange={e=>setUsuario(e.target.value)} placeholder="Ej. EPG-110" autoComplete="username"/></label>
    <label>Código de acceso<input value={codigo} onChange={e=>setCodigo(e.target.value)} placeholder="Código asignado" type="password" autoComplete="current-password"/></label>
    {error&&<div className="error">{error}</div>}
    <button disabled={loading}>{loading?'Validando…':'Ingresar'}</button>
   </form>
   <p className="help">Utiliza las credenciales asignadas a tu grupo.</p>
  </section>
  <style jsx>{styles}</style>
 </main>;

 const fase=data.proceso?.fase||'F1';
 const progress=data.proceso?.progreso||0;
 const sheetId=data.grupo?.sheet_id||data.alumno?.sheet_id||'';
 const drive=data.documentos?.drive_url||'';
 const perfil=data.documentos?.perfil_documental_url||(sheetId?`https://autonoma-del-peru.app.n8n.cloud/webhook/v6-core-documentos-epg?sheet_id=${encodeURIComponent(sheetId)}`:'');
 const nav=[['inicio','⌂','Inicio'],['documentos','▣','Docs'],['comunicaciones','✉','Mensajes'],['citas','◷','Citas'],['perfil','○','Yo']];

 return <main className="shell">
  <header><div><b>MI CAMPUS UA</b><small>{data.alumno?.nombre||data.grupo?.nombre||data.auth?.grupo||'Estudiante'}</small></div><button className="exit" onClick={()=>setData(null)}>Salir</button></header>
  <section className="content">
   {tab==='inicio'&&<>
    <p className="eyebrow">Proceso de titulación</p><h1>{fase} · {data.proceso?.subetapa||'En proceso'}</h1>
    <div className="progress"><i style={{width:`${progress}%`}}/></div><p>{progress}% de avance</p>
    <div className="phaseRow">{phases.map(p=><span key={p[0]} className={p[0]===fase?'on':''}>{p[0]}<small>{p[1]}</small></span>)}</div>
    <article><h2>Próxima acción</h2><p>{data.proceso?.proxima_accion||'Revisar las indicaciones de coordinación.'}</p></article>
   </>}
   {tab==='documentos'&&<><h1>Documentos</h1><p className="muted">Revisa tus documentos y las diferencias u observaciones detectadas.</p>
    <div className="actions">{perfil&&<a href={perfil} target="_blank">Ver diferencias y errores documentales</a>}{drive&&<a href={drive} target="_blank">Abrir carpeta Drive</a>}</div>
   </>}
   {tab==='comunicaciones'&&<><h1>Mensajes</h1><p className="muted">Comunicaciones enviadas por coordinación a tu grupo.</p>
    {(data.comunicaciones||[]).length===0?<article><p>Aún no hay comunicaciones registradas para mostrar.</p></article>:(data.comunicaciones||[]).map((m:any,i:number)=><article key={i}><small>{m.fecha||''} · {m.fase||''}</small><h2>{m.asunto||'Comunicación'}</h2>{m.mensaje?<p>{m.mensaje}</p>:<p className="muted">El envío está registrado; el contenido no fue almacenado en el historial anterior.</p>}<small>De: {m.remitente||'gradua@autonoma.pe'}</small></article>)}
   </>}
   {tab==='citas'&&<><h1>Citas</h1>{data.cita?<article><h2>{data.cita.fecha} {data.cita.hora}</h2><p>Estado: {data.cita.estado}</p>{data.cita.meeting_url&&<a href={data.cita.meeting_url} target="_blank">Ingresar a la reunión</a>}</article>:<article><p>No tienes una cita próxima registrada.</p></article>}</>}
   {tab==='perfil'&&<><h1>Mi perfil</h1><article><p><b>Grupo:</b> {data.grupo?.nombre||data.auth?.grupo||'-'}</p><p><b>Usuario:</b> {data.auth?.usuario||usuario}</p><p><b>Programa:</b> {data.alumno?.programa||data.grupo?.programa||'-'}</p><p><b>Fase:</b> {fase}</p></article></>}
  </section>
  <nav>{nav.map(n=><button key={n[0]} className={tab===n[0]?'active':''} onClick={()=>setTab(n[0])}><b>{n[1]}</b><small>{n[2]}</small></button>)}</nav>
  <style jsx>{styles}</style>
 </main>
}

const styles=`
*{box-sizing:border-box}.shell{font-family:Arial,sans-serif;max-width:900px;margin:auto;padding:24px;color:#172033}.loginCard{max-width:470px;margin:48px auto;padding:32px;border:1px solid #e1e5ea;border-radius:24px;background:#fff}.brand{width:52px;height:52px;border-radius:16px;background:#8b1d2c;color:white;display:grid;place-items:center;font-weight:800}.eyebrow{font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:#6b7280;margin-top:18px}h1{font-size:28px;margin:8px 0}h2{font-size:18px}.muted,.help{color:#6b7280}label{display:block;font-weight:700;margin:18px 0}input{display:block;width:100%;margin-top:7px;padding:14px;border:1px solid #cfd5dd;border-radius:12px;font-size:16px}button,.actions a,article a{border:0;border-radius:12px;padding:13px 18px;background:#8b1d2c;color:#fff;text-decoration:none;font-weight:700;cursor:pointer}.loginCard button{width:100%;margin-top:8px}.error{background:#fff0f0;color:#9b1c1c;padding:12px;border-radius:10px;margin:12px 0}header{display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #e5e7eb;padding-bottom:18px}header small{display:block;color:#6b7280;margin-top:4px}.exit{background:#f2f3f5;color:#333}.content{padding:24px 0 90px}.progress{height:10px;background:#eceff3;border-radius:99px;overflow:hidden}.progress i{display:block;height:100%;background:#8b1d2c}.phaseRow{display:grid;grid-template-columns:repeat(6,1fr);gap:8px;margin:20px 0}.phaseRow span{padding:10px;border-radius:12px;background:#f3f4f6;text-align:center;font-weight:700}.phaseRow span.on{background:#8b1d2c;color:white}.phaseRow small{display:block;font-size:10px;margin-top:4px}article{border:1px solid #e1e5ea;border-radius:16px;padding:18px;margin:14px 0;background:white}.actions{display:flex;gap:12px;flex-wrap:wrap;margin:20px 0}nav{position:sticky;bottom:10px;display:grid;grid-template-columns:repeat(5,1fr);gap:5px;background:white;border:1px solid #e1e5ea;border-radius:18px;padding:8px}nav button{background:transparent;color:#6b7280;padding:8px 4px}nav button.active{background:#f6e9eb;color:#8b1d2c}nav b,nav small{display:block}nav b{font-size:18px}nav small{font-size:10px;margin-top:3px}@media(max-width:600px){.shell{padding:14px}.loginCard{margin:18px auto;padding:22px}.phaseRow{grid-template-columns:repeat(3,1fr)}h1{font-size:24px}}
`;
