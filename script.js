const confettiPalette = ["#f72585", "#b5179e", "#8338ec", "#ffd166", "#2f9fa0"];
const balloonPalette = ["#ff66c4", "#ff9f1c", "#7b61ff", "#2ec4b6", "#ff6b6b", "#ffd166"];
const eventDateTime = new Date("2026-03-25T19:00:00+05:30");
const AUTOPLAY_KEY = "inviteMusicAutoplay";

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

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
  globalThis.scrollTo({ top: 0, left: 0, behavior: "auto" });

  // Staged reveal sequence for premium first impression.
  const revealEls = Array.from(document.querySelectorAll(".reveal"));
  revealEls.forEach((el, idx) => {
    globalThis.setTimeout(() => {
      el.classList.add("in");
    }, 120 + idx * 90);
  });

  // Theme switcher
  const themeButtons = Array.from(document.querySelectorAll(".theme-btn"));
  const applyTheme = (theme) => {
    document.body.dataset.theme = theme;
    themeButtons.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.theme === theme);
    });
    globalThis.localStorage.setItem("inviteTheme", theme);
  };

  const savedTheme = globalThis.localStorage.getItem("inviteTheme");
  if (savedTheme && themeButtons.some((btn) => btn.dataset.theme === savedTheme)) {
    applyTheme(savedTheme);
  } else {
    applyTheme("pastel");
  }

  themeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.dataset.theme) applyTheme(btn.dataset.theme);
    });
  });

  // Countdown timer
  const daysEl = document.getElementById("cdDays");
  const hoursEl = document.getElementById("cdHours");
  const minutesEl = document.getElementById("cdMinutes");
  const secondsEl = document.getElementById("cdSeconds");

  const updateCountdown = () => {
    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;
    const delta = eventDateTime.getTime() - Date.now();
    const safeDelta = Math.max(delta, 0);
    const days = Math.floor(safeDelta / (1000 * 60 * 60 * 24));
    const hours = Math.floor((safeDelta / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((safeDelta / (1000 * 60)) % 60);
    const seconds = Math.floor((safeDelta / 1000) % 60);

    daysEl.textContent = String(days);
    hoursEl.textContent = String(hours).padStart(2, "0");
    minutesEl.textContent = String(minutes).padStart(2, "0");
    secondsEl.textContent = String(seconds).padStart(2, "0");
  };

  updateCountdown();
  globalThis.setInterval(updateCountdown, 1000);

  sprinkleConfetti();

  globalThis.setInterval(() => {
    sprinkleConfetti(10);
  }, 5000);

  // Balloon stream from bottom.
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
  const autoplayBtn = document.getElementById("autoplayBtn");
  const audio = document.getElementById("bgm");
  if (musicBtn && audio) {
    const getAutoplayEnabled = () => {
      const saved = globalThis.localStorage.getItem(AUTOPLAY_KEY);
      if (saved === null) return true;
      return saved === "true";
    };

    const setAutoplayEnabled = (enabled) => {
      globalThis.localStorage.setItem(AUTOPLAY_KEY, String(enabled));
      if (!autoplayBtn) return;
      autoplayBtn.textContent = enabled ? "Auto: ON" : "Auto: OFF";
      autoplayBtn.classList.toggle("off", !enabled);
    };

    const setPlayingUI = (isPlaying) => {
      // Keep it simple: change icon label only.
      musicBtn.setAttribute(
        "aria-label",
        isPlaying ? "Music playing. Tap to pause." : "Music paused. Tap to play."
      );
      musicBtn.innerHTML = isPlaying ? "<span>⏸</span>" : "<span>♪</span>";
    };

    audio.volume = 0.5;
    audio.autoplay = true;

    const toggleMusic = async () => {
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
        musicBtn.setAttribute("aria-label", "Music unavailable. Check audio file path.");
      }
    };

    const tryAutoPlay = async () => {
      if (!getAutoplayEnabled()) return;
      if (!audio.paused) return;
      try {
        await audio.play();
        setPlayingUI(true);
      } catch {
        // Expected on many mobile browsers before a user gesture.
        setPlayingUI(false);
      }
    };

    // Use pointerup for reliable mobile tap behavior.
    musicBtn.addEventListener("pointerup", () => {
      toggleMusic();
    });

    // Keyboard accessibility for Enter/Space when focused.
    musicBtn.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      toggleMusic();
    });

    if (autoplayBtn) {
      setAutoplayEnabled(getAutoplayEnabled());
      autoplayBtn.addEventListener("pointerup", () => {
        const next = !getAutoplayEnabled();
        setAutoplayEnabled(next);
        if (next) {
          tryAutoPlay();
        }
      });
    }

    // Best-effort autoplay as soon as page opens.
    tryAutoPlay();

    // Retry when tab becomes active and after first interaction.
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) {
        tryAutoPlay();
      }
    });
    globalThis.addEventListener(
      "pointerdown",
      () => {
        tryAutoPlay();
      },
      { once: true, passive: true }
    );

    setPlayingUI(false);
  }
});
