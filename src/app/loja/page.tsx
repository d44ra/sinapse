'use client'

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import Menu from "../../components/Menu";

export default function Loja() {
  // --- TUDO QUE É LÓGICA FICA AQUI DENTRO ---
  const [gateOpen, setGateOpen] = useState(false);
  const [carrinho, setCarrinho] = useState([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const produtos = [
    { id: 1, name: 'Casaco oque vc sente', price: 'R$ 89,90', img: '/images/CASACO2.png', top: '15%', left: '5%', size: 420 },
    { id: 2, name: 'Boné Sinapse', price: 'R$ 59,90', img: '/images/bone.png', top: '30%', left: '40%', size: 200 },
    { id: 3, name: 'Casaco Sentidos', price: 'R$ 150,00', img: '/images/CASACO.png', top: '55%', left: '5%', size: 420 },
    { id: 4, name: 'Garrafas', price: 'R$ 50,00', img: '/images/GARRAFAS.png', top: '67%', left: '38%', size: 270 },
    { id: 5, name: 'Ecobag White', price: 'R$ 20,00', img: '/images/ecobag1.png', top: '58%', left: '27%', size: 150 },
    { id: 6, name: 'Ecobag Black', price: 'R$ 20,00', img: '/images/ecobag 2.png', top: '18%', left: '27%', size: 150 },
  ];

  const tocarSomPortao = () => {
    const audio = new Audio("/images/portao.mp3");
    audio.volume = 0.5;
    audio.play().catch(err => console.log("Erro ao tocar som:", err));
  };

  const addToCart = (produto) => {
    const novoItem = { ...produto, cartId: Math.random() };
    setCarrinho((prev) => [...prev, novoItem]);
  };

  const removeFromCart = (cartId) => {
    setCarrinho((prev) => prev.filter(item => item.cartId !== cartId));
  };

  const total = carrinho.reduce((acc, item) => {
    const preco = parseFloat(item.price.replace('R$ ', '').replace(',', '.'));
    return acc + preco;
  }, 0);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      <Menu iconePersonalizado="/images/menu4.png" tamanho={100} />
      
      {/* 1. PORTÃO */}
      <AnimatePresence>
        {!gateOpen && (
          <motion.div 
            exit={{ y: '-100%' }}
            transition={{ duration: 5.5, ease: "easeInOut" }}
            onClick={() => {
              setGateOpen(true);
              tocarSomPortao();
            }}
            className="fixed inset-0 z-[100] cursor-pointer"
          >
            <Image src="/images/portao.png" alt="Portão" fill className="object-cover" priority />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. FUNDO DA LOJA */}
      <div className="absolute inset-0">
        <Image src="/images/fundoloja.png" alt="Loja" fill className="object-cover" />
      </div>

      {/* 3. PRODUTOS */}
      {produtos.map((p) => (
        <motion.div
          key={p.id}
          drag
          dragSnapToOrigin={true}
          onDragEnd={(e, info) => {
            if (info.point.x > window.innerWidth - 350 && info.point.y > window.innerHeight - 350) {
              addToCart(p);
            }
          }}
          className="absolute z-10 cursor-grab active:cursor-grabbing"
          style={{ top: p.top, left: p.left }}
        >
          <Image src={p.img} alt={p.name} width={p.size} height={p.size} className="pointer-events-none object-contain drop-shadow-lg" />
        </motion.div>
      ))}

      {/* 4. CARRINHO INTERATIVO */}
      <div 
        className="absolute bottom-2 right-2 z-20 cursor-pointer"
        onClick={() => carrinho.length > 0 && setIsCheckoutOpen(true)}
      >
        <div className="relative w-80 h-80 flex items-center justify-center group">
          <Image src="/images/carrinho.png" alt="Carrinho" width={320} height={320} className="object-contain drop-shadow-2xl transition-transform group-hover:scale-105" />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <AnimatePresence>
              {carrinho.map((item, index) => (
                <motion.div
                  key={item.cartId}
                  initial={{ scale: 0, y: -100, opacity: 0 }}
                  animate={{ 
                    scale: 0.5, 
                    y: -15, 
                    x: (index * 15) - (carrinho.length * 7), 
                    opacity: 1,
                  }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="absolute"
                >
                  <Image src={item.img} alt={item.name} width={120} height={120} className="drop-shadow-md" />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          {carrinho.length > 0 && (
            <div className="absolute top-10 right-10 bg-red-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-2xl shadow-xl border-2 border-white z-50">
              {carrinho.length}
            </div>
          )}
        </div>
      </div>

      {/* 5. MODAL DE CHECKOUT */}
      <AnimatePresence>
        {isCheckoutOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white text-black w-full max-w-lg rounded-3xl p-8 relative max-h-[80vh] overflow-y-auto"
            >
              <button onClick={() => setIsCheckoutOpen(false)} className="absolute top-4 right-4 text-2xl font-bold text-gray-400 hover:text-black">✕</button>
              <h2 className="text-3xl font-black mb-6 text-[#0004FF]">SEU CARRINHO</h2>
              <div className="space-y-4 mb-8">
                {carrinho.map((item) => (
                  <div key={item.cartId} className="flex items-center justify-between border-b pb-4">
                    <div className="flex items-center gap-4">
                      <Image src={item.img} alt={item.name} width={60} height={60} />
                      <div>
                        <p className="font-bold">{item.name}</p>
                        <p className="text-gray-500 text-sm">{item.price}</p>
                      </div>
                    </div>
                    <button onClick={() => removeFromCart(item.cartId)} className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold">REMOVER</button>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between text-2xl font-black mb-6">
                <span>TOTAL:</span>
                <span className="text-[#0004FF]">R$ {total.toFixed(2)}</span>
              </div>
              <button onClick={() => alert("Compra confirmada! 🧠")} className="w-full bg-[#0004FF] text-white py-4 rounded-full font-black text-xl">CONFIRMAR PRODUTOS</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}