'use client';
import {useEffect,useState} from 'react';
const phases=[['F1','Inicio'],['F2','Documentos'],['F3','Preparación'],['F4','Revisión'],['F5','Sustentación'],['F6','Grado']];
type Data={ok:boolean;alumno?:any;proceso?:any;documentos?:any;cita?:any;error?:string};
export default function Home(){
 const [tab,setTab]=useState('inicio'),[ai,setAi]=useState(false),[email,setEmail]=useState('nzegarraa@autonoma.edu.pe'),[data,setData]=useState<Data|null>(null),[loading,setLoading]=useState(false),[error,setError]=useState('');
 const nav=[['inicio','⌂','Inicio'],['comunidad','💬','Comunidad'],['documentos','📁','Docs'],['citas','📅','Citas'],['perfil','👤','Yo']];
 async function cargar(e=email){setLoading(true);setError('');try{const r=await fetch('/api/n8n/student-event',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:e})});const j=await r.json();if(!j.ok){setData(null);setError(j.message||'Alumno no encontrado');}else setData(j)}catch{setError('No se pudo conectar con n8n')}finally{setLoading(false)}}
 useEffect(()=>{cargar('nzegarraa@autonoma.edu.pe')},[]);
 const a=data?.alumno||{},p=data?.proceso||{},faseN=Number(String(p.fase||'').replace('F',''))||0;
 const faseNames:any={F1:'Inicio',F2:'Documentos',F3:'Preparación',F4:'Revisión',F5:'Sustentación',F6:'Grado'};
 return <main className="app">
 <header><div className="logo">UA</div><div className="brand"><b>MI CAMPUS UA</b><small>Portal del Estudiante</small></div><button className="bell">🔔</button></header>
 <div className="login"><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Correo institucional"/><button onClick={()=>cargar()} disabled={loading}>{loading?'Consultando…':'Ingresar'}</button></div>
 {error&&<div className="apierror">{error}</div>}
 {tab==='inicio'&&<section>
  <p className="eyebrow">{data?'BIENVENIDA/O':'PORTAL DEL ESTUDIANTE'}</p><h1>{a.nombre||'Mi proceso académico'}</h1><p className="muted">{a.programa||'Ingresa tu correo para consultar tu proceso'}{a.grupo?' · Grupo '+a.grupo:''}</p>
  <div className="card"><div className="between"><b>Mi proceso</b><span className="warn">{p.pendientes??0} pendientes</span></div>
   <div className="steps">{phases.map((x,i)=><div className={'step '+(i+1<faseN?'done':i+1===faseN?'active':'')} key={x[0]}><i>{i+1<faseN?'✓':x[0]}</i><small>{x[1]}</small></div>)}</div>
   <div className="status"><small>ETAPA ACTUAL</small><h2>{p.fase||'—'} · {faseNames[p.fase]||'Sin fase'}</h2><p>Estado: <b>{p.estado||'Sin información'}</b></p></div>
   <button className="primary" onClick={()=>setTab('documentos')}>Ver qué debo hacer →</button>
  </div>
  <h3>Próxima acción</h3><div className="item"><b className="circle">🎯</b><div><strong>{p.proxima_accion||'Consultar estado'}</strong><p>Progreso del proceso: {p.progreso??0}%</p></div><b>›</b></div>
  <h3>Datos del proceso</h3><div className="card route"><p>🎓 <b>Programa</b><small>{a.programa||'—'}</small></p><p>👥 <b>Grupo</b><small>{a.grupo||'—'}</small></p><p>🪪 <b>Código</b><small>{a.codigo||'—'}</small></p><p>📧 <b>Correo</b><small>{a.email||email}</small></p></div>
 </section>}
 {tab==='comunidad'&&<section><h1>Comunidad</h1><p className="muted">Avisos y conversaciones en un solo lugar.</p>{[['📢','Avisos','Información académica'],['🎓','Mi proceso de titulación',p.proxima_accion||'Consulta tu proceso'],['👥','Mi grupo de investigación',a.grupo?'Grupo '+a.grupo:'Sin grupo registrado'],['📚','Mi programa',a.programa||'Sin programa'],['🖥️','Soporte tecnológico','Canal de ayuda']].map((x,i)=><div className="item" key={i}><b className="circle">{x[0]}</b><div><strong>{x[1]}</strong><p>{x[2]}</p></div><b>›</b></div>)}</section>}
 {tab==='documentos'&&<section><h1>Mis documentos</h1><p className="muted">Información vinculada a tu expediente.</p><div className="card"><div className="doc"><b className="state">✓</b><div><strong>Expediente del estudiante</strong><small>{data?.documentos?.drive_url?'Drive localizado':'Sin enlace de Drive disponible'}</small></div></div>{data?.documentos?.drive_url&&<a className="primary linkbtn" href={data.documentos.drive_url} target="_blank" rel="noreferrer">Abrir documentos</a>}</div><h3>Avance</h3><div className="card review"><h2>{p.progreso??0}%</h2><span>Progreso por fase actual</span><div className="bar"><i style={{width:`${p.progreso??0}%`}}/></div><p>Estado <b>{p.estado||'—'}</b></p></div></section>}
 {tab==='citas'&&<section><h1>Mis citas</h1><p className="muted">Reuniones asociadas al estudiante.</p><div className="card">{data?.cita?<><p className="eyebrow">PRÓXIMA</p><h2>{data.cita.fecha||'Fecha por confirmar'}</h2><p>🕕 {data.cita.hora||'Hora por confirmar'} · {data.cita.estado||'Programada'}</p>{data.cita.meeting_url&&<a className="primary linkbtn" href={data.cita.meeting_url} target="_blank" rel="noreferrer">Ingresar a reunión</a>}</>:<p>No hay una próxima cita registrada.</p>}</div></section>}
 {tab==='perfil'&&<section><div className="profile"><div>👤</div><h1>{a.nombre||'Mi perfil'}</h1><p className="muted">{a.programa||'Estudiante'}</p></div><div className="card"><div className="menu">🪪 DNI <b>{a.dni||'—'}</b></div><div className="menu">🎓 Fase <b>{p.fase||'—'}</b></div><div className="menu">📧 Correo <b>{a.email||email}</b></div></div></section>}
 <button className="ai" onClick={()=>setAi(true)}>✨</button>
 {ai&&<div className="overlay" onClick={()=>setAi(false)}><div className="assistant" onClick={e=>e.stopPropagation()}><div className="between"><h3>✨ Asistente UA</h3><button onClick={()=>setAi(false)}>×</button></div><div className="bubble">Hola {String(a.nombre||'').split(' ')[0]||''}. Tu fase actual es <b>{p.fase||'—'}</b> y tu próxima acción es: <b>{p.proxima_accion||'consultar coordinación'}</b>.</div><div className="ask"><input placeholder="Escribe tu pregunta..."/><button>➤</button></div></div></div>}
 <nav>{nav.map(x=><button className={tab===x[0]?'sel':''} onClick={()=>setTab(x[0])} key={x[0]}><b>{x[1]}</b><small>{x[2]}</small></button>)}</nav>
 </main>
}