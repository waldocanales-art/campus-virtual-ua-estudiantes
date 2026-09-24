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
 const [faseDetalle,setFaseDetalle]=useState<string|null>(null);

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
   <h1>UA | HAWKS</h1>
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
  <header><div><b>UA | HAWKS</b><small>{data.alumno?.nombre||data.grupo?.nombre||data.auth?.grupo||'Estudiante'}</small></div><button className="exit" onClick={()=>setData(null)}>Salir</button></header>
  <section className="content">
   {tab==='inicio'&&<>
    <p className="eyebrow">Proceso de titulación</p><h1>{fase} · {data.proceso?.subetapa||'En proceso'}</h1>
    <div className="progress"><i style={{width:`${progress}%`}}/></div><p>{progress}% de avance</p>
    <div className="phaseRow">{phases.map(p=><button type="button" key={p[0]} disabled={p[0]!==fase} onClick={()=>p[0]===fase&&setFaseDetalle(faseDetalle===p[0]?null:p[0])} className={p[0]===fase?'on':''}>{p[0]}<small>{p[1]}</small></button>)}</div>
    {faseDetalle===fase&&<article className="phaseDetail"><h2>Observaciones de {fase}</h2><p>{data.proceso?.observaciones_fase||data.proceso?.observaciones||data.proceso?.nota_fase||'No hay observaciones registradas para esta fase en este momento.'}</p></article>}
    <article><h2>Próxima acción</h2><p>{data.proceso?.proxima_accion||'Revisar las indicaciones de coordinación.'}</p></article>
   </>}
   {tab==='documentos'&&<><h1>Documentos</h1><p className="muted">Información documental de tu proceso.</p><article className="manualNote"><h2>Nota de coordinación</h2><p>{data.documentos?.nota_manual||data.documentos?.nota_coordinacion||'No hay observaciones documentales registradas por coordinación en este momento.'}</p></article></>}
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
*{box-sizing:border-box}html,body{margin:0;max-width:100%;overflow-x:hidden}.shell{font-family:Arial,sans-serif;max-width:900px;margin:auto;padding:24px;color:#111111;background:#f3e6d3;min-height:100vh}.loginCard{max-width:470px;margin:48px auto;padding:32px;border:1px solid #d8c7b2;border-radius:24px;background:#f8efe3}.brand{width:52px;height:52px;border-radius:16px;background:#f47c20;color:white;display:grid;place-items:center;font-weight:800}.eyebrow{font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:#4b453f;margin-top:18px}h1{font-size:28px;margin:8px 0}h2{font-size:18px}.muted,.help{color:#4b453f}label{display:block;font-weight:700;margin:18px 0}input{display:block;width:100%;margin-top:7px;padding:14px;border:1px solid #cfd5dd;border-radius:12px;font-size:16px}button,.actions a,article a{border:0;border-radius:12px;padding:13px 18px;background:#f47c20;color:#fff;text-decoration:none;font-weight:700;cursor:pointer}.loginCard button{width:100%;margin-top:8px}.error{background:#fff0f0;color:#9b1c1c;padding:12px;border-radius:10px;margin:12px 0}header{display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #d8c7b2;padding-bottom:18px}header small{display:block;color:#4b453f;margin-top:4px}.exit{background:#efe3d3;color:#333}.content{padding:24px 0 90px}.progress{height:10px;background:#eadcca;border-radius:99px;overflow:hidden}.progress i{display:block;height:100%;background:#f47c20}.phaseRow{display:grid;grid-template-columns:repeat(6,1fr);gap:8px;margin:20px 0}.phaseRow button{padding:10px;border-radius:12px;background:#f4eadc;text-align:center;font-weight:700}.phaseRow button.on{background:#f47c20;color:white}.phaseRow small{display:block;font-size:10px;margin-top:4px}.phaseRow button:disabled{opacity:.72;cursor:default}.phaseDetail{border-left:5px solid #f47c20}article{border:1px solid #d8c7b2;border-radius:16px;padding:18px;margin:14px 0;background:#f8efe3}.actions{display:flex;gap:12px;flex-wrap:wrap;margin:20px 0}nav{position:sticky;bottom:10px;display:grid;grid-template-columns:repeat(5,1fr);gap:5px;background:white;border:1px solid #d8c7b2;border-radius:18px;padding:8px}nav button{background:transparent;color:#4b453f;padding:8px 4px}nav button.active{background:#fff0df;color:#f47c20}nav b,nav small{display:block}nav b{font-size:18px}nav small{font-size:10px;margin-top:3px}@media(max-width:600px){.shell{padding:0;max-width:none}.loginCard{margin:0;min-height:100dvh;border:0;border-radius:0;padding:24px 18px;display:flex;flex-direction:column;justify-content:center}.content{padding:20px 16px 110px}.phaseRow{grid-template-columns:repeat(3,minmax(0,1fr));gap:6px}.phaseRow button{padding:9px 4px;font-size:12px}h1{font-size:24px}header{padding:14px 16px;position:sticky;top:0;background:#f3e6d3;z-index:5}nav{position:fixed;left:50%;right:auto;transform:translateX(-50%);bottom:0;width:100vw;max-width:100vw;z-index:20;grid-template-columns:repeat(5,20%);padding:6px 0 calc(6px + env(safe-area-inset-bottom));margin:0;border-radius:0;border-left:0;border-right:0;border-bottom:0;box-shadow:0 -4px 18px rgba(0,0,0,.12);overflow:hidden}nav button{min-width:0;width:100%;max-width:100%;padding:8px 0;overflow:hidden;border-radius:10px}nav small{font-size:9px;white-space:nowrap;overflow:hidden;text-overflow:clip}.content{padding-bottom:130px}article{overflow-wrap:anywhere}.manualNote{min-height:130px}}@media(max-width:360px){nav small{font-size:8px}.phaseRow{grid-template-columns:repeat(2,minmax(0,1fr));}.content{padding-left:12px;padding-right:12px}}
`;
