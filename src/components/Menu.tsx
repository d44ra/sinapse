"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

// Adicionamos 'tamanho = 100' aqui nos parênteses
export default function MenuSinapse({ iconePersonalizado, tamanho = 100 }) {
  const [aberto, setAberto] = useState(false);

  return (
    <div className="fixed top-1 right-8 z-[10001] group"> 
      
      {/* Texto que aparece no Hover (Tooltip) */}
      <div className="absolute -left-20 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-[#0004FF] text-white text-[10px] py-1 px-3 rounded-md pointer-events-none font-bold uppercase tracking-widest shadow-lg">
        Menu
        <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-[#0004FF] rotate-45"></div>
      </div>

      {/* Botão do Menu */}
      <button 
        onClick={() => setAberto(!aberto)}
        className="hover:scale-110 transition-transform active:scale-95 bg-white/50 p-2 rounded-full backdrop-blur-sm shadow-sm flex items-center justify-center"
      >
        {iconePersonalizado ? (
          <Image 
            src={iconePersonalizado} 
            alt="Menu Icon" 
            width={tamanho}   // <--- AGORA USA O TAMANHO QUE VOCÊ MANDAR
            height={tamanho}  // <--- AGORA USA O TAMANHO QUE VOCÊ MANDAR
            className="object-contain" 
          />
        ) : (
          <div className="w-12 h-10 flex flex-col justify-between p-1">
            <span className="w-full h-1.5 bg-[#0004FF] rounded"></span>
            <span className="w-full h-1.5 bg-[#0004FF] rounded"></span>
            <span className="w-full h-1.5 bg-[#0004FF] rounded"></span>
          </div>
        )}
      </button>

      {aberto && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[10002]" onClick={() => setAberto(false)} />
      )}

      <div className={`fixed top-0 right-0 h-screen w-80 bg-[#0004FF] text-white shadow-2xl transform transition-transform duration-300 ease-in-out z-[10003] ${aberto ? 'translate-x-0' : 'translate-x-full'}`}>
        <button onClick={() => setAberto(false)} className="absolute top-8 right-8 text-xl font-bold hover:rotate-90 transition-transform">[ X ]</button>
        <nav className="flex flex-col gap-6 mt-32 ml-12 text-2xl font-bold">
          <Link href="/" onClick={() => setAberto(false)} className="hover:italic w-fit transition-all">HOME</Link>
          <Link href="/sobre-nos" onClick={() => setAberto(false)} className="hover:italic w-fit transition-all">SOBRE NÓS</Link>
          <Link href="/midia" onClick={() => setAberto(false)} className="hover:italic w-fit transition-all">MÍDIA</Link>
          <Link href="/jogo" onClick={() => setAberto(false)} className="hover:italic w-fit transition-all">JOGO</Link>
          <Link href="/loja" onClick={() => setAberto(false)} className="hover:italic w-fit transition-all">LOJA</Link>
          <Link href="/os-sentidos" onClick={() => setAberto(false)} className="hover:italic w-fit transition-all">OS SENTIDOS</Link>
          <Link href="/comunidade" onClick={() => setAberto(false)} className="hover:italic w-fit transition-all">COMUNIDADE</Link>
        </nav>
      </div>
    </div>
  );
}