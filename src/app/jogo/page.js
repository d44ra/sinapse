"use client";

import { useEffect, useRef, useState } from "react";
import Matter from "matter-js";
import Image from "next/image";

import { PROMPTS } from "../../data/prompts";
import { ITEMS, SCALE } from "../../data/items";
import { randomItems, extractTextFromAnswers } from "../../lib/utils";

const DEFAULT_SLOT_W = 160;
const DEFAULT_SLOT_H = 80;
const DEFAULT_SLOT_PATH = `M10,0 L150,0 Q160,0 160,10 L160,70 Q160,80 150,80 L10,80 Q0,80 0,70 L0,10 Q0,0 10,0 Z`;

export default function App() {
  const containerRef = useRef(null);
  const slotRefs = useRef(new Map());
  
  const engineRef = useRef(null);
  const bodiesRef = useRef(new Map());

  const [promptIndex, setPromptIndex] = useState(0);
  const [activeSlotId, setActiveSlotId] = useState(null);
  const [answeredSlots, setAnsweredSlots] = useState({});
  
  const [physicsItems, setPhysicsItems] = useState([]);
  const [draggingItem, setDraggingItem] = useState(null);

  const currentPrompt = PROMPTS[promptIndex];
  const allSlots = currentPrompt.nodes.filter((n) => n.type === "slot");
  const isPromptComplete = allSlots.length > 0 && allSlots.every((s) => answeredSlots[s.id]);

  /* =========================
     INIT PHYSICS ENGINE
  ========================= */
  useEffect(() => {
    const engine = Matter.Engine.create({ gravity: { x: 0, y: 1.1 } });
    engineRef.current = engine;

    const width = window.innerWidth;
    const height = window.innerHeight;

    const floor = Matter.Bodies.rectangle(width / 2, height + 60, width, 120, { isStatic: true });
    const left = Matter.Bodies.rectangle(-60, height / 2, 120, height, { isStatic: true });
    const right = Matter.Bodies.rectangle(width + 60, height / 2, 120, height, { isStatic: true });

    Matter.World.add(engine.world, [floor, left, right]);

    let animationFrameId;
    const loop = () => {
      Matter.Engine.update(engine, 1000 / 60);
      const next = [];
      bodiesRef.current.forEach((body, id) => {
        const data = ITEMS.find((i) => i.id === id);
        if (!data) return;
        next.push({ id, x: body.position.x, y: body.position.y, angle: body.angle, ...data });
      });
      setPhysicsItems(next);
      animationFrameId = requestAnimationFrame(loop);
    };

    loop();
    return () => {
      cancelAnimationFrame(animationFrameId);
      Matter.Engine.clear(engine);
    };
  }, []);

  /* =========================
     ACTIONS
  ========================= */
  const clearPhysics = () => {
    if (!engineRef.current) return;
    bodiesRef.current.forEach((b) => Matter.World.remove(engineRef.current.world, b));
    bodiesRef.current.clear();
    setPhysicsItems([]);
  };

  const spawnItems = () => {
    const engine = engineRef.current;
    if (!engine) return;
    
    clearPhysics();
    
    const selected = randomItems(ITEMS, 5);
    selected.forEach((img, i) => {
      const scaledVertices = img.vertices.map(part => 
        part.map(v => ({ x: v.x * SCALE, y: v.y * SCALE }))
      );

      const body = Matter.Bodies.fromVertices(
        window.innerWidth / 2 + (Math.random() - 0.5) * 150,
        -200 - i * 100,
        scaledVertices,
        { restitution: 0.05, friction: 0.9, frictionAir: 0.04 }
      );

      if (!body) return;

      Matter.World.add(engine.world, body);
      bodiesRef.current.set(img.id, body);
    });
  };

  const handleSlotClick = (slotId) => {
    if (answeredSlots[slotId]) return;
    setActiveSlotId(slotId);
    spawnItems();
  };

  const nextPrompt = () => {
    if (promptIndex + 1 < PROMPTS.length) {
      setPromptIndex((prev) => prev + 1);
    } else {
      setPromptIndex(0);
    }
    setAnsweredSlots({});
    setActiveSlotId(null);
    clearPhysics();
  };

  const sharePrompt = async () => {
    const text = extractTextFromAnswers(currentPrompt.nodes, answeredSlots, ITEMS);
    if (navigator.share) {
      try {
        await navigator.share({ title: "Minha Frase", text });
      } catch (e) {
        console.error("Erro ao compartilhar", e);
      }
    } else {
      navigator.clipboard.writeText(text);
      alert("Texto copiado para a área de transferência!");
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

      const item = ITEMS.find((i) => bodiesRef.current.get(i.id) === found);
      if (!item) return;

      Matter.World.remove(engineRef.current.world, found);
      bodiesRef.current.delete(item.id);

      setDraggingItem({
        ...item,
        offsetX: (item.w * SCALE) / 2,
        offsetY: (item.h * SCALE) / 2,
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
        setAnsweredSlots((prev) => ({ ...prev, [activeSlotId]: draggingItem.id }));
        setActiveSlotId(null);
        clearPhysics();
      } else {
        const engine = engineRef.current;
        if (engine) {
          const scaledVertices = draggingItem.vertices.map(part => 
            part.map(v => ({ x: v.x * SCALE, y: v.y * SCALE }))
          );
          const body = Matter.Bodies.fromVertices(
            e.clientX,
            e.clientY,
            scaledVertices,
            { restitution: 0.05, friction: 0.9, frictionAir: 0.04 }
          );
          if (body) {
            Matter.World.add(engine.world, body);
            bodiesRef.current.set(draggingItem.id, body);
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
          fontSize: "48px",
          lineHeight: "1.5",
          textAlign: "center",
          whiteSpace: "pre-wrap",
        }}>
          {currentPrompt.nodes.map((node, i) => {
            if (node.type === "text") {
              return <span key={i}>{node.content}</span>;
            }

            if (node.type === "slot") {
              const answerId = answeredSlots[node.id];
              const isActive = activeSlotId === node.id;

              if (answerId) {
                const item = ITEMS.find((it) => it.id === answerId);
                if (!item) return null;
                return (
                  <img
                    key={node.id}
                    src={item.src}
                    alt={item.label}
                    style={{
                      display: "inline-block",
                      width: item.w * SCALE,
                      height: item.h * SCALE,
                      verticalAlign: "middle",
                      margin: "0 8px",
                      pointerEvents: "none"
                    }}
                  />
                );
              }

              const w = draggingItem && isActive ? draggingItem.w * SCALE : DEFAULT_SLOT_W;
              const h = draggingItem && isActive ? draggingItem.h * SCALE : DEFAULT_SLOT_H;
              const pathStr = draggingItem && isActive ? draggingItem.svgPath : DEFAULT_SLOT_PATH;

              return (
                <span
                  key={node.id}
                  ref={(el) => {
                    if (el) slotRefs.current.set(node.id, el);
                  }}
                  onClick={() => handleSlotClick(node.id)}
                  style={{
                    display: "inline-block",
                    width: w,
                    height: h,
                    verticalAlign: "middle",
                    margin: "0 8px",
                    cursor: isActive ? "default" : "pointer",
                    transition: "width 0.2s, height 0.2s"
                  }}
                >
                  <svg 
                    width={w} 
                    height={h} 
                    viewBox={draggingItem && isActive ? `0 0 ${draggingItem.w} ${draggingItem.h}` : `0 0 ${DEFAULT_SLOT_W} ${DEFAULT_SLOT_H}`}
                    style={{ overflow: "visible" }}
                  >
                    <path
                      d={pathStr}
                      className="slot-path"
                      style={{
                        stroke: isActive ? "#000" : "#ccc",
                        animationPlayState: isActive ? "running" : "paused"
                      }}
                    />
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
              style={{ padding: "16px 32px", fontSize: "20px", cursor: "pointer" }}
            >
              Próxima frase
            </button>
            <button 
              onClick={sharePrompt}
              style={{ padding: "16px 32px", fontSize: "20px", cursor: "pointer" }}
            >
              Compartilhar
            </button>
          </div>
        )}
      </div>

      {physicsItems.map((item) => (
        <div
          key={item.id}
          style={{
            position: "absolute",
            left: item.x - (item.w * SCALE) / 2,
            top: item.y - (item.h * SCALE) / 2,
            transform: `rotate(${item.angle}rad)`,
            pointerEvents: "none",
          }}
        >
          <Image src={item.src} alt="" width={item.w * SCALE} height={item.h * SCALE} draggable={false} />
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
          <Image src={draggingItem.src} alt="" width={draggingItem.w * SCALE} height={draggingItem.h * SCALE} draggable={false} />
        </div>
      )}
    </main>
  );
}