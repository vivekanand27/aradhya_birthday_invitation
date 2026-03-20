const colors = ["#f72585", "#ff9f1c", "#8338ec", "#3a86ff", "#2ec4b6"];
const card = document.querySelector(".video-card");

function dropConfetti(count = 8) {
  if (!card) return;

  for (let i = 0; i < count; i += 1) {
    const bit = document.createElement("span");
    bit.className = "confetti";
    bit.style.left = `${Math.random() * 100}%`;
    bit.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    bit.style.animationDuration = `${4 + Math.random() * 2.2}s`;
    bit.style.opacity = `${0.55 + Math.random() * 0.35}`;

    card.appendChild(bit);
    globalThis.setTimeout(() => bit.remove(), 6500);
  }
}

globalThis.addEventListener("load", () => {
  dropConfetti(10);
  globalThis.setInterval(() => dropConfetti(7), 1800);
});
