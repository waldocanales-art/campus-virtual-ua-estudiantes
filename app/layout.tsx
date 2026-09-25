import './globals.css'; import type {Metadata} from 'next';
export const metadata:Metadata={title:'HAWKS UA',description:'Plataforma Universitaria HAWKS UA',applicationName:'HAWKS UA',manifest:'/manifest.webmanifest'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="es"><body>{children}</body></html>}