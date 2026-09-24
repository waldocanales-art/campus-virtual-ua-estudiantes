import {NextRequest,NextResponse} from 'next/server';

const N8N_BASE=process.env.N8N_WEBHOOK_BASE_URL || 'https://autonoma-del-peru.app.n8n.cloud';

export async function GET(req:NextRequest){
  const email=req.nextUrl.searchParams.get('email')||'';
  const dni=req.nextUrl.searchParams.get('dni')||'';
  const codigo=req.nextUrl.searchParams.get('codigo')||'';
  if(!email&&!dni&&!codigo) return NextResponse.json({ok:false,error:'IDENTIDAD_REQUERIDA'},{status:400});
  const url=new URL('/webhook/mi-campus-ua-api-estudiante',N8N_BASE);
  if(email)url.searchParams.set('email',email);
  if(dni)url.searchParams.set('dni',dni);
  if(codigo)url.searchParams.set('codigo',codigo);
  try{
    const r=await fetch(url,{cache:'no-store'});
    const data=await r.json();
    return NextResponse.json(data,{status:r.ok?200:r.status});
  }catch(e){
    return NextResponse.json({ok:false,error:'N8N_NO_DISPONIBLE',message:'No fue posible consultar n8n.'},{status:502});
  }
}

export async function POST(req:Request){
  const event=await req.json();
  return NextResponse.json({ok:true,received:event,portal:'Mi Campus UA V2'});
}