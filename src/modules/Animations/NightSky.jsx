import { useEffect, useRef } from "react";
import "./nightSky.css";

export default function NightSky() {
  const canvasRef = useRef(null);
  const rafRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const STAR_COUNT = Math.max(150);
    const SHOOTING_STAR_COUNT = 2;

    const stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.4 + 0.2,
        a: Math.random() * Math.PI * 2,
        s: 0.008 + Math.random() * 0.02,
        tw: 0.4 + Math.random() * 0.6,
        hue: 200 + Math.random() * 40,
      });
    }

    const shootingStars = [];
    for (let i = 0; i < SHOOTING_STAR_COUNT; i++) {
      shootingStars.push(resetShootingStar(width, height, true));
    }

    function resetShootingStar(w, h, initial = false) {
      return {
        x: initial ? Math.random() * w : -100,
        y: initial ? Math.random() * h * 0.7 : Math.random() * h * 0.6,
        len: 80 + Math.random() * 120,
        speed: 6 + Math.random() * 5,
        angle: Math.PI / 4 + (Math.random() - 0.5) * 0.2,
        life: initial ? Math.random() * 300 : 0,
        delay: 200 + Math.random() * 500,
      };
    }

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      for (const s of stars) {
        s.x = Math.random() * width;
        s.y = Math.random() * height;
      }
    }
    window.addEventListener("resize", resize);

    function drawSky() {
      ctx.clearRect(0, 0, width, height);

      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, "#030410");
      grad.addColorStop(0.5, "#060816");
      grad.addColorStop(1, "#0c0f1c");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      const nebula = ctx.createRadialGradient(
        width * 0.85,
        height * 0.25,
        40,
        width * 0.85,
        height * 0.25,
        Math.max(width, height) * 0.6
      );
      nebula.addColorStop(0, "rgba(80, 90, 160, 0.09)");
      nebula.addColorStop(0.4, "rgba(40, 60, 120, 0.04)");
      nebula.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = nebula;
      ctx.fillRect(0, 0, width, height);

      for (const s of stars) {
        s.a += s.s;
        const alpha = 0.5 + Math.sin(s.a) * 0.5 * s.tw;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${s.hue}, 80%, 90%, ${alpha})`;
        ctx.fill();

        if (s.r > 0.9) {
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r * 2.4, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${s.hue}, 90%, 80%, ${alpha * 0.25})`;
          ctx.fill();
        }
      }

      for (const sh of shootingStars) {
        sh.life += 1;
        if (sh.life < sh.delay) continue;

        sh.x += Math.cos(sh.angle) * sh.speed;
        sh.y += Math.sin(sh.angle) * sh.speed;

        const tailX = sh.x - Math.cos(sh.angle) * sh.len;
        const tailY = sh.y - Math.sin(sh.angle) * sh.len;

        const lg = ctx.createLinearGradient(tailX, tailY, sh.x, sh.y);
        lg.addColorStop(0, "rgba(255,255,255,0)");
        lg.addColorStop(0.6, "rgba(180, 210, 255, 0.3)");
        lg.addColorStop(1, "rgba(255, 255, 255, 0.95)");
        ctx.strokeStyle = lg;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(sh.x, sh.y);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(sh.x, sh.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.9)";
        ctx.fill();

        if (sh.x > width + 200 || sh.y > height + 200) {
          Object.assign(sh, resetShootingStar(width, height));
        }
      }

      rafRef.current = requestAnimationFrame(drawSky);
    }

    drawSky();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="night-sky-bg" aria-hidden="true" />;
}
