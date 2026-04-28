import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Caminho apontando para public/images/adesivos
    const dir = path.join(process.cwd(), 'public', 'images', 'adesivos');
    
    if (!fs.existsSync(dir)) {
      console.error("Pasta não encontrada em:", dir);
      return NextResponse.json([]);
    }

    const files = fs.readdirSync(dir);
    
    // Filtra as imagens e monta o caminho correto para o navegador
    const images = files
      .filter(file => /\.(png|jpe?g|webp|svg)$/i.test(file))
      .map(name => `/images/adesivos/${name}`);

    return NextResponse.json(images);
  } catch (error) {
    return NextResponse.json([]);
  }
}