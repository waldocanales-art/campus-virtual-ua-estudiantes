import './globals.css'; import type {Metadata} from 'next';
export const metadata:Metadata={title:'Mi Campus UA',description:'Portal del Estudiante',manifest:'/manifest.webmanifest'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="es"><body>{children}</body></html>}