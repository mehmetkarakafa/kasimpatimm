window.addEventListener("load", () => {
  buildChrysanthemumHeads();

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const timer = setTimeout(() => {
        document.body.classList.remove("not-loaded");
        clearTimeout(timer);
      }, 300);
    });
  });

  initStarfield();
  initControls();
});

function buildChrysanthemumHeads() {
  const heads = document.querySelectorAll(".chrysanthemum-head");
  const isMobile = window.innerWidth <= 768;

  const rings = isMobile
    ? [
        { count: 16, pw: "2.1vmin", ph: "6.8vmin", offset: "0.3vmin", z: 5, shift: 0 },
        { count: 14, pw: "1.9vmin", ph: "5.4vmin", offset: "0.2vmin", z: 10, shift: 11 },
        { count: 12, pw: "1.65vmin", ph: "4.1vmin", offset: "0.14vmin", z: 15, shift: 5 },
        { count: 9, pw: "1.35vmin", ph: "2.6vmin", offset: "0.08vmin", z: 20, shift: 15 }
      ]
    : [
        { count: 22, pw: "1.75vmin", ph: "6.8vmin", offset: "0.3vmin", z: 5, shift: 0 },
        { count: 18, pw: "1.6vmin", ph: "5.5vmin", offset: "0.22vmin", z: 10, shift: 8 },
        { count: 15, pw: "1.4vmin", ph: "4.3vmin", offset: "0.15vmin", z: 15, shift: 3 },
        { count: 12, pw: "1.2vmin", ph: "3.1vmin", offset: "0.1vmin", z: 20, shift: 11 },
        { count: 10, pw: "1.0vmin", ph: "2.0vmin", offset: "0.05vmin", z: 25, shift: 5 }
      ];

  heads.forEach((head) => {
    head.innerHTML = "";
    const fragment = document.createDocumentFragment();

    rings.forEach((ring) => {
      const step = 360 / ring.count;
      for (let i = 0; i < ring.count; i++) {
        const petal = document.createElement("div");
        petal.className = "chrys-petal";
        const jitter = (Math.sin(i * 17.3 + ring.z) * 1.6).toFixed(1);
        const angle = (i * step + ring.shift + parseFloat(jitter)).toFixed(1);
        const scaleJitter = (0.96 + (Math.cos(i * 9.1) + 1) * 0.04).toFixed(2);

        petal.style.setProperty("--angle", `${angle}deg`);
        petal.style.setProperty("--pw", ring.pw);
        petal.style.setProperty("--ph", ring.ph);
        petal.style.setProperty("--offset", ring.offset);
        petal.style.setProperty("--sc", scaleJitter);
        petal.style.zIndex = String(ring.z);
        fragment.appendChild(petal);
      }
    });

    const center = document.createElement("div");
    center.className = "chrys-center";
    fragment.appendChild(center);

    head.appendChild(fragment);
  });
}

function initControls() {
  const btnReplay = document.getElementById("btn-replay");
  const btnColor = document.getElementById("btn-color");
  const btnText = document.getElementById("btn-text");
  const btnNoteClose = document.getElementById("btn-note-close");
  const romanticMessage = document.getElementById("romantic-message");

  btnReplay.addEventListener("click", () => {
    const currentFlowers = document.querySelector(".flowers");
    if (!currentFlowers) return;
    document.body.classList.add("not-loaded");
    const clone = currentFlowers.cloneNode(true);
    currentFlowers.parentNode.replaceChild(clone, currentFlowers);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.body.classList.remove("not-loaded");
      });
    });
  });

  const themes = [
    { className: "", label: "Leylak" },
    { className: "theme-cyan", label: "Turkuaz" },
    { className: "theme-white", label: "Beyaz" },
    { className: "theme-gold", label: "Altın" }
  ];
  let currentThemeIndex = 0;

  btnColor.addEventListener("click", () => {
    if (themes[currentThemeIndex].className) {
      document.body.classList.remove(themes[currentThemeIndex].className);
    }
    currentThemeIndex = (currentThemeIndex + 1) % themes.length;
    if (themes[currentThemeIndex].className) {
      document.body.classList.add(themes[currentThemeIndex].className);
    }
    btnColor.textContent = themes[currentThemeIndex].label;
  });

  function toggleNote(forceState) {
    const isCurrentlyHidden = romanticMessage.hasAttribute("hidden");
    const shouldShow = typeof forceState === "boolean" ? forceState : isCurrentlyHidden;
    if (shouldShow) {
      romanticMessage.removeAttribute("hidden");
      btnText.classList.add("is-active");
    } else {
      romanticMessage.setAttribute("hidden", "");
      btnText.classList.remove("is-active");
    }
  }

  btnText.addEventListener("click", () => toggleNote());
  if (btnNoteClose) {
    btnNoteClose.addEventListener("click", () => toggleNote(false));
  }
}

function initStarfield() {
  const canvas = document.getElementById("stars-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const isMobile = width <= 768;
  const starCount = isMobile ? 65 : 120;
  const stars = Array.from({ length: starCount }, () => ({
    x: Math.random() * width,
    y: Math.random() * height * 0.85,
    radius: Math.random() * 1.2 + 0.4,
    alpha: Math.random() * 0.65 + 0.2,
    speed: Math.random() * 0.008 + 0.002,
    phase: Math.random() * Math.PI * 2
  }));

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    drawStars(0);
  });

  function drawStars(time) {
    ctx.clearRect(0, 0, width, height);
    for (const s of stars) {
      const twinkle = time === 0 ? 0.8 : 0.5 + 0.5 * Math.sin(time * s.speed + s.phase);
      ctx.fillStyle = `rgba(245, 225, 240, ${(s.alpha * twinkle).toFixed(2)})`;
      const size = s.radius * 2;
      ctx.fillRect(s.x, s.y, size, size);
    }
  }

  drawStars(0);

  let lastFrame = 0;
  function render(time) {
    if (!isMobile || time - lastFrame > 50) {
      drawStars(time);
      lastFrame = time;
    }
    requestAnimationFrame(render);
  }

  setTimeout(() => {
    requestAnimationFrame(render);
  }, 3200);
}
