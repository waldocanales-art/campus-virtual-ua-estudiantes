'use client';
import {FormEvent,useState} from 'react';

const phases=[['F1','Inicio'],['F2','Documentos'],['F3','Preparación'],['F4','Revisión'],['F5','Sustentación'],['F6','Grado']];
type Data={ok:boolean;alumno?:any;proceso?:any;documentos?:any;cita?:any;grupo?:any;error?:string;message?:string};

export default function Home(){
 const [tab,setTab]=useState('inicio');
 const [ai,setAi]=useState(false);
 const [email,setEmail]=useState('');
 const [data,setData]=useState<Data|null>(null);
 const [loading,setLoading]=useState(false);
 const [error,setError]=useState('');
 const [modal,setModal]=useState<string|null>(null);
 const [question,setQuestion]=useState('');
 const [answer,setAnswer]=useState('');

 const nav=[['inicio','⌂','Inicio'],['comunidad','💬','Comunidad'],['documentos','📁','Docs'],['citas','📅','Citas'],['perfil','👤','Yo']];

 async function cargar(e=email){
  const correo=e.trim();
  if(!correo){setError('Ingresa tu correo institucional o el correo registrado en el sistema.');return}
  setLoading(true);setError('');setData(null);
  try{
   const r=await fetch('/api/n8n/student-event',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:correo})});
   const j=await r.json();
   if(!r.ok||!j.ok){setError(j.message||j.error||'Alumno no encontrado');return}
   setData(j);
  }catch{
   setError('No se pudo conectar con el sistema de titulación.');
  }finally{setLoading(false)}
 }

 function submit(e:FormEvent){e.preventDefault();cargar()}

 const a=data?.alumno||{},p=data?.proceso||{},g=data?.grupo||{};
 const faseN=Number(String(p.fase||'').replace('F',''))||0;
 const faseNames:any={F1:'Inicio',F2:'Documentos',F3:'Preparación',F4:'Revisión',F5:'Sustentación',F6:'Grado'};
 const groupName=g.nombre||a.grupo_nombre||a.grupo||'Sin grupo registrado';
 const sheetId=g.sheet_id||a.sheet_id||'';
 const integrantes=Array.isArray(g.integrantes)?g.integrantes:[];
 const docUrl=data?.documentos?.drive_url||'';
 const perfilDocUrl=data?.documentos?.perfil_documental_url||'';

 function askAssistant(){
  const q=question.trim().toLowerCase();
  if(!q)return;
  let r='Puedo orientarte sobre tu fase, próxima acción, grupo, documentos y citas.';
  if(q.includes('fase')||q.includes('etapa')) r=`Tu fase actual es ${p.fase||'—'} (${faseNames[p.fase]||'sin clasificación'}). Estado: ${p.estado||'sin información'}.`;
  else if(q.includes('hacer')||q.includes('acción')||q.includes('siguiente')) r=`Tu próxima acción registrada es: ${p.proxima_accion||'contactar a coordinación'}.`;
  else if(q.includes('grupo')||q.includes('equipo')) r=`Tu grupo es: ${groupName}${sheetId?` (ID ${sheetId})`:''}.`;
  else if(q.includes('document')||q.includes('drive')) r=docUrl?'Tu carpeta de documentos está localizada. Puedes abrirla desde la sección Docs.':'Aún no hay una carpeta de documentos vinculada a tu ficha.';
  else if(q.includes('cita')||q.includes('reun')) r=data?.cita?`Tu próxima cita figura para ${data.cita.fecha||'fecha por confirmar'} ${data.cita.hora?'a las '+data.cita.hora:''}.`:'No hay una próxima cita registrada.';
  else if(q.includes('programa')||q.includes('maestr')) r=`Tu programa registrado es: ${a.programa||'sin información'}.`;
  setAnswer(r);setQuestion('');
 }

 function communityAction(i:number){
  if(i===0)setModal('avisos');
  if(i===1)setTab('inicio');
  if(i===2)setModal('grupo');
  if(i===3)setModal('programa');
  if(i===4)setModal('soporte');
 }

 return <main className="app">
 <header><div className="logo">UA</div><div className="brand"><b>MI CAMPUS UA</b><small>Portal del Estudiante</small></div><button className="bell" onClick={()=>setModal('avisos')} aria-label="Avisos">🔔</button></header>

 <form className="login" onSubmit={submit}>
  <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Correo institucional o registrado" autoComplete="email"/>
  <button type="submit" disabled={loading}>{loading?'Consultando…':'Ingresar'}</button>
 </form>
 {error&&<div className="apierror">{error}</div>}

 {tab==='inicio'&&<section>
  <p className="eyebrow">{data?'BIENVENIDA/O':'PORTAL DEL ESTUDIANTE'}</p>
  <h1>{a.nombre||'Mi proceso académico'}</h1>
  <p className="muted">{a.programa||'Ingresa tu correo para consultar tu proceso'}{data&&groupName!=='Sin grupo registrado'?' · '+groupName:''}</p>
  <div className="card">
   <div className="between"><b>Mi proceso</b><span className="warn">{p.pendientes??0} pendientes</span></div>
   <div className="steps">{phases.map((x,i)=><div className={'step '+(i+1<faseN?'done':i+1===faseN?'active':'')} key={x[0]}><i>{i+1<faseN?'✓':x[0]}</i><small>{x[1]}</small></div>)}</div>
   <div className="status"><small>ETAPA ACTUAL</small><h2>{p.fase||'—'} · {faseNames[p.fase]||'Sin fase'}</h2><p>Estado: <b>{p.estado||'Sin información'}</b></p></div>
   <button className="primary" onClick={()=>setTab('documentos')}>Ver qué debo hacer →</button>
  </div>
  <h3>Próxima acción</h3>
  <div className="item"><b className="circle">🎯</b><div><strong>{p.proxima_accion||'Consultar estado'}</strong><p>Progreso del proceso: {p.progreso??0}%</p></div><b>›</b></div>
  <h3>Datos del proceso</h3>
  <div className="card route">
   <p>🎓 <b>Programa</b><small>{a.programa||'—'}</small></p>
   <p>👥 <b>Grupo</b><small>{groupName}</small></p>
   {sheetId&&<p>🔢 <b>ID de grupo</b><small>{sheetId}</small></p>}
   <p>🪪 <b>Código</b><small>{a.codigo||'—'}</small></p>
   <p>📧 <b>Correo</b><small>{a.email||email||'—'}</small></p>
  </div>
 </section>}

 {tab==='comunidad'&&<section>
  <h1>Comunidad</h1><p className="muted">Avisos y accesos de tu proceso en un solo lugar.</p>
  {[
   ['📢','Avisos','Información académica'],
   ['🎓','Mi proceso de titulación',p.proxima_accion||'Consulta tu proceso'],
   ['👥','Mi grupo de investigación',groupName],
   ['📚','Mi programa',a.programa||'Sin programa'],
   ['🖥️','Soporte tecnológico','Canal de ayuda']
  ].map((x,i)=><button className="item itembtn" key={i} onClick={()=>communityAction(i)}><b className="circle">{x[0]}</b><div><strong>{x[1]}</strong><p>{x[2]}</p></div><b>›</b></button>)}
 </section>}

 {tab==='documentos'&&<section>
  <h1>Mis documentos</h1><p className="muted">Información vinculada a tu expediente.</p>
  <div className="card">
   <div className="doc"><b className="state">{docUrl?'✓':'!'}</b><div><strong>Expediente del estudiante</strong><small>{docUrl?'Drive localizado':'Sin enlace de Drive disponible'}</small></div></div>
   {docUrl&&<a className="primary linkbtn" href={docUrl} target="_blank" rel="noreferrer">Abrir documentos</a>}
   {perfilDocUrl&&<a className="outline linkbtn" href={perfilDocUrl} target="_blank" rel="noreferrer">Ver estado documental</a>}
  </div>
  <h3>Avance</h3><div className="card review"><h2>{p.progreso??0}%</h2><span>Progreso por fase actual</span><div className="bar"><i style={{width:`${p.progreso??0}%`}}/></div><p>Estado <b>{p.estado||'—'}</b></p></div>
 </section>}

 {tab==='citas'&&<section>
  <h1>Mis citas</h1><p className="muted">Reuniones asociadas al estudiante.</p>
  <div className="card">{data?.cita?<><p className="eyebrow">PRÓXIMA</p><h2>{data.cita.fecha||'Fecha por confirmar'}</h2><p>🕕 {data.cita.hora||'Hora por confirmar'} · {data.cita.estado||'Programada'}</p>{data.cita.meeting_url&&<a className="primary linkbtn" href={data.cita.meeting_url} target="_blank" rel="noreferrer">Ingresar a reunión</a>}</>:<p>No hay una próxima cita registrada.</p>}</div>
 </section>}

 {tab==='perfil'&&<section>
  <div className="profile"><div>👤</div><h1>{a.nombre||'Mi perfil'}</h1><p className="muted">{a.programa||'Estudiante'}</p></div>
  <div className="card">
   <div className="menu">🪪 DNI <b>{a.dni||'—'}</b></div>
   <div className="menu">🎓 Fase <b>{p.fase||'—'}</b></div>
   {sheetId&&<div className="menu">👥 Grupo <b>{sheetId}</b></div>}
   <div className="menu">📧 Correo <b>{a.email||email||'—'}</b></div>
  </div>
 </section>}

 <button className="ai" onClick={()=>setAi(true)} aria-label="Asistente UA">✨</button>

 {ai&&<div className="overlay" onClick={()=>setAi(false)}><div className="assistant" onClick={e=>e.stopPropagation()}>
  <div className="between"><h3>✨ Asistente UA</h3><button onClick={()=>setAi(false)}>×</button></div>
  <div className="bubble">Hola {String(a.nombre||'').split(' ')[0]||''}. Tu fase actual es <b>{p.fase||'—'}</b> y tu próxima acción es <b>{p.proxima_accion||'consultar coordinación'}</b>.</div>
  {answer&&<div className="ububble">{answer}</div>}
  <div className="ask"><input value={question} onChange={e=>setQuestion(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')askAssistant()}} placeholder="Pregunta por fase, grupo, documentos o citas..."/><button onClick={askAssistant}>➤</button></div>
 </div></div>}

 {modal&&<div className="overlay center" onClick={()=>setModal(null)}><div className="modal" onClick={e=>e.stopPropagation()}>
  <div className="between"><h3>{modal==='avisos'?'Avisos':modal==='grupo'?'Mi grupo de investigación':modal==='programa'?'Mi programa':'Soporte tecnológico'}</h3><button className="close" onClick={()=>setModal(null)}>×</button></div>
  {modal==='avisos'&&<><p>No tienes avisos críticos pendientes en este portal.</p><p className="muted">Las novedades del proceso se reflejan en tu fase, próxima acción y citas.</p></>}
  {modal==='grupo'&&<><h2>{groupName}</h2>{sheetId&&<p>ID de grupo: <b>{sheetId}</b></p>}{integrantes.length>0&&<div>{integrantes.map((m:any,i:number)=><p key={i}>👤 {m.nombre||m.integrante||'Integrante'} {m.email?<small>· {m.email}</small>:''}</p>)}</div>}{docUrl&&<a className="primary linkbtn" href={docUrl} target="_blank" rel="noreferrer">Abrir carpeta del grupo</a>}</>}
  {modal==='programa'&&<><p className="eyebrow">PROGRAMA REGISTRADO</p><h2>{a.programa||'Sin información'}</h2><p>Fase actual: <b>{p.fase||'—'}</b></p></>}
  {modal==='soporte'&&<><p>Si detectas un dato incorrecto o necesitas ayuda con tu proceso, escribe al canal de soporte.</p><a className="primary linkbtn" href="mailto:gradua@autonoma.pe?subject=Soporte%20MI%20CAMPUS%20UA">Escribir a gradua@autonoma.pe</a></>}
 </div></div>}

 <nav>{nav.map(x=><button className={tab===x[0]?'sel':''} onClick={()=>setTab(x[0])} key={x[0]}><b>{x[1]}</b><small>{x[2]}</small></button>)}</nav>
 </main>
}
