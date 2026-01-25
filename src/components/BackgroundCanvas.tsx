import React, { useRef, useEffect, useCallback } from 'react';
import { useStore } from '@/store/useStore';
import { useGyroscope } from '@/hooks/use-gyroscope';

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

interface MechanicalGear {
    x: number;
    y: number;
    baseX: number;
    baseY: number;
    radius: number;
    teeth: number;
    rotation: number;
    rotationSpeed: number;
    baseRotationSpeed: number; // Original rotation speed
    angularVelocity: number; // Current angular velocity with friction applied
    alpha: number;
    type: 'spur' | 'helical' | 'planetary';
}

interface MechanicalBolt {
    x: number;
    y: number;
    baseX: number;
    baseY: number;
    size: number;
    alpha: number;
    rotation: number;
    rotationSpeed: number;
    baseRotationSpeed: number;
    angularVelocity: number;
}

interface MechanicalSpring {
    x: number;
    y: number;
    baseX: number;
    baseY: number;
    length: number;
    rotation: number;
    alpha: number;
}

// Drawing functions for mechanical elements
const drawGear = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, teeth: number, rotation: number, type: 'spur' | 'helical' | 'planetary') => {
    const toothHeight = radius * 0.25;
    const innerRadius = radius - toothHeight;
    const toothWidth = 0.4;

    ctx.beginPath();

    // Draw gear teeth using lineTo for cleaner rendering
    for (let i = 0; i < teeth; i++) {
        const angle1 = (i / teeth) * Math.PI * 2 + rotation;
        const angle2 = ((i + toothWidth * 0.5) / teeth) * Math.PI * 2 + rotation;
        const angle3 = ((i + toothWidth) / teeth) * Math.PI * 2 + rotation;
        const angle4 = ((i + 1) / teeth) * Math.PI * 2 + rotation;

        if (i === 0) {
            ctx.moveTo(x + innerRadius * Math.cos(angle1), y + innerRadius * Math.sin(angle1));
        }

        // Inner arc to tooth base
        ctx.lineTo(x + innerRadius * Math.cos(angle1), y + innerRadius * Math.sin(angle1));
        // Up to tooth tip
        ctx.lineTo(x + radius * Math.cos(angle2), y + radius * Math.sin(angle2));
        // Across tooth tip
        ctx.lineTo(x + radius * Math.cos(angle3), y + radius * Math.sin(angle3));
        // Down from tooth
        ctx.lineTo(x + innerRadius * Math.cos(angle3), y + innerRadius * Math.sin(angle3));
        // Inner arc to next tooth
        ctx.lineTo(x + innerRadius * Math.cos(angle4), y + innerRadius * Math.sin(angle4));
    }

    ctx.closePath();

    // Center hole
    ctx.moveTo(x + radius * 0.3, y);
    ctx.arc(x, y, radius * 0.3, 0, Math.PI * 2, false);

    // Hub spokes for planetary type
    if (type === 'planetary') {
        for (let i = 0; i < 4; i++) {
            const angle = (i / 4) * Math.PI * 2 + rotation;
            ctx.moveTo(x + Math.cos(angle) * radius * 0.3, y + Math.sin(angle) * radius * 0.3);
            ctx.lineTo(x + Math.cos(angle) * innerRadius, y + Math.sin(angle) * innerRadius);
        }
    }
};

const drawCenterline = (ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) => {
    const dashLength = 10;
    const gapLength = 5;
    const dx = x2 - x1;
    const dy = y2 - y1;
    const length = Math.sqrt(dx * dx + dy * dy);
    const steps = Math.floor(length / (dashLength + gapLength));

    ctx.beginPath();
    for (let i = 0; i < steps; i++) {
        const t1 = (i * (dashLength + gapLength)) / length;
        const t2 = (i * (dashLength + gapLength) + dashLength) / length;
        ctx.moveTo(x1 + dx * t1, y1 + dy * t1);
        ctx.lineTo(x1 + dx * t2, y1 + dy * t2);
    }
};

const drawDimensionLine = (ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) => {
    // Main dimension line
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);

    // Arrows at ends
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const arrowSize = 8;

    // Start arrow
    ctx.moveTo(x1, y1);
    ctx.lineTo(x1 + arrowSize * Math.cos(angle + 2.8), y1 + arrowSize * Math.sin(angle + 2.8));
    ctx.moveTo(x1, y1);
    ctx.lineTo(x1 + arrowSize * Math.cos(angle - 2.8), y1 + arrowSize * Math.sin(angle - 2.8));

    // End arrow
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - arrowSize * Math.cos(angle + 2.8), y2 - arrowSize * Math.sin(angle + 2.8));
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - arrowSize * Math.cos(angle - 2.8), y2 - arrowSize * Math.sin(angle - 2.8));
};

// Additional mechanical drawing functions
const drawBolt = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rotation: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);

    // Hexagonal head
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const px = size * Math.cos(angle);
        const py = size * Math.sin(angle);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
    }
    ctx.closePath();

    // Center circle
    ctx.moveTo(size * 0.4, 0);
    ctx.arc(0, 0, size * 0.4, 0, Math.PI * 2, false);

    ctx.restore();
};

const drawSpring = (ctx: CanvasRenderingContext2D, x: number, y: number, length: number, rotation: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);

    ctx.beginPath();
    const coils = 8;
    const amplitude = 6;
    for (let i = 0; i <= coils * 10; i++) {
        const t = i / (coils * 10);
        const xPos = t * length - length / 2;
        const yPos = Math.sin(t * Math.PI * 2 * coils) * amplitude;
        if (i === 0) ctx.moveTo(xPos, yPos);
        else ctx.lineTo(xPos, yPos);
    }
    ctx.restore();
};

const drawBlueprintGrid = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, gridSize: number) => {
    ctx.beginPath();
    // Vertical lines
    for (let i = 0; i <= width / gridSize; i++) {
        ctx.moveTo(x + i * gridSize, y);
        ctx.lineTo(x + i * gridSize, y + height);
    }
    // Horizontal lines
    for (let j = 0; j <= height / gridSize; j++) {
        ctx.moveTo(x, y + j * gridSize);
        ctx.lineTo(x + width, y + j * gridSize);
    }
};

const MECHANICAL_SYMBOLS: Record<string, (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, scale: number) => void> = {};


/**
 * Lightweight 2D Canvas background with mechanical engineering elements.
 * Features:
 * - Rotating mechanical gears (spur, helical, planetary)
 * - Technical drawing centerlines and dimension lines
 * - Floating geometric shapes (hexagons, triangles, circles, lines, squares, diamonds, plus signs, dashes)
 * - Particle field
 * - Mouse parallax effect
 * - Scroll-responsive movement
 */
interface BackgroundCanvasProps {
    gyroEnabled?: boolean;
}

const BackgroundCanvas: React.FC<BackgroundCanvasProps> = ({ gyroEnabled = false }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>(0);
    const particlesRef = useRef<Particle[]>([]);
    const shapesRef = useRef<FloatingShape[]>([]);
    const gearsRef = useRef<MechanicalGear[]>([]);
    const boltsRef = useRef<MechanicalBolt[]>([]);
    const springsRef = useRef<MechanicalSpring[]>([]);
    const mouseRef = useRef({ x: 0.5, y: 0.5 });
    const scrollRef = useRef(0);
    const lastScrollRef = useRef(0);
    const scrollSpeedMultiplierRef = useRef(1); // Smoothly interpolated multiplier
    const lastFrameTimeRef = useRef(0);
    const dprRef = useRef(1);
    const timeRef = useRef(0);

    // Use custom gyroscope hook
    const { gyroRef, isMobile } = useGyroscope(gyroEnabled);

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

        // Initialize mechanical gears with fixed positions for mobile stability
        const gearPositions = [
            { x: width * 0.15, y: height * 0.20, radius: 70, teeth: 12, type: 'spur' as const, speed: 0.001 },
            { x: width * 0.75, y: height * 0.35, radius: 60, teeth: 14, type: 'planetary' as const, speed: -0.0012 },
            { x: width * 0.40, y: height * 0.65, radius: 55, teeth: 16, type: 'helical' as const, speed: 0.0015 },
            { x: width * 0.85, y: height * 0.75, radius: 65, teeth: 10, type: 'spur' as const, speed: -0.0008 },
            { x: width * 0.20, y: height * 0.85, radius: 50, teeth: 12, type: 'planetary' as const, speed: 0.001 },
        ];

        gearsRef.current = gearPositions.map((pos) => ({
            x: 0,
            y: 0,
            baseX: pos.x,
            baseY: pos.y,
            radius: pos.radius,
            teeth: pos.teeth,
            rotation: 0,
            rotationSpeed: pos.speed,
            baseRotationSpeed: pos.speed,
            angularVelocity: 0,
            alpha: 0.6,
            type: pos.type,
        }));

        // Initialize bolts with fixed positions for mobile stability
        const boltPositions = [
            { x: width * 0.25, y: height * 0.15, size: 12 },
            { x: width * 0.60, y: height * 0.25, size: 14 },
            { x: width * 0.50, y: height * 0.50, size: 10 },
            { x: width * 0.15, y: height * 0.60, size: 16 },
            { x: width * 0.70, y: height * 0.70, size: 11 },
            { x: width * 0.90, y: height * 0.45, size: 13 },
            { x: width * 0.35, y: height * 0.90, size: 12 },
        ];

        boltsRef.current = boltPositions.map((pos, i) => ({
            x: 0,
            y: 0,
            baseX: pos.x,
            baseY: pos.y,
            size: pos.size,
            alpha: 0.4,
            rotation: 0,
            rotationSpeed: (i % 2 === 0 ? 0.0001 : -0.0001),
            baseRotationSpeed: (i % 2 === 0 ? 0.00005 : -0.00005),
            angularVelocity: 0,
        }));

        // Initialize springs with fixed positions
        const springPositions = [
            { x: width * 0.10, y: height * 0.40, length: 60, rotation: 0.3 },
            { x: width * 0.55, y: height * 0.15, length: 70, rotation: 1.2 },
            { x: width * 0.30, y: height * 0.75, length: 50, rotation: 2.1 },
            { x: width * 0.80, y: height * 0.60, length: 65, rotation: 0.8 },
            { x: width * 0.65, y: height * 0.85, length: 55, rotation: 1.7 },
        ];

        springsRef.current = springPositions.map((pos) => ({
            x: 0,
            y: 0,
            baseX: pos.x,
            baseY: pos.y,
            length: pos.length,
            rotation: pos.rotation,
            alpha: 0.3,
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

        // Parallax offset - only use mouse on desktop, disabled on mobile (scroll only)
        const mouseOffsetX = isMobile ? 0 : (mouseRef.current.x - 0.5) * 30;
        const mouseOffsetY = isMobile ? 0 : (mouseRef.current.y - 0.5) * 20;

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

        // Update time for rotation
        timeRef.current += 0.02;

        // Calculate scroll direction and velocity
        const currentScroll = scrollRef.current;
        const scrollDiff = currentScroll - lastScrollRef.current; // Positive = scrolling down, Negative = scrolling up
        const scrollDelta = Math.abs(scrollDiff);
        const scrollDirection = scrollDiff > 0 ? 1 : -1; // 1 for down, -1 for up
        lastScrollRef.current = currentScroll;

        // Very gentle speed multiplier for smooth rotation
        const targetScrollSpeedMultiplier = 1 + Math.min(scrollDelta * 0.01, 0.5); // Max 1.5x speed, much slower

        // Smooth interpolation: gradually return to normal speed when scrolling stops
        const lerpFactor = scrollDelta > 0 ? 0.08 : 0.03; // Slower acceleration and deceleration
        scrollSpeedMultiplierRef.current += (targetScrollSpeedMultiplier - scrollSpeedMultiplierRef.current) * lerpFactor;
        const scrollSpeedMultiplier = scrollSpeedMultiplierRef.current;

        // Very slow scroll-based rotation that reverses with scroll direction
        const scrollRotation = scrollDelta * 0.0001 * scrollDirection; // Much slower, direction-aware

        // Higher friction for smoother, slower movement
        const friction = 0.92; // 8% slowdown per frame for slower coasting

        // Draw mechanical gears
        gearsRef.current.forEach((gear, index) => {
            const offsetX = gear.baseX + mouseOffsetX * 0.2;
            const offsetY = gear.baseY + mouseOffsetY * 0.2 - scrollOffset * 0.15;

            // Apply scroll boost to angular velocity (direction-aware)
            if (scrollDelta > 0) {
                // Add scroll energy with direction - gears reverse when scrolling up
                gear.angularVelocity += scrollRotation + gear.baseRotationSpeed * (scrollSpeedMultiplier - 1) * scrollDirection;
            }

            // Apply friction to angular velocity
            gear.angularVelocity *= friction;

            // Update gear position and rotation
            gear.x = offsetX;
            gear.y = offsetY;
            gear.rotation += gear.angularVelocity;

            ctx.save();

            // Draw gear with stronger presence
            ctx.strokeStyle = `rgba(212, 165, 116, ${gear.alpha})`;
            ctx.lineWidth = 2.5;
            ctx.shadowColor = `rgba(212, 165, 116, ${gear.alpha * 0.6})`;
            ctx.shadowBlur = 10;

            drawGear(ctx, gear.x, gear.y, gear.radius, gear.teeth, gear.rotation, gear.type);
            ctx.stroke();

            ctx.restore();

            // Draw centerlines between some adjacent gears
            if (index > 0 && index % 4 === 0) {
                const prevGear = gearsRef.current[index - 1];
                if (prevGear) {
                    const prevOffsetX = prevGear.baseX + mouseOffsetX * 0.2;
                    const prevOffsetY = prevGear.baseY + mouseOffsetY * 0.2 - scrollOffset * 0.15;

                    ctx.save();
                    ctx.strokeStyle = `rgba(136, 180, 212, ${(gear.alpha + prevGear.alpha) * 0.3})`;
                    ctx.lineWidth = 1.5;
                    drawCenterline(ctx, prevOffsetX, prevOffsetY, gear.x, gear.y);
                    ctx.stroke();
                    ctx.restore();
                }
            }

            // Draw dimension lines for some gears
            if (index % 5 === 0 && gear.radius > 50) {
                ctx.save();
                ctx.strokeStyle = `rgba(74, 144, 164, ${gear.alpha * 0.4})`;
                ctx.lineWidth = 1;
                drawDimensionLine(
                    ctx,
                    gear.x - gear.radius,
                    gear.y - gear.radius - 15,
                    gear.x + gear.radius,
                    gear.y - gear.radius - 15
                );
                ctx.stroke();
                ctx.restore();
            }

            // Draw center crosshair for some gears
            if (index % 3 === 1) {
                ctx.save();
                ctx.strokeStyle = `rgba(212, 165, 116, ${gear.alpha * 0.5})`;
                ctx.lineWidth = 1;
                const crossSize = gear.radius * 0.2;
                ctx.beginPath();
                ctx.moveTo(gear.x - crossSize, gear.y);
                ctx.lineTo(gear.x + crossSize, gear.y);
                ctx.moveTo(gear.x, gear.y - crossSize);
                ctx.lineTo(gear.x, gear.y + crossSize);
                ctx.stroke();
                ctx.restore();
            }
        });

        // Draw bolts
        boltsRef.current.forEach((bolt) => {
            bolt.x = bolt.baseX + mouseOffsetX * 0.15;
            bolt.y = bolt.baseY + mouseOffsetY * 0.15 - scrollOffset * 0.1;

            // Apply scroll boost to bolt angular velocity (direction-aware)
            if (scrollDelta > 0) {
                bolt.angularVelocity += scrollRotation * 0.5 + bolt.baseRotationSpeed * (scrollSpeedMultiplier - 1) * scrollDirection;
            }

            // Apply friction to bolt angular velocity
            bolt.angularVelocity *= friction;

            // Update bolt rotation
            bolt.rotation += bolt.angularVelocity;

            ctx.save();
            ctx.strokeStyle = `rgba(136, 180, 212, ${bolt.alpha})`;
            ctx.fillStyle = `rgba(136, 180, 212, ${bolt.alpha * 0.3})`;
            ctx.lineWidth = 1.5;
            drawBolt(ctx, bolt.x, bolt.y, bolt.size, bolt.rotation);
            ctx.fill();
            ctx.stroke();
            ctx.restore();
        });

        // Draw springs
        springsRef.current.forEach((spring) => {
            spring.x = spring.baseX + mouseOffsetX * 0.18;
            spring.y = spring.baseY + mouseOffsetY * 0.18 - scrollOffset * 0.12;

            ctx.save();
            ctx.strokeStyle = `rgba(212, 165, 116, ${spring.alpha})`;
            ctx.lineWidth = 2;
            drawSpring(ctx, spring.x, spring.y, spring.length, spring.rotation);
            ctx.stroke();
            ctx.restore();
        });

        // Draw blueprint grid sections in corners
        ctx.save();
        ctx.strokeStyle = `rgba(74, 144, 164, 0.08)`;
        ctx.lineWidth = 0.5;
        drawBlueprintGrid(ctx, 0, 0, width * 0.2, height * 0.2, 20);
        ctx.stroke();
        drawBlueprintGrid(ctx, width * 0.8, height * 0.8, width * 0.2, height * 0.2, 20);
        ctx.stroke();
        ctx.restore();

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

    // Handle mouse movement (desktop)
    useEffect(() => {
        if (isMobile) return; // Skip mouse events on mobile

        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = {
                x: e.clientX / window.innerWidth,
                y: e.clientY / window.innerHeight,
            };
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [isMobile]);

    // Gyroscope is now handled by the useGyroscope custom hook

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
