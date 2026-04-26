"use client";

import { useEffect, useRef, useState } from "react";
import Matter from "matter-js";
import Image from "next/image";
import { SCALE } from "../../../data/items";

export default function FinalPoster({ selectedItems }) {
  const containerRef = useRef(null);
  const engineRef = useRef(null);
  const bodiesRef = useRef(new Map());

  const [physicsItems, setPhysicsItems] = useState([]);
  const [draggingItem, setDraggingItem] = useState(null);

  useEffect(() => {
    const engine = Matter.Engine.create({ gravity: { x: 0, y: 1.1 } });
    engineRef.current = engine;

    const width = window.innerWidth;
    const height = window.innerHeight;

    // Chão ajustado para os itens não cortarem na base da tela
    const floor = Matter.Bodies.rectangle(width / 2, height - 10, width, 120, { isStatic: true });
    const left = Matter.Bodies.rectangle(-60, height / 2, 120, height, { isStatic: true });
    const right = Matter.Bodies.rectangle(width + 60, height / 2, 120, height, { isStatic: true });

    Matter.World.add(engine.world, [floor, left, right]);

    selectedItems.forEach((img, i) => {
      const itemScale = img.dynamicScale || SCALE;

      const scaledVertices = img.vertices.map((part) =>
        part.map((v) => ({ x: v.x * itemScale, y: v.y * itemScale }))
      );

      const startX = width / 2 + (Math.random() - 0.5) * 300;
      const startY = -200 - i * 150;

      const body = Matter.Bodies.fromVertices(
        startX,
        startY,
        scaledVertices,
        {
          restitution: 0.1,
          friction: 0.8,
          frictionAir: 0.02,
          isStatic: false,
        }
      );

      // Fallback para não travar a renderização da tela final
      if (!body || body.parts.length <= 1) {
        const fallbackBody = Matter.Bodies.rectangle(
          startX, startY, img.w * itemScale, img.h * itemScale,
          {
            restitution: 0.1,
            friction: 0.8,
            frictionAir: 0.02,
            isStatic: false,
          }
        );
        Matter.World.add(engine.world, fallbackBody);
        bodiesRef.current.set(img.uniqueId, fallbackBody);
      } else {
        Matter.World.add(engine.world, body);
        bodiesRef.current.set(img.uniqueId, body); 
      }
    });

    let animationFrameId;
    const loop = () => {
      Matter.Engine.update(engine, 1000 / 60);
      const next = [];
      bodiesRef.current.forEach((body, uniqueId) => {
        const data = selectedItems.find((i) => i.uniqueId === uniqueId);
        if (!data) return;
        next.push({ uniqueId, x: body.position.x, y: body.position.y, angle: body.angle, ...data });
      });
      setPhysicsItems(next);
      animationFrameId = requestAnimationFrame(loop);
    };

    loop();
    return () => {
      cancelAnimationFrame(animationFrameId);
      Matter.Engine.clear(engine);
    };
  }, [selectedItems]);

  useEffect(() => {
    function handlePointerDown(e) {
      if (draggingItem) return;
      const bodies = Array.from(bodiesRef.current.values());
      const found = Matter.Query.point(bodies, { x: e.clientX, y: e.clientY })[0];

      if (!found) return;

      const item = selectedItems.find((i) => bodiesRef.current.get(i.uniqueId) === found);
      if (!item) return;

      Matter.World.remove(engineRef.current.world, found);
      bodiesRef.current.delete(item.uniqueId);

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
      setDraggingItem((prev) => ({ ...prev, x, y }));
    }

    function handlePointerUp(e) {
      if (!draggingItem) return;

      const engine = engineRef.current;
      if (engine) {
        const itemScale = draggingItem.dynamicScale || SCALE;
        const scaledVertices = draggingItem.vertices.map((part) =>
          part.map((v) => ({ x: v.x * itemScale, y: v.y * itemScale }))
        );

        const body = Matter.Bodies.fromVertices(
          e.clientX,
          e.clientY,
          scaledVertices,
          { isStatic: true }
        );

        if (!body || body.parts.length <= 1) {
          const fallbackBody = Matter.Bodies.rectangle(
            e.clientX, e.clientY, draggingItem.w * itemScale, draggingItem.h * itemScale,
            { isStatic: true }
          );
          Matter.Body.setAngle(fallbackBody, 0);
          Matter.World.add(engine.world, fallbackBody);
          bodiesRef.current.set(draggingItem.uniqueId, fallbackBody);
        } else {
          Matter.Body.setAngle(body, 0); 
          Matter.World.add(engine.world, body);
          bodiesRef.current.set(draggingItem.uniqueId, body);
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
  }, [draggingItem, selectedItems]);

  const textFragmentStyle = {
    position: "absolute",
    margin: 0,
    fontWeight: "bold",
    color: "#191919",
    letterSpacing: "-0.05em",
    lineHeight: "0.85",
  };

  return (
    <main
      ref={containerRef}
      style={{
        height: "100vh",
        width: "100vw",
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#ffffff",
        fontFamily: "system-ui, sans-serif",
        userSelect: "none",
        WebkitUserSelect: "none",
      }}
    >
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <h2 style={{ 
          ...textFragmentStyle,
          top: "10%", 
          right: "20%", 
          fontSize: "5.5vw", 
        }}>
          Você
        </h2>

        <h2 style={{ 
          ...textFragmentStyle,
          top: "15%", 
          left: "20%", 
          fontSize: "5.5vw", 
        }}>
          cheira<br/>saboreia<br/>escuta<br/>toca<br/>vê
        </h2>

        <h2 style={{ 
          ...textFragmentStyle,
          top: "44%", 
          left: "55%", 
          fontSize: "5.5vw", 
          textAlign: "left"
        }}>
          e
        </h2>

        <h2 style={{ 
          ...textFragmentStyle,
          top: "60%", 
          left: "55%", 
          fontSize: "5.5vw", 
          textAlign: "left"
        }}>
          a<br/>cidade
        </h2>

        <h2 style={{ 
          ...textFragmentStyle,
          bottom: "7%", 
          left: "20%", 
          fontSize: "5.5vw", 
        }}>
          de<br/>São Paulo.
        </h2>
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
            zIndex: 10,
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