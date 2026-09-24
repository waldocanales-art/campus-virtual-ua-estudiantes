'use client';
import {useState} from 'react';
const phases=[['F1','Inicio'],['F2','Documentos'],['F3','Preparación'],['F4','Revisión'],['F5','Sustentación'],['F6','Grado']];
export default function Home(){
 const [tab,setTab]=useState('inicio'); const [ai,setAi]=useState(false);
 const nav=[['inicio','⌂','Inicio'],['comunidad','💬','Comunidad'],['documentos','📁','Docs'],['citas','📅','Citas'],['perfil','👤','Yo']];
 return <main className="app">
 <header><div className="logo">UA</div><div className="brand"><b>MI CAMPUS UA</b><small>Portal del Estudiante</small></div><button className="bell">🔔<i>3</i></button></header>
 {tab==='inicio'&&<section>
  <p className="eyebrow">BUENOS DÍAS</p><h1>Mi proceso académico</h1><p className="muted">Maestría · Posgrado</p>
  <div className="card"><div className="between"><b>Mi proceso</b><span className="warn">2 pendientes</span></div>
   <div className="steps">{phases.map((p,i)=><div className={'step '+(i<3?'done':i===3?'active':'')} key={p[0]}><i>{i<3?'✓':p[0]}</i><small>{p[1]}</small></div>)}</div>
   <div className="status"><small>ETAPA ACTUAL</small><h2>F4 · Revisión</h2><p>Tu documento está siendo revisado. Encontramos observaciones que debes atender.</p></div>
   <button className="primary" onClick={()=>setTab('documentos')}>Ver qué debo hacer →</button>
  </div>
  <h3>Próxima acción</h3><div className="item"><b className="circle">📄</b><div><strong>Corregir documento</strong><p>Hay 3 observaciones pendientes antes de continuar.</p></div><b>›</b></div>
  <h3>Tu ruta</h3><div className="card route"><p>🔴 <b>Hoy</b><small>Corregir observaciones</small></p><p>🟠 <b>Después</b><small>Validación de metadatos</small></p><p>⚪ <b>Luego</b><small>Confirmación de expediente</small></p><p>⚪ <b>Finalmente</b><small>Programación de sustentación</small></p></div>
 </section>}
 {tab==='comunidad'&&<section><h1>Comunidad</h1><p className="muted">Avisos y conversaciones en un solo lugar.</p>
  {[['📢','Avisos','Nueva fecha de atención y sustentaciones'],['🎓','Mi proceso de titulación','Coordinación respondió tu consulta'],['👥','Mi grupo de investigación','Nuevo mensaje del equipo'],['📚','Mi programa','Nuevo material académico'],['🖥️','Soporte tecnológico','Canal de ayuda']].map((x,i)=><div className="item" key={i}><b className="circle">{x[0]}</b><div><strong>{x[1]}</strong><p>{x[2]}</p></div><b>›</b></div>)}
 </section>}
 {tab==='documentos'&&<section><h1>Mis documentos</h1><p className="muted">Estado actualizado de tu expediente.</p><div className="card">
  {[['✓','DNI','Validado'],['✓','Solicitud','Validado'],['✓','Proyecto','Validado'],['!','Trabajo de investigación','Requiere revisión'],['×','Documento pendiente','Pendiente']].map((x,i)=><div className="doc" key={i}><b className={'state s'+i}>{x[0]}</b><div><strong>{x[1]}</strong><small>{x[2]}</small></div><b>›</b></div>)}
  <button className="primary">＋ Subir documento</button></div><h3>Revisión</h3><div className="card review"><h2>87%</h2><span>Cumplimiento actual</span><div className="bar"><i/></div><p>🟢 Estructura <b>OK</b></p><p>🟠 Tablas <b>Revisar</b></p><p>🔴 Referencias <b>Corregir</b></p></div>
 </section>}
 {tab==='citas'&&<section><h1>Mis citas</h1><p className="muted">Reuniones y atención académica.</p><div className="card"><p className="eyebrow">PRÓXIMA</p><h2>Miércoles 30 septiembre</h2><p>🕕 18:15 · Revisión académica · 15 minutos</p><button className="primary">Ingresar a reunión</button></div><button className="outline">＋ Reservar una cita</button></section>}
 {tab==='perfil'&&<section><div className="profile"><div>👤</div><h1>Mi perfil</h1><p className="muted">Estudiante de Posgrado</p></div><div className="card">{['🎓 Mi programa','📁 Mi expediente','🔔 Notificaciones','🛟 Ayuda y soporte'].map(x=><div className="menu" key={x}>{x}<b>›</b></div>)}</div></section>}
 <button className="ai" onClick={()=>setAi(true)}>✨</button>
 {ai&&<div className="overlay" onClick={()=>setAi(false)}><div className="assistant" onClick={e=>e.stopPropagation()}><div className="between"><h3>✨ Asistente UA</h3><button onClick={()=>setAi(false)}>×</button></div><div className="bubble">Hola. Puedo explicarte tu estado y qué necesitas para continuar.</div><div className="ububble">¿Por qué no puedo pasar todavía a sustentación?</div><div className="bubble">Tienes dos pendientes: corregir las observaciones del documento y completar la validación de metadatos. Cuando ambos estén conformes, podrás continuar.</div><div className="ask"><input placeholder="Escribe tu pregunta..."/><button>➤</button></div></div></div>}
 <nav>{nav.map(x=><button className={tab===x[0]?'sel':''} onClick={()=>setTab(x[0])} key={x[0]}><b>{x[1]}</b><small>{x[2]}</small></button>)}</nav>
 </main>}
