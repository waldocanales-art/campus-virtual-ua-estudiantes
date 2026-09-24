import {NextResponse} from 'next/server';

const VALIDAR='https://autonoma-del-peru.app.n8n.cloud/webhook/validar-credencial-carga-grupo-epg';
const CAMPUS='https://autonoma-del-peru.app.n8n.cloud/webhook/mi-campus-ua-api-estudiante';

const norm=(v:unknown)=>String(v??'').trim().toLowerCase();

export async function POST(req:Request){
  try{
    const body=await req.json();
    const grupo=String(body?.grupo||'').trim();
    const usuario=String(body?.usuario||'').trim();
    const codigo=String(body?.codigo||'').trim();
    if(!grupo||!usuario||!codigo){
      return NextResponse.json({ok:false,error:'CREDENCIALES_REQUERIDAS',message:'Ingresa grupo, usuario y código.'},{status:400});
    }

    const vr=await fetch(VALIDAR,{
      method:'POST',cache:'no-store',
      headers:{'Content-Type':'application/json','Accept':'application/json'},
      body:JSON.stringify({usuario_carga:usuario,codigo_carga:codigo})
    });
    const v=await vr.json().catch(()=>({ok:false}));
    const auth=v?.body||v;
    if(!vr.ok||!auth?.ok){
      return NextResponse.json({ok:false,error:'CREDENCIAL_INVALIDA',message:'Grupo, usuario o código incorrectos.'},{status:401});
    }

    const returnedSheet=String(auth.sheet_id||'').trim();
    const returnedGroup=String(auth.grupo||'').trim();
    const groupOk=norm(grupo)===norm(returnedSheet)||norm(grupo)===norm(returnedGroup);
    if(!groupOk){
      return NextResponse.json({ok:false,error:'GRUPO_NO_COINCIDE',message:'El grupo no corresponde a estas credenciales.'},{status:401});
    }

    const url=new URL(CAMPUS);
    url.searchParams.set('sheet_id',returnedSheet);
    const r=await fetch(url.toString(),{cache:'no-store',headers:{Accept:'application/json'}});
    const data=await r.json();
    if(!r.ok||!data?.ok) return NextResponse.json(data,{status:r.ok?404:r.status,headers:{'Cache-Control':'no-store'}});
    return NextResponse.json({...data,auth:{grupo:returnedGroup||returnedSheet,usuario}},{status:200,headers:{'Cache-Control':'no-store'}});
  }catch(e){
    return NextResponse.json({ok:false,error:'N8N_NO_DISPONIBLE',message:e instanceof Error?e.message:'Error de conexión'},{status:502});
  }
}