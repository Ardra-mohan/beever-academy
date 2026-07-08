import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Award, Users, Shield, Globe, BookOpen, GraduationCap, 
  Monitor, Briefcase, ChevronLeft, ChevronRight, 
  MapPin, Phone, Mail, Facebook, Instagram, Linkedin, Youtube, 
  Quote, Sparkles, Menu, X, ArrowRight, CheckCircle2,
  Star, TrendingUp, Trophy, Clock, Compass, MessageSquare
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


// ==========================================
// CINEMATIC ADMISSIONS BACKGROUND PARTICLES
// ==========================================
function AdmissionsBackgroundParticles() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let particles = [];
    const particleCount = 45;

    const resizeCanvas = () => {
      canvas.width = canvas.parentElement.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement.clientHeight || 800;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.8 + 0.6,
        speedY: -(Math.random() * 0.22 + 0.05),
        speedX: (Math.random() - 0.5) * 0.12,
        opacity: Math.random() * 0.6 + 0.15,
        color: Math.random() > 0.4 ? 'rgba(201, 162, 77, 0.45)' : 'rgba(126, 28, 44, 0.35)'
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        p.y += p.speedY;
        p.x += p.speedX;

        // Wrap around borders
        if (p.y < 0) {
          p.y = canvas.height;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < 0 || p.x > canvas.width) {
          p.speedX = -p.speedX;
        }

        ctx.save();
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 3;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-70"
    />
  );
}

// ==========================================
// PREMIUM INTERACTIVE TRADING TERMINAL COMPONENT
// ==========================================
function PremiumTradingTerminal() {
  const [candles, setCandles] = useState([]);
  const [ticker, setTicker] = useState({
    symbol: "BEEV/USD",
    price: 75420.50,
    change: 1.24,
    high: 75850.00,
    low: 74900.00,
    volume: 245820,
    spread: 0.02,
    session: "DUBAI LIVE"
  });

  // Crosshair coordinate state
  const [crosshair, setCrosshair] = useState({ x: null, y: null, active: false, price: null, time: null });

  // Execution flashes state
  const [executions, setExecutions] = useState([]);

  // Generate initial candle dataset
  useEffect(() => {
    let currentPrice = 75100;
    const initialCandles = [];
    const now = new Date();
    
    for (let i = 24; i >= 0; i--) {
      const candleTime = new Date(now.getTime() - i * 60000);
      const timeStr = `${String(candleTime.getHours()).padStart(2, '0')}:${String(candleTime.getMinutes()).padStart(2, '0')}:${String(candleTime.getSeconds()).padStart(2, '0')}`;
      
      const openPrice = currentPrice;
      const change = (Math.random() - 0.47) * 220; // slight positive drift
      const closePrice = openPrice + change;
      const highPrice = Math.max(openPrice, closePrice) + Math.random() * 80;
      const lowPrice = Math.min(openPrice, closePrice) - Math.random() * 80;
      const volumeVal = Math.floor(Math.random() * 600) + 150;
      
      // Random Buy/Sell markers on historical candles
      let markerType = null;
      if (i > 2 && Math.random() < 0.12) {
        markerType = Math.random() > 0.5 ? 'buy' : 'sell';
      }

      initialCandles.push({
        time: timeStr,
        open: openPrice,
        close: closePrice,
        high: highPrice,
        low: lowPrice,
        volume: volumeVal,
        marker: markerType
      });
      
      currentPrice = closePrice;
    }
    
    setCandles(initialCandles);
    setTicker(prev => ({
      ...prev,
      price: currentPrice,
      high: Math.max(...initialCandles.map(c => c.high)),
      low: Math.min(...initialCandles.map(c => c.low))
    }));
  }, []);

  // Update simulator logic: ticks and new candles
  useEffect(() => {
    if (candles.length === 0) return;

    // 1. Gentle tick fluctuation interval (every 200ms)
    const tickInterval = setInterval(() => {
      setCandles(prevCandles => {
        if (prevCandles.length === 0) return prevCandles;
        
        const nextCandles = [...prevCandles];
        const latestIdx = nextCandles.length - 1;
        const current = nextCandles[latestIdx];
        
        // Fluctuate close price
        const priceTick = (Math.random() - 0.5) * 35;
        const newClose = current.close + priceTick;
        const newHigh = Math.max(current.high, newClose);
        const newLow = Math.min(current.low, newClose);
        const newVol = current.volume + Math.floor(Math.random() * 8);

        nextCandles[latestIdx] = {
          ...current,
          close: newClose,
          high: newHigh,
          low: newLow,
          volume: newVol
        };

        // Update ticker values
        const firstOpen = nextCandles[0].open;
        const percentageChange = ((newClose - firstOpen) / firstOpen) * 100;
        
        setTicker(prev => ({
          ...prev,
          price: newClose,
          change: percentageChange,
          high: Math.max(prev.high, newHigh),
          low: Math.min(prev.low, newLow),
          volume: prev.volume + Math.floor(Math.random() * 4)
        }));

        return nextCandles;
      });
    }, 200);

    // 2. New Candle interval (every 4000ms)
    const candleInterval = setInterval(() => {
      setCandles(prevCandles => {
        if (prevCandles.length === 0) return prevCandles;
        
        const nextCandles = [...prevCandles];
        const lastCandle = nextCandles[nextCandles.length - 1];

        // Format timestamp
        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
        
        // Randomly place a buy/sell execution flash on the chart
        const rand = Math.random();
        let marker = null;
        if (rand < 0.25) {
          const type = Math.random() > 0.5 ? 'buy' : 'sell';
          marker = type;

          // Add active trade execution flash
          const price = lastCandle.close;
          const newExecution = {
            id: Date.now() + '-' + Math.random(),
            x: 50 + 24 * 34.4 + 17.2, // latest candle X pos
            price: price,
            type: type,
            amount: type === 'buy' ? `+100 BEEV` : `-100 BEEV`
          };
          setExecutions(prev => [...prev, newExecution]);
          // Clean up execution after 1 second
          setTimeout(() => {
            setExecutions(prev => prev.filter(e => e.id !== newExecution.id));
          }, 1000);
        }

        const newCandle = {
          time: timeStr,
          open: lastCandle.close,
          close: lastCandle.close,
          high: lastCandle.close,
          low: lastCandle.close,
          volume: Math.floor(Math.random() * 200) + 50,
          marker: marker
        };

        nextCandles.push(newCandle);
        
        // Shift out oldest candle to pan chart left
        if (nextCandles.length > 25) {
          nextCandles.shift();
        }

        return nextCandles;
      });
    }, 4000);

    return () => {
      clearInterval(tickInterval);
      clearInterval(candleInterval);
    };
  }, [candles.length]);

  // Dimension helpers for coordinate mapping
  // viewBox="0 0 1000 450"
  // Left: 50, Right: 910, Width: 860
  // Top: 40, Bottom: 360, Height: 320
  const CHART_LEFT = 50;
  const CHART_RIGHT = 910;
  const CHART_TOP = 40;
  const CHART_BOTTOM = 360;
  const CHART_WIDTH = CHART_RIGHT - CHART_LEFT;
  const CHART_HEIGHT = CHART_BOTTOM - CHART_TOP;
  const TOTAL_CANDLES = 25;
  const CANDLE_SPACING = CHART_WIDTH / TOTAL_CANDLES; // 860 / 25 = 34.4

  const getX = (index) => CHART_LEFT + index * CANDLE_SPACING + (CANDLE_SPACING / 2);

  // Price boundary mapping
  const prices = candles.flatMap(c => [c.high, c.low]);
  const minPrice = prices.length ? Math.min(...prices) * 0.999 : 74000;
  const maxPrice = prices.length ? Math.max(...prices) * 1.001 : 76500;
  const priceRange = maxPrice - minPrice;

  const getY = (price) => {
    if (priceRange === 0) return CHART_TOP + CHART_HEIGHT / 2;
    return CHART_BOTTOM - ((price - minPrice) / priceRange) * CHART_HEIGHT;
  };

  // Map Y to Price for crosshair tooltip
  const getPriceFromY = (y) => {
    return minPrice + ((CHART_BOTTOM - y) / CHART_HEIGHT) * priceRange;
  };

  // Map X to Candle for crosshair tooltip
  const getCandleFromX = (x) => {
    const adjustedX = x - CHART_LEFT;
    const idx = Math.floor(adjustedX / CANDLE_SPACING);
    if (idx >= 0 && idx < candles.length) {
      return candles[idx];
    }
    return null;
  };

  // Indicators calculations
  const calculateEMA = (data, period = 9) => {
    const k = 2 / (period + 1);
    let emaVal = [];
    if (data.length === 0) return emaVal;
    let current = data[0].close;
    emaVal.push(current);
    for (let i = 1; i < data.length; i++) {
      current = data[i].close * k + current * (1 - k);
      emaVal.push(current);
    }
    return emaVal;
  };

  const calculateVWAP = (data) => {
    let vwapVal = [];
    let cumPriceVol = 0;
    let cumVol = 0;
    for (let i = 0; i < data.length; i++) {
      const typical = (data[i].high + data[i].low + data[i].close) / 3;
      cumPriceVol += typical * data[i].volume;
      cumVol += data[i].volume;
      vwapVal.push(cumVol > 0 ? cumPriceVol / cumVol : typical);
    }
    return vwapVal;
  };

  const emaValues = calculateEMA(candles, 9);
  const vwapValues = calculateVWAP(candles);

  // Generate lines SVG paths
  const makeLinePath = (values) => {
    if (candles.length < 2 || values.length < 2) return "";
    return values.map((val, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(val)}`).join(" ");
  };

  const emaPath = makeLinePath(emaValues);
  const vwapPath = makeLinePath(vwapValues);

  // Handle Mouse Events for Crosshair
  const handleMouseMove = (e) => {
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    
    // Scale client coordinate to SVG viewBox
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;
    
    const svgX = (clientX / rect.width) * 1000;
    const svgY = (clientY / rect.height) * 450;

    // Constraints to main chart canvas
    if (svgX >= CHART_LEFT && svgX <= CHART_RIGHT && svgY >= CHART_TOP && svgY <= CHART_BOTTOM) {
      const activeCandle = getCandleFromX(svgX);
      const hoveredPrice = getPriceFromY(svgY);
      
      setCrosshair({
        x: svgX,
        y: svgY,
        active: true,
        price: hoveredPrice,
        time: activeCandle ? activeCandle.time : null
      });
    } else {
      setCrosshair(prev => ({ ...prev, active: false }));
    }
  };

  const handleMouseLeave = () => {
    setCrosshair(prev => ({ ...prev, active: false }));
  };

  // Format volume bar scale
  const volumes = candles.map(c => c.volume);
  const maxVolume = volumes.length ? Math.max(...volumes) : 100;

  // Bullish/Bearish class details
  const isUpSession = ticker.change >= 0;

  return (
    <div className="w-full flex flex-col bg-[#080102] text-white select-none font-sans leading-none relative">
      
      {/* Tickers Tape/Data Header */}
      <div className="bg-[#0e0204] border-b border-gold/15 py-3 px-6 flex flex-wrap items-center justify-between gap-4 select-none relative z-10 text-[10px] tracking-wider uppercase font-semibold text-white/60">
        
        {/* Symbol and Pulse indicator */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 font-bold text-white tracking-widest text-[11px]">
            <span className="text-gold font-bold">★ {ticker.symbol}</span>
          </div>
          <div className="flex items-center gap-2 border-l border-white/10 pl-4">
            <span className={`w-2 h-2 rounded-full ${isUpSession ? 'bg-emerald-500 animate-pulse' : 'bg-red-500 animate-pulse'}`}></span>
            <span className={isUpSession ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
              ${ticker.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className={`font-bold ml-1 ${isUpSession ? 'text-emerald-400' : 'text-red-400'}`}>
              {isUpSession ? '+' : ''}{ticker.change.toFixed(2)}%
            </span>
          </div>
        </div>

        {/* Market Stats details */}
        <div className="flex items-center gap-5 text-[9px] font-mono text-white/40">
          <div>H: <span className="text-white/80">${ticker.high.toLocaleString(undefined, { maximumFractionDigits: 1 })}</span></div>
          <div>L: <span className="text-white/80">${ticker.low.toLocaleString(undefined, { maximumFractionDigits: 1 })}</span></div>
          <div>VOL: <span className="text-white/80">{(ticker.volume / 1000).toFixed(1)}k</span></div>
          <div>SPREAD: <span className="text-gold">${ticker.spread}</span></div>
          <div className="border-l border-white/10 pl-5 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span className="text-emerald-400 font-bold">{ticker.session}</span>
          </div>
        </div>

      </div>

      {/* Main SVG Viewport */}
      <div className="relative w-full overflow-hidden">
        <svg 
          viewBox="0 0 1000 450" 
          className="w-full h-auto cursor-crosshair overflow-visible"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          
          {/* Subtle Grid Lines */}
          <g className="grid-lines opacity-10">
            {/* Horizontal lines */}
            {Array.from({ length: 5 }).map((_, i) => {
              const yVal = CHART_TOP + (CHART_HEIGHT / 5) * i;
              return <line key={`grid-h-${i}`} x1={CHART_LEFT} y1={yVal} x2={CHART_RIGHT} y2={yVal} stroke="#ffffff" strokeDasharray="3 3" strokeWidth="0.5" />;
            })}
            {/* Vertical lines */}
            {Array.from({ length: 6 }).map((_, i) => {
              const xVal = CHART_LEFT + (CHART_WIDTH / 6) * i;
              return <line key={`grid-v-${i}`} x1={xVal} y1={CHART_TOP} x2={xVal} y2={CHART_BOTTOM} stroke="#ffffff" strokeDasharray="3 3" strokeWidth="0.5" />;
            })}
          </g>

          {/* Indicators layer: EMA and VWAP */}
          {candles.length > 2 && (
            <>
              {/* VWAP Line (Translucent Cyan/Blue) */}
              <path d={vwapPath} fill="none" stroke="#2563eb" strokeWidth="1.75" strokeOpacity="0.8" className="transition-all duration-300 ease-out" />
              {/* EMA Line (Golden) */}
              <path d={emaPath} fill="none" stroke="#D4AF37" strokeWidth="1.75" strokeOpacity="0.9" className="transition-all duration-300 ease-out" />
            </>
          )}

          {/* Volume Chart underlay (placed at bottom, max height of 60 pixels) */}
          <g className="volume-bars opacity-30">
            {candles.map((candle, i) => {
              const x = getX(i) - 4;
              const barHeight = (candle.volume / maxVolume) * 50;
              const y = CHART_BOTTOM - barHeight;
              const isUp = candle.close >= candle.open;
              return (
                <rect 
                  key={`vol-${i}`}
                  x={x}
                  y={y}
                  width="8"
                  height={barHeight}
                  fill={isUp ? "#10B981" : "#EF4444"}
                  rx="1"
                />
              );
            })}
          </g>

          {/* Realistic OHLC Candlesticks */}
          <g className="candlesticks">
            {candles.map((candle, i) => {
              const x = getX(i);
              const openY = getY(candle.open);
              const closeY = getY(candle.close);
              const highY = getY(candle.high);
              const lowY = getY(candle.low);
              
              const isBullish = candle.close >= candle.open;
              const bodyY = Math.min(openY, closeY);
              const bodyHeight = Math.max(1.5, Math.abs(openY - closeY));
              
              const strokeColor = isBullish ? "#10B981" : "#EF4444";
              const fillColor = isBullish ? "#10B981" : "#EF4444";

              return (
                <g key={`candle-${i}`}>
                  {/* Wicks (High to Low line) */}
                  <line 
                    x1={x}
                    y1={highY}
                    x2={x}
                    y2={lowY}
                    stroke={strokeColor}
                    strokeWidth="1.25"
                  />
                  {/* Candle Body */}
                  <rect 
                    x={x - 6}
                    y={bodyY}
                    width="12"
                    height={bodyHeight}
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth="0.5"
                    className="transition-all duration-150 ease-out"
                    rx="1.5"
                  />

                  {/* Buy/Sell markers appearing under/above the candle */}
                  {candle.marker === 'buy' && (
                    <g className="animate-pulse">
                      {/* Triangle pointing up */}
                      <polygon 
                        points={`${x},${lowY + 12} ${x - 5.5},${lowY + 21} ${x + 5.5},${lowY + 21}`} 
                        fill="#10B981" 
                        stroke="#ffffff"
                        strokeWidth="0.5"
                      />
                      <text x={x} y={lowY + 29} fill="#10B981" fontSize="7.5" fontFamily="monospace" textAnchor="middle" fontWeight="bold">BUY</text>
                    </g>
                  )}
                  {candle.marker === 'sell' && (
                    <g className="animate-pulse">
                      {/* Triangle pointing down */}
                      <polygon 
                        points={`${x},${highY - 12} ${x - 5.5},${highY - 21} ${x + 5.5},${highY - 21}`} 
                        fill="#EF4444" 
                        stroke="#ffffff"
                        strokeWidth="0.5"
                      />
                      <text x={x} y={highY - 25} fill="#EF4444" fontSize="7.5" fontFamily="monospace" textAnchor="middle" fontWeight="bold">SELL</text>
                    </g>
                  )}
                </g>
              );
            })}
          </g>

          {/* Live Price Tag Tracker (follows latest candle price Y coord) */}
          {candles.length > 0 && (
            <g className="latest-price-tag">
              {/* Horizontal price line indicator */}
              <line 
                x1={CHART_LEFT} 
                y1={getY(ticker.price)} 
                x2={CHART_RIGHT} 
                y2={getY(ticker.price)} 
                stroke={isUpSession ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"} 
                strokeDasharray="2 2" 
                strokeWidth="0.75" 
              />
              {/* Price scale tag block */}
              <rect 
                x={CHART_RIGHT + 2} 
                y={getY(ticker.price) - 8} 
                width="84" 
                height="16" 
                fill={isUpSession ? "#10B981" : "#EF4444"} 
                rx="3" 
              />
              <text 
                x={CHART_RIGHT + 44} 
                y={getY(ticker.price) + 4} 
                fill="#ffffff" 
                fontSize="8.5" 
                fontFamily="monospace" 
                fontWeight="bold" 
                textAnchor="middle"
              >
                ${ticker.price.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
              </text>
            </g>
          )}

          {/* Trade Executions Flashing Dots overlay */}
          {executions.map(exec => (
            <g key={exec.id} className="trade-execution-flash">
              <circle 
                cx={exec.x} 
                cy={getY(exec.price)} 
                r="18" 
                fill="none" 
                stroke={exec.type === 'buy' ? "#10B981" : "#EF4444"} 
                strokeWidth="1.5" 
                className="animate-ping opacity-60" 
              />
              <circle 
                cx={exec.x} 
                cy={getY(exec.price)} 
                r="6" 
                fill={exec.type === 'buy' ? "#10B981" : "#EF4444"} 
                stroke="#ffffff" 
                strokeWidth="1" 
              />
              <text 
                x={exec.x} 
                y={getY(exec.price) - 14} 
                fill={exec.type === 'buy' ? "#10B981" : "#EF4444"} 
                fontSize="8" 
                fontFamily="monospace" 
                fontWeight="bold" 
                textAnchor="middle"
                className="animate-pulse"
              >
                {exec.amount}
              </text>
            </g>
          ))}

          {/* Crosshair Interaction Layer */}
          {crosshair.active && (
            <g className="crosshair-interactive-group">
              {/* Horizontal line */}
              <line 
                x1={CHART_LEFT} 
                y1={crosshair.y} 
                x2={CHART_RIGHT} 
                y2={crosshair.y} 
                stroke="#ffffff" 
                strokeDasharray="4 4" 
                strokeWidth="0.75" 
                strokeOpacity="0.5" 
              />
              {/* Vertical line */}
              <line 
                x1={crosshair.x} 
                y1={CHART_TOP} 
                x2={crosshair.x} 
                y2={CHART_BOTTOM} 
                stroke="#ffffff" 
                strokeDasharray="4 4" 
                strokeWidth="0.75" 
                strokeOpacity="0.5" 
              />
              
              {/* Price axis label tooltip */}
              <rect 
                x={CHART_RIGHT + 2} 
                y={crosshair.y - 8} 
                width="84" 
                height="16" 
                fill="#D4AF37" 
                rx="3" 
              />
              <text 
                x={CHART_RIGHT + 44} 
                y={crosshair.y + 4} 
                fill="#0c0103" 
                fontSize="8.5" 
                fontFamily="monospace" 
                fontWeight="bold" 
                textAnchor="middle"
              >
                ${crosshair.price.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
              </text>

              {/* Time axis label tooltip */}
              {crosshair.time && (
                <g>
                  <rect 
                    x={crosshair.x - 30} 
                    y={CHART_BOTTOM + 2} 
                    width="60" 
                    height="15" 
                    fill="#D4AF37" 
                    rx="3" 
                  />
                  <text 
                    x={crosshair.x} 
                    y={CHART_BOTTOM + 12} 
                    fill="#0c0103" 
                    fontSize="8.5" 
                    fontFamily="monospace" 
                    fontWeight="bold" 
                    textAnchor="middle"
                  >
                    {crosshair.time}
                  </text>
                </g>
              )}
            </g>
          )}

          {/* Right Price Scale Axis grid line and text */}
          <line x1={CHART_RIGHT} y1={CHART_TOP} x2={CHART_RIGHT} y2={CHART_BOTTOM} stroke="rgba(201,162,77,0.2)" strokeWidth="1" />
          <g className="price-axis-text text-[8.5px] font-mono fill-white/40">
            {Array.from({ length: 5 }).map((_, i) => {
              const pricePoint = minPrice + (priceRange / 5) * i;
              const yVal = CHART_BOTTOM - (CHART_HEIGHT / 5) * i;
              return (
                <text key={`price-lbl-${i}`} x={CHART_RIGHT + 8} y={yVal + 3} textAnchor="start">
                  ${pricePoint.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </text>
              );
            })}
          </g>

          {/* Horizontal Timeline scale at the bottom */}
          <line x1={CHART_LEFT} y1={CHART_BOTTOM} x2={CHART_RIGHT} y2={CHART_BOTTOM} stroke="rgba(201,162,77,0.2)" strokeWidth="1" />
          <g className="time-axis-text text-[8.5px] font-mono fill-white/40">
            {candles.filter((_, idx) => idx % 4 === 0).map((candle, idx) => {
              const xVal = getX(idx * 4);
              return (
                <g key={`time-lbl-${idx}`}>
                  <line x1={xVal} y1={CHART_BOTTOM} x2={xVal} y2={CHART_BOTTOM + 4} stroke="rgba(201,162,77,0.3)" strokeWidth="0.75" />
                  <text x={xVal} y={CHART_BOTTOM + 16} textAnchor="middle">
                    {candle.time}
                  </text>
                </g>
              );
            })}
          </g>

        </svg>
      </div>

      {/* Floating Indicator labels */}
      <div className="absolute top-16 left-16 flex gap-3 text-[7.5px] font-mono font-bold select-none tracking-widest pointer-events-none">
        <span className="text-[#D4AF37] border border-gold/25 px-1.5 py-0.5 rounded bg-black/40">EMA (9)</span>
        <span className="text-[#2563eb] border border-blue-500/25 px-1.5 py-0.5 rounded bg-black/40">VWAP</span>
      </div>

    </div>
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

  // Futuristic Dashboard States (Removed in favor of embedded PremiumTradingTerminal)

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
      img: "https://placehold.co/150x150/170105/D4AF37/png?text=VK"
    },
    {
      heading: "Professional Growth",
      text: "The mentorship and expert guidance here helped me build both technical depth and leadership confidence. The network of industry leaders is unmatched.",
      name: "Charles Harrison",
      meta: "Senior Tech Consultant",
      rating: 5,
      img: "https://placehold.co/150x150/170105/D4AF37/png?text=CH"
    },
    {
      heading: "Industry Success",
      text: "Thanks to the real-world insights shared by specialists, I was able to solve critical challenges at my startup from day one. Truly career-ready skills.",
      name: "Aravind Sharma",
      meta: "Co-Founder, Fintech Solutions",
      rating: 5,
      img: "https://placehold.co/150x150/170105/D4AF37/png?text=AS"
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

  // Mobile Menu Body Scroll Lock
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [mobileMenuOpen]);

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

      // 4. Admissions Section Animation Sequence
      if (document.querySelector('#admissions')) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: '#admissions',
            start: 'top 65%',
            once: true
          }
        });

        tl.fromTo('.admissions-left-content',
          { opacity: 0, x: prefersReducedMotion ? 0 : -50 },
          { opacity: 1, x: 0, duration: 1.0, ease: 'power3.out' }
        );

        tl.fromTo('.admissions-right-content',
          { opacity: 0, x: prefersReducedMotion ? 0 : 50, scale: prefersReducedMotion ? 1 : 0.97 },
          { opacity: 1, x: 0, scale: 1, duration: 1.2, ease: 'power3.out' },
          '-=0.8'
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
          style={{ backgroundImage: `url(${homeImg})`, filter: 'brightness(0.70) contrast(1.12) saturate(1.18)' }}
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
            <span className="text-white font-bold">LEAD TOMORROW.</span>
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
    <section id="why-choose-us" className="py-20 md:py-32 bg-white text-center">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        <div className="mb-16">
          <span className="font-sans uppercase text-gold-dark text-[11px] tracking-[0.2em] font-semibold block mb-3">
            Heritage of Distinction
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-burgundy mb-6">
            Why Choose Beever Academy?
          </h2>
          <div className="w-[80px] h-[2px] bg-gold-gradient mx-auto mb-8"></div>
          <p className="text-sm md:text-base text-text-secondary max-w-[900px] mx-auto leading-relaxed text-justify md:text-center">
            At Beever Academy, we are committed to delivering an educational experience that goes beyond the classroom. Our focus is on providing premium financial education through practical learning, experienced professionals, and a student-first approach. Every aspect of our academy is designed to help learners build knowledge, confidence, and the skills required to succeed in an ever-evolving financial landscape.
          </p>
        </div>

        <div className="features-grid-el grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: <GraduationCap className="w-[28px] h-[28px] text-burgundy group-hover:text-gold group-hover:scale-105 transition-all duration-300" />,
              title: "Premium Financial Education",
              desc: "Experience high-quality learning designed to meet professional standards while remaining accessible through affordable pricing."
            },
            {
              icon: <TrendingUp className="w-[28px] h-[28px] text-burgundy group-hover:text-gold group-hover:scale-105 transition-all duration-300" />,
              title: "Practical Learning",
              desc: "Our training approach emphasizes real-world understanding, helping learners develop practical knowledge that can be applied with confidence."
            },
            {
              icon: <Award className="w-[28px] h-[28px] text-burgundy group-hover:text-gold group-hover:scale-105 transition-all duration-300" />,
              title: "20+ Years of Collective Expertise",
              desc: "Benefit from the combined knowledge and experience of professionals from different corners of the financial industry."
            },
            {
              icon: <Shield className="w-[28px] h-[28px] text-burgundy group-hover:text-gold group-hover:scale-105 transition-all duration-300" />,
              title: "Affordable Excellence",
              desc: "We believe that premium financial education should be accessible without compromising quality, ensuring exceptional value for every learner."
            },
            {
              icon: <Users className="w-[28px] h-[28px] text-burgundy group-hover:text-gold group-hover:scale-105 transition-all duration-300" />,
              title: "Student-Centered Learning",
              desc: "Every learner's journey matters. We are committed to creating a supportive environment that encourages continuous learning and personal growth."
            },
            {
              icon: <Trophy className="w-[28px] h-[28px] text-burgundy group-hover:text-gold group-hover:scale-105 transition-all duration-300" />,
              title: "A Commitment to Excellence",
              desc: "Our goal is to empower individuals with the knowledge, discipline, and mindset needed to build a strong foundation for lifelong learning and professional success."
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

        <div className="mt-16 text-center">
          <p className="font-serif text-2xl md:text-3xl text-burgundy italic font-semibold">
            "Learn Today. Lead Tomorrow."
          </p>
        </div>
      </div>
    </section>
  );

  const renderAbout = () => (
    <section id="about" className="py-20 md:py-32 bg-ivory">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        <div className="about-grid-el grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Visual Column */}
          <div className="about-img-box-el relative border border-burgundy/10 p-[15px] bg-white shadow-md rounded-2xl">
            <img src="https://placehold.co/800x600/170105/D4AF37/png?text=About+Beever+Academy" alt="Grand Academy Facade" className="w-full h-[280px] sm:h-[380px] lg:h-[480px] object-cover rounded-xl" />
            
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
            <h2 className="text-4xl md:text-5xl font-serif text-burgundy mb-4 font-medium">
              About Beever Academy
            </h2>
            <h3 className="text-lg md:text-xl font-serif text-gold-dark mb-6 font-medium italic">
              Premium Financial Education. Affordable for Everyone.
            </h3>
            <div className="w-[80px] h-[2px] bg-gold-gradient mb-8"></div>
            
            <div className="text-sm text-text-secondary leading-relaxed flex flex-col gap-6 mb-10 text-justify">
              <p>
                At Beever Academy, we believe that quality financial education should be accessible to everyone. Our vision is to deliver premium, industry-focused learning at an affordable price, empowering individuals with the knowledge, confidence, and practical skills needed to succeed in today's dynamic financial world.
              </p>
              <p>
                Founded by a team of professionals from different corners of the financial industry, Beever Academy brings together more than 20 years of collective expertise across financial markets, trading, wealth management, leadership, sales, and professional development. This diverse experience enables us to deliver practical, relevant, and career-focused education that reflects real industry standards.
              </p>
              <p>
                Our programs are designed to bridge the gap between theory and real-world application. Through expert mentorship, interactive learning, and a modern training environment, we equip our students with the skills, discipline, and mindset required to make informed decisions, seize new opportunities, and build successful careers.
              </p>
              <p>
                At Beever Academy, we don't just teach financial concepts. We inspire confidence, develop future professionals, and empower individuals to achieve lasting success.
              </p>
              <p className="font-serif text-lg md:text-xl text-burgundy italic font-semibold mt-2">
                "Learn Today. Lead Tomorrow."
              </p>
            </div>

            {/* Stats Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 border-t border-burgundy/10 pt-8">
              <div>
                <div className="font-serif text-2xl font-bold text-burgundy mb-1">20+ Years</div>
                <div className="font-sans text-[11px] uppercase tracking-wider text-gold-dark font-semibold">Collective Industry Expertise</div>
              </div>
              <div>
                <div className="font-serif text-2xl font-bold text-burgundy mb-1">Premium Education</div>
                <div className="font-sans text-[11px] uppercase tracking-wider text-gold-dark font-semibold">World-Class Learning at Affordable Pricing</div>
              </div>
              <div>
                <div className="font-serif text-2xl font-bold text-burgundy mb-1">Practical Learning</div>
                <div className="font-sans text-[11px] uppercase tracking-wider text-gold-dark font-semibold">Industry-Focused Training with Real-World Application</div>
              </div>
              <div>
                <div className="font-serif text-2xl font-bold text-burgundy mb-1">Career Growth</div>
                <div className="font-sans text-[11px] uppercase tracking-wider text-gold-dark font-semibold">Building Skills for Long-Term Success</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  const renderGlobalNetwork = () => (
    <section id="global-network" className="py-20 md:py-32 bg-[#170105] text-center text-white relative overflow-hidden">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a0206] via-transparent to-[#1a0206] pointer-events-none z-10"></div>
      
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 relative z-20">
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
    <section id="programs" className="py-20 md:py-32 bg-white text-center">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        <div className="mb-16">
          <span className="font-sans uppercase text-gold-dark text-[11px] tracking-[0.2em] font-semibold block mb-3">
            Where Knowledge Meets Opportunity
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-burgundy mb-6 font-medium">
            Our Program
          </h2>
          <div className="w-[80px] h-[2px] bg-gold-gradient mx-auto mb-8"></div>
          <p className="text-sm md:text-base text-text-secondary max-w-[900px] mx-auto leading-relaxed text-justify md:text-center">
            The journey to success in the financial markets begins with a strong foundation. At Beever Academy, we believe that lasting success is built through knowledge, discipline, and practical understanding. Our program is carefully designed to help learners develop the confidence, skills, and mindset required to navigate today's financial markets with clarity and purpose.
          </p>
        </div>

        {/* FMMTA Program Card Layout */}
        <div className="strengths-grid-el grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch text-left bg-ivory/40 p-6 md:p-12 rounded-3xl border border-burgundy/10 shadow-lg mt-12">
          {/* Visual Column */}
          <div className="strength-card-el lg:col-span-5 relative group overflow-hidden rounded-2xl border border-gold/20 shadow-md">
            <img 
              src="https://placehold.co/800x600/170105/D4AF37/png?text=FMMTA+Program" 
              alt="FMMTA Classroom Training" 
              className="w-full h-full min-h-[320px] md:min-h-[400px] object-cover transition-transform duration-700 group-hover:scale-105" 
            />
            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-burgundy-dark/95 via-burgundy-dark/30 to-transparent"></div>
            {/* Badge overlay */}
            <span className="absolute top-4 left-4 bg-gold text-burgundy-dark font-sans text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-full shadow-lg">
              Primary Program
            </span>
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <h4 className="font-serif text-xl text-gold mb-2">Build the Foundation.</h4>
              <p className="text-xs text-white/80 leading-relaxed font-sans">Learn key market mechanics and technical analytical strategies.</p>
            </div>
          </div>

          {/* Details Column */}
          <div className="strength-card-el lg:col-span-7 flex flex-col justify-between h-full py-2">
            <div>
              <span className="font-sans text-[11px] uppercase tracking-wider text-gold-dark font-bold mb-2 block">
                FMMTA Course
              </span>
              <h3 className="text-2xl md:text-3xl font-serif text-burgundy mb-6 leading-tight">
                Foundation Market Mechanics & Technical Analysis (FMMTA)
              </h3>
              
              <div className="text-sm text-text-secondary leading-relaxed flex flex-col gap-6 text-justify">
                <p>
                  The Foundation Market Mechanics & Technical Analysis (FMMTA) program is the first step toward understanding how financial markets truly operate. Designed with a practical and structured approach, the program introduces learners to the core principles of market mechanics and technical analysis, helping them build a solid foundation before advancing to higher levels of financial education.
                </p>
                <p>
                  Whether you are taking your first step into the world of financial markets or looking to strengthen your understanding of market behavior, FMMTA provides the essential knowledge required to begin your learning journey with confidence.
                </p>
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-burgundy/10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <p className="font-serif text-xl md:text-2xl text-burgundy italic font-semibold">
                  "Build the Foundation. Master the Markets."
                </p>
              </div>
              <div className="self-start sm:self-center">
                <a 
                  href="#contact" 
                  className="btn btn-gold gold-gradient-bg text-burgundy-dark px-8 py-3.5 font-semibold uppercase tracking-widest text-xs shadow-md hover:shadow-lg hover:-translate-y-[2px] transition-all duration-300 inline-block text-center whitespace-nowrap"
                >
                  Enquire Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  const renderJourney = () => {
    return (
      <section id="admissions" className="py-20 md:py-32 bg-[#0c0103] text-left relative overflow-hidden">
        {/* Cinematic Backdrop Volumetric lighting */}
        <div className="absolute inset-0 bg-radial-gradient from-burgundy-dark/45 via-[#0c0103] to-[#090001] pointer-events-none z-0"></div>
        <div className="light-blob light-blob-gold z-0 opacity-25"></div>
        <div className="light-blob light-blob-burgundy z-0 opacity-40"></div>

        {/* Faint Background Particle System */}
        <AdmissionsBackgroundParticles />

        {/* Backdrop Grid Pattern */}
        <div className="absolute inset-0 terminal-grid-bg opacity-35 z-0 pointer-events-none"></div>

        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* LEFT COLUMN: Text Copy */}
            <div className="lg:col-span-5 flex flex-col justify-center select-none z-10 text-white pr-0 lg:pr-8 admissions-left-content">
              <span className="font-sans uppercase text-gold text-[11px] tracking-[0.2em] font-semibold block mb-4 animate-pulse">
                ADMISSIONS & ENROLLMENT
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-[52px] font-serif leading-[1.1] text-white mb-6 font-bold tracking-wide">
                Master the Markets<br/>
                <span className="text-gold">with Confidence.</span>
              </h2>
              <div className="w-[80px] h-[2px] bg-gold mb-6 opacity-60"></div>
              <p className="text-sm md:text-base text-white/70 font-light leading-relaxed mb-8 max-w-[520px]">
                Beever Academy offers Dubai's premier environment for high-end financial markets training and strategic wealth development. Gain access to expert instruction, institutional-grade tools, and real-time market simulators. Join a cohort of high-performing leaders, master liquidity dynamics, and advance your trading journey today.
              </p>
              
              <div className="admission-action-btn relative z-10">
                <a href="#contact" className="inline-flex btn px-8 py-4 font-semibold uppercase tracking-widest shadow-lg hover:shadow-xl hover:-translate-y-[2px] transition-all duration-300 items-center gap-2 gold-gradient-bg text-burgundy-dark font-sans text-xs">
                  <span>Start Your Trading Journey</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* RIGHT COLUMN: Interactive Embedded Trading Terminal */}
            <div className="lg:col-span-7 w-full overflow-hidden border border-gold/15 bg-black rounded-2xl shadow-2xl relative z-10 admissions-right-content">
              <PremiumTradingTerminal />
            </div>

          </div>
        </div>
      </section>
    );
  };

  const renderInsideGallery = () => (
    <section id="blog" className="py-20 md:py-32 bg-white text-center">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
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
              img: "https://placehold.co/600x400/170105/D4AF37/png?text=Interactive+Learning",
              desc: "Engage in collaborative workshops using modern educational technology and collaborative teaching setups."
            },
            {
              title: "Expert-Led Workshops",
              img: "https://placehold.co/600x400/170105/D4AF37/png?text=Expert+Workshops",
              desc: "Gain hands-on problem solving insights led directly by top industry practitioners."
            },
            {
              title: "Collaborative Learning Environment",
              img: "https://placehold.co/600x400/170105/D4AF37/png?text=Collaborative+Study",
              desc: "Modern study environments built to nurture teamwork, cooperation, and group study projects."
            },
            {
              title: "Professional Mentorship",
              img: "https://placehold.co/600x400/170105/D4AF37/png?text=Mentorship",
              desc: "One-on-one professional counseling guidance to layout clear long-term career growth plans."
            },
            {
              title: "Career Development Programs",
              img: "https://placehold.co/600x400/170105/D4AF37/png?text=Career+Development",
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
      <section id="careers" className="py-20 md:py-32 bg-ivory text-center relative">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
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
    <section id="testimonials" className="py-20 md:py-32 bg-ivory">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
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
    <section id="contact" className="py-20 md:py-32 bg-white">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        <div className="text-center mb-16">
          <span className="font-sans uppercase text-gold-dark text-[11px] tracking-[0.2em] font-semibold block mb-3">
            Contact Us
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-burgundy mb-6 font-medium">
            Learn Today. Lead Tomorrow.
          </h2>
          <div className="w-[80px] h-[2px] bg-gold-gradient mx-auto mb-8"></div>
          <p className="text-sm md:text-base text-text-secondary max-w-[850px] mx-auto leading-relaxed text-justify md:text-center">
            Ready to begin your learning journey with Beever Academy? Our team is here to assist you with program details, admissions support, and general enquiries. We welcome you to connect with us and take the first step toward premium financial education.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Form Wrap */}
          <div className="lg:col-span-7 bg-ivory p-10 sm:p-14 border border-black/5 rounded-2xl shadow-sm text-left">
            <h3 className="text-2xl font-serif text-burgundy mb-8 font-semibold">Contact Form</h3>
            <form onSubmit={handleInquirySubmit} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="font-sans text-[10px] font-semibold uppercase tracking-wider text-burgundy-dark">Full Name</label>
                <input type="text" id="name" placeholder="John Doe" required className="font-sans text-sm p-4 border border-burgundy/10 bg-white rounded-xl focus:outline-none focus:border-gold-dark focus:ring-4 focus:ring-gold/15 transition-all duration-200" />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="phone" className="font-sans text-[10px] font-semibold uppercase tracking-wider text-burgundy-dark">Phone Number</label>
                <input type="tel" id="phone" placeholder="+971 50 000 0000" required className="font-sans text-sm p-4 border border-burgundy/10 bg-white rounded-xl focus:outline-none focus:border-gold-dark focus:ring-4 focus:ring-gold/15 transition-all duration-200" />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="msg" className="font-sans text-[10px] font-semibold uppercase tracking-wider text-burgundy-dark">Message</label>
                <textarea id="msg" rows="5" placeholder="Your enquiry details..." required className="font-sans text-sm p-4 border border-burgundy/10 bg-white rounded-xl focus:outline-none focus:border-gold-dark focus:ring-4 focus:ring-gold/15 transition-all duration-200"></textarea>
              </div>

              <button 
                type="submit" 
                disabled={formStatus.loading}
                className="btn btn-burgundy bg-burgundy hover:bg-burgundy-light text-white font-semibold uppercase tracking-widest py-4 w-full cursor-pointer rounded-xl disabled:opacity-75 hover:-translate-y-[2px] shadow-sm hover:shadow-md transition-all duration-300"
              >
                {formStatus.loading ? 'PROCESSING...' : 'Submit Enquiry'}
              </button>
            </form>
          </div>

          {/* Info Cards Wrap */}
          <div className="lg:col-span-5 flex flex-col gap-8 text-left">
            {[
              { 
                icon: <MapPin className="w-5.5 h-5.5" />, 
                title: "Visit Us", 
                desc: (
                  <>
                    Office No. 4904<br />
                    Aspin Commercial Tower<br />
                    Sheikh Zayed Road<br />
                    Dubai, United Arab Emirates
                  </>
                )
              },
              { 
                icon: <Phone className="w-5.5 h-5.5" />, 
                title: "Call Us", 
                desc: "+971 4 892 3151" 
              },
              { 
                icon: <MessageSquare className="w-5.5 h-5.5" />, 
                title: "WhatsApp", 
                desc: "+971 50 702 1275" 
              },
              { 
                icon: <Clock className="w-5.5 h-5.5" />, 
                title: "Business Hours", 
                desc: (
                  <>
                    Monday to Sunday<br />
                    10:00 AM to 10:00 PM
                  </>
                )
              }
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

            <div className="h-[220px] bg-cover bg-center border border-black/5 rounded-2xl shadow-sm relative overflow-hidden" style={{ backgroundImage: "url('https://placehold.co/800x400/170105/D4AF37/png?text=Aspin+Tower%2C+Dubai')" }}>
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
    <div className="min-h-screen text-charcoal font-sans bg-white relative overflow-x-hidden">
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
      <nav className={`fixed top-0 left-0 w-full z-[1000] transition-all duration-300 ${isScrolled ? 'py-4 bg-[#1a0206] border-b border-gold/10 shadow-md' : 'py-6 bg-[#1a0206]/95 border-b border-burgundy/20 shadow-sm'}`}>
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
        <div className="fixed inset-0 bg-burgundy-dark z-[990] flex flex-col justify-start items-center overflow-y-auto pt-28 pb-12 transition-all duration-500">
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
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 py-20 md:py-28 text-left">
          
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
                <span>Office No. 4904, Aspin Commercial Tower, Sheikh Zayed Road, Dubai, UAE</span>
              </li>
              <li className="flex gap-4 items-start">
                <Phone className="w-[18px] h-[18px] text-gold mt-[2px] flex-shrink-0" />
                <span>+971 4 892 3151</span>
              </li>
              <li className="flex gap-4 items-start">
                <MessageSquare className="w-[18px] h-[18px] text-gold mt-[2px] flex-shrink-0" />
                <span>WhatsApp: +971 50 702 1275</span>
              </li>
              <li className="flex gap-4 items-start">
                <Clock className="w-[18px] h-[18px] text-gold mt-[2px] flex-shrink-0" />
                <span>Mon - Sun: 10:00 AM - 10:00 PM</span>
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
