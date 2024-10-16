import React, { useState, useMemo } from 'react';
import styled, { keyframes, css } from 'styled-components';

interface MenuItemProps {
    label: string;
    link: string;
    index: number;
    randomPosition: number;
    windowSize: { width: number; height: number };
    isLoaded: boolean;
}

const bobAnimation = keyframes`
    0%, 100% { transform: translateY(0) translateX(-50%); }
    50% { transform: translateY(-3px) translateX(-50%); }
`;

const glowAnimation = keyframes`
    0%, 100% { filter: drop-shadow(0 0 5px rgba(0, 255, 0, 0.7)); }
    50% { filter: drop-shadow(0 0 15px rgba(0, 255, 0, 0.9)); }
`;

const pulseAnimation = keyframes`
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.05); opacity: 0.9; }
`;

const fadeInAnimation = keyframes`
    from { opacity: 0; transform: translateY(20px) translateX(-50%); }
    to { opacity: 1; transform: translateY(0) translateX(-50%); }
`;

const ItemContainer = styled.div<{ index: number; randomPosition: number; size: number; isLoaded: boolean }>`
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
    width: ${props => props.size}px;
    height: ${props => props.size}px;
    transition: top 1s ease-out;
    top: ${props => props.isLoaded ? `${props.randomPosition}%` : '50%'};

    animation: ${props => props.isLoaded ? css`
        ${bobAnimation} 4s ease-in-out infinite,
        ${glowAnimation} 5s ease-in-out infinite,
        ${fadeInAnimation} 1s ease-out
    ` : 'none'};
    animation-delay: ${props => `${props.index * 0.5}s, ${props.index * 0.7}s, ${props.index * 0.2}s`};
`;

const Strand = styled.div`
    position: absolute;
    width: 1px;
    background: linear-gradient(to bottom, rgba(0, 255, 0, 0.2), rgba(0, 255, 0, 0));
    top: -100vh;
    bottom: 100%;
    left: 50%;
    opacity: 0.5;
`;

interface ItemBubbleProps {
    isHovered: boolean;
    size: number;
}

const ItemBubble = styled.div<ItemBubbleProps>`
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: radial-gradient(
            circle at center,
            rgba(0, 255, 0, 0.1) 0%,
            rgba(0, 255, 0, 0.2) 50%,
            rgba(0, 255, 0, 0.4) 80%,
            rgba(0, 255, 0, 0.6) 100%
    );
    border: 2px solid rgba(0, 255, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.3s ease;
    cursor: pointer;
    box-shadow: 0 0 20px rgba(0, 255, 0, 0.5),
    inset 0 0 20px rgba(0, 255, 0, 0.5);
    animation: ${pulseAnimation} 3s ease-in-out infinite;

    &:hover {
        background: radial-gradient(
                circle at center,
                rgba(0, 255, 0, 0.2) 0%,
                rgba(0, 255, 0, 0.3) 50%,
                rgba(0, 255, 0, 0.5) 80%,
                rgba(0, 255, 0, 0.7) 100%
        );
        box-shadow: 0 0 30px rgba(0, 255, 0, 0.7),
        inset 0 0 30px rgba(0, 255, 0, 0.7);
    }
`;

const ItemText = styled.span<ItemBubbleProps>`
    color: #ffffff;
    font-family: 'Orbitron', sans-serif;
    font-size: ${props => props.size * 0.12}px;
    text-transform: lowercase;
    letter-spacing: 1px;
    transition: all 0.3s ease;
    text-shadow: 0 0 5px rgba(0, 255, 0, 0.8);
    opacity: ${props => props.isHovered ? 1 : 0.8};
`;

const ItemLink = styled.a`
    text-decoration: none;
    color: inherit;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const MenuItem: React.FC<MenuItemProps> = ({ label, link, index, randomPosition, windowSize, isLoaded }) => {
    const [isHovered, setIsHovered] = useState(false);

    const itemSize = useMemo(() => {
        const baseSize = Math.min(windowSize.width, windowSize.height) * 0.15;
        return Math.max(baseSize, 100); // Ensure a minimum size of 100px
    }, [windowSize]);

    return (
        <ItemContainer
            index={index}
            randomPosition={randomPosition}
            size={itemSize}
            isLoaded={isLoaded}
        >
            <Strand />
            <ItemBubble
                isHovered={isHovered}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                size={itemSize}
            >
                <ItemLink href={link} target="_blank" rel="noopener noreferrer">
                    <ItemText isHovered={isHovered} size={itemSize}>{label}</ItemText>
                </ItemLink>
            </ItemBubble>
        </ItemContainer>
    );
};

export default MenuItem;