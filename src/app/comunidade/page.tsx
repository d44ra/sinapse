'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Menu from "../../components/Menu";

// 1. DECLARE O CANVAS AQUI FORA (FORA DA FUNÇÃO PRINCIPAL)
// Adicione a prop no CanvasGrafite
const CanvasGrafite = ({ sprayAudio }: { sprayAudio: HTMLAudioElement | null }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false); // Usamos Ref para o desenho não bugar com o som

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !sprayAudio) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const draw = (e: MouseEvent) => {
      if (!isDrawingRef.current) return;
      
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      ctx.fillStyle = '#00ff00';
      ctx.globalAlpha = 0.5;
      
      for (let i = 0; i < 80; i++) {
        const offsetX = (Math.random() - 0.5) * 45;
        const offsetY = (Math.random() - 0.5) * 45;
        ctx.beginPath();
        ctx.arc(x + offsetX, y + offsetY, Math.random() * 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const startDrawing = () => {
      isDrawingRef.current = true;
      // Toca o som apenas UMA VEZ ao clicar
      if (sprayAudio.paused) {
        sprayAudio.play().catch(err => console.error("Erro no play:", err));
      }
    };

    const stopDrawing = () => {
      isDrawingRef.current = false;
      // Pausa apenas quando soltar o botão
      sprayAudio.pause();
      sprayAudio.currentTime = 0; 
    };

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseleave', stopDrawing);

    return () => {
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', stopDrawing);
      canvas.removeEventListener('mouseleave', stopDrawing);
      sprayAudio.pause();
    };
  }, [sprayAudio]); // Removi o isDrawing daqui para evitar o AbortError

  return <canvas ref={canvasRef} className="absolute inset-0 z-10 touch-none" />;
};

type Interacao = {
  id: string;
  label: string;
  som?: string; 
  tipoAnimacao?: 'carros' | 'chuva' | 'concreto' | 'flash' | 'pizza' | 'metro' | 'grafite';
}

export default function ComunidadeSensorial() {
  const [palavrasSensoriais] = useState<Interacao[]>([
    { id: 'transito', label: 'Trânsito', som: '/sounds/transito.mp3', tipoAnimacao: 'carros' },
    { id: 'chuva', label: 'Chuva', som: '/sounds/chuva.mp3', tipoAnimacao: 'chuva' },
    { id: 'concreto', label: 'Concreto', tipoAnimacao: 'concreto', som: '/sounds/impacto-concreto.mp3' },
    { id: 'noite', label: 'Vida noturna', tipoAnimacao: 'flash', som: '/sounds/balada.mp3' },
    { id: 'pizza', label: 'Pizza', tipoAnimacao: 'pizza' },
    { id: 'metro', label: 'Metrô', tipoAnimacao: 'metro', som: '/sounds/metro.mp3' },
    { id: 'grafite', label: 'Grafite', tipoAnimacao: 'grafite', som: '/sounds/chacoalhar-lata.mp3' },
  ])

  const [inputValue, setInputValue] = useState('')
  const [showPopup, setShowPopup] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [animacaoAtiva, setAnimacaoAtiva] = useState<Interacao | null>(null)
  
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const sprayAudioRef = useRef<HTMLAudioElement | null>(null); // Nova ref para o spray

useEffect(() => {
  setMounted(true);
  if (typeof window !== "undefined") {
    audioRef.current = new Audio();
    // Já deixa o áudio do spray pré-carregado aqui!
    sprayAudioRef.current = new Audio('/sounds/spray-loop.mp3');
    sprayAudioRef.current.loop = true;
  }
}, []);

  useEffect(() => {
    setMounted(true)
    if (typeof window !== "undefined") {
      audioRef.current = new Audio()
    }
  }, [])

  useEffect(() => {
    if (!audioRef.current) return;

    if (animacaoAtiva?.som) {
      audioRef.current.src = animacaoAtiva.som
      audioRef.current.loop = true
      audioRef.current.volume = 0.5
      
      if (animacaoAtiva.id === 'noite') {
        audioRef.current.currentTime = 52; 
      } else {
        audioRef.current.currentTime = 0; 
      }

      const playPromise = audioRef.current.play()
      if (playPromise !== undefined) {
        playPromise.catch(e => console.log("Erro ao tocar:", e))
      }
    } else {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }

    

    return () => {
      audioRef.current?.pause()
    }
  }, [animacaoAtiva])

  const ativarSensacao = (palavra: Interacao) => {
    if (!palavra.som && !palavra.tipoAnimacao) return;

    if (animacaoAtiva?.id === palavra.id) {
      setAnimacaoAtiva(null)
      return
    }

    setAnimacaoAtiva(palavra)

    setTimeout(() => {
      setAnimacaoAtiva(null)
    }, 30000); 
  }

  const handleSend = () => {
    if (inputValue.trim() === '') return
    setShowPopup(true)
    setInputValue('')
    setTimeout(() => setShowPopup(false), 2000)
  }

  if (!mounted) return null

  return (
    <main className="relative w-full h-screen bg-[#f7f7f7] overflow-hidden font-sans">
      
      {/* 1. SEU MENU FICA AQUI - Z-INDEX 10001 GARANTE QUE ELE FIQUE NO TOPO DE TUDO */}
      <Menu iconePersonalizado="/images/menu5.png" tamanho={100} />

      <AnimatePresence>
        {/* CAMADA DE GRAFITE */}
        {animacaoAtiva?.tipoAnimacao === 'grafite' && (
          <motion.div 
            key="grafite-layer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10" 
            style={{ cursor: "url('/images/lata-spray.png') 32 32, pointer" }}
          >
            <div 
              className="absolute inset-0 z-0"
              style={{ 
                backgroundImage: "url('/images/parede-tijolo.png')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="absolute inset-0 bg-black/60" />
            </div>

            <CanvasGrafite sprayAudio={sprayAudioRef.current} /> 
          </motion.div>
        )}

        {/* CAMADA DE TRÂNSITO */}
        {animacaoAtiva?.tipoAnimacao === 'carros' && (
          <motion.div 
            key="carros-layer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center"
          >
            <div 
              className="absolute w-full h-[800px]" 
              style={{ 
                backgroundImage: "url('/images/asfalto.png')", 
                backgroundSize: 'auto 100%',
                backgroundRepeat: 'repeat-x', 
                backgroundPosition: 'center',
                top: '50%',
                transform: 'translateY(-50%)',
              }}
            />
            <div className="relative w-full h-[400px]">
              {[1, 2, 3, 4].map((num, i) => {
                const posicaoY = i === 3 ? (50 + i * 20) + 15 : (15 + i * 20);
                return (
                  <motion.div
                    key={`car-${num}`}
                    initial={{ x: '-30vw', y: `${posicaoY}%` }} 
                    animate={{ x: '115vw' }}
                    transition={{ duration: 4, delay: i * 0.8, repeat: Infinity, ease: "linear" }}
                    className="absolute"
                  >
                    <Image 
                      src={`/images/carro${num}.png`} 
                      alt="Carro" 
                      width={num === 4 ? 160 : 250} 
                      height={num === 4 ? 80 : 125} 
                      className="object-contain"
                      style={{ filter: "drop-shadow(0 15px 8px rgba(0,0,0,0.5))" }}
                    />
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* CAMADA DE CHUVA */}
        {animacaoAtiva?.tipoAnimacao === 'chuva' && (
          <motion.div 
            key="chuva-layer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-0 pointer-events-none"
          >
            <div className="absolute top-0 w-full flex justify-around p-5">
              {[1, 2, 3, 4].map((n) => (
                <motion.div
                  key={`cloud-${n}`}
                  animate={{ x: [0, 40, 0] }}
                  transition={{ duration: 4 + n, repeat: Infinity, ease: "easeInOut" }}
                  className="relative w-[500px] h-[300px]" 
                >
                  <Image 
                    src="/images/nuvem.png" 
                    alt="Nuvem"
                    fill
                    className="object-contain opacity-90"
                  />
                </motion.div>
              ))}
            </div>

            <div className="absolute inset-0 overflow-hidden">
              {Array.from({ length: 70 }).map((_, i) => (
                <motion.div
                  key={`drop-${i}`}
                  initial={{ y: -100, x: `${Math.random() * 100}vw` }}
                  animate={{ y: '110vh' }}
                  transition={{ 
                    duration: 0.5 + Math.random() * 0.5, 
                    repeat: Infinity, 
                    delay: Math.random() * 2, 
                    ease: "linear" 
                  }}
                  className="absolute w-[2px] h-[25px] bg-blue-400 opacity-40 rounded-full"
                />
              ))}
            </div>
            <div className="absolute inset-0 bg-slate-900/20" />
          </motion.div>
        )}

        {/* CAMADA DE CONCRETO */}
        {animacaoAtiva?.tipoAnimacao === 'concreto' && (
          <motion.div 
            key="concreto-layer"
            animate={{ 
              x: [0, -35, 35, -25, 25, 0],
              y: [0, 25, -25, 15, -15, 0] 
            }}
            transition={{ 
              delay: 0.35, 
              duration: 0.4, 
              ease: "easeInOut" 
            }}
            className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 2 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.35, duration: 0.05 }}
              className="absolute inset-0 flex items-center justify-center z-10" 
              style={{ top: '20%' }}
            >
               <Image 
                  src="/images/rachadura.png" 
                  alt="Rachadura"
                  width={1100}
                  height={1100}
                  className="object-contain opacity-90"
                  style={{ mixBlendMode: 'multiply' }}
                />
            </motion.div>

            <motion.div
              initial={{ y: '-100vh', rotate: -25 }}
              animate={{ y: '-10vh', rotate: 5 }} 
              transition={{ duration: 0.35, ease: [0.45, 0, 0.55, 1] }}
              className="relative z-20" 
            >
              <Image 
                src="/images/bloco-concreto.png" 
                alt="Bloco"
                width={750} 
                height={550}
                className="object-contain"
              />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.8, 0] }}
              transition={{ delay: 0.35, duration: 0.2 }}
              className="absolute inset-0 bg-white z-30"
            />
          </motion.div>
        )}

        {/* CAMADA DE VIDA NOTURNA */}
        {animacaoAtiva?.tipoAnimacao === 'flash' && (
          <motion.div 
            key="balada-layer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
          >
            <motion.div 
              animate={{ 
                backgroundColor: ['#ff00bf', '#7000ff', '#ff0080', '#ffee00', '#06e0ce']
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 opacity-40" 
            />

            <div className="absolute top-0 w-full h-full flex justify-between px-10 z-10">
              {[0, 1].map((i) => (
                <motion.div
                  key={`spot-${i}`}
                  animate={{ opacity: [0.2, 0.6, 0.2], scaleX: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                  className={`w-[300px] h-[600px] bg-gradient-to-b from-white/20 to-transparent blur-3xl origin-top ${i === 0 ? '-rotate-12' : 'rotate-12'}`}
                />
              ))}
            </div>

            <motion.div
              initial={{ y: -300, x: '-50%' }}
              animate={{ y: 50 }} 
              className="absolute top-0 left-1/2 z-30"
            >
              <motion.div
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="relative w-[250px] h-[250px]"
              >
                <Image 
                  src="/images/disco-ball.png" 
                  alt="Disco Ball"
                  fill
                  className="object-contain"
                  style={{ filter: 'drop-shadow(0 0 30px rgba(255,255,255,0.4))' }}
                />
              </motion.div>
              <div className="absolute top-0 left-1/2 w-[1px] h-[100px] bg-white/30 -translate-x-1/2 -translate-y-full" />
            </motion.div>

            <div 
              className="absolute bottom-0 w-full h-[20%] z-5"
              style={{ 
                background: 'linear-gradient(to bottom, #9c9c9c 0%, #050505 100%)',
                perspective: '500px'
              }}
            >
              <motion.div 
                animate={{ opacity: [0.1, 0.3, 0.1] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="w-full h-full bg-white/5 blur-xl"
              />
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="absolute bottom-0 w-full flex justify-center z-20"
            >
              <div className="relative w-full h-[450px]">
                <Image 
                  src="/images/silhuetas-balada.png" 
                  alt="Pessoas dançando"
                  fill
                  className="object-contain object-bottom"
                />
              </div>
            </motion.div>

            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40 z-0" />
          </motion.div>
        )}

        {/* CAMADA DE PIZZA */}
        {animacaoAtiva?.tipoAnimacao === 'pizza' && (
          <motion.div 
            key="pizza-layer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-0 pointer-events-none"
          >
            {Array.from({ length: 15 }).map((_, i) => (
              <motion.div
                key={`pizza-${i}`}
                initial={{ y: -200, x: `${Math.random() * 100}vw`, rotate: 0 }}
                animate={{ y: '110vh', rotate: 360 * (Math.random() > 0.5 ? 1 : -1) }}
                transition={{ 
                  duration: 2 + Math.random() * 3, 
                  repeat: Infinity,
                  delay: Math.random() * 5, 
                  ease: "linear"
                }}
                className="absolute"
              >
                <Image 
                  src="/images/pizza.png" 
                  alt="Pizza" 
                  width={150 + Math.random() * 100} 
                  height={150 + Math.random() * 100}
                  className="object-contain"
                  style={{ filter: "drop-shadow(0 10px 10px rgba(0,0,0,0.2))" }}
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* CAMADA DE METRÔ */}
        {animacaoAtiva?.tipoAnimacao === 'metro' && (
          <motion.div 
            key="metro-layer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
          >
            <motion.div
              initial={{ x: '-100%' }} 
              animate={{ x: '100vw' }}  
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute top-[25%] left-0 flex items-center"
            >
              <img 
                src="/images/vagao-metro.png" 
                alt="Metrô"
                className="h-[600px] w-auto max-w-none min-w-[max-content] object-contain"
                style={{ 
                  filter: 'blur(1.5px) drop-shadow(0 70px 50px rgba(0,0,0,0.6))',
                  backgroundColor: 'transparent'
                }}
              />
            </motion.div>
            <motion.div 
              animate={{ y: [-4, 4, -4], x: [-1, 1, -1] }}
              transition={{ duration: 0.08, repeat: Infinity }}
              className="absolute inset-0 bg-black/5"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute top-10 left-10 z-0 opacity-5">
        <h1 className="text-[120px] font-black leading-none text-black select-none uppercase">São<br />Paulo</h1>
      </div>

      <div className="relative w-full h-full p-20 flex flex-wrap gap-4 items-start content-start z-[100] pointer-events-none">
        {palavrasSensoriais.map((palavra) => (
          <motion.div
            key={palavra.id}
            whileHover={{ scale: 1.1, rotate: 3 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => ativarSensacao(palavra)}
            className={`px-6 py-3 bg-white border-2 border-black text-2xl md:text-4xl font-bold cursor-pointer pointer-events-auto shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-colors ${
              (palavra.som || palavra.tipoAnimacao) ? 'hover:text-[#0066ff] hover:border-[#0066ff]' : 'hover:border-gray-400'
            }`}
          >
            {palavra.label}
          </motion.div>
        ))}
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-4 w-full max-w-md px-4">
        <label className="text-xl font-bold bg-white px-2 uppercase">O que define São Paulo pra você?</label>
        <div className="flex w-full gap-2">
          <input 
            type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Sua sugestão..."
            className="flex-1 p-4 border-2 border-black outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white"
          />
          <button onClick={handleSend} className="bg-[#0066ff] text-white px-8 py-4 border-2 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">ENVIAR</button>
        </div>
        <AnimatePresence>
          {showPopup && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="bg-[#0066ff] text-white px-6 py-2 border-2 border-black font-bold">
              Sugestão enviada ✓
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <button onClick={() => window.location.href = '/'} className="absolute top-6 left-6 text-black font-black hover:underline z-[110]">
        ← MAPA
      </button>
    </main>
  )
}