'use client'

import { useState } from 'react';
import Image from 'next/image'; //

export default function Loja() {
  // Estado para controlar o portão e os detalhes do produto
  const [gateOpen, setGateOpen] = useState(false);
  const [modalItem, setModalItem] = useState({ 
    open: false, 
    name: '', 
    price: '', 
    description: '' 
  });

  return (
    <div className="relative w-full h-screen bg-[#1a1a1a] overflow-hidden">
      
      {/* 1. PORTÃO DE METAL */}
      <div 
        onClick={() => setGateOpen(true)}
        className={`fixed inset-0 z-[100] flex items-center justify-center transition-transform duration-[1500ms] ease-in-out cursor-pointer ${
          gateOpen ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        {/* A SUA IMAGEM DO PORTÃO */}
        <Image 
          src="/images/portao.png" // <--- COLOQUE O NOME DO SEU ARQUIVO AQUI
          alt="Portão da Loja"
          fill
          className="object-cover"
          priority
        />

        {/* TEXTO EM CIMA DA IMAGEM (OPCIONAL) */}
        <div className="relative z-10 bg-black/50 text-white p-4 rounded-xl border border-white animate-bounce font-bold">
          CLIQUE PARA ABRIR
        </div>
      </div>

      {/* 2. INTERIOR DA LOJA */}
      <main className="p-10 text-center text-white h-full overflow-y-auto">
        <h1 className="text-4xl font-bold mb-10 text-[#0004FF]">Loja Sinapse</h1>
        
        <div className="flex justify-center gap-10 flex-wrap">
          {/* Produto 1 */}
          <div 
            className="bg-[#222] p-5 border-b-4 border-[#0004FF] cursor-pointer hover:scale-105 transition-transform rounded-lg"
            onClick={() => setModalItem({ 
              open: true, 
              name: 'Camiseta Classic', 
              price: 'R$ 89,90',
              description: 'Camiseta 100% algodão com estampa exclusiva Sinapse.' 
            })}
          >
            <div className="w-40 h-40 bg-gray-600 mb-4 flex items-center justify-center rounded">FOTO</div>
            <p className="font-semibold text-lg text-white">Camiseta Classic</p>
            <p className="text-[#0004FF]">R$ 89,90</p>
          </div>
        </div>
      </main>

      {/* 3. MODAL DE DETALHES */}
      {modalItem.open && (
        <div 
          className="fixed inset-0 bg-black/90 z-[200] flex items-center justify-center p-4"
          onClick={() => setModalItem({ ...modalItem, open: false })}
        >
          <div 
            className="bg-white p-8 rounded-2xl text-black relative max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()} 
          >
            <button 
              className="absolute top-4 right-4 text-3xl font-light hover:text-red-500 transition-colors" 
              onClick={() => setModalItem({ ...modalItem, open: false })}
            >
              &times;
            </button>
            
            <h2 className="text-3xl font-bold text-[#0004FF] mb-2">{modalItem.name}</h2>
            <p className="text-xl font-semibold mb-4 text-gray-800">{modalItem.price}</p>
            <hr className="mb-4" />
            <p className="text-gray-600 leading-relaxed">
              {modalItem.description}
            </p>
            
            <button className="w-full mt-6 bg-[#0004FF] text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors">
              Adicionar ao Carrinho
            </button>
          </div>
        </div>
      )}
    </div>
  );
}