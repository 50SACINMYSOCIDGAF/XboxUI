import React, { useMemo, useState, useEffect } from 'react';
import styled, { createGlobalStyle, keyframes } from 'styled-components';
import MenuItem from './components/MenuItem';

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
    background-image: radial-gradient(circle at 50% 50%, rgba(0, 255, 0, 0.1) 0%, transparent 70%);
    animation: ${backgroundPulse} 8s ease-in-out infinite;
    display: flex;
    justify-content: space-around;
    align-items: flex-end;
    overflow: hidden;
`;

const SegmentContainer = styled.div`
    position: relative;
    width: 20%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
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

const App: React.FC = () => {
    const menuItems = ['Games', 'Music', 'Movies', 'Memory', 'Settings'];
    const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
    const randomPositions = useMemo(() => menuItems.map(() => generateRandomPosition()), []);

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const segmentWidth = windowSize.width / menuItems.length;
    const segmentHeight = windowSize.height;

    return (
        <>
            <GlobalStyle />
            <AppContainer>
                {menuItems.map((item, index) => (
                    <SegmentContainer key={item}>
                        <StrandSVG>
                            <Strand
                                width={segmentWidth}
                                height={segmentHeight}
                                menuItemY={(randomPositions[index] / 100) * segmentHeight}
                                delay={index * 0.2}
                                seed={index * 2}
                            />
                            <Strand
                                width={segmentWidth}
                                height={segmentHeight}
                                menuItemY={(randomPositions[index] / 100) * segmentHeight}
                                delay={index * 0.2 + 0.1}
                                seed={index * 2 + 1}
                            />
                        </StrandSVG>
                        <MenuItem
                            label={item}
                            index={index}
                            randomPosition={randomPositions[index]}
                            windowSize={windowSize}
                        />
                    </SegmentContainer>
                ))}
            </AppContainer>
        </>
    );
};

export default App;