const confettiPalette = ["#f72585", "#b5179e", "#8338ec", "#ffd166", "#2f9fa0"];
const balloonPalette = ["#ff66c4", "#ff9f1c", "#7b61ff", "#2ec4b6", "#ff6b6b", "#ffd166"];

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

function launchBalloon(direction = "rise") {
  const balloon = document.createElement("span");
  balloon.className = `balloon balloon-${direction}`;
  balloon.style.left = `${Math.random() * 100}vw`;
  balloon.style.setProperty("--balloon-size", `${18 + Math.random() * 20}px`);
  balloon.style.setProperty(
    "--balloon-color",
    balloonPalette[Math.floor(Math.random() * balloonPalette.length)]
  );

  const durationMs = 9000 + Math.random() * 5000;
  balloon.style.animationDuration = `${durationMs}ms`;
  document.body.appendChild(balloon);

  globalThis.setTimeout(() => {
    balloon.remove();
  }, durationMs + 500);
}

globalThis.addEventListener("load", () => {
  sprinkleConfetti();

  globalThis.setInterval(() => {
    sprinkleConfetti(10);
  }, 5000);

  // Balloon stream: mostly rising from bottom, some falling from top.
  globalThis.setInterval(() => {
    launchBalloon("rise");
  }, 1200);

  // Small celebration on interaction (mobile-friendly).
  let lastTapAt = 0;
  globalThis.addEventListener(
    "pointerdown",
    () => {
      const now = Date.now();
      if (now - lastTapAt < 6500) return;
      lastTapAt = now;
      sprinkleConfetti(6);
    },
    { passive: true }
  );

  // --- Background music toggle (requires user interaction) ---
  const musicBtn = document.getElementById("musicBtn");
  const audio = document.getElementById("bgm");
  if (musicBtn && audio) {
    const setPlayingUI = (isPlaying) => {
      // Keep it simple: change icon label only.
      musicBtn.setAttribute(
        "aria-label",
        isPlaying ? "Music playing. Tap to pause." : "Music paused. Tap to play."
      );
      musicBtn.innerHTML = isPlaying ? "<span>🔊</span>" : "<span>🎵</span>";
    };

    audio.volume = 0.5;
    audio.addEventListener("error", () => {
      // If music file is missing, hide the control.
      musicBtn.style.display = "none";
    });

    musicBtn.addEventListener("click", async () => {
      try {
        if (audio.paused) {
          await audio.play();
          setPlayingUI(true);
        } else {
          audio.pause();
          setPlayingUI(false);
        }
      } catch (err) {
        // Autoplay restrictions or missing file.
        setPlayingUI(false);
        // eslint-disable-next-line no-console
        console.warn("Music couldn't start:", err);
      }
    });

    setPlayingUI(false);
  }
});
