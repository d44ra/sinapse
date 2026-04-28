"use client";

import { useEffect } from "react";
import Image from "next/image";
import Menu from "../../components/Menu";

export default function SobreNos() {
  
  useEffect(() => {
    let listaDeImagens = []; 
    let desenhando = false;

    fetch('/api/stickers')
      .then(res => res.json())
      .then(data => { 
        if (Array.isArray(data)) listaDeImagens = data; 
      })
      .catch(err => console.log("Erro ao buscar adesivos:", err));

    const criarImagem = (event) => {
      if (listaDeImagens.length === 0) return;
      const escolha = listaDeImagens[Math.floor(Math.random() * listaDeImagens.length)];
      const img = document.createElement("img");
      img.src = escolha;
      img.style.position = "absolute";
      img.style.left = event.pageX + "px";
      img.style.top = event.pageY + "px";
      const tamanho = 80 + Math.random() * 250; 
      img.style.width = tamanho + "px";
      img.style.transform = "translate(-50%, -50%) rotate(" + (-45 + Math.random() * 90) + "deg)";
      img.style.pointerEvents = "none";
      img.style.zIndex = "9998"; 
      img.style.transition = "opacity 0.3s"; 
      document.body.appendChild(img);
      setTimeout(() => { img.style.opacity = "0"; }, 500); 
      setTimeout(() => { img.remove(); }, 800);
    };

    const aoApertar = (e) => { desenhando = true; criarImagem(e); };
    const aoSoltar = () => { desenhando = false; };
    const aoMover = (e) => { if (desenhando) criarImagem(e); };

    window.addEventListener("mousedown", aoApertar);
    window.addEventListener("mouseup", aoSoltar);
    window.addEventListener("mousemove", aoMover);

    return () => {
      window.removeEventListener("mousedown", aoApertar);
      window.removeEventListener("mouseup", aoSoltar);
      window.removeEventListener("mousemove", aoMover);
    };
  }, []);

  return (
    /* ADICIONEI 'antialiased' e a variável da fonte aqui no main */
    <main className="min-h-screen bg-[#f7f7f7] py-24 px-8 overflow-x-hidden relative select-none flex flex-col items-center gap-16 antialiased" style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}>
      
      <Menu iconePersonalizado="/images/menu1.png" />

      <header className="w-full max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-[#0004FF] tracking-tighter uppercase italic">Sobre Nós</h1>
      </header>

      <div className="w-full max-w-6xl flex flex-col gap-20">
        
        {/* Bloco 1 */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="md:w-1/2 text-black text-lg leading-relaxed font-medium tracking-tight">
            O site Sinapse surge da ideia de experimentar São Paulo através dos cinco sentidos humanos (tato, visão, olfato, audição e paladar).
          </div>
          <div className="md:w-1/2 flex justify-center opacity-20"></div>
        </div>

        {/* Bloco 2 */}
        <div className="flex flex-col md:flex-row-reverse items-center justify-between gap-10">
          <div className="md:w-1/2 text-black text-lg leading-relaxed font-medium text-right tracking-tight">
            O nome vem da interação entre os neurônios, responsável pela transmissão de impulsos nervosos: é assim que toda experiência sensorial acontece no corpo humano.
          </div>
          <div className="md:w-1/2 flex justify-center opacity-20"></div>
        </div>

        {/* Bloco 3 */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="md:w-1/2 text-black text-lg leading-relaxed font-medium tracking-tight">
            O projeto propõe uma reflexão sobre a mistura de estímulos que sentimos em São Paulo. A partir de páginas interativas com imagens sobrepostas e jogos que convidam a misturar os sentidos, como no dia a dia da cidade.
          </div>
          <div className="md:w-1/2 flex justify-center opacity-20"></div>
        </div>

        {/* Bloco 4 */}
        <div className="flex flex-col md:flex-row-reverse items-center justify-between gap-10">
          <div className="md:w-1/2 text-black text-lg leading-relaxed font-medium text-right tracking-tight">
            O conceito também carrega uma explicação visual. O "S" e o "P" em destaque no logo são as iniciais de São Paulo, simbolizando a relação direta entre os sentidos e a cidade.
          </div>
          <div className="md:w-1/2 flex justify-center opacity-20"></div>
        </div>

      </div>

      <div className="fixed bottom-8 left-8 z-0 opacity-80 pointer-events-none">
        <Image 
          src="/images/sinapse_logo.png" 
          alt="Logo Grande Fundo" 
          width={400} 
          height={150} 
          style={{ height: 'auto' }}
        />
      </div>
    </main>
  );
}