import {NextResponse} from 'next/server';

const N8N_URL='https://autonoma-del-peru.app.n8n.cloud/webhook/mi-campus-ua-api-estudiante';

export async function POST(req:Request){
  try{
    const body=await req.json();
    const email=String(body?.email||'').trim();
    const dni=String(body?.dni||'').trim();
    const codigo=String(body?.codigo||'').trim();
    if(!email&&!dni&&!codigo) return NextResponse.json({ok:false,error:'IDENTIDAD_REQUERIDA'},{status:400});
    const url=new URL(N8N_URL);
    if(email) url.searchParams.set('email',email);
    if(dni) url.searchParams.set('dni',dni);
    if(codigo) url.searchParams.set('codigo',codigo);
    const r=await fetch(url.toString(),{cache:'no-store',headers:{Accept:'application/json'}});
    const data=await r.json();
    return NextResponse.json(data,{status:r.ok?200:r.status,headers:{'Cache-Control':'no-store'}});
  }catch(e){
    return NextResponse.json({ok:false,error:'N8N_NO_DISPONIBLE',message:e instanceof Error?e.message:'Error de conexión'},{status:502});
  }
}