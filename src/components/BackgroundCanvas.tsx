import React, { useRef, useEffect, useCallback } from 'react';
import { useStore } from '@/store/useStore';

interface Particle {
    x: number;
    y: number;
    baseX: number;
    baseY: number;
    vx: number;
    vy: number;
    size: number;
    alpha: number;
    color: string;
}

interface FloatingShape {
    x: number;
    y: number;
    baseX: number;
    baseY: number;
    size: number;
    rotation: number;
    rotationSpeed: number;
    type: 'hexagon' | 'triangle' | 'circle' | 'line' | 'square' | 'diamond' | 'plus' | 'dash';
    color: string;
    alpha: number;
}

interface ZodiacConstellation {
    name: string;
    stars: { x: number; y: number }[];
    connections: [number, number][];
    baseX: number;
    baseY: number;
    scale: number;
    alpha: number;
}

// Zodiac constellation patterns (simplified star positions)
const ZODIAC_PATTERNS: { name: string; stars: { x: number; y: number }[]; connections: [number, number][] }[] = [
    { name: 'Aries', stars: [{ x: 0, y: 0 }, { x: 20, y: -10 }, { x: 35, y: -5 }, { x: 50, y: 5 }], connections: [[0, 1], [1, 2], [2, 3]] },
    { name: 'Taurus', stars: [{ x: 0, y: 0 }, { x: 15, y: -15 }, { x: 30, y: -10 }, { x: 45, y: 0 }, { x: 25, y: 10 }, { x: 40, y: 15 }], connections: [[0, 1], [1, 2], [2, 3], [2, 4], [3, 5]] },
    { name: 'Gemini', stars: [{ x: 0, y: 0 }, { x: 10, y: -20 }, { x: 25, y: -25 }, { x: 40, y: 0 }, { x: 50, y: -20 }, { x: 60, y: -25 }], connections: [[0, 1], [1, 2], [3, 4], [4, 5], [0, 3]] },
    { name: 'Cancer', stars: [{ x: 0, y: 0 }, { x: 20, y: -15 }, { x: 40, y: -10 }, { x: 30, y: 5 }, { x: 15, y: 15 }], connections: [[0, 1], [1, 2], [1, 3], [3, 4]] },
    { name: 'Leo', stars: [{ x: 0, y: 0 }, { x: 15, y: -20 }, { x: 35, y: -25 }, { x: 50, y: -15 }, { x: 55, y: 0 }, { x: 40, y: 10 }, { x: 20, y: 5 }], connections: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 0]] },
    { name: 'Virgo', stars: [{ x: 0, y: 0 }, { x: 20, y: -10 }, { x: 40, y: -15 }, { x: 60, y: -10 }, { x: 50, y: 5 }, { x: 30, y: 10 }], connections: [[0, 1], [1, 2], [2, 3], [2, 4], [4, 5], [5, 1]] },
    { name: 'Libra', stars: [{ x: 0, y: 0 }, { x: 25, y: -20 }, { x: 50, y: 0 }, { x: 25, y: 15 }], connections: [[0, 1], [1, 2], [0, 3], [2, 3]] },
    { name: 'Scorpio', stars: [{ x: 0, y: 0 }, { x: 15, y: -5 }, { x: 30, y: 0 }, { x: 45, y: 5 }, { x: 60, y: 0 }, { x: 70, y: -10 }, { x: 75, y: -20 }], connections: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6]] },
    { name: 'Sagittarius', stars: [{ x: 0, y: 0 }, { x: 20, y: -15 }, { x: 40, y: -20 }, { x: 25, y: 5 }, { x: 45, y: -5 }, { x: 60, y: -10 }], connections: [[0, 1], [1, 2], [1, 3], [1, 4], [4, 5]] },
    { name: 'Capricorn', stars: [{ x: 0, y: 0 }, { x: 20, y: -15 }, { x: 40, y: -10 }, { x: 50, y: 5 }, { x: 35, y: 15 }, { x: 15, y: 10 }], connections: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0]] },
    { name: 'Aquarius', stars: [{ x: 0, y: 0 }, { x: 15, y: -10 }, { x: 30, y: -5 }, { x: 45, y: -10 }, { x: 55, y: 0 }, { x: 65, y: 10 }], connections: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5]] },
    { name: 'Pisces', stars: [{ x: 0, y: 0 }, { x: 15, y: -10 }, { x: 30, y: -5 }, { x: 45, y: -15 }, { x: 50, y: 0 }, { x: 60, y: 10 }, { x: 70, y: 5 }], connections: [[0, 1], [1, 2], [2, 3], [2, 4], [4, 5], [5, 6]] },
];

/**
 * Lightweight 2D Canvas background with zodiac constellations.
 * Features:
 * - Floating geometric shapes (hexagons, triangles, circles, lines, squares, diamonds, plus signs, dashes)
 * - Zodiac constellation stars with connecting lines
 * - Particle field
 * - Mouse parallax effect
 * - Scroll-responsive movement
 */
const BackgroundCanvas: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>(0);
    const particlesRef = useRef<Particle[]>([]);
    const shapesRef = useRef<FloatingShape[]>([]);
    const constellationsRef = useRef<ZodiacConstellation[]>([]);
    const mouseRef = useRef({ x: 0.5, y: 0.5 });
    const scrollRef = useRef(0);
    const lastFrameTimeRef = useRef(0);
    const dprRef = useRef(1);
    const timeRef = useRef(0);

    // Get quality settings for adaptive performance
    const qualitySettings = useStore((state) => state.qualitySettings);
    const targetFPS = qualitySettings?.targetFPS || 60;
    const frameInterval = 1000 / targetFPS;

    // Color palette matching the portfolio theme
    const colors = {
        primary: 'rgba(74, 144, 164, ',    // #4a90a4 - blue
        accent: 'rgba(212, 165, 116, ',     // #d4a574 - amber
        subtle: 'rgba(136, 180, 212, ',     // #88b4d4 - light blue
        dark: 'rgba(26, 58, 74, ',          // #1a3a4a - dark blue
        star: 'rgba(255, 255, 255, ',       // white for stars
    };

    // Initialize particles, shapes, and constellations
    const initElements = useCallback((width: number, height: number) => {
        // Particle count - more particles for visual interest
        const particleCount = targetFPS < 30 ? 50 : 100;
        // Many more shapes for a richer background
        const shapeCount = targetFPS < 30 ? 25 : 50;

        // Create particles (small stars and dots)
        particlesRef.current = Array.from({ length: particleCount }, () => {
            const x = Math.random() * width;
            const y = Math.random() * height;
            return {
                x,
                y,
                baseX: x,
                baseY: y,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                size: Math.random() * 2.5 + 0.5,
                alpha: Math.random() * 0.6 + 0.2,
                color: Math.random() > 0.3 ? colors.star : (Math.random() > 0.5 ? colors.primary : colors.accent),
            };
        });

        // Create floating shapes with more variety
        const shapeTypes: FloatingShape['type'][] = ['hexagon', 'triangle', 'circle', 'line', 'square', 'diamond', 'plus', 'dash'];
        shapesRef.current = Array.from({ length: shapeCount }, (_, i) => {
            const x = Math.random() * width;
            const y = Math.random() * height;
            return {
                x,
                y,
                baseX: x,
                baseY: y,
                size: Math.random() * 50 + 15,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.003,
                type: shapeTypes[i % shapeTypes.length],
                color: [colors.primary, colors.accent, colors.subtle, colors.dark][i % 4],
                alpha: Math.random() * 0.2 + 0.05,
            };
        });

        // Initialize zodiac constellations distributed across the canvas
        constellationsRef.current = ZODIAC_PATTERNS.map((pattern, index) => ({
            ...pattern,
            baseX: (width / 4) + (index % 4) * (width / 4) + (Math.random() - 0.5) * 100,
            baseY: (height / 4) + Math.floor(index / 4) * (height / 3) + (Math.random() - 0.5) * 100,
            scale: 1.5 + Math.random() * 0.5,
            alpha: 0.3 + Math.random() * 0.2,
        }));
    }, [targetFPS, colors.primary, colors.accent, colors.subtle, colors.dark, colors.star]);

    // Draw a hexagon
    const drawHexagon = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rotation: number) => {
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = rotation + (Math.PI / 3) * i;
            const px = x + size * Math.cos(angle);
            const py = y + size * Math.sin(angle);
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
    };

    // Draw a triangle
    const drawTriangle = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rotation: number) => {
        ctx.beginPath();
        for (let i = 0; i < 3; i++) {
            const angle = rotation + (Math.PI * 2 / 3) * i - Math.PI / 2;
            const px = x + size * Math.cos(angle);
            const py = y + size * Math.sin(angle);
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
    };

    // Draw a square
    const drawSquare = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rotation: number) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        ctx.beginPath();
        ctx.rect(-size / 2, -size / 2, size, size);
        ctx.restore();
    };

    // Draw a diamond
    const drawDiamond = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rotation: number) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        ctx.beginPath();
        ctx.moveTo(0, -size);
        ctx.lineTo(size * 0.6, 0);
        ctx.lineTo(0, size);
        ctx.lineTo(-size * 0.6, 0);
        ctx.closePath();
        ctx.restore();
    };

    // Draw a plus sign
    const drawPlus = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rotation: number) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        ctx.beginPath();
        ctx.moveTo(-size, 0);
        ctx.lineTo(size, 0);
        ctx.moveTo(0, -size);
        ctx.lineTo(0, size);
        ctx.restore();
    };

    // Draw a dash
    const drawDash = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rotation: number) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        ctx.beginPath();
        ctx.moveTo(-size, 0);
        ctx.lineTo(size, 0);
        ctx.restore();
    };

    // Main animation loop
    const animate = useCallback((timestamp: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Frame rate limiting for low-end devices
        const elapsed = timestamp - lastFrameTimeRef.current;
        if (elapsed < frameInterval) {
            animationRef.current = requestAnimationFrame(animate);
            return;
        }
        lastFrameTimeRef.current = timestamp - (elapsed % frameInterval);

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = dprRef.current;
        const width = canvas.width / dpr;
        const height = canvas.height / dpr;

        // Reset transform and apply DPR scaling for this frame
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        // Clear with dark gradient background
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, 'hsl(220, 20%, 8%)');
        gradient.addColorStop(1, 'hsl(220, 25%, 4%)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // Mouse parallax offset
        const mouseOffsetX = (mouseRef.current.x - 0.5) * 30;
        const mouseOffsetY = (mouseRef.current.y - 0.5) * 20;

        // Scroll parallax offset
        const scrollOffset = scrollRef.current * 0.1;

        // Draw floating shapes (back layer)
        shapesRef.current.forEach((shape, index) => {
            // Parallax factor based on shape index (depth)
            const parallaxFactor = 0.3 + (index * 0.1);

            // Update position with mouse and scroll parallax
            shape.x = shape.baseX + mouseOffsetX * parallaxFactor;
            shape.y = shape.baseY + mouseOffsetY * parallaxFactor - scrollOffset * parallaxFactor;

            // Wrap around screen
            if (shape.y < -shape.size) shape.baseY += height + shape.size * 2;
            if (shape.y > height + shape.size) shape.baseY -= height + shape.size * 2;

            // Rotate slowly
            shape.rotation += shape.rotationSpeed;

            ctx.save();
            ctx.strokeStyle = shape.color + shape.alpha + ')';
            ctx.lineWidth = 1;

            switch (shape.type) {
                case 'hexagon':
                    drawHexagon(ctx, shape.x, shape.y, shape.size, shape.rotation);
                    ctx.stroke();
                    break;
                case 'triangle':
                    drawTriangle(ctx, shape.x, shape.y, shape.size, shape.rotation);
                    ctx.stroke();
                    break;
                case 'circle':
                    ctx.beginPath();
                    ctx.arc(shape.x, shape.y, shape.size, 0, Math.PI * 2);
                    ctx.stroke();
                    break;
                case 'line':
                    ctx.beginPath();
                    const lineLength = shape.size * 1.5;
                    ctx.moveTo(
                        shape.x + Math.cos(shape.rotation) * lineLength,
                        shape.y + Math.sin(shape.rotation) * lineLength
                    );
                    ctx.lineTo(
                        shape.x - Math.cos(shape.rotation) * lineLength,
                        shape.y - Math.sin(shape.rotation) * lineLength
                    );
                    ctx.stroke();
                    break;
                case 'square':
                    drawSquare(ctx, shape.x, shape.y, shape.size, shape.rotation);
                    ctx.stroke();
                    break;
                case 'diamond':
                    drawDiamond(ctx, shape.x, shape.y, shape.size, shape.rotation);
                    ctx.stroke();
                    break;
                case 'plus':
                    drawPlus(ctx, shape.x, shape.y, shape.size, shape.rotation);
                    ctx.stroke();
                    break;
                case 'dash':
                    drawDash(ctx, shape.x, shape.y, shape.size, shape.rotation);
                    ctx.stroke();
                    break;
            }
            ctx.restore();
        });

        // Update time for twinkling effect
        timeRef.current += 0.02;

        // Draw zodiac constellations
        constellationsRef.current.forEach((constellation) => {
            const offsetX = constellation.baseX + mouseOffsetX * 0.2;
            const offsetY = constellation.baseY + mouseOffsetY * 0.2 - scrollOffset * 0.15;

            ctx.save();

            // Draw constellation connection lines
            ctx.strokeStyle = `rgba(136, 180, 212, ${constellation.alpha * 0.5})`;
            ctx.lineWidth = 1;
            ctx.setLineDash([3, 6]);

            constellation.connections.forEach(([startIdx, endIdx]) => {
                const startStar = constellation.stars[startIdx];
                const endStar = constellation.stars[endIdx];
                if (startStar && endStar) {
                    ctx.beginPath();
                    ctx.moveTo(
                        offsetX + startStar.x * constellation.scale,
                        offsetY + startStar.y * constellation.scale
                    );
                    ctx.lineTo(
                        offsetX + endStar.x * constellation.scale,
                        offsetY + endStar.y * constellation.scale
                    );
                    ctx.stroke();
                }
            });

            ctx.setLineDash([]);

            // Draw stars with twinkling effect
            constellation.stars.forEach((star, starIdx) => {
                const twinkle = Math.sin(timeRef.current * 2 + starIdx * 0.5) * 0.3 + 0.7;
                const starX = offsetX + star.x * constellation.scale;
                const starY = offsetY + star.y * constellation.scale;
                const starSize = 2 + Math.random() * 0.5;

                // Star glow
                const glowGradient = ctx.createRadialGradient(starX, starY, 0, starX, starY, starSize * 4);
                glowGradient.addColorStop(0, `rgba(255, 255, 255, ${constellation.alpha * twinkle * 0.8})`);
                glowGradient.addColorStop(0.5, `rgba(136, 180, 212, ${constellation.alpha * twinkle * 0.3})`);
                glowGradient.addColorStop(1, 'transparent');
                ctx.fillStyle = glowGradient;
                ctx.fillRect(starX - starSize * 4, starY - starSize * 4, starSize * 8, starSize * 8);

                // Star core
                ctx.beginPath();
                ctx.arc(starX, starY, starSize * twinkle, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${constellation.alpha * twinkle})`;
                ctx.fill();

                // Star outline (4-point star shape)
                ctx.strokeStyle = `rgba(255, 255, 255, ${constellation.alpha * twinkle * 0.5})`;
                ctx.lineWidth = 0.5;
                const rayLength = starSize * 3 * twinkle;
                ctx.beginPath();
                ctx.moveTo(starX - rayLength, starY);
                ctx.lineTo(starX + rayLength, starY);
                ctx.moveTo(starX, starY - rayLength);
                ctx.lineTo(starX, starY + rayLength);
                ctx.stroke();
            });

            ctx.restore();
        });

        // Draw particles
        particlesRef.current.forEach((particle) => {
            // Apply mouse parallax
            particle.x = particle.baseX + mouseOffsetX * 0.5;
            particle.y = particle.baseY + mouseOffsetY * 0.5 - scrollOffset * 0.3;

            // Slow drift
            particle.baseX += particle.vx;
            particle.baseY += particle.vy;

            // Wrap around screen
            if (particle.baseX < 0) particle.baseX = width;
            if (particle.baseX > width) particle.baseX = 0;
            if (particle.baseY < 0) particle.baseY = height;
            if (particle.baseY > height) particle.baseY = 0;

            // Draw particle
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = particle.color + particle.alpha + ')';
            ctx.fill();
        });

        // Add subtle gradient overlay for depth
        const radialGradient = ctx.createRadialGradient(
            width * 0.5, height * 0.3, 0,
            width * 0.5, height * 0.3, width * 0.7
        );
        radialGradient.addColorStop(0, 'rgba(74, 144, 164, 0.03)');
        radialGradient.addColorStop(1, 'transparent');
        ctx.fillStyle = radialGradient;
        ctx.fillRect(0, 0, width, height);

        animationRef.current = requestAnimationFrame(animate);
    }, [frameInterval]);

    // Handle resize
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const handleResize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            dprRef.current = dpr;
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            canvas.style.width = window.innerWidth + 'px';
            canvas.style.height = window.innerHeight + 'px';

            initElements(window.innerWidth, window.innerHeight);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [initElements]);

    // Handle mouse movement
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = {
                x: e.clientX / window.innerWidth,
                y: e.clientY / window.innerHeight,
            };
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Handle scroll
    useEffect(() => {
        const handleScroll = () => {
            scrollRef.current = window.scrollY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Start animation
    useEffect(() => {
        animationRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationRef.current);
    }, [animate]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none"
            style={{
                zIndex: -20,
                background: 'linear-gradient(180deg, hsl(220 20% 8%) 0%, hsl(220 25% 4%) 100%)',
            }}
        />
    );
};

export default BackgroundCanvas;
