import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Award, Users, Shield, Globe, BookOpen, GraduationCap, 
  Monitor, Briefcase, ChevronLeft, ChevronRight, 
  MapPin, Phone, Mail, Facebook, Instagram, Linkedin, Youtube, 
  Quote, Sparkles, Menu, X, ArrowRight, CheckCircle2,
  Star, TrendingUp, Trophy, Clock, Compass
} from 'lucide-react';

// Import local logo from assets
import logo from './assets/logo.png';
import homeImg from './assets/homee.jpeg';

// Register GSAP ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// ==========================================
// CUSTOM GOLDEN SPRINKLE CURSOR COMPONENT
// ==========================================
function GoldenSprinkleCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const canvasRef = useRef(null);
  const requestRef = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    // Check if device supports touch/coarse pointers (mobile)
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
    if (isTouchDevice) {
      if (dotRef.current) dotRef.current.style.display = 'none';
      if (ringRef.current) ringRef.current.style.display = 'none';
      if (canvasRef.current) canvasRef.current.style.display = 'none';
      return;
    }

    const dot = dotRef.current;
    const ring = ringRef.current;
    const canvas = canvasRef.current;
    if (!dot || !ring || !canvas) return;

    const ctx = canvas.getContext('2d');
    
    // Set canvas sizes
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Mouse coordinates tracking
    let mouse = { x: -100, y: -100 };
    let lastMouse = { x: -100, y: -100 };

    // Set initial custom cursor positioning
    gsap.set(dot, { xPercent: -50, yPercent: -50 });
    gsap.set(ring, { xPercent: -50, yPercent: -50 });

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      // Move custom dot (fast lag) and ring (slower lag for smooth drag follow feel)
      gsap.to(dot, { x: mouse.x, y: mouse.y, duration: 0.05, ease: "power2.out" });
      gsap.to(ring, { x: mouse.x, y: mouse.y, duration: 0.22, ease: "power2.out" });

      // Generate golden sprinkle particles based on cursor speed
      const distance = Math.hypot(mouse.x - lastMouse.x, mouse.y - lastMouse.y);
      if (distance > 2) {
        const spawnCount = Math.min(3, Math.floor(distance / 5) + 1);
        for (let i = 0; i < spawnCount; i++) {
          particlesRef.current.push(createParticle(mouse.x, mouse.y));
        }
      }

      lastMouse.x = mouse.x;
      lastMouse.y = mouse.y;
    };

    // Curated color values for luxury gold sparkles
    const goldColors = [
      { r: 201, g: 162, b: 77 },   // --color-gold (#C9A24D)
      { r: 242, g: 223, b: 162 },  // --color-gold-light (#F2DFA2)
      { r: 166, g: 126, b: 45 }    // --color-gold-dark (#A67E2D)
    ];

    const createParticle = (x, y) => {
      const colorObj = goldColors[Math.floor(Math.random() * goldColors.length)];
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 1.5 + 0.5;
      return {
        x,
        y,
        vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 0.4,
        vy: Math.sin(angle) * speed + 0.3, // biased slightly downwards
        size: Math.random() * 3 + 1.5,
        r: colorObj.r,
        g: colorObj.g,
        b: colorObj.b,
        alpha: 1.0,
        decay: Math.random() * 0.02 + 0.015,
        rotation: Math.random() * Math.PI,
        rotationSpeed: (Math.random() - 0.5) * 0.08
      };
    };

    // Hover scales the cursor ring & adds translucent gold fill
    const handleMouseEnterLink = () => {
      gsap.to(ring, {
        scale: 1.5,
        backgroundColor: 'rgba(201, 162, 77, 0.15)',
        borderColor: '#F2DFA2',
        boxShadow: '0 0 15px rgba(201, 162, 77, 0.4)',
        duration: 0.25
      });
      gsap.to(dot, {
        scale: 0.5,
        backgroundColor: '#F2DFA2',
        duration: 0.2
      });
    };

    const handleMouseLeaveLink = () => {
      gsap.to(ring, {
        scale: 1,
        backgroundColor: 'transparent',
        borderColor: 'rgba(201, 162, 77, 0.6)',
        boxShadow: '0 0 10px rgba(201, 162, 77, 0.2)',
        duration: 0.25
      });
      gsap.to(dot, {
        scale: 1,
        backgroundColor: '#C9A24D',
        duration: 0.2
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Apply custom cursor interactions to all interactive nodes
    const bindLinkListeners = () => {
      const nodes = document.querySelectorAll('a, button, select, input, textarea, [role="button"], .cursor-pointer');
      nodes.forEach(node => {
        node.removeEventListener('mouseenter', handleMouseEnterLink);
        node.removeEventListener('mouseleave', handleMouseLeaveLink);
        node.addEventListener('mouseenter', handleMouseEnterLink);
        node.addEventListener('mouseleave', handleMouseLeaveLink);
      });
    };

    bindLinkListeners();

    // Auto-listen to SPA page navigation or DOM layout modifications
    const observer = new MutationObserver(bindLinkListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    // Sparkles canvas rendering loop
    const animateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const particles = particlesRef.current;

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.035; // simulated gravity drift
        p.alpha -= p.decay;
        p.rotation += p.rotationSpeed;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        // Draw diamond-shaped sparkle element
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.beginPath();
        ctx.moveTo(0, -p.size);
        ctx.lineTo(p.size, 0);
        ctx.lineTo(0, p.size);
        ctx.lineTo(-p.size, 0);
        ctx.closePath();
        ctx.fillStyle = `rgba(${p.r}, ${p.g}, ${p.b}, ${p.alpha})`;
        
        // Add subtle bloom glow shadow
        ctx.shadowBlur = 4;
        ctx.shadowColor = `rgba(${p.r}, ${p.g}, ${p.b}, ${p.alpha})`;
        ctx.fill();
        ctx.restore();
      }

      requestRef.current = requestAnimationFrame(animateParticles);
    };

    requestRef.current = requestAnimationFrame(animateParticles);

    // Cleanup events & timers
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(requestRef.current);
      observer.disconnect();
      const nodes = document.querySelectorAll('a, button, select, input, textarea, [role="button"], .cursor-pointer');
      nodes.forEach(node => {
        node.removeEventListener('mouseenter', handleMouseEnterLink);
        node.removeEventListener('mouseleave', handleMouseLeaveLink);
      });
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="custom-cursor-dot hidden lg:block" />
      <div ref={ringRef} className="custom-cursor-ring hidden lg:block" />
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[10000] hidden lg:block" />
    </>
  );
}


// ==========================================
// CINEMATIC GLOBAL NETWORK CANVAS COMPONENT
// ==========================================
function GlobalNetworkCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // LANDMASS DEFINITIONS FOR STYLIZED MAP
    const LANDMASSES = [
      // North America
      { cx: 12, cy: 18, rx: 6, ry: 4 },   // Alaska
      { cx: 22, cy: 15, rx: 8, ry: 6 },   // Northern Canada / Islands
      { cx: 38, cy: 12, rx: 5, ry: 6 },   // Greenland
      { cx: 17, cy: 26, rx: 6, ry: 5 },   // Canada / US Border (West)
      { cx: 25, cy: 26, rx: 6, ry: 5 },   // Canada / US Border (East)
      { cx: 22, cy: 33, rx: 7, ry: 5 },   // USA Midwest/South
      { cx: 26, cy: 35, rx: 3, ry: 4 },   // US East Coast / New York
      { cx: 28, cy: 40, rx: 2, ry: 3 },   // Florida / Caribbean
      { cx: 18, cy: 41, rx: 4, ry: 5 },   // Mexico
      { cx: 24, cy: 47, rx: 1.5, ry: 3 }, // Central America

      // South America
      { cx: 31, cy: 56, rx: 4, ry: 6 },   // North-West (Colombia/Ecuador/Peru)
      { cx: 37, cy: 59, rx: 7, ry: 8 },   // North-East (Brazil)
      { cx: 33, cy: 68, rx: 5, ry: 7 },   // Central South America
      { cx: 31, cy: 78, rx: 2.5, ry: 9 }, // Southern Cone (Argentina/Chile)

      // Europe
      { cx: 50, cy: 14, rx: 3, ry: 6 },   // Scandinavia
      { cx: 47.5, cy: 23, rx: 2, ry: 3 }, // United Kingdom & Ireland (covers London)
      { cx: 48, cy: 24, rx: 4, ry: 4 },   // Western Europe
      { cx: 54, cy: 21, rx: 6, ry: 6 },   // Eastern Europe / European Russia
      { cx: 50, cy: 28, rx: 5, ry: 3 },   // Southern Europe / Mediterranean

      // Africa
      { cx: 50, cy: 40, rx: 8, ry: 6 },   // North Africa
      { cx: 44, cy: 46, rx: 5, ry: 5 },   // West Africa
      { cx: 53, cy: 52, rx: 5, ry: 6 },   // Central Africa
      { cx: 58, cy: 48, rx: 4, ry: 5 },   // East Africa / Horn of Africa
      { cx: 54, cy: 65, rx: 4.5, ry: 8 }, // Southern Africa (covers Johannesburg)
      { cx: 60, cy: 66, rx: 1.5, ry: 4.5 }, // Madagascar

      // Middle East
      { cx: 58, cy: 41, rx: 4, ry: 4.5 },  // Arabian Peninsula (covers Dubai)
      { cx: 61, cy: 34, rx: 5, ry: 4 },   // Middle East / Iran / Central Asia

      // Asia
      { cx: 72, cy: 16, rx: 15, ry: 7 },  // Siberia / Northern Asia
      { cx: 70, cy: 24, rx: 10, ry: 5 },  // Central Asia / Mongolia
      { cx: 74, cy: 30, rx: 8, ry: 6 },   // China
      { cx: 66, cy: 38, rx: 4, ry: 5 },   // India
      { cx: 75, cy: 42, rx: 3.5, ry: 4.5 }, // Indochina / Southeast Asia
      { cx: 84.5, cy: 30, rx: 1.8, ry: 5 }, // Japan (covers Tokyo)
      { cx: 77, cy: 51, rx: 6, ry: 4 },   // Maritime Southeast Asia / Indonesia / Philippines (covers Singapore)

      // Australia & Oceania
      { cx: 84, cy: 70, rx: 7, ry: 6 },   // Australia main
      { cx: 86, cy: 74, rx: 3.5, ry: 3.5 }, // Sydney area / South-East Australia
      { cx: 91, cy: 79, rx: 1.5, ry: 4 }, // New Zealand

      // Antarctica
      { cx: 50, cy: 92, rx: 45, ry: 4 }   // Antarctica
    ];

    // CITIES
    const DESTINATIONS = [
      { name: "London", xPct: 0.50, yPct: 0.24 },
      { name: "New York", xPct: 0.25, yPct: 0.35 },
      { name: "Tokyo", xPct: 0.85, yPct: 0.32 },
      { name: "Singapore", xPct: 0.76, yPct: 0.54 },
      { name: "Sydney", xPct: 0.86, yPct: 0.76 },
      { name: "Johannesburg", xPct: 0.54, yPct: 0.70 }
    ];

    const dxP = 0.58; // Dubai
    const dyP = 0.42;

    // GENERATE MAP PARTICLES
    const points = [];
    const cols = 120;
    const rows = 60;
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        const xPct = c / cols;
        const yPct = r / rows;
        let isLand = false;
        for (const lm of LANDMASSES) {
          const dx = (xPct * 100 - lm.cx) / lm.rx;
          const dy = (yPct * 100 - lm.cy) / lm.ry;
          if (dx * dx + dy * dy <= 1) {
            isLand = true;
            break;
          }
        }
        if (isLand) {
          points.push({
            xPct,
            yPct,
            jitterX: (Math.random() - 0.5) * 0.15,
            jitterY: (Math.random() - 0.5) * 0.15,
            size: Math.random() * 0.6 + 0.8,
            phaseOffset: Math.random() * Math.PI * 2
          });
        }
      }
    }

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      canvas.width = parent.clientWidth;
      canvas.height = Math.max(500, Math.min(650, parent.clientWidth * 0.55));
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // EASING
    const easeInOutQuad = t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    const easeOutBounce = t => {
      const n1 = 7.5625;
      const d1 = 2.75;
      if (t < 1 / d1) {
        return n1 * t * t;
      } else if (t < 2 / d1) {
        return n1 * (t -= 1.5 / d1) * t + 0.75;
      } else if (t < 2.5 / d1) {
        return n1 * (t -= 2.25 / d1) * t + 0.9375;
      } else {
        return n1 * (t -= 2.625 / d1) * t + 0.984375;
      }
    };

    const getControlPoint = (x1, y1, x2, y2) => {
      const mx = (x1 + x2) / 2;
      const my = (y1 + y2) / 2;
      const dist = Math.hypot(x2 - x1, y2 - y1);
      return { x: mx, y: my - dist * 0.18 };
    };

    const getBezierPoint = (t, s, c, e) => {
      const u = 1 - t;
      return {
        x: u * u * s.x + 2 * u * t * c.x + t * t * e.x,
        y: u * u * s.y + 2 * u * t * c.y + t * t * e.y
      };
    };

    let start = null;

    const animate = (timestamp) => {
      if (!start) start = timestamp;
      const elapsed = (timestamp - start) / 1000;
      const loopTime = elapsed % 16.0;

      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;

      // Radial background
      const bgGrad = ctx.createRadialGradient(centerX, centerY, 50, centerX, centerY, Math.max(width, height) / 1.5);
      bgGrad.addColorStop(0, '#2b030b');
      bgGrad.addColorStop(1, '#0e0103');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      const gridSpacing = 40;
      for (let x = 0; x < width; x += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      let progress = 0;
      if (loopTime < 4) {
        progress = 0;
      } else if (loopTime >= 4 && loopTime < 6) {
        progress = easeInOutQuad((loopTime - 4) / 2);
      } else if (loopTime >= 6 && loopTime < 14) {
        progress = 1;
      } else if (loopTime >= 14 && loopTime < 16) {
        progress = easeInOutQuad(1 - (loopTime - 14) / 2);
      }

      const rotY = (loopTime * 0.4) % (Math.PI * 2);
      const rotX = 0.15;

      const flatW = width * 0.82;
      const flatH = height * 0.65;

      let zoom = 1.0;
      let panX = 0;
      let panY = 0;

      const dxbFlatX = (dxP - 0.5) * flatW + centerX;
      const dxbFlatY = (dyP - 0.5) * flatH + centerY;

      if (loopTime >= 6 && loopTime < 14) {
        const zoomProg = Math.min(1.0, (loopTime - 6) / 2.0);
        const easedZoom = easeInOutQuad(zoomProg);
        zoom = 1.0 + easedZoom * 0.32;
        panX = easedZoom * (centerX - dxbFlatX) * 0.28;
        panY = easedZoom * (centerY - dxbFlatY) * 0.28;
      } else if (loopTime >= 14 && loopTime < 16) {
        const zoomProg = (loopTime - 14) / 2.0;
        const easedZoom = easeInOutQuad(zoomProg);
        zoom = 1.32 - easedZoom * 0.32;
        panX = (1 - easedZoom) * (centerX - dxbFlatX) * 0.28;
        panY = (1 - easedZoom) * (centerY - dxbFlatY) * 0.28;
      }

      const R = Math.min(width, height) * 0.32;
      const D = R * 2.5;

      points.forEach(p => {
        const theta = p.xPct * Math.PI * 2 - Math.PI;
        const phi = p.yPct * Math.PI - Math.PI / 2;

        const xSphere = R * Math.cos(phi) * Math.sin(theta);
        const ySphere = R * Math.sin(phi);
        const zSphere = R * Math.cos(phi) * Math.cos(theta);

        const x1 = xSphere * Math.cos(rotY) - zSphere * Math.sin(rotY);
        const z1 = xSphere * Math.sin(rotY) + zSphere * Math.cos(rotY);

        const y2 = ySphere * Math.cos(rotX) - z1 * Math.sin(rotX);
        const z2 = ySphere * Math.sin(rotX) + z1 * Math.cos(rotX);

        const xProj = x1 * (D / (D + z2)) + centerX;
        const yProj = y2 * (D / (D + z2)) + centerY;

        const xFlat = (p.xPct - 0.5) * flatW + centerX + p.jitterX * 12;
        const yFlat = (p.yPct - 0.5) * flatH + centerY + p.jitterY * 12;

        let curX = (1 - progress) * xProj + progress * xFlat;
        let curY = (1 - progress) * yProj + progress * yFlat;

        const finalX = (curX - centerX) * zoom + centerX + panX;
        const finalY = (curY - centerY) * zoom + centerY + panY;

        if (progress < 0.05 && z2 > 0) return;

        let opacityFactor = 1.0;
        if (progress < 0.2) {
          const depthRatio = (z2 + R) / (2 * R);
          opacityFactor = 1 - Math.max(0, Math.min(1, depthRatio));
        }

        const shimmer = Math.sin(loopTime * 3.5 + p.phaseOffset) * 0.25 + 0.75;
        ctx.fillStyle = `rgba(242, 223, 162, ${opacityFactor * shimmer * (0.35 + progress * 0.25)})`;
        ctx.beginPath();
        ctx.arc(finalX, finalY, p.size * (progress * 0.15 + 0.85), 0, Math.PI * 2);
        ctx.fill();
      });

      const dxbDrawX = (dxbFlatX - centerX) * zoom + centerX + panX;
      const dxbDrawY = (dxbFlatY - centerY) * zoom + centerY + panY;

      if (progress > 0.95 && loopTime >= 6.2 && loopTime < 14) {
        const dropDur = 0.6;
        const dropProg = Math.min(1.0, (loopTime - 6.2) / dropDur);
        
        if (loopTime >= 6.6) {
          const rippleProg = ((loopTime - 6.6) % 1.8) / 1.8;
          ctx.strokeStyle = `rgba(201, 162, 77, ${1 - rippleProg})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(dxbDrawX, dxbDrawY, rippleProg * 45, 0, Math.PI * 2);
          ctx.stroke();

          if (loopTime >= 7.2) {
            const rippleProg2 = ((loopTime - 7.2) % 1.8) / 1.8;
            ctx.strokeStyle = `rgba(201, 162, 77, ${(1 - rippleProg2) * 0.6})`;
            ctx.beginPath();
            ctx.arc(dxbDrawX, dxbDrawY, rippleProg2 * 35, 0, Math.PI * 2);
            ctx.stroke();
          }
        }

        const pinHeight = 20;
        const bounceY = (1 - easeOutBounce(dropProg)) * -50;
        const py = dxbDrawY + bounceY;

        ctx.save();
        ctx.fillStyle = 'rgba(0,0,0,0.4)';
        ctx.beginPath();
        ctx.ellipse(dxbDrawX, dxbDrawY + 1.5, 5 * dropProg, 1.5 * dropProg, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#C9A24D';
        ctx.strokeStyle = '#F2DFA2';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(dxbDrawX, py);
        ctx.bezierCurveTo(dxbDrawX - 6, py - 10, dxbDrawX - 6, py - pinHeight, dxbDrawX, py - pinHeight);
        ctx.bezierCurveTo(dxbDrawX + 6, py - pinHeight, dxbDrawX + 6, py - 10, dxbDrawX, py);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#37060F';
        ctx.beginPath();
        ctx.arc(dxbDrawX, py - pinHeight + 6, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      if (progress > 0.95 && loopTime >= 6.8 && loopTime < 14) {
        const connDuration = 1.5;
        const connProg = Math.min(1.0, (loopTime - 6.8) / connDuration);

        DESTINATIONS.forEach((dest, i) => {
          const dFlatX = (dest.xPct - 0.5) * flatW + centerX;
          const dFlatY = (dest.yPct - 0.5) * flatH + centerY;

          const dDrawX = (dFlatX - centerX) * zoom + centerX + panX;
          const dDrawY = (dFlatY - centerY) * zoom + centerY + panY;

          const cp = getControlPoint(dxbDrawX, dxbDrawY, dDrawX, dDrawY);

          ctx.save();
          const lineGrad = ctx.createLinearGradient(dxbDrawX, dxbDrawY, dDrawX, dDrawY);
          lineGrad.addColorStop(0, 'rgba(201, 162, 77, 0.7)');
          lineGrad.addColorStop(1, 'rgba(255, 255, 255, 0.15)');
          
          ctx.strokeStyle = lineGrad;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(dxbDrawX, dxbDrawY);

          const resolution = 30;
          const endT = connProg;
          for (let step = 0; step <= resolution; step++) {
            const tVal = (step / resolution) * endT;
            const pt = getBezierPoint(tVal, { x: dxbDrawX, y: dxbDrawY }, cp, { x: dDrawX, y: dDrawY });
            ctx.lineTo(pt.x, pt.y);
          }
          ctx.stroke();
          ctx.restore();

          if (loopTime >= 7.2) {
            ctx.save();
            ctx.fillStyle = 'rgba(255,255,255,0.7)';
            ctx.beginPath();
            ctx.arc(dDrawX, dDrawY, 3, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = 'rgba(242, 223, 162, 0.9)';
            ctx.font = '8px monospace';
            ctx.fillText(dest.name.toUpperCase(), dDrawX + 6, dDrawY + 3);
            ctx.restore();
          }

          if (loopTime >= 7.5) {
            const pulseProg = ((loopTime - 7.5) % 2.0) / 2.0;
            const pulsePt = getBezierPoint(pulseProg, { x: dxbDrawX, y: dxbDrawY }, cp, { x: dDrawX, y: dDrawY });

            ctx.save();
            ctx.shadowBlur = 8;
            ctx.shadowColor = '#F2DFA2';
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(pulsePt.x, pulsePt.y, 2.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        });
      }

      ctx.save();
      ctx.font = '9px monospace';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';

      ctx.fillStyle = 'rgba(242, 223, 162, 0.7)';
      ctx.fillText('NETWORK_HUB: DUBAI CENTRAL', 20, 30);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.fillText(`STATUS: LIVE SYNERGY (${progress > 0.95 ? 'FLAT_MAP_DASHBOARD' : 'SPHERE_ROTATION_MODE'})`, 20, 45);
      ctx.fillText(`ROT_ANGLE: ${(rotY * 180 / Math.PI).toFixed(0)}°`, 20, 60);

      ctx.fillStyle = 'rgba(242, 223, 162, 0.7)';
      ctx.fillText(`ACTIVE GATEWAYS: ${loopTime >= 7.2 ? '6 / 6 ESTABLISHED' : 'CONNECTING...'}`, width - 180, 30);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.fillText(`SYSTEM LOAD: ${(45.2 + Math.sin(loopTime * 1.5) * 2.3).toFixed(1)} GB/S`, width - 180, 45);
      ctx.fillText(`LATENCY: ${(34 + Math.sin(loopTime * 4) * 2).toFixed(0)}MS (EXCELLENT)`, width - 180, 60);

      ctx.strokeStyle = 'rgba(201, 162, 77, 0.25)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(20, height - 40);
      for (let i = 0; i < 12; i++) {
        const yVal = Math.sin((loopTime * 3) + i * 0.6) * 12 + 18;
        ctx.lineTo(20 + i * 10, height - 20 - yVal);
      }
      ctx.stroke();
      ctx.fillText('GLOBAL OPERATIONS THROUGHPUT', 20, height - 10);

      ctx.fillText('HUB GPS COORDINATES', width - 150, height - 40);
      ctx.fillStyle = 'rgba(242, 223, 162, 0.8)';
      ctx.fillText('LAT: 25.2048° N', width - 150, height - 25);
      ctx.fillText('LON: 55.2708° E', width - 150, height - 10);

      ctx.restore();

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="w-full block select-none cursor-crosshair relative z-20"
      style={{ minHeight: '520px' }}
    />
  );
}


export default function App() {
  // ==========================================
  // STATE MANAGEMENT
  // ==========================================
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isTestimonialHovered, setIsTestimonialHovered] = useState(false);
  const [formStatus, setFormStatus] = useState({ loading: false, submitted: false });
  const [activeNavSection, setActiveNavSection] = useState('home');
  const [allowScrollHome, setAllowScrollHome] = useState(false);
  const [activeJourneyStep, setActiveJourneyStep] = useState(0);
  const [selectedJob, setSelectedJob] = useState(null);
  const [careerFormStatus, setCareerFormStatus] = useState({ loading: false, submitted: false });

  // Testimonial Autoplay Ref
  const autoplayRef = useRef(null);

  // Testimonials data
  const testimonials = [
    {
      heading: "Career Transformation",
      text: "My time at Beever Academy redefined my career path. The industry-focused training and hands-on projects allowed me to transition into high-end finance seamlessly.",
      name: "Victoria Kincaid",
      meta: "Investment Banking Associate",
      rating: 5,
      img: "/student_avatar_woman.png"
    },
    {
      heading: "Professional Growth",
      text: "The mentorship and expert guidance here helped me build both technical depth and leadership confidence. The network of industry leaders is unmatched.",
      name: "Charles Harrison",
      meta: "Senior Tech Consultant",
      rating: 5,
      img: "/student_avatar_man.png"
    },
    {
      heading: "Industry Success",
      text: "Thanks to the real-world insights shared by specialists, I was able to solve critical challenges at my startup from day one. Truly career-ready skills.",
      name: "Aravind Sharma",
      meta: "Co-Founder, Fintech Solutions",
      rating: 5,
      img: "/student_avatar_young.png"
    }
  ];

  // ==========================================
  // EFFECT HOOKS
  // ==========================================

  // Loading Screen Timer
  useEffect(() => {
    const handleLoadComplete = () => {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000); // Luxury branding delay
    };

    if (document.readyState === 'complete') {
      handleLoadComplete();
    } else {
      window.addEventListener('load', handleLoadComplete);
      return () => window.removeEventListener('load', handleLoadComplete);
    }
  }, []);

  // Hash Change SPA Routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '' || hash === '#/' || hash === '#home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const id = hash.substring(1);
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Run once initially

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Navbar Scroll Trigger
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      // Track active section for navbar highlighting
      const sections = ['home', 'about', 'programs', 'admissions', 'blog', 'careers', 'contact'];
      const scrollY = window.pageYOffset;
      
      for (const sectionId of sections) {
        const current = document.getElementById(sectionId);
        if (current) {
          const sectionHeight = current.offsetHeight;
          const sectionTop = current.offsetTop - 150;
          if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            setActiveNavSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // GSAP Animations once loader is gone or page changes
  useEffect(() => {
    if (!isLoading) {
      // Clear previous ScrollTriggers to prevent duplicates/errors on page changes
      ScrollTrigger.getAll().forEach(t => t.kill());

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      // 1. Hero Load Animations (Only if on Home page)
      if (currentPage === 'home') {
        const heroTl = gsap.timeline();
        if (prefersReducedMotion) {
          heroTl.fromTo('.hero-heading', { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power1.inOut', overwrite: 'auto' })
                .fromTo('.hero-desc', { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power1.inOut', overwrite: 'auto' }, '-=0.35')
                .fromTo('.hero-btn', { opacity: 0 }, { opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power1.inOut', overwrite: 'auto' }, '-=0.35')
                .fromTo('.hero-feature-item', { opacity: 0 }, { opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power1.inOut', overwrite: 'auto' }, '-=0.35');
        } else {
          heroTl.fromTo('.hero-heading', { opacity: 0 }, { opacity: 1, duration: 0.6, ease: 'power1.inOut', overwrite: 'auto' })
                .fromTo('.hero-desc', { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power1.inOut', overwrite: 'auto' }, '-=0.4')
                .fromTo('.hero-btn', { y: 5, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.15, ease: 'power1.inOut', overwrite: 'auto' }, '-=0.4')
                .fromTo('.hero-feature-item', { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power1.inOut', overwrite: 'auto' }, '-=0.3');
                
          // Subtle background zoom
          gsap.to('.hero-bg-img', { scale: 1.02, duration: 6, ease: 'power1.inOut' });
        }
      }

      // 2. Features entrance
      if (document.querySelector('.features-grid-el')) {
        gsap.fromTo('.feature-card-el', 
          { y: prefersReducedMotion ? 0 : 20, opacity: 0 },
          {
            scrollTrigger: { trigger: '.features-grid-el', start: 'top 85%' },
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.1,
            ease: 'power1.inOut',
            overwrite: 'auto'
          }
        );
      }

      // 3. Strengths Cards Stagger
      if (document.querySelector('.strengths-grid-el')) {
        gsap.fromTo('.strength-card-el', 
          { y: prefersReducedMotion ? 0 : 25, opacity: 0 },
          {
            scrollTrigger: { trigger: '.strengths-grid-el', start: 'top 85%' },
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.1,
            ease: 'power1.inOut',
            overwrite: 'auto'
          }
        );
      }

      // 4. Learning Journey Timeline steps stagger
      if (document.querySelector('.journey-timeline-el')) {
        gsap.fromTo('.journey-step-el', 
          { scale: prefersReducedMotion ? 1 : 0.9, opacity: 0 },
          {
            scrollTrigger: { trigger: '.journey-timeline-el', start: 'top 85%' },
            scale: 1,
            opacity: 1,
            duration: 0.6,
            stagger: 0.15,
            ease: 'power1.inOut',
            overwrite: 'auto'
          }
        );
      }

      // 5. Inside Gallery Cards
      if (document.querySelector('.inside-grid-el')) {
        gsap.fromTo('.inside-card-el', 
          { y: prefersReducedMotion ? 0 : 20, opacity: 0 },
          {
            scrollTrigger: { trigger: '.inside-grid-el', start: 'top 85%' },
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.1,
            ease: 'power1.inOut',
            overwrite: 'auto'
          }
        );
      }

      // 5.5. Careers Cards (Slide in towards the left)
      if (document.querySelector('.careers-grid-el')) {
        gsap.fromTo('.career-card-el', 
          { x: prefersReducedMotion ? 0 : 80, opacity: 0 },
          {
            scrollTrigger: { trigger: '.careers-grid-el', start: 'top 85%' },
            x: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.15,
            ease: 'power2.out',
            overwrite: 'auto'
          }
        );
      }

      // 6. About animations
      if (document.querySelector('.about-grid-el')) {
        gsap.fromTo('.about-img-box-el', 
          { x: prefersReducedMotion ? 0 : -30, opacity: 0 },
          {
            scrollTrigger: { trigger: '.about-grid-el', start: 'top 80%', once: true },
            x: 0,
            opacity: 1,
            duration: 0.6,
            ease: 'power1.inOut',
            overwrite: 'auto'
          }
        );
        gsap.fromTo('.about-text-el', 
          { x: prefersReducedMotion ? 0 : 30, opacity: 0 },
          {
            scrollTrigger: { trigger: '.about-grid-el', start: 'top 80%', once: true },
            x: 0,
            opacity: 1,
            duration: 0.6,
            ease: 'power1.inOut',
            overwrite: 'auto'
          }
        );
      }

      // 7. Footer fade-in
      gsap.fromTo('footer', 
        { opacity: 0 },
        {
          scrollTrigger: { trigger: 'footer', start: 'top 95%' },
          opacity: 1,
          duration: 0.6,
          ease: 'power1.inOut',
          overwrite: 'auto'
        }
      );

      // Refresh ScrollTrigger after a short delay to ensure correct calculations
      const timer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 500);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [isLoading]);

  // Testimonials slide autoplay loops
  useEffect(() => {
    if (!isTestimonialHovered) {
      startAutoplay();
    } else {
      clearInterval(autoplayRef.current);
    }
    return () => clearInterval(autoplayRef.current);
  }, [currentTestimonial, isTestimonialHovered]);

  const startAutoplay = () => {
    clearInterval(autoplayRef.current);
    autoplayRef.current = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 6000);
  };

  const handleTestimonialNav = (dir) => {
    setCurrentTestimonial(prev => (prev + dir + testimonials.length) % testimonials.length);
  };

  // Form submission handler
  const handleInquirySubmit = (e) => {
    e.preventDefault();
    setFormStatus({ loading: true, submitted: false });
    
    setTimeout(() => {
      setFormStatus({ loading: false, submitted: true });
      alert('Thank you for your interest in Beever Academy. A senior admissions advisor will contact you within 24 business hours.');
      e.target.reset();
    }, 1500);
  };

  // ==========================================
  // SECTION RENDER FUNCTIONS
  // ==========================================
  
  const renderHero = () => (
    <section id="home" className="relative min-h-screen bg-[#1a0206] flex flex-col justify-between overflow-hidden pt-32 pb-6 text-white">
      {/* Background Image & Overlays */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div 
          className="hero-bg-img absolute top-24 md:top-28 inset-x-0 bottom-0 bg-cover bg-[position:75%_15%] md:bg-cover bg-no-repeat opacity-95 scale-100 z-0"
          style={{ backgroundImage: `url(${homeImg})`, filter: 'brightness(1.15) contrast(1.12) saturate(1.18)' }}
        ></div>
        {/* Darker burgundy gradient with a subtle fade on the left */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a0206_0%,rgba(26,2,6,0.8)_15%,rgba(26,2,6,0.15)_35%,transparent_60%)] z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a0206] via-transparent to-[#1a0206]/20 z-10"></div>
      </div>
      
      {/* Main Copy Area */}
      <div className="relative w-full px-4 sm:px-6 md:px-10 z-20 flex-grow flex flex-col justify-center">
        <div className="max-w-[700px] text-left mt-6 md:mt-12">
          <h1 className="hero-heading text-5xl md:text-7xl lg:text-[76px] font-serif leading-[1.1] mb-8 font-medium">
            LEARN TODAY,<br/>
            <span className="gold-gradient-text font-bold">LEAD TOMORROW.</span>
          </h1>
          <p className="hero-desc text-base md:text-lg font-light text-text-light/90 mb-10 max-w-[580px] leading-relaxed">
            Dubai's premium academy for financial markets, professional skills and personal growth. Practical education. Real insights. Future ready.
          </p>
          <div className="flex flex-wrap gap-5">
            <a href="#programs" className="hero-btn btn btn-gold gold-gradient-bg text-burgundy-dark px-8 py-4 font-semibold uppercase tracking-widest shadow-lg hover:shadow-xl hover:-translate-y-[2px] transition-all duration-300 flex items-center gap-2">
              <span>Start Your Journey</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a href="#contact" className="hero-btn btn border border-gold/40 text-gold-light hover:bg-white/5 px-8 py-4 font-semibold uppercase tracking-widest hover:-translate-y-[2px] transition-all duration-300 flex items-center gap-2">
              <svg className="w-4.5 h-4.5 text-gold-light" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="16" y1="2" x2="16" y2="6" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="8" y1="2" x2="8" y2="6" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="3" y1="10" x2="21" y2="10" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>Book a Consultation</span>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Features Row & Scroll Indicator */}
      <div className="relative z-20 w-full px-4 sm:px-6 md:px-10 mt-auto pt-6 flex flex-col gap-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 pt-8 border-t border-white/10 text-left">
          {/* Feature 1 */}
          <div className="hero-feature-item flex gap-4 items-start">
            <div className="p-2.5 bg-white/5 rounded-lg border border-gold/20 text-gold flex-shrink-0">
              <MapPin className="w-5 h-5 text-gold" strokeWidth={1.5} />
            </div>
            <div>
              <h4 className="font-serif text-sm font-bold text-gold uppercase tracking-wider mb-1">Dubai Based</h4>
              <p className="text-xs text-white/70 leading-relaxed">Located in the heart of Dubai's business district.</p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="hero-feature-item flex gap-4 items-start">
            <div className="p-2.5 bg-white/5 rounded-lg border border-gold/20 text-gold flex-shrink-0">
              <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3L2 8h20L12 3zM4 10h2v10H4V10zm5 0h2v10H9V10zm6 0h2v10h-2V10zm5 0h2v10h-2V10zM2 21h20" />
              </svg>
            </div>
            <div>
              <h4 className="font-serif text-sm font-bold text-gold uppercase tracking-wider mb-1">Modern Environment</h4>
              <p className="text-xs text-white/70 leading-relaxed">State-of-the-art classrooms for focused learning.</p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="hero-feature-item flex gap-4 items-start">
            <div className="p-2.5 bg-white/5 rounded-lg border border-gold/20 text-gold flex-shrink-0">
              <TrendingUp className="w-5 h-5 text-gold" strokeWidth={1.5} />
            </div>
            <div>
              <h4 className="font-serif text-sm font-bold text-gold uppercase tracking-wider mb-1">Industry Focused</h4>
              <p className="text-xs text-white/70 leading-relaxed">Practical training aligned with real market needs.</p>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="hero-feature-item flex gap-4 items-start">
            <div className="p-2.5 bg-white/5 rounded-lg border border-gold/20 text-gold flex-shrink-0">
              <Users className="w-5 h-5 text-gold" strokeWidth={1.5} />
            </div>
            <div>
              <h4 className="font-serif text-sm font-bold text-gold uppercase tracking-wider mb-1">Community Driven</h4>
              <p className="text-xs text-white/70 leading-relaxed">Learn, grow and network with like-minded people.</p>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="text-center pt-2">
          <a href="#why-choose-us" className="inline-flex flex-col items-center gap-2 cursor-pointer" aria-label="Scroll Down">
            <span className="w-[20px] h-[34px] border border-white/40 rounded-[10px] relative block">
              <span className="w-[3px] h-[6px] bg-gold rounded-[1px] absolute top-1.5 left-1/2 -translate-x-1/2 animate-mouse-scroll"></span>
            </span>
            <span className="text-[9px] uppercase tracking-[0.2em] text-white/40 font-semibold">Scroll to Explore</span>
          </a>
        </div>
      </div>
    </section>
  );

  const renderWhyChooseUs = () => (
    <section id="why-choose-us" className="py-32 bg-white text-center">
      <div className="max-w-[1440px] mx-auto px-8">
        <div className="mb-20">
          <span className="font-sans uppercase text-gold-dark text-[11px] tracking-[0.2em] font-semibold block mb-3">
            Heritage of Distinction
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-burgundy mb-6">
            Why Choose Beever Academy?
          </h2>
          <div className="w-[80px] h-[2px] bg-gold-gradient mx-auto"></div>
        </div>

        <div className="features-grid-el grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {[
            {
              icon: <BookOpen className="w-[28px] h-[28px] text-burgundy group-hover:text-gold group-hover:scale-105 transition-all duration-300" />,
              title: "Industry-Focused Training",
              desc: "Learn practical skills through real-world projects, case studies, and hands-on learning experiences."
            },
            {
              icon: <Award className="w-[28px] h-[28px] text-burgundy group-hover:text-gold group-hover:scale-105 transition-all duration-300" />,
              title: "10+ Years of Combined Experience",
              desc: "Gain knowledge from professionals with over a decade of industry expertise."
            },
            {
              icon: <Users className="w-[28px] h-[28px] text-burgundy group-hover:text-gold group-hover:scale-105 transition-all duration-300" />,
              title: "Expert-Led Learning",
              desc: "Learn directly from specialists from diverse industry backgrounds and domains."
            },
            {
              icon: <Briefcase className="w-[28px] h-[28px] text-burgundy group-hover:text-gold group-hover:scale-105 transition-all duration-300" />,
              title: "Career-Oriented Approach",
              desc: "Bridge the gap between theory and application with training designed for professional success."
            }
          ].map((feat, i) => (
            <div key={i} className="feature-card-el bg-white p-10 border border-black/5 rounded-2xl shadow-sm hover:-translate-y-[5px] hover:shadow-xl hover:border-gold/30 transition-all duration-300 group relative overflow-hidden z-10">
              <div className="w-[65px] h-[65px] bg-ivory rounded-full border border-burgundy/8 flex justify-center items-center mb-8 mx-auto group-hover:bg-burgundy group-hover:border-burgundy transition-all duration-300">
                {feat.icon}
              </div>
              <h3 className="text-xl font-serif text-burgundy mb-4">{feat.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{feat.desc}</p>
              <div className="absolute inset-0 border border-gold opacity-0 group-hover:opacity-40 rounded-2xl shadow-[inset_0_0_15px_rgba(201,162,77,0.1)] transition-all duration-300 z-[-1]"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const renderAbout = () => (
    <section id="about" className="py-32 bg-ivory">
      <div className="max-w-[1440px] mx-auto px-8">
        <div className="about-grid-el grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Visual Column */}
          <div className="about-img-box-el relative border border-burgundy/10 p-[15px] bg-white shadow-md rounded-2xl">
            <img src="/hero_building.png" alt="Grand Academy Facade" className="w-full h-[280px] sm:h-[380px] lg:h-[480px] object-cover rounded-xl" />
            
            {/* Overlay Glass Card */}
            <div className="about-glass-card-el absolute -bottom-10 right-4 lg:-right-10 w-[280px] bg-burgundy/90 backdrop-blur-[12px] border border-gold/30 p-8 shadow-2xl text-white rounded-2xl hidden sm:block">
              <div className="relative">
                <h4 className="font-serif text-2xl text-gold mb-3">Education For Life</h4>
                <p className="text-xs text-text-light leading-relaxed">Transforming knowledge into success through practical, industry-focused programs.</p>
                <Sparkles className="absolute -top-[10px] -right-[10px] w-[35px] h-[35px] text-gold/20" />
              </div>
            </div>
          </div>

          {/* Content Column */}
          <div className="about-text-el">
            <span className="font-sans uppercase text-gold-dark text-[11px] tracking-[0.2em] font-semibold block mb-3">
              Since 2016
            </span>
            <h2 className="text-4xl md:text-5xl font-serif text-burgundy mb-6 font-medium">
              About Beever Academy
            </h2>
            <div className="w-[80px] h-[2px] bg-gold-gradient mb-8"></div>
            
            <div className="text-sm text-text-secondary leading-relaxed flex flex-col gap-6 mb-10 text-justify">
              <p>
                At Beever Academy, we are committed to transforming knowledge into success. Backed by a team of professionals with over 10 years of combined industry experience, we deliver practical, industry-focused training designed to equip individuals with the skills needed to thrive in a rapidly evolving world.
              </p>
              <p>
                Our team consists of specialists from different areas of the industry, bringing diverse expertise, real-world experience, and valuable insights into every training program we offer.
              </p>
              <p>
                We focus on bridging the gap between learning and application, ensuring that our students gain not only knowledge but also the confidence to apply it effectively.
              </p>
              <p>
                Whether you are starting your journey or advancing your professional career, Beever Academy provides the guidance, expertise, and learning environment needed to help you achieve your goals.
              </p>
            </div>

            {/* Stats Highlights Grid */}
            <div className="grid grid-cols-2 gap-6 border-t border-burgundy/10 pt-8">
              <div>
                <div className="font-serif text-4xl font-bold text-burgundy mb-1">10+ Years</div>
                <div className="font-sans text-[11px] uppercase tracking-wider text-gold-dark font-semibold">Combined Experience</div>
              </div>
              <div>
                <div className="font-serif text-4xl font-bold text-burgundy mb-1">100%</div>
                <div className="font-sans text-[11px] uppercase tracking-wider text-gold-dark font-semibold">Industry Experts</div>
              </div>
              <div>
                <div className="font-serif text-4xl font-bold text-burgundy mb-1">Hands-On</div>
                <div className="font-sans text-[11px] uppercase tracking-wider text-gold-dark font-semibold">Practical Training</div>
              </div>
              <div>
                <div className="font-serif text-4xl font-bold text-burgundy mb-1">Success</div>
                <div className="font-sans text-[11px] uppercase tracking-wider text-gold-dark font-semibold">Career-Focused Learning</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  const renderGlobalNetwork = () => (
    <section id="global-network" className="py-32 bg-[#170105] text-center text-white relative overflow-hidden">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a0206] via-transparent to-[#1a0206] pointer-events-none z-10"></div>
      
      <div className="max-w-[1440px] mx-auto px-8 relative z-20">
        <div className="mb-16">
          <span className="font-sans uppercase text-gold-light text-[11px] tracking-[0.2em] font-semibold block mb-3">
            Global Connectivity Hub
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-white mb-6 font-bold">
            Beever Academy Network
          </h2>
          <div className="w-[80px] h-[2px] bg-gold-gradient mx-auto mb-4"></div>
          <p className="text-sm text-white/70 max-w-[650px] mx-auto leading-relaxed">
            Connecting Dubai to the world. Charting live knowledge pathways and professional synergies across major global markets.
          </p>
        </div>

        {/* Dynamic Interactive Canvas */}
        <div className="w-full bg-[#1b0207] border border-gold/15 rounded-2xl overflow-hidden shadow-2xl relative">
          <GlobalNetworkCanvas />
        </div>
      </div>
    </section>
  );

  const renderStrengths = () => (
    <section id="programs" className="py-32 bg-white text-center">
      <div className="max-w-[1440px] mx-auto px-8">
        <div className="mb-20">
          <span className="font-sans uppercase text-gold-dark text-[11px] tracking-[0.2em] font-semibold block mb-3">
            Elite Competencies
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-burgundy mb-6">
            Our Strengths
          </h2>
          <div className="w-[80px] h-[2px] bg-gold-gradient mx-auto"></div>
        </div>

        <div className="strengths-grid-el grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-16">
          {[
            {
              title: "Practical Learning",
              desc: "Industry-relevant knowledge that can be applied immediately.",
              img: "/campus_classroom.png"
            },
            {
              title: "Diverse Expertise",
              desc: "Training delivered by specialists from multiple sectors and disciplines.",
              img: "/library_students.png"
            },
            {
              title: "Real-World Insights",
              desc: "Learn from actual industry experiences, challenges, and solutions.",
              img: "/campus_innovation.png"
            },
            {
              title: "Professional Growth",
              desc: "Develop confidence, leadership, and career-ready skills.",
              img: "/campus_sports.png"
            },
            {
              title: "Future-Ready Skills",
              desc: "Stay ahead in a rapidly evolving professional landscape.",
              img: "/campus_events.png"
            }
          ].map((strength, i) => (
            <div key={i} className="strength-card-el bg-white border border-black/5 rounded-2xl overflow-hidden shadow-sm hover:-translate-y-2 hover:shadow-xl hover:border-gold/30 transition-all duration-300 flex flex-col justify-between group">
              <div className="relative overflow-hidden h-[180px]">
                <img src={strength.img} alt={strength.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="p-6 text-left flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-serif text-burgundy mb-2 font-semibold">{strength.title}</h3>
                  <p className="text-xs text-text-secondary leading-relaxed mb-6">{strength.desc}</p>
                </div>
                <a href="#contact" className="inline-flex items-center gap-2 font-sans text-[11px] uppercase tracking-wider font-semibold text-burgundy hover:text-gold-dark transition-colors duration-200 mt-auto">
                  <span>Explore More</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <a href="#contact" className="btn btn-gold gold-gradient-bg text-burgundy-dark px-12 py-4 font-semibold uppercase tracking-widest shadow-md hover:shadow-lg hover:-translate-y-[2px] transition-all duration-300">
            View All Programs
          </a>
        </div>
      </div>
    </section>
  );

  const renderJourney = () => {
    const journeySteps = [
      {
        step: "01",
        label: "Market Analysis",
        phase: "Learn",
        desc: "Master the fundamentals of market mechanics, order books, and price action dynamics.",
        icon: <BookOpen className="w-5 h-5" />,
        value: "$1,000",
        x: 100,
        y: 280,
        candle: { open: 290, close: 270, high: 260, low: 300 }
      },
      {
        step: "02",
        label: "Risk & Probability",
        phase: "Understand",
        desc: "Formulate quantitative models, risk-management rules, and risk-reward strategies.",
        icon: <Shield className="w-5 h-5" />,
        value: "$2,500",
        x: 300,
        y: 230,
        candle: { open: 245, close: 215, high: 200, low: 260 }
      },
      {
        step: "03",
        label: "Live Simulation",
        phase: "Apply",
        desc: "Execute trades in real-time simulated environments to test discipline and emotional control.",
        icon: <Monitor className="w-5 h-5" />,
        value: "$5,000",
        x: 500,
        y: 170,
        candle: { open: 190, close: 150, high: 130, low: 210 }
      },
      {
        step: "04",
        label: "Capital Allocation",
        phase: "Grow",
        desc: "Scale position sizes safely, manage leverage, and diversify multi-asset portfolios.",
        icon: <TrendingUp className="w-5 h-5" />,
        value: "$12,000",
        x: 700,
        y: 100,
        candle: { open: 120, close: 80, high: 60, low: 140 }
      },
      {
        step: "05",
        label: "Fund Management",
        phase: "Lead",
        desc: "Direct trading desks, manage proprietary firm capital, and build professional market operations.",
        icon: <Trophy className="w-5 h-5" />,
        value: "$50,000",
        x: 900,
        y: 40,
        candle: { open: 55, close: 25, high: 10, low: 70 }
      }
    ];

    const activeStepData = journeySteps[activeJourneyStep];

    return (
      <section id="admissions" className="py-32 bg-ivory text-center relative overflow-hidden">
        {/* Decorative background grid subtle effect */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(90,15,29,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(90,15,29,0.015)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>

        <div className="max-w-[1440px] mx-auto px-8 relative z-10">
          <div className="mb-16">
            <span className="font-sans uppercase text-gold-dark text-[11px] tracking-[0.2em] font-semibold block mb-3 animate-pulse">
              Strategic Progression
            </span>
            <h2 className="text-4xl md:text-5xl font-serif text-burgundy mb-6 font-bold">
              Your Learning Journey
            </h2>
            <div className="w-[80px] h-[2px] bg-gold-gradient mx-auto mb-4"></div>
            <p className="text-sm text-text-secondary max-w-[600px] mx-auto leading-relaxed">
              Track your development from foundations to prop-firm management on our proprietary academy chart.
            </p>
          </div>

          {/* Desktop/Tablet Trading Terminal Layout */}
          <div className="journey-timeline-el hidden md:block mb-12">
            <div className="bg-white border border-burgundy/10 rounded-2xl shadow-xl overflow-hidden transition-all duration-500 hover:shadow-2xl">
              
              {/* Terminal Header Bar */}
              <div className="bg-burgundy-dark text-white px-6 py-4 flex flex-wrap items-center justify-between gap-4 font-sans text-xs border-b border-white/10 shadow-inner select-none">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
                  <span className="font-bold tracking-wider text-[10px] text-white/90">BEEVER TERMINAL v4.2</span>
                </div>
                <div className="flex items-center gap-6 overflow-x-auto py-1 whitespace-nowrap scrollbar-none text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <span className="text-white/40 font-medium">PAIR:</span>
                    <span className="font-semibold text-gold font-mono">BEEV/USD</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-white/40 font-medium">GROWTH:</span>
                    <span className="font-semibold text-emerald-400 font-mono">+5,000%</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-white/40 font-medium">STATUS:</span>
                    <span className="font-semibold text-emerald-400 font-mono tracking-wider">UPTREND CONFIRMED</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-white/40 font-medium">SHARPE RATIO:</span>
                    <span className="font-semibold text-gold font-mono">3.82</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-white/40 font-medium">RSI(14):</span>
                    <span className="font-semibold text-white/90 font-mono">68.2 (BULLISH)</span>
                  </div>
                </div>
              </div>

              {/* Legend Indicator */}
              <div className="flex items-center gap-5 text-[10px] text-burgundy/60 border-b border-burgundy/5 px-6 py-2.5 bg-ivory/30 select-none">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-1.5 rounded-sm bg-emerald-500"></span>
                  <span>Bullish Candlestick</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-0.5 bg-gradient-to-r from-burgundy to-gold"></span>
                  <span>Skill Growth Trendline</span>
                </div>
                <div className="flex items-center gap-1.5 font-semibold text-burgundy">
                  <span className="w-2.5 h-2.5 rounded-full border border-gold bg-white flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-burgundy"></span>
                  </span>
                  <span>Active Phase (Step ${activeStepData.step})</span>
                </div>
              </div>

              {/* Chart Screen (SVG) */}
              <div className="p-6 md:p-8 bg-white relative overflow-hidden select-none">
                <svg viewBox="0 0 1000 350" className="w-full h-auto overflow-visible">
                  {/* Defs for gradients and filters */}
                  <defs>
                    <filter id="chartGlow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="4" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                    <linearGradient id="curveGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#5A0F1D" />
                      <stop offset="100%" stopColor="#C9A24D" />
                    </linearGradient>
                    <linearGradient id="areaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#C9A24D" stopOpacity="0.12" />
                      <stop offset="100%" stopColor="#C9A24D" stopOpacity="0.0" />
                    </linearGradient>
                    <linearGradient id="activeCandleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#C9A24D" />
                      <stop offset="100%" stopColor="#A88135" />
                    </linearGradient>
                    <linearGradient id="normalCandleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#34D399" />
                      <stop offset="100%" stopColor="#059669" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal grid lines */}
                  {[40, 110, 180, 250, 320].map((yVal, index) => (
                    <g key={`grid-h-${index}`}>
                      <line x1={50} y1={yVal} x2={950} y2={yVal} stroke="#5A0F1D" strokeOpacity="0.04" strokeWidth="1" />
                      <text x={960} y={yVal + 3} fill="#5A0F1D" fillOpacity="0.4" fontSize={9} fontFamily="monospace" textAnchor="start">
                        {index === 0 && "$50,000"}
                        {index === 1 && "$12,000"}
                        {index === 2 && "$5,000"}
                        {index === 3 && "$2,500"}
                        {index === 4 && "$1,000"}
                      </text>
                    </g>
                  ))}

                  {/* Vertical grid lines */}
                  {[100, 300, 500, 700, 900].map((xVal, index) => (
                    <line key={`grid-v-${index}`} x1={xVal} y1={20} x2={xVal} y2={320} stroke="#5A0F1D" strokeOpacity="0.04" strokeWidth="1" />
                  ))}

                  {/* Shaded Area Under the Curve */}
                  <path 
                    d="M 100,280 C 200,260 200,230 300,230 C 400,230 400,170 500,170 C 600,170 600,100 700,100 C 800,100 800,40 900,40 L 900,320 L 100,320 Z" 
                    fill="url(#areaGrad)" 
                  />

                  {/* Glowing Trendline Curve */}
                  <path 
                    d="M 100,280 C 200,260 200,230 300,230 C 400,230 400,170 500,170 C 600,170 600,100 700,100 C 800,100 800,40 900,40" 
                    fill="none" 
                    stroke="url(#curveGrad)" 
                    strokeWidth="3" 
                    filter="url(#chartGlow)"
                  />

                  {/* Active Step Crosshairs */}
                  <line 
                    x1={activeStepData.x} 
                    y1={20} 
                    x2={activeStepData.x} 
                    y2={320} 
                    stroke="#5A0F1D" 
                    strokeOpacity="0.12" 
                    strokeDasharray="4 4" 
                    className="transition-all duration-300"
                  />
                  <line 
                    x1={50} 
                    y1={activeStepData.y} 
                    x2={950} 
                    y2={activeStepData.y} 
                    stroke="#5A0F1D" 
                    strokeOpacity="0.12" 
                    strokeDasharray="4 4" 
                    className="transition-all duration-300"
                  />

                  {/* Y-axis Active Price Coordinate Badge */}
                  <g className="transition-all duration-300" style={{ transform: `translateY(${activeStepData.y}px)` }}>
                    <rect x={954} y={-8} width={42} height={16} rx={3} fill="#5A0F1D" />
                    <text x={975} y={3} fill="#C9A24D" fontSize={8} fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                      {activeStepData.value}
                    </text>
                  </g>

                  {/* X-axis Active Step Coordinate Badge */}
                  <g className="transition-all duration-300" style={{ transform: `translateX(${activeStepData.x}px)` }}>
                    <rect x={-25} y={322} width={50} height={15} rx={3} fill="#5A0F1D" />
                    <text x={0} y={332} fill="#C9A24D" fontSize={8} fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                      STEP {activeStepData.step}
                    </text>
                  </g>

                  {/* Candlesticks Layer */}
                  {journeySteps.map((item, i) => {
                    const isActive = activeJourneyStep === i;
                    const { high, low, open, close } = item.candle;
                    const x = item.x;
                    return (
                      <g 
                        key={`candle-${i}`} 
                        className="cursor-pointer group"
                        onMouseEnter={() => setActiveJourneyStep(i)}
                      >
                        {/* Transparent click/hover helper rect */}
                        <rect x={x - 20} y={20} width={40} height={300} fill="transparent" />
                        
                        {/* Candlestick Wick (Shadow & Line) */}
                        <line 
                          x1={x} 
                          y1={high} 
                          x2={x} 
                          y2={low} 
                          stroke={isActive ? "#C9A24D" : "#10B981"} 
                          strokeWidth={isActive ? 2 : 1.25} 
                          strokeOpacity={isActive ? 1.0 : 0.7}
                          className="transition-all duration-300"
                        />
                        {/* Candlestick Body */}
                        <rect 
                          x={isActive ? x - 8 : x - 5} 
                          y={close} 
                          width={isActive ? 16 : 10} 
                          height={Math.max(4, Math.abs(open - close))} 
                          fill={isActive ? "url(#activeCandleGrad)" : "url(#normalCandleGrad)"} 
                          stroke={isActive ? "#C9A24D" : "none"}
                          strokeWidth={isActive ? 1 : 0}
                          rx={2}
                          className="transition-all duration-300 shadow-sm"
                        />
                      </g>
                    );
                  })}

                  {/* Line Node Points Layer */}
                  {journeySteps.map((item, i) => {
                    const isActive = activeJourneyStep === i;
                    return (
                      <circle 
                        key={`node-${i}`}
                        cx={item.x}
                        cy={item.y}
                        r={isActive ? 7 : 4.5}
                        fill={isActive ? "#C9A24D" : "#5A0F1D"}
                        stroke="#FFFFFF"
                        strokeWidth={isActive ? 2 : 1.5}
                        className="transition-all duration-300 cursor-pointer shadow-md"
                        onMouseEnter={() => setActiveJourneyStep(i)}
                      />
                    );
                  })}
                </svg>
              </div>
            </div>
          </div>

          {/* Responsive Details Cards Grid (Desktop/Tablet) */}
          <div className="hidden md:grid grid-cols-5 gap-4">
            {journeySteps.map((item, i) => {
              const isActive = activeJourneyStep === i;
              return (
                <div 
                  key={i}
                  onMouseEnter={() => setActiveJourneyStep(i)}
                  className={`journey-step-el p-6 text-left rounded-2xl border transition-all duration-300 cursor-pointer ${
                    isActive 
                      ? 'bg-white border-gold shadow-lg -translate-y-1' 
                      : 'bg-white/60 border-burgundy/10 hover:border-gold/40 hover:bg-white hover:-translate-y-0.5'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 rounded-full flex justify-center items-center transition-all duration-300 ${
                      isActive ? 'bg-burgundy text-gold shadow-md' : 'bg-ivory text-burgundy'
                    }`}>
                      {item.icon}
                    </div>
                    <span className={`font-mono text-xs font-bold transition-colors duration-300 ${isActive ? 'text-gold-dark' : 'text-gold-dark/60'}`}>
                      {item.step}
                    </span>
                  </div>
                  <div className="font-sans text-[10px] font-bold uppercase tracking-wider text-gold-dark mb-1">
                    {item.phase}
                  </div>
                  <h3 className="font-serif text-lg text-burgundy font-semibold mb-2 leading-tight">
                    {item.label}
                  </h3>
                  <p className="text-[11px] text-text-secondary leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Mobile Vertical Candlestick Timeline Layout */}
          <div className="journey-timeline-el md:hidden space-y-4 text-left">
            {journeySteps.map((item, i) => {
              const isActive = activeJourneyStep === i;
              return (
                <div 
                  key={i} 
                  className={`flex items-stretch gap-4 p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                    isActive 
                      ? 'bg-white border-gold shadow-md' 
                      : 'bg-white/60 border-burgundy/10'
                  }`}
                  onClick={() => setActiveJourneyStep(i)}
                >
                  {/* Left Side Candlestick Column */}
                  <div className="flex flex-col items-center w-10 flex-shrink-0 select-none relative">
                    {/* Dashed background connector */}
                    {i < 4 && (
                      <div className="absolute top-[45px] bottom-[-25px] left-1/2 -translate-x-1/2 w-[1.5px] border-l border-dashed border-burgundy/20 z-0"></div>
                    )}
                    
                    <svg width="30" height="90" viewBox="0 0 30 90" className="overflow-visible relative z-10">
                      <defs>
                        <linearGradient id={`mobActCandle-${i}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#C9A24D" />
                          <stop offset="100%" stopColor="#8A6E32" />
                        </linearGradient>
                        <linearGradient id={`mobNormCandle-${i}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#34D399" />
                          <stop offset="100%" stopColor="#059669" />
                        </linearGradient>
                      </defs>
                      {/* Wick */}
                      <line x1="15" y1="8" x2="15" y2="82" stroke={isActive ? "#C9A24D" : "#10B981"} strokeWidth="1.5" />
                      {/* Candle Body */}
                      <rect 
                        x="10" 
                        y="22" 
                        width="10" 
                        height="46" 
                        fill={isActive ? `url(#mobActCandle-${i})` : `url(#mobNormCandle-${i})`} 
                        rx="1.5"
                      />
                      {/* Marker Circle */}
                      <circle 
                        cx="15" 
                        cy="45" 
                        r={isActive ? 6 : 4} 
                        fill={isActive ? "#C9A24D" : "#5A0F1D"} 
                        stroke="#FFFFFF"
                        strokeWidth={isActive ? 2 : 1.5}
                      />
                      {/* Price Label Badge */}
                      <text x="15" y="6" fill={isActive ? "#C9A24D" : "#5A0F1D"} fillOpacity="0.7" fontSize="7" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                        {item.value}
                      </text>
                    </svg>
                  </div>

                  {/* Right Side Card Details */}
                  <div className="flex-grow flex flex-col justify-center">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`font-mono text-[10px] font-bold ${isActive ? 'text-gold-dark' : 'text-gold-dark/60'}`}>
                        STEP {item.step}
                      </span>
                      <span className="font-sans text-[9px] font-bold uppercase tracking-wider text-burgundy/60">
                        {item.phase}
                      </span>
                    </div>
                    <h3 className="font-serif text-base text-burgundy font-semibold mb-1 leading-snug">
                      {item.label}
                    </h3>
                    <p className="text-[11px] text-text-secondary leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  };

  const renderInsideGallery = () => (
    <section id="blog" className="py-32 bg-white text-center">
      <div className="max-w-[1440px] mx-auto px-8">
        <div className="mb-20">
          <span className="font-sans uppercase text-gold-dark text-[11px] tracking-[0.2em] font-semibold block mb-3">
            Campus Life & Environment
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-burgundy mb-6">
            Inside Beever Academy
          </h2>
          <div className="w-[80px] h-[2px] bg-gold-gradient mx-auto"></div>
        </div>

        <div className="inside-grid-el grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
          {[
            {
              title: "Interactive Learning Sessions",
              img: "/campus_classroom.png",
              desc: "Engage in collaborative workshops using modern educational technology and collaborative teaching setups."
            },
            {
              title: "Expert-Led Workshops",
              img: "/campus_innovation.png",
              desc: "Gain hands-on problem solving insights led directly by top industry practitioners."
            },
            {
              title: "Collaborative Learning Environment",
              img: "/library_students.png",
              desc: "Modern study environments built to nurture teamwork, cooperation, and group study projects."
            },
            {
              title: "Professional Mentorship",
              img: "/campus_events.png",
              desc: "One-on-one professional counseling guidance to layout clear long-term career growth plans."
            },
            {
              title: "Career Development Programs",
              img: "/campus_sports.png",
              desc: "Rigorous physical and strategic preparation designed to cultivate confidence and leadership."
            }
          ].map((card, i) => (
            <div 
              key={i} 
              className={`inside-card-el bg-white border border-black/5 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-gold/30 transition-all duration-300 flex flex-col justify-between group ${i === 3 || i === 4 ? 'lg:col-span-1 lg:max-w-md mx-auto w-full' : ''}`}
            >
              <div className="relative overflow-hidden h-[240px]">
                <img src={card.img} alt={card.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-burgundy-dark/75 via-transparent to-transparent opacity-90"></div>
                <div className="absolute bottom-4 left-6 right-6">
                  <h3 className="font-serif text-xl text-white font-medium drop-shadow-sm">{card.title}</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-xs text-text-secondary leading-relaxed">{card.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const renderCareers = () => {
    const openings = [
      {
        id: "sen-admissions",
        title: "Senior Admissions Advisor",
        dept: "Admissions & Student Relations",
        location: "Dubai (On-site)",
        type: "Full-time",
        desc: "Lead student consultations, evaluate applications, and support prospective students in selecting their optimal educational pathway at Beever Academy."
      },
      {
        id: "fin-instructor",
        title: "Financial Markets Instructor",
        dept: "Academic Department",
        location: "Dubai (Hybrid)",
        type: "Full-time or Part-time",
        desc: "Deliver practical, real-market trading education and proprietary fund management strategies to executive and postgraduate students."
      },
      {
        id: "corp-relations",
        title: "Corporate Relations Manager",
        dept: "Business Development",
        location: "Dubai (On-site)",
        type: "Full-time",
        desc: "Build strategic relations with institutional funds, investment banks, and corporate entities in Dubai to secure postgraduate placements."
      }
    ];

    const handleApplyClick = (jobTitle) => {
      setSelectedJob(jobTitle);
    };

    const handleCareerSubmit = (e) => {
      e.preventDefault();
      setCareerFormStatus({ loading: true, submitted: false });
      
      setTimeout(() => {
        setCareerFormStatus({ loading: false, submitted: true });
        alert(`Application for ${selectedJob} submitted successfully. Our talent acquisition team will review your resume and contact you soon.`);
        setSelectedJob(null);
        setCareerFormStatus({ loading: false, submitted: false });
        e.target.reset();
      }, 1500);
    };

    return (
      <section id="careers" className="py-32 bg-ivory text-center relative">
        <div className="max-w-[1440px] mx-auto px-8">
          <div className="mb-20">
            <span className="font-sans uppercase text-gold-dark text-[11px] tracking-[0.2em] font-semibold block mb-3">
              Careers at Beever Academy
            </span>
            <h2 className="text-4xl md:text-5xl font-serif text-burgundy mb-6">
              Shape the Future of Professional Learning
            </h2>
            <div className="w-[80px] h-[2px] bg-gold-gradient mx-auto mb-6"></div>
            <p className="text-sm text-text-secondary max-w-[650px] mx-auto leading-relaxed">
              Join an elite team of educators, specialists, and academic advisors dedicated to cultivating the next generation of financial and business leaders in Dubai.
            </p>
          </div>

          <div className="careers-grid-el flex flex-col gap-8 max-w-[1000px] mx-auto text-left">
            {openings.map((job) => (
              <div 
                key={job.id} 
                className="career-card-el bg-white border border-black/5 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:border-gold/30 transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6 group relative overflow-hidden"
              >
                <div className="flex-grow">
                  <span className="font-sans text-[10px] font-bold text-gold-dark uppercase tracking-widest block mb-2">
                    {job.dept}
                  </span>
                  <h3 className="text-xl font-serif font-bold text-burgundy mb-2 group-hover:text-gold transition-colors duration-300">
                    {job.title}
                  </h3>
                  <div className="flex flex-wrap gap-4 items-center text-[11px] text-text-secondary/70 font-semibold mb-4">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-gold" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-gold" />
                      {job.type}
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed max-w-[700px]">
                    {job.desc}
                  </p>
                </div>
                
                <div className="flex-shrink-0 w-full md:w-auto">
                  <button 
                    onClick={() => handleApplyClick(job.title)}
                    className="btn btn-burgundy bg-burgundy hover:bg-burgundy-light text-white text-[11px] px-8 py-4 font-bold uppercase tracking-widest rounded-xl transition-all duration-300 w-full md:w-auto hover:-translate-y-[2px] shadow-sm hover:shadow-md cursor-pointer block text-center"
                  >
                    Apply For Role
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Application Modal */}
        {selectedJob && (
          <div className="fixed inset-0 bg-burgundy-dark/65 backdrop-blur-[6px] flex justify-center items-center z-[10000] px-4">
            <div className="bg-white border border-gold/30 rounded-2xl w-full max-w-[550px] p-8 sm:p-10 shadow-2xl relative animate-grid-fade text-left text-charcoal">
              <button 
                onClick={() => setSelectedJob(null)}
                className="absolute top-6 right-6 text-burgundy/65 hover:text-burgundy transition-colors cursor-pointer"
                aria-label="Close Modal"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="mb-6">
                <span className="font-sans text-[10px] font-bold text-gold-dark uppercase tracking-widest block mb-1">
                  Job Application
                </span>
                <h3 className="text-2xl font-serif text-burgundy font-bold">
                  {selectedJob}
                </h3>
              </div>

              <form onSubmit={handleCareerSubmit} className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="appl-name" className="font-sans text-[10px] font-semibold uppercase tracking-wider text-burgundy-dark">Full Name</label>
                  <input 
                    type="text" 
                    id="appl-name" 
                    placeholder="Enter your full name" 
                    required 
                    className="font-sans text-sm p-3.5 border border-burgundy/10 bg-white rounded-xl focus:outline-none focus:border-gold focus:ring-4 focus:ring-gold/15 transition-all duration-200" 
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="appl-email" className="font-sans text-[10px] font-semibold uppercase tracking-wider text-burgundy-dark">Email Address</label>
                  <input 
                    type="email" 
                    id="appl-email" 
                    placeholder="Enter your email address" 
                    required 
                    className="font-sans text-sm p-3.5 border border-burgundy/10 bg-white rounded-xl focus:outline-none focus:border-gold focus:ring-4 focus:ring-gold/15 transition-all duration-200" 
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="appl-resume" className="font-sans text-[10px] font-semibold uppercase tracking-wider text-burgundy-dark">Resume / Portfolio Link</label>
                  <input 
                    type="url" 
                    id="appl-resume" 
                    placeholder="https://linkedin.com/in/username or drive link" 
                    required 
                    className="font-sans text-sm p-3.5 border border-burgundy/10 bg-white rounded-xl focus:outline-none focus:border-gold focus:ring-4 focus:ring-gold/15 transition-all duration-200" 
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="appl-msg" className="font-sans text-[10px] font-semibold uppercase tracking-wider text-burgundy-dark">Cover Letter Summary</label>
                  <textarea 
                    id="appl-msg" 
                    rows="4" 
                    placeholder="Tell us why you are a great fit for Beever Academy..." 
                    required 
                    className="font-sans text-sm p-3.5 border border-burgundy/10 bg-white rounded-xl focus:outline-none focus:border-gold focus:ring-4 focus:ring-gold/15 transition-all duration-200"
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={careerFormStatus.loading}
                  className="btn btn-burgundy bg-burgundy hover:bg-burgundy-light text-white font-bold uppercase tracking-widest py-4 w-full cursor-pointer rounded-xl disabled:opacity-75 hover:-translate-y-[2px] shadow-sm hover:shadow-md transition-all duration-300 text-xs mt-2"
                >
                  {careerFormStatus.loading ? 'SUBMITTING APPLICATION...' : 'SUBMIT APPLICATION'}
                </button>
              </form>
            </div>
          </div>
        )}
      </section>
    );
  };

  const renderTestimonials = () => (
    <section id="testimonials" className="py-32 bg-ivory">
      <div className="max-w-[1440px] mx-auto px-8">
        <div className="text-center mb-16">
          <span className="font-sans uppercase text-gold-dark text-[11px] tracking-[0.2em] font-semibold block mb-3">
            Alumni Testimonials
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-burgundy mb-6">
            Student Success Stories
          </h2>
          <div className="w-[80px] h-[2px] bg-gold-gradient mx-auto"></div>
        </div>

        <div className="max-w-[850px] mx-auto relative px-4 sm:px-16">
          <div 
            className="relative h-[480px] sm:h-[380px] overflow-hidden"
            onMouseEnter={() => setIsTestimonialHovered(true)}
            onMouseLeave={() => setIsTestimonialHovered(false)}
          >
            {testimonials.map((test, index) => (
              <div 
                key={index} 
                className={`absolute inset-0 flex flex-col justify-center items-center text-center transition-all duration-500 ease-in-out ${index === currentTestimonial ? 'opacity-100 visible translate-y-0 scale-100' : 'opacity-0 invisible translate-y-5 scale-95'}`}
              >
                <div className="bg-white border border-black/5 rounded-2xl p-8 sm:p-10 shadow-md relative max-w-[750px] mx-auto">
                  {/* Heading tag */}
                  <span className="font-sans text-[10px] font-bold text-gold-dark uppercase tracking-widest block mb-4">
                    {test.heading}
                  </span>

                  {/* Stars Rating */}
                  <div className="flex gap-1 justify-center mb-6">
                    {Array(test.rating).fill().map((_, starIdx) => (
                      <Star key={starIdx} className="w-4 h-4 fill-gold text-gold" />
                    ))}
                  </div>

                  <div className="relative pt-6 mb-8">
                    <Quote className="absolute -top-4 left-1/2 -translate-x-1/2 w-[36px] h-[36px] text-gold-light/45" />
                    <p className="font-serif text-xl sm:text-2xl text-burgundy-dark italic leading-relaxed">
                      "{test.text}"
                    </p>
                  </div>

                  <div className="flex items-center justify-center gap-4 border-t border-burgundy/10 pt-6 mt-4">
                    <img 
                      src={test.img} 
                      alt={test.name} 
                      className="w-14 h-14 rounded-full object-cover border-2 border-gold shadow-sm"
                    />
                    <div className="text-left">
                      <h4 className="text-base text-burgundy font-serif font-bold">{test.name}</h4>
                      <span className="font-sans text-[10px] uppercase tracking-wider text-text-secondary block mt-0.5">
                        {test.meta}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Slider Arrow Buttons */}
          <button 
            onClick={() => handleTestimonialNav(-1)} 
            className="absolute left-0 top-1/2 -translate-y-1/2 border border-burgundy/15 rounded-full w-12 h-12 flex justify-center items-center bg-white text-burgundy hover:bg-burgundy hover:text-white hover:border-burgundy hover:shadow-lg transition-all duration-300 cursor-pointer hidden md:flex z-20"
            aria-label="Previous Testimonial"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={() => handleTestimonialNav(1)} 
            className="absolute right-0 top-1/2 -translate-y-1/2 border border-burgundy/15 rounded-full w-12 h-12 flex justify-center items-center bg-white text-burgundy hover:bg-burgundy hover:text-white hover:border-burgundy hover:shadow-lg transition-all duration-300 cursor-pointer hidden md:flex z-20"
            aria-label="Next Testimonial"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots */}
          <div className="flex justify-center gap-3 mt-8">
            {testimonials.map((_, index) => (
              <button 
                key={index} 
                onClick={() => setCurrentTestimonial(index)} 
                className={`border-none h-2 cursor-pointer transition-all duration-300 rounded-full ${index === currentTestimonial ? 'bg-gold-dark w-6' : 'bg-burgundy/15 w-2'}`}
                aria-label={`Slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );

  const renderContact = () => (
    <section id="contact" className="py-32 bg-white">
      <div className="max-w-[1440px] mx-auto px-8">
        <div className="text-center mb-20">
          <span className="font-sans uppercase text-gold-dark text-[11px] tracking-[0.2em] font-semibold block mb-3">
            Reach Out
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-burgundy mb-6">
            Schedule A Visit & Inquiry
          </h2>
          <div className="w-[80px] h-[2px] bg-gold-gradient mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Form Wrap */}
          <div className="lg:col-span-7 bg-ivory p-10 sm:p-14 border border-black/5 rounded-2xl shadow-sm text-left">
            <form onSubmit={handleInquirySubmit} className="flex flex-col gap-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="font-sans text-[10px] font-semibold uppercase tracking-wider text-burgundy-dark">Full Name</label>
                  <input type="text" id="name" placeholder="John Doe" required className="font-sans text-sm p-4 border border-burgundy/10 bg-white rounded-xl focus:outline-none focus:border-gold-dark focus:ring-4 focus:ring-gold/15 transition-all duration-200" />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="font-sans text-[10px] font-semibold uppercase tracking-wider text-burgundy-dark">Email Address</label>
                  <input type="email" id="email" placeholder="john@example.com" required className="font-sans text-sm p-4 border border-burgundy/10 bg-white rounded-xl focus:outline-none focus:border-gold-dark focus:ring-4 focus:ring-gold/15 transition-all duration-200" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="flex flex-col gap-2">
                  <label htmlFor="program" className="font-sans text-[10px] font-semibold uppercase tracking-wider text-burgundy-dark">Program of Interest</label>
                  <select id="program" className="font-sans text-sm p-4 border border-burgundy/10 bg-white rounded-xl focus:outline-none focus:border-gold-dark focus:ring-4 focus:ring-gold/15 transition-all duration-200">
                    <option value="undergraduate">Undergraduate Studies</option>
                    <option value="postgraduate">Postgraduate Programs</option>
                    <option value="executive">Executive Education</option>
                    <option value="other">Other / General Inquiry</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="date" className="font-sans text-[10px] font-semibold uppercase tracking-wider text-burgundy-dark">Preferred Visit Date</label>
                  <input type="date" id="date" className="font-sans text-sm p-4 border border-burgundy/10 bg-white rounded-xl focus:outline-none focus:border-gold-dark focus:ring-4 focus:ring-gold/15 transition-all duration-200" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="msg" className="font-sans text-[10px] font-semibold uppercase tracking-wider text-burgundy-dark">Your Message</label>
                <textarea id="msg" rows="5" placeholder="Tell us about your academic goals..." required className="font-sans text-sm p-4 border border-burgundy/10 bg-white rounded-xl focus:outline-none focus:border-gold-dark focus:ring-4 focus:ring-gold/15 transition-all duration-200"></textarea>
              </div>

              <button 
                type="submit" 
                disabled={formStatus.loading}
                className="btn btn-burgundy bg-burgundy hover:bg-burgundy-light text-white font-semibold uppercase tracking-widest py-4 w-full cursor-pointer rounded-xl disabled:opacity-75 hover:-translate-y-[2px] shadow-sm hover:shadow-md transition-all duration-300"
              >
                {formStatus.loading ? 'PROCESSING INQUIRY...' : 'SUBMIT INQUIRY'}
              </button>
            </form>
          </div>

          {/* Info Cards Wrap */}
          <div className="lg:col-span-5 flex flex-col gap-8 text-left">
            {[
              { icon: <MapPin className="w-5.5 h-5.5" />, title: "Academy Campus", desc: "100 Academic Circle, Royal Estates, NY 10021" },
              { icon: <Phone className="w-5.5 h-5.5" />, title: "Admissions Office", desc: "+1 (800) 555-BEEV • +1 (212) 555-0198" },
              { icon: <Mail className="w-5.5 h-5.5" />, title: "Electronic Mail", desc: "admissions@beeveracademy.edu • info@beeveracademy.edu" }
            ].map((card, i) => (
              <div key={i} className="flex gap-6 items-start bg-white p-8 border border-black/3 rounded-2xl shadow-sm">
                <div className="w-[48px] h-[48px] bg-ivory border border-burgundy/5 rounded-full flex justify-center items-center text-burgundy flex-shrink-0">
                  {card.icon}
                </div>
                <div>
                  <h4 className="text-lg font-serif text-burgundy font-bold mb-1">{card.title}</h4>
                  <p className="text-sm text-text-secondary leading-relaxed">{card.desc}</p>
                </div>
              </div>
            ))}

            <div className="h-[220px] bg-cover bg-center border border-black/5 rounded-2xl shadow-sm relative overflow-hidden" style={{ backgroundImage: "url('/hero_building.png')" }}>
              <div className="absolute inset-0 bg-burgundy/30 flex justify-center items-center">
                <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="btn btn-gold text-[10px] font-semibold tracking-wider gold-gradient-bg text-burgundy-dark px-5 py-3 rounded-xl uppercase flex items-center gap-2">
                  <Globe className="w-4 h-4" /> View Map
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <div className="min-h-screen text-charcoal font-sans bg-white relative">
      <GoldenSprinkleCursor />
      {/* ==========================================
         PAGE LOADER
         ========================================== */}
      {isLoading && (
        <div className="fixed inset-0 bg-burgundy-dark flex justify-center items-center z-[9999] transition-opacity duration-800">
          <div className="flex flex-col items-center justify-center text-center">
            {/* Logo used here */}
            <div className="gold-glass-logo-frame w-[130px] h-[130px] animate-logo-pulse mb-6">
              <img src={logo} alt="Beever Academy Emblem" className="w-full h-full object-contain" />
            </div>
            <div className="w-[180px] h-[2px] bg-white/10 my-6 relative overflow-hidden">
              <div className="h-full bg-gold-gradient w-full animate-bar-fill"></div>
            </div>
            <span className="font-serif text-gold-light tracking-[0.3em] pl-[0.3em] text-sm font-medium block">
              BEEVER ACADEMY
            </span>
          </div>
        </div>
      )}

      {/* ==========================================
         STICKY HEADER NAVBAR
         ========================================== */}
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'py-4 bg-[#1a0206] border-b border-gold/10 shadow-md' : 'py-6 bg-[#1a0206]/95 border-b border-burgundy/20 shadow-sm'}`}>
        <div className="w-full px-4 sm:px-6 md:px-10 flex justify-between items-center">
          <a href="#home" className="flex items-center gap-3">
            {/* Logo used here */}
            <div className="gold-glass-logo-frame w-[54px] h-[54px] sm:w-[62px] sm:h-[62px] flex-shrink-0">
              <img src={logo} alt="Beever Academy Logo" className="w-full h-full object-contain" />
            </div>
            <span className="font-serif text-2xl sm:text-3xl md:text-4xl font-semibold tracking-wider transition-colors duration-300 text-white">
              BEEVER <span className="text-gold">ACADEMY</span>
            </span>
          </a>

          {/* Desktop Nav */}
          <ul className="hidden lg:flex gap-7">
            {['home', 'about', 'programs', 'admissions', 'blog', 'careers', 'contact'].map(sec => (
              <li key={sec}>
                <a 
                  href={`#${sec}`} 
                  className={`font-sans text-xs uppercase tracking-wider font-semibold transition-all duration-200 relative py-2 ${
                    activeNavSection === sec 
                      ? 'text-gold-light after:w-full' 
                      : 'text-white/80 hover:text-gold-light after:w-0'
                  } after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[1px] after:bg-gold hover:after:w-full after:transition-all after:duration-300`}
                >
                  {sec.replace('-', ' ')}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-6">
            <a 
              href="#admissions" 
              className="hidden sm:inline-flex btn text-xs px-6 py-3 font-semibold shadow-sm transition-all duration-300 uppercase tracking-widest gold-gradient-bg text-burgundy-dark hover:shadow-md hover:-translate-y-[2px]"
            >
              Enroll Now
            </a>
            {/* Mobile Hamburger toggle */}
            <button 
              className="lg:hidden flex flex-col gap-[6px] cursor-pointer z-[1100] text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-white" />
              ) : (
                <>
                  <span className="w-6 h-[2px] block transition-colors duration-300 bg-white"></span>
                  <span className="w-6 h-[2px] block transition-colors duration-300 bg-white"></span>
                  <span className="w-6 h-[2px] block transition-colors duration-300 bg-white"></span>
                </>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-burgundy-dark z-[990] flex justify-center items-center transition-all duration-500">
          <ul className="flex flex-col items-center gap-8">
            {['home', 'about', 'programs', 'admissions', 'blog', 'careers', 'contact'].map(sec => (
              <li key={sec} onClick={() => setMobileMenuOpen(false)}>
                <a href={`#${sec}`} className="font-serif text-white text-3xl tracking-wide hover:text-gold transition-colors duration-200 capitalize">
                  {sec.replace('-', ' ')}
                </a>
              </li>
            ))}
            <li onClick={() => setMobileMenuOpen(false)} className="mt-4">
              <a href="#admissions" className="btn btn-gold text-sm px-10 py-4 shadow-gold gold-gradient-bg text-burgundy-dark uppercase tracking-widest font-semibold block text-center">
                Enroll Now
              </a>
            </li>
          </ul>
        </div>
      )}

      <>
        {renderHero()}
        {renderWhyChooseUs()}
        {renderAbout()}
        {renderGlobalNetwork()}
        {renderStrengths()}
        {renderJourney()}
        {renderInsideGallery()}
        {renderCareers()}
        {renderTestimonials()}
        {renderContact()}
      </>

      {/* ==========================================
         FOOTER SECTION
         ========================================== */}
      <footer className="bg-burgundy-dark text-white border-t-2 border-gold">
        <div className="max-w-[1440px] mx-auto px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 py-28 text-left">
          
          {/* Brand Col */}
          <div className="flex flex-col gap-6">
            <a href="#home" className="flex items-center gap-3">
              {/* Logo used here */}
              <div className="gold-glass-logo-frame w-[64px] h-[64px] flex-shrink-0">
                <img src={logo} alt="Beever Academy Logo" className="w-full h-full object-contain" />
              </div>
              <span className="font-serif text-white text-xl font-semibold tracking-wider">
                BEEVER ACADEMY
              </span>
            </a>
            <p className="font-sans text-[10px] font-semibold text-gold uppercase tracking-wider">
              Empowering Minds. Building Character. Shaping Future Leaders.
            </p>
            <p className="text-xs text-text-light leading-relaxed">
              An elite world-class educational institution dedicated to intellectual brilliance, elite leadership preparation, and ethical foundation.
            </p>
            <div className="flex gap-4">
              {[
                { icon: <Facebook className="w-4 h-4" />, label: "Facebook" },
                { icon: <Instagram className="w-4 h-4" />, label: "Instagram" },
                { icon: <Linkedin className="w-4 h-4" />, label: "LinkedIn" },
                { icon: <Youtube className="w-4 h-4" />, label: "YouTube" }
              ].map((soc, i) => (
                <a key={i} href="#" className="w-[38px] h-[38px] bg-white/5 border border-white/10 rounded-full flex justify-center items-center text-white hover:bg-gold-gradient hover:text-burgundy-dark hover:border-transparent hover:scale-105 transition-all duration-300" aria-label={soc.label}>
                  {soc.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links Col */}
          <div className="flex flex-col gap-6">
            <h4 className="text-lg text-gold font-serif font-semibold relative pb-3 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-9 after:h-[1px] after:bg-gold">
              Quick Links
            </h4>
            <ul className="flex flex-col gap-4 text-xs text-text-light">
              {['about', 'programs', 'admissions', 'blog', 'contact'].map(link => (
                <li key={link}>
                  <a href={`#${link}`} className="hover:text-gold-light hover:pl-1 transition-all duration-200 capitalize">
                    {link.replace('-', ' ')}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs Col */}
          <div className="flex flex-col gap-6">
            <h4 className="text-lg text-gold font-serif font-semibold relative pb-3 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-9 after:h-[1px] after:bg-gold">
              Programs
            </h4>
            <ul className="flex flex-col gap-4 text-xs text-text-light">
              {['Undergraduate', 'Postgraduate', 'Professional Courses', 'Online Learning', 'Executive Education'].map(prog => (
                <li key={prog}>
                  <a href="#programs" className="hover:text-gold-light hover:pl-1 transition-all duration-200">
                    {prog}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Col */}
          <div className="flex flex-col gap-6">
            <h4 className="text-lg text-gold font-serif font-semibold relative pb-3 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-9 after:h-[1px] after:bg-gold">
              Contact Us
            </h4>
            <ul className="flex flex-col gap-5 text-xs text-text-light">
              <li className="flex gap-4 items-start">
                <MapPin className="w-[18px] h-[18px] text-gold mt-[2px] flex-shrink-0" />
                <span>100 Academic Circle, Royal Estates, NY 10021</span>
              </li>
              <li className="flex gap-4 items-start">
                <Phone className="w-[18px] h-[18px] text-gold mt-[2px] flex-shrink-0" />
                <span>+1 (800) 555-BEEV</span>
              </li>
              <li className="flex gap-4 items-start">
                <Mail className="w-[18px] h-[18px] text-gold mt-[2px] flex-shrink-0" />
                <span>admissions@beeveracademy.edu</span>
              </li>
              <li className="flex gap-4 items-start">
                <Globe className="w-[18px] h-[18px] text-gold mt-[2px] flex-shrink-0" />
                <span>www.beeveracademy.edu</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="bg-[#240000] border-t border-white/5 py-8">
          <div className="max-w-[1440px] mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/40">
            <p>&copy; 2026 Beever Academy. All Rights Reserved. Designed for Luxury Educational Institutions.</p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-white">Privacy Policy</a>
              <a href="#" className="hover:text-white">Terms of Service</a>
              <a href="#" className="hover:text-white">Sitemap</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
