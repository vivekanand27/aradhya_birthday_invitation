const confettiPalette = ["#f72585", "#b5179e", "#8338ec", "#ffd166", "#2f9fa0"];

function sprinkleConfetti(count = 20) {
  for (let i = 0; i < count; i += 1) {
    const confetti = document.createElement("span");
    confetti.className = "confetti";
    confetti.style.left = `${Math.random() * 100}vw`;
    confetti.style.background = confettiPalette[Math.floor(Math.random() * confettiPalette.length)];
    confetti.style.animationDuration = `${4 + Math.random() * 2.7}s`;
    confetti.style.opacity = `${0.55 + Math.random() * 0.25}`;
    confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
    document.body.appendChild(confetti);

    globalThis.setTimeout(() => {
      confetti.remove();
    }, 6500);
  }
}

globalThis.addEventListener("load", () => {
  sprinkleConfetti();

  globalThis.setInterval(() => {
    sprinkleConfetti(10);
  }, 5000);
});
