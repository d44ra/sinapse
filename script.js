function criarImagem(event) {

  const imagens = [
    "cafe.webp",
    "bemtevi.png",
    "heroi.png",
    "operarios.png",
    "cadeira.png"
  ];

  const escolha = imagens[Math.floor(Math.random() * imagens.length)];

  const img = document.createElement("img");
  img.src = escolha;
  img.classList.add("adesivo");

  // posição do clique
  img.style.left = event.pageX + "px";
  img.style.top = event.pageY + "px";

  // tamanho grande
  const tamanho = 150 + Math.random() * 200;
  img.style.width = tamanho + "px";

  // rotação aleatória
  const rotacao = -40 + Math.random() * 80;
  img.style.transform = `rotate(${rotacao}deg)`;

  document.body.appendChild(img);

  // começa fade depois de 18 segundos
  setTimeout(() => {
    img.style.opacity = "0";
  }, 18000);

  // remove depois de 20 segundos
  setTimeout(() => {
    img.remove();
  }, 20000);
}