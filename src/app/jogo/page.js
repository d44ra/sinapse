"use client";

import { useEffect, useRef, useState } from "react";
import Matter from "matter-js";
import decomp from 'poly-decomp';
Matter.Common.setDecomp(decomp);
import Image from "next/image";
import html2canvas from 'html2canvas';

import FinalPoster from "./components/FinalPoster";
import { PROMPTS } from "../../data/prompts";
import { ITEMS, SCALE } from "../../data/items";
import { randomItems, extractTextFromAnswers, shuffleArray } from "../../lib/utils";

const DEFAULT_SLOT_W = 160;
const DEFAULT_SLOT_H = 80;
const DEFAULT_SLOT_PATH = `M10,0 L150,0 Q160,0 160,10 L160,70 Q160,80 150,80 L10,80 Q0,80 0,70 L0,10 Q0,0 10,0 Z`;

export default function App() {
  const containerRef = useRef(null);
  const slotRefs = useRef(new Map());
  
  const engineRef = useRef(null);
  const bodiesRef = useRef(new Map());
  
  const activeItemsRef = useRef(new Map());

  const [promptIndex, setPromptIndex] = useState(0);
  const [activeSlotId, setActiveSlotId] = useState(null);
  const [answeredSlots, setAnsweredSlots] = useState({});
  
  const [physicsItems, setPhysicsItems] = useState([]);
  const [draggingItem, setDraggingItem] = useState(null);

  const [isGameFinished, setIsGameFinished] = useState(false);
  const [finalItems, setFinalItems] = useState([]);

  const [shuffledPrompts, setShuffledPrompts] = useState([]);
  const [itemPool, setItemPool] = useState([]);

  useEffect(() => {
    setShuffledPrompts(shuffleArray(PROMPTS));
  }, []);

  const currentPromptsList = shuffledPrompts.length > 0 ? shuffledPrompts : PROMPTS;
  const currentPrompt = currentPromptsList[promptIndex];
  
  const allSlots = currentPrompt ? currentPrompt.nodes.filter((n) => n.type === "slot") : [];
  const isPromptComplete = allSlots.length > 0 && allSlots.every((s) => answeredSlots[s.id]);

  /* =========================
     INIT PHYSICS ENGINE
  ========================= */
  useEffect(() => {
    if (!currentPrompt) return;

    const engine = Matter.Engine.create({ gravity: { x: 0, y: 1.1 } });
    engineRef.current = engine;

    const width = window.innerWidth;
    const height = window.innerHeight;

    const floor = Matter.Bodies.rectangle(width / 2, height - 10, width, 120, { isStatic: true });
    const left = Matter.Bodies.rectangle(-60, height / 2, 120, height, { isStatic: true });
    const right = Matter.Bodies.rectangle(width + 60, height / 2, 120, height, { isStatic: true });

    Matter.World.add(engine.world, [floor, left, right]);

    let animationFrameId;
    const loop = () => {
      Matter.Engine.update(engine, 1000 / 60);
      const next = [];
      
      bodiesRef.current.forEach((body, uniqueId) => {
        const data = activeItemsRef.current.get(uniqueId);
        if (!data) return;
        next.push({ ...data, x: body.position.x, y: body.position.y, angle: body.angle });
      });
      
      setPhysicsItems(next);
      animationFrameId = requestAnimationFrame(loop);
    };

    loop();
    return () => {
      cancelAnimationFrame(animationFrameId);
      Matter.Engine.clear(engine);
    };
  }, [currentPrompt]);

  /* =========================
     ACTIONS
  ========================= */
  const clearPhysics = () => {
    if (!engineRef.current) return;
    bodiesRef.current.forEach((b) => Matter.World.remove(engineRef.current.world, b));
    bodiesRef.current.clear();
    activeItemsRef.current.clear();
    setPhysicsItems([]);
  };

  const spawnItems = (sentidoAtivo) => {
    const engine = engineRef.current;
    if (!engine) return;
    
    clearPhysics();
    
    let currentPool = [...itemPool];
    if (currentPool.length < 5) {
      currentPool = shuffleArray([...ITEMS]);
    }
    
    const selected = currentPool.splice(0, 5);
    setItemPool(currentPool);

    selected.forEach((img, i) => {
      const dynamicSrc = `/images/jogo/${img.id}_${sentidoAtivo}.png`;
      const uniqueId = `${img.id}-${Date.now()}-${i}`;

      const targetSize = 180;
      const autoScale = targetSize / Math.max(img.w, img.h);

      activeItemsRef.current.set(uniqueId, { 
        ...img, 
        uniqueId, 
        src: dynamicSrc,
        dynamicScale: autoScale
      });

      const scaledVertices = img.vertices.map(part => 
        part.map(v => ({ x: v.x * autoScale, y: v.y * autoScale }))
      );

      const startX = window.innerWidth / 2 + (Math.random() - 0.5) * 150;
      const startY = -200 - i * 100;

      const body = Matter.Bodies.fromVertices(
        startX,
        startY,
        scaledVertices,
        { restitution: 0.05, friction: 0.9, frictionAir: 0.04 }
      );

      if (!body || body.parts.length <= 1) {
        console.warn(`Silhueta falhou para: ${img.id}. Usando box de fallback.`);
        const fallbackBody = Matter.Bodies.rectangle(
          startX, startY, img.w * autoScale, img.h * autoScale,
          { restitution: 0.05, friction: 0.9, frictionAir: 0.04 }
        );
        Matter.World.add(engine.world, fallbackBody);
        bodiesRef.current.set(uniqueId, fallbackBody);
      } else {
        Matter.World.add(engine.world, body);
        bodiesRef.current.set(uniqueId, body);
      }
    });
  };

  const handleSlotClick = (slotId) => {
    if (answeredSlots[slotId]) return;
    
    setActiveSlotId(slotId);
    
    const slotNode = currentPrompt.nodes.find((n) => n.id === slotId);
    spawnItems(slotNode.sentido);
  };

  const processRoundAndContinue = (isLastPrompt) => {
    const roundItems = Object.keys(answeredSlots).map((slotId) => {
      const answer = answeredSlots[slotId];
      const baseItem = ITEMS.find((i) => i.id === answer.itemId);
      return { ...baseItem, src: answer.src, uniqueId: `${baseItem.id}-${Date.now()}-${Math.random()}` };
    });

    setFinalItems((prev) => [...prev, ...roundItems]);

    clearPhysics();

    if (isLastPrompt) {
      setIsGameFinished(true);
    } else {
      setPromptIndex((prev) => prev + 1);
      setAnsweredSlots({});
      setActiveSlotId(null);
    }
  };

  const nextPrompt = () => {
    const isLastPrompt = promptIndex + 1 >= currentPromptsList.length;
    processRoundAndContinue(isLastPrompt);
  };

  const sharePrompt = async () => {
    if (!containerRef.current) return;

    try {
      const canvas = await html2canvas(containerRef.current, {
        useCORS: true,
        backgroundColor: "#f9f9f9",
        scale: 2 
      });

      canvas.toBlob(async (blob) => {
        if (!blob) return;

        const file = new File([blob], "minha-frase.jpg", { type: "image/jpeg" });

        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              title: "Minha Frase",
              files: [file]
            });
          } catch (e) {
            console.error("Erro ao compartilhar", e);
          }
        } else {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "minha-frase.jpg";
          a.click();
          URL.revokeObjectURL(url);
        }
      }, "image/jpeg", 0.9);

    } catch (error) {
      console.error("Erro ao gerar a imagem:", error);
    }
  };

  /* =========================
     DRAG & DROP
  ========================= */
  useEffect(() => {
    function handlePointerDown(e) {
      if (draggingItem) return;
      const bodies = Array.from(bodiesRef.current.values());
      const found = Matter.Query.point(bodies, { x: e.clientX, y: e.clientY })[0];
      
      if (!found) return;

      const bodyEntry = Array.from(bodiesRef.current.entries()).find(([uid, b]) => b === found);
      if (!bodyEntry) return;

      const [uniqueId] = bodyEntry;
      const item = activeItemsRef.current.get(uniqueId);
      if (!item) return;

      Matter.World.remove(engineRef.current.world, found);
      bodiesRef.current.delete(uniqueId);

      const itemScale = item.dynamicScale || SCALE;

      setDraggingItem({
        ...item,
        offsetX: (item.w * itemScale) / 2,
        offsetY: (item.h * itemScale) / 2,
        x: e.clientX,
        y: e.clientY,
      });
    }

    function handlePointerMove(e) {
      if (!draggingItem || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - draggingItem.offsetX;
      const y = e.clientY - rect.top - draggingItem.offsetY;
      setDraggingItem((prev) => ({ ...prev, x, y, rawX: e.clientX, rawY: e.clientY }));
    }

    function handlePointerUp(e) {
      if (!draggingItem) return;

      let droppedInActiveSlot = false;

      if (activeSlotId) {
        const slotEl = slotRefs.current.get(activeSlotId);
        if (slotEl) {
          const rect = slotEl.getBoundingClientRect();
          const inside =
            e.clientX >= rect.left &&
            e.clientX <= rect.right &&
            e.clientY >= rect.top &&
            e.clientY <= rect.bottom;

          if (inside) {
            droppedInActiveSlot = true;
          }
        }
      }

      if (droppedInActiveSlot && activeSlotId) {
        setAnsweredSlots((prev) => ({ 
          ...prev, 
          [activeSlotId]: { 
            itemId: draggingItem.id, 
            src: draggingItem.src,
            scale: draggingItem.dynamicScale 
          } 
        }));
        setActiveSlotId(null);
        clearPhysics();
      } else {
        const engine = engineRef.current;
        if (engine) {
          const currentScale = draggingItem.dynamicScale || SCALE;
          const scaledVertices = draggingItem.vertices.map(part => 
            part.map(v => ({ x: v.x * currentScale, y: v.y * currentScale }))
          );
          
          const body = Matter.Bodies.fromVertices(
            e.clientX,
            e.clientY,
            scaledVertices,
            { restitution: 0.05, friction: 0.9, frictionAir: 0.04 }
          );

          if (!body || body.parts.length <= 1) {
            const fallbackBody = Matter.Bodies.rectangle(
              e.clientX, e.clientY, draggingItem.w * currentScale, draggingItem.h * currentScale,
              { restitution: 0.05, friction: 0.9, frictionAir: 0.04 }
            );
            Matter.World.add(engine.world, fallbackBody);
            bodiesRef.current.set(draggingItem.uniqueId, fallbackBody);
          } else {
            Matter.World.add(engine.world, body);
            bodiesRef.current.set(draggingItem.uniqueId, body);
          }
        }
      }

      setDraggingItem(null);
    }

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [draggingItem, activeSlotId]);

  /* =========================
     RENDER
  ========================= */
  if (isGameFinished) {
    return <FinalPoster selectedItems={finalItems} />;
  }

  if (!currentPrompt) {
    return <div style={{ display: "flex", height: "100vh", width: "100vw", justifyContent: "center", alignItems: "center", fontSize: "2rem", color: "#000", backgroundColor: "#f9f9f9" }}>Carregando jogo...</div>;
  }

  return (
    <main
      ref={containerRef}
      style={{
        height: "100vh",
        width: "100vw",
        position: "relative",
        overflow: "hidden",
        fontFamily: "system-ui, sans-serif",
        userSelect: "none",
        WebkitUserSelect: "none",
        backgroundColor: "#f9f9f9"
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marching-ants {
          to { stroke-dashoffset: -20; }
        }
        .slot-path {
          fill: transparent;
          stroke: #000;
          stroke-width: 2;
          stroke-dasharray: 6 4;
          animation: marching-ants 0.5s linear infinite;
        }
      `}} />

      <div style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "2rem"
      }}>
        <div style={{
          fontSize: "75px",
          maxWidth: "80vw",
          lineHeight: "1.15",
          textAlign: "center",
          whiteSpace: "pre-wrap",
          color: "#191919",
          fontWeight: "bold"
        }}>
          {currentPrompt.nodes.map((node, i) => {
            if (node.type === "text") {
              return <span key={i}>{node.content}</span>;
            }

            if (node.type === "slot") {
              const answer = answeredSlots[node.id];
              const isActive = activeSlotId === node.id;

              if (answer) {
                const itemBase = ITEMS.find((it) => it.id === answer.itemId);
                if (!itemBase) return null;

                const currentScale = answer.scale || SCALE;
                const totalW = itemBase.w * currentScale;
                const totalH = itemBase.h * currentScale;

                return (
                  <span
                    key={node.id}
                    style={{
                      display: "inline-block",
                      width: totalW,
                      height: 80,
                      position: "relative",
                      verticalAlign: "middle",
                      margin: "0 8px",
                    }}
                  >
                    <img
                      src={answer.src}
                      alt={itemBase.label}
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: totalW,
                        height: totalH,
                        objectFit: "contain",
                        pointerEvents: "none"
                      }}
                    />
                  </span>
                );
              }

              const activeScale = draggingItem && isActive ? (draggingItem.dynamicScale || SCALE) : SCALE;
              const svgW = draggingItem && isActive ? draggingItem.w * activeScale : DEFAULT_SLOT_W;
              const svgH = draggingItem && isActive ? draggingItem.h * activeScale : DEFAULT_SLOT_H;
              const pathStr = draggingItem && isActive ? draggingItem.svgPath : DEFAULT_SLOT_PATH;
              const dropZoneW = Math.max(svgW, 80);

              return (
                <span
                  key={node.id}
                  ref={(el) => {
                    if (el) slotRefs.current.set(node.id, el);
                  }}
                  onClick={() => handleSlotClick(node.id)}
                  style={{
                    display: "inline-block",
                    width: dropZoneW,
                    height: 80,
                    position: "relative",
                    verticalAlign: "middle",
                    margin: "0 8px",
                    cursor: isActive ? "default" : "pointer",
                  }}
                >
                  <svg 
                    width={svgW} 
                    height={svgH} 
                    viewBox={draggingItem && isActive ? `0 0 ${draggingItem.w} ${draggingItem.h}` : `0 0 ${DEFAULT_SLOT_W} ${DEFAULT_SLOT_H}`}
                    style={{ 
                      overflow: "visible",
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)"
                    }}
                  >
                    {pathStr && (
                      <path
                        d={pathStr}
                        className="slot-path"
                        style={{
                          stroke: isActive ? "#001bff" : "#ccc",
                          animationPlayState: isActive ? "running" : "paused"
                        }}
                      />
                    )}
                  </svg>
                </span>
              );
            }
          })}
        </div>

        {isPromptComplete && (
          <div style={{ marginTop: "40px", display: "flex", gap: "20px" }}>
            <button 
              onClick={nextPrompt}
              title={promptIndex + 1 >= currentPromptsList.length ? "Finalizar" : "Próxima frase"}
              style={{ padding: "8px", cursor: "pointer", border: "none", background: "none", color: "#001bff", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              {promptIndex + 1 >= currentPromptsList.length ? (
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              ) : (
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              )}
            </button>
            <button 
              onClick={sharePrompt}
              title="Compartilhar"
              style={{ padding: "8px", cursor: "pointer", border: "none", background: "none", color: "#001bff", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                <polyline points="16 6 12 2 8 6"></polyline>
                <line x1="12" y1="2" x2="12" y2="15"></line>
              </svg>
            </button>
          </div>
        )}
      </div>

      {physicsItems.map((item) => (
        <div
          key={item.uniqueId}
          style={{
            position: "absolute",
            left: item.x - (item.w * (item.dynamicScale || SCALE)) / 2,
            top: item.y - (item.h * (item.dynamicScale || SCALE)) / 2,
            transform: `rotate(${item.angle}rad)`,
            pointerEvents: "none",
          }}
        >
          <Image 
            src={item.src} 
            alt="" 
            width={item.w * (item.dynamicScale || SCALE)} 
            height={item.h * (item.dynamicScale || SCALE)} 
            draggable={false} 
          />
        </div>
      ))}

      {draggingItem && (
        <div
          style={{
            position: "absolute",
            left: draggingItem.x,
            top: draggingItem.y,
            pointerEvents: "none",
            zIndex: 100,
          }}
        >
          <Image 
            src={draggingItem.src} 
            alt="" 
            width={draggingItem.w * (draggingItem.dynamicScale || SCALE)} 
            height={draggingItem.h * (draggingItem.dynamicScale || SCALE)} 
            draggable={false} 
          />
        </div>
      )}
    </main>
  );
}