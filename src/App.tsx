import React, {useMemo, useState, useEffect, useCallback} from 'react';
import styled, { createGlobalStyle, keyframes } from 'styled-components';
import { debounce } from 'lodash';
import MenuItem from './components/MenuItem';
import SelectButton from './components/SelectButton';
import Particles from './components/Particles';
import moveLeftSound from './MoveLeft.mp3';
import moveRightSound from './MoveRight.mp3';

import DigitalDistortion from './components/DigitalDistortion';
import exp from "node:constants";

const GlobalStyle = createGlobalStyle`
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap');

    body {
        margin: 0;
        padding: 0;
        font-family: 'Orbitron', sans-serif;
        background-color: #001200;
        overflow: hidden;
    }
`;

const backgroundPulse = keyframes`
    0%, 100% { background-color: #001200; }
    50% { background-color: #002200; }
`;

const AppContainer = styled.div`
    width: 100vw;
    height: 100vh;
    background-image:
            radial-gradient(circle at 50% 50%, rgba(0, 255, 0, 0.1) 0%, transparent 70%),
            linear-gradient(0deg, rgba(0, 50, 0, 0.2) 0%, transparent 100%);
    animation: ${backgroundPulse} 8s ease-in-out infinite;
    display: flex;
    justify-content: space-around;
    align-items: flex-end;
    overflow: hidden;
    position: relative;
`;

const GridOverlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image:
            linear-gradient(rgba(0, 255, 0, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 0, 0.1) 1px, transparent 1px);
    background-size: 50px 50px;
    pointer-events: none;
`;

const CentralOrb = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: radial-gradient(circle at center, rgba(0, 255, 0, 0.7) 0%, rgba(0, 255, 0, 0) 70%);
    animation: ${backgroundPulse} 4s ease-in-out infinite;
    pointer-events: none;
`;

const SegmentContainer = styled.div`
    position: relative;
    width: 20%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    transform-origin: center bottom;
    transition: all 0.3s ease-out;
`;
const strandPulse = keyframes`
    0%, 100% { opacity: 0.3; filter: drop-shadow(0 0 5px rgba(0, 255, 0, 0.5)); }
    50% { opacity: 0.5; filter: drop-shadow(0 0 15px rgba(0, 255, 0, 0.7)); }
`;

const StrandSVG = styled.svg`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
`;

const StrandPath = styled.path<{ delay: number }>`
    fill: none;
    stroke: rgba(0, 255, 0, 0.4);
    stroke-width: 2px;
    animation: ${strandPulse} ${props => 4 + props.delay}s ease-in-out infinite;
    animation-delay: ${props => props.delay}s;
`;

interface Point {
    x: number;
    y: number;
}

const SEGMENTS = 100;
const INFLUENCE_RADIUS = 200;
const INFLUENCE_STRENGTH = 0.5;

const generateRandomPosition = () => {
    return Math.floor(Math.random() * (75 - 25 + 1) + 25);
};

const generateControlPoints = (width: number, height: number, segments: number, seed: number): Point[] => {
    const points: Point[] = [];
    for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const x = width * 0.5 + Math.sin(t * Math.PI * 2 + seed) * (width * 0.4);
        const y = height * t;
        points.push({ x, y });
    }
    return points;
};

const applyMenuItemInfluence = (point: Point, menuItem: { x: number; y: number }, strength: number): Point => {
    const dx = menuItem.x - point.x;
    const dy = menuItem.y - point.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < INFLUENCE_RADIUS) {
        const influence = Math.pow((INFLUENCE_RADIUS - distance) / INFLUENCE_RADIUS, 2) * strength;
        return {
            x: point.x + dx * influence,
            y: point.y + dy * influence
        };
    }
    return point;
};

const MobileGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(3, 1fr);
    gap: 5vmin;
    width: 90vw;
    height: 90vh;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 5vmin;
    box-sizing: border-box;
    z-index: 30;
`;

const MobileStrandContainer = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 20;
`;

const MobileMessage = styled.div`
    position: absolute;
    top: 20px;
    left: 20px;
    right: 20px;
    background-color: rgba(0, 255, 0, 0.2);
    color: #ffffff;
    padding: 10px;
    border-radius: 5px;
    font-size: 14px;
    text-align: center;
    z-index: 40;
`;

const DesktopLayout = styled.div`
    @media (max-width: 768px) {
        display: none;
    }
`;

interface StrandProps {
    width: number;
    height: number;
    menuItemY: number;
    delay: number;
    seed: number;
}

const Strand: React.FC<StrandProps> = ({ width, height, menuItemY, delay, seed }) => {
    const points = useMemo(() => {
        const basePoints = generateControlPoints(width, height, SEGMENTS, seed);
        return basePoints.map(point => applyMenuItemInfluence(point, { x: width / 2, y: menuItemY }, INFLUENCE_STRENGTH));
    }, [width, height, menuItemY, seed]);

    const path = useMemo(() => {
        return `M ${points[0].x} ${points[0].y} ` +
            points.slice(1).map((point, index) => {
                const prevPoint = points[index];
                const midX = (prevPoint.x + point.x) / 2;
                const midY = (prevPoint.y + point.y) / 2;
                return `Q ${prevPoint.x} ${prevPoint.y} ${midX} ${midY}`;
            }).join(' ');
    }, [points]);

    return <StrandPath d={path} delay={delay} />;
};

interface MenuItemData {
    label: string;
    link: string;
}

const App: React.FC = () => {
    const menuItems = [
        { label: 'GitHub', link: 'https://github.com/50SACINMYSOCIDGAF' },
        { label: 'Email', link: 'mailto:contact@noah.jp.net' },
        { label: 'Blog', link: 'https://medium.com/@noah_44244' },
        { label: 'Discord', link: 'https://discordlookup.com/user/1106369952501481534' },
        { label: 'Portfolio', link: 'https://noah.jp.net/portfolio/' }
    ];

    const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
    const [isLoaded, setIsLoaded] = useState(false);
    const [selectedItemIndex, setSelectedItemIndex] = useState<number>(0);

    const [safeArea, setSafeArea] = useState({ left: 0, right: 0, top: 0, bottom: 0 });

    const calculateSafeArea = useCallback(() => {
        const maxItemSize = Math.min(windowSize.width, windowSize.height) * 0.18 * 1.5;
        const glowRadius = maxItemSize * 0.5; // Account for glow effect
        const newSafeArea = {
            left: maxItemSize + glowRadius,
            right: windowSize.width - (maxItemSize + glowRadius),
            top: maxItemSize + glowRadius,
            bottom: windowSize.height - (maxItemSize + glowRadius)
        };
        setSafeArea(newSafeArea);
    }, [windowSize]);

    useEffect(() => {
        calculateSafeArea();
    }, [windowSize, calculateSafeArea]);

    const generatePositions = useCallback((itemCount: number): { x: number; y: number }[] => {
        const positions: { x: number; y: number }[] = [];
        const maxAttempts = 100;
        const itemRadius = Math.min(windowSize.width, windowSize.height) * 0.18 * 0.75; // Consider the minimum size

        const isColliding = (pos: { x: number; y: number }) => {
            return positions.some(existingPos => {
                const dx = pos.x - existingPos.x;
                const dy = pos.y - existingPos.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                return distance < itemRadius * 2; // Ensure items don't overlap
            });
        };

        for (let i = 0; i < itemCount; i++) {
            let attempts = 0;
            let newPosition;

            do {
                const x = Math.random() * (safeArea.right - safeArea.left) + safeArea.left;
                const y = Math.random() * (safeArea.bottom - safeArea.top) + safeArea.top;
                newPosition = { x, y };
                attempts++;
            } while (isColliding(newPosition) && attempts < maxAttempts);

            if (attempts < maxAttempts) {
                positions.push({
                    x: (newPosition.x / windowSize.width) * 100,
                    y: (newPosition.y / windowSize.height) * 100
                });
            } else {
                console.warn(`Could not find non-colliding position for item ${i}`);
                // Fallback: place item at the center
                positions.push({ x: 50, y: 50 });
            }
        }
        return positions;
    }, [safeArea, windowSize]);

    const randomPositions = useMemo(() => generatePositions(menuItems.length), [generatePositions, menuItems.length]);


    const leftMoveSound = useMemo(() => new Audio(moveLeftSound), []);
    const rightMoveSound = useMemo(() => new Audio(moveRightSound), []);

    useEffect(() => {
        const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        window.addEventListener('resize', handleResize);
        const loadTimer = setTimeout(() => setIsLoaded(true), 100);

        const handleKeyDown = (event: KeyboardEvent) => {
            if (windowSize.width <= 768) return;

            switch (event.key) {
                case 'ArrowLeft':
                    setSelectedItemIndex((prev) => {
                        const newIndex = (prev - 1 + menuItems.length) % menuItems.length;
                        leftMoveSound.currentTime = 0;
                        leftMoveSound.play();
                        return newIndex;
                    });
                    break;
                case 'ArrowRight':
                    setSelectedItemIndex((prev) => {
                        const newIndex = (prev + 1) % menuItems.length;
                        rightMoveSound.currentTime = 0;
                        rightMoveSound.play();
                        return newIndex;
                    });
                    break;
                case 'Enter':
                    if (selectedItemIndex !== -1) {
                        window.open(menuItems[selectedItemIndex].link, '_blank');
                    }
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('keydown', handleKeyDown);
            clearTimeout(loadTimer);
        };
    }, [windowSize, menuItems, selectedItemIndex, leftMoveSound, rightMoveSound]);


    const segmentWidth = windowSize.width / menuItems.length;
    const segmentHeight = windowSize.height;


    const isMobile = windowSize.width <= 768;

    const mobileItemSize = useMemo(() => {
        return Math.min(windowSize.width, windowSize.height) * 0.3;
    }, [windowSize]);

    return (
        <>
            <GlobalStyle />
            <AppContainer>
                <GridOverlay />
                <CentralOrb />
                <Particles />
                <DigitalDistortion />
                {!isMobile ? (
                    <>
                        {menuItems.map((item, index) => (
                            <SegmentContainer key={item.label}>
                                <StrandSVG>
                                    <Strand
                                        width={segmentWidth}
                                        height={segmentHeight}
                                        menuItemY={(randomPositions[index].y / 100) * segmentHeight}
                                        delay={index * 0.2}
                                        seed={index * 2}
                                    />
                                    <Strand
                                        width={segmentWidth}
                                        height={segmentHeight}
                                        menuItemY={(randomPositions[index].y / 100) * segmentHeight}
                                        delay={index * 0.2}
                                        seed={index * 2}
                                    />
                                </StrandSVG>
                                <MenuItem
                                    label={item.label}
                                    link={item.link}
                                    index={index}
                                    randomPosition={randomPositions[index]}
                                    windowSize={windowSize}
                                    isLoaded={isLoaded}
                                    isSelected={selectedItemIndex === index}
                                    position={randomPositions[index]}
                                    safeArea={safeArea}
                                />
                            </SegmentContainer>
                        ))}
                        <SelectButton windowSize={windowSize} />
                    </>
                ) : (
                    <>
                        <MobileMessage>
                            This page is not optimized for mobile usage. Please open it on desktop for the full experience.
                        </MobileMessage>
                        <MobileStrandContainer>
                            {menuItems.map((_, index) => (
                                <StrandSVG key={index}>
                                    <Strand
                                        width={windowSize.width}
                                        height={windowSize.height}
                                        menuItemY={(index + 1) * (windowSize.height / 6)}
                                        delay={index * 0.2}
                                        seed={index * 2}
                                    />
                                </StrandSVG>
                            ))}
                        </MobileStrandContainer>
                        <MobileGrid>
                            {menuItems.map((item, index) => (
                                <MenuItem
                                    key={item.label}
                                    label={item.label}
                                    link={item.link}
                                    index={index}
                                    randomPosition={{ x: 50, y: 50 }}
                                    windowSize={windowSize}
                                    isLoaded={isLoaded}
                                    isSelected={selectedItemIndex === index}
                                    position={{ x: 50, y: 50 }}
                                    safeArea={safeArea}
                                />
                            ))}
                            <SelectButton
                                windowSize={windowSize}
                            />
                        </MobileGrid>
                    </>
                )}
            </AppContainer>
        </>
    );
};

export default App;