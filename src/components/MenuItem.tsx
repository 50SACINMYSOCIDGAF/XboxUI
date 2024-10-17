import React, { useState, useMemo, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import exp from "node:constants";

interface MenuItemProps {
    label: string;
    link: string;
    index: number;
    randomPosition: { x: number; y: number };
    windowSize: { width: number; height: number };
    isLoaded: boolean;
    isSelected: boolean;
    position: { x: number; y: number };
    safeArea: { left: number; right: number; top: number; bottom: number };
}

const bobAnimation = keyframes`
    0%, 100% { transform: translateY(0) translateX(-50%) rotate(0deg); }
    50% { transform: translateY(-3px) translateX(-50%) rotate(2deg); }
`;

const glowAnimation = keyframes`
    0%, 100% { filter: drop-shadow(0 0 10px rgba(0, 255, 0, 0.8)); }
    50% { filter: drop-shadow(0 0 25px rgba(0, 255, 0, 1)); }
`;

const pulseAnimation = keyframes`
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.05); opacity: 0.9; }
`;

const fadeInAnimation = keyframes`
    from { opacity: 0; transform: translateY(20px) translateX(-50%) scale(0.8); }
    to { opacity: 1; transform: translateY(0) translateX(-50%) scale(1); }
`;

const typingAnimation = keyframes`
    from { width: 0; }
    to { width: 100%; }
`;

const ItemContainer = styled.div<{
    size: number;
    isSelected: boolean;
}>`
    position: absolute;
    left: 50%;
    width: ${props => props.size}px;
    height: ${props => props.size}px;
    transform: translateX(-50%);
    transition: all 0.3s ease-out;

    @media (min-width: 769px) {
        transform: translateX(-50%) scale(${props => props.isSelected ? 1.5 : 0.75});
        z-index: ${props => props.isSelected ? 20 : 10};
    }

    @media (max-width: 768px) {
        position: relative;
        left: auto;
        transform: none;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        max-width: 40vmin;
        max-height: 40vmin;
        -webkit-transform: scale(1);
    }
`;

const AnimatedWrapper = styled.div<{
    position: { x: number; y: number };
    isLoaded: boolean;
}>`
    position: absolute;
    left: ${props => props.position.x}%;
    top: ${props => props.isLoaded ? `${props.position.y}%` : '50%'};
    transition: all 1s ease-out;
    transform: translate(-50%, -50%);

    animation: ${props => props.isLoaded ? css`
        ${bobAnimation} 4s ease-in-out infinite,
        ${glowAnimation} 5s ease-in-out infinite,
        ${fadeInAnimation} 1s ease-out
    ` : 'none'};

    @media (max-width: 768px) {
        position: static;
        transform: none;
        animation: none;
        width: 100%;
        height: 100%;
    }
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
    isSelected: boolean; // New prop
}

const ItemBubble = styled.div<ItemBubbleProps>`
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: radial-gradient(
            circle at center,
            rgba(0, 255, 0, 0.2) 0%,
            rgba(0, 255, 0, 0.3) 50%,
            rgba(0, 255, 0, 0.5) 80%,
            rgba(0, 255, 0, 0.7) 100%
    );
    border: 2px solid rgba(0, 255, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.3s ease, transform 0.5s ease;
    cursor: pointer;
    box-shadow: ${props => props.isSelected
    ? '0 0 50px rgba(0, 255, 0, 0.9), inset 0 0 50px rgba(0, 255, 0, 0.9)'
    : '0 0 30px rgba(0, 255, 0, 0.7), inset 0 0 30px rgba(0, 255, 0, 0.7)'};
    animation: ${pulseAnimation} 3s ease-in-out infinite;
    aspect-ratio: 1;

    &:hover {
        transform: scale(1.1) rotate(5deg);
        box-shadow: 0 0 50px rgba(0, 255, 0, 0.9),
        inset 0 0 50px rgba(0, 255, 0, 0.9);
    }

    @media (max-width: 768px) {
        width: 100%;
        height: 100%;
        box-shadow: 0 0 15px rgba(0, 255, 0, 0.5),
        inset 0 0 15px rgba(0, 255, 0, 0.5);
        transform: none;
        -webkit-transform: scale(1);
        &:hover {
            transform: none;
        }
    }
`;

const ItemText = styled.span<ItemBubbleProps & { isTyping: boolean; isSelected: boolean }>`
    color: ${props => props.isSelected ? '#00ff00' : '#ffffff'};
    font-family: 'Orbitron', sans-serif;
    font-size: ${props => props.size * 0.18}px;
    text-transform: lowercase;
    letter-spacing: 1px;
    transition: all 0.3s ease;
    text-shadow: 0 0 5px rgba(0, 255, 0, 0.8);
    opacity: ${props => props.isHovered || props.isSelected ? 1 : 0.8};
    overflow: hidden;
    white-space: nowrap;
    animation: ${props => props.isTyping ? css`${typingAnimation} 1s steps(${props.children?.toString().length || 1}, end)` : 'none'};

    @media (max-width: 768px) {
        font-size: ${props => props.size * 0.3}px;
    }
`;

const ItemLink = styled.a`
    text-decoration: none;
    color: inherit;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    &:focus {
        outline: none;
        box-shadow: 0 0 0 3px rgba(0, 255, 0, 0.5);
    }
`;

const MenuItem: React.FC<MenuItemProps> = ({
                                               label,
                                               link,
                                               index,
                                               randomPosition,
                                               windowSize,
                                               isLoaded,
                                               isSelected,
                                               safeArea
                                           }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    const itemSize = useMemo(() => {
        if (windowSize.width <= 768) {
            return Math.min(windowSize.width, windowSize.height) * 0.2;
        }
        const baseSize = Math.min(windowSize.width, windowSize.height) * 0.18;
        return Math.max(baseSize, 120);
    }, [windowSize]);

    useEffect(() => {
        if (isLoaded) {
            const typingTimeout = setTimeout(() => setIsTyping(true), index * 500);
            return () => clearTimeout(typingTimeout);
        }
    }, [isLoaded, index]);

    const adjustedPosition = useMemo(() => {
        const maxSize = itemSize * (isSelected ? 1.5 : 1);
        const x = Math.max(safeArea.left, Math.min(safeArea.right - maxSize, randomPosition.x * windowSize.width / 100));
        const y = Math.max(safeArea.top, Math.min(safeArea.bottom - maxSize, randomPosition.y * windowSize.height / 100));
        return { x: (x / windowSize.width) * 100, y: (y / windowSize.height) * 100 };
    }, [randomPosition, windowSize, safeArea, itemSize, isSelected]);

    return (
        <AnimatedWrapper position={adjustedPosition} isLoaded={isLoaded}>
            <ItemContainer size={itemSize} isSelected={isSelected}>
                <ItemBubble
                    isHovered={isHovered}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    size={itemSize}
                    isSelected={isSelected}
                >
                    <ItemLink href={link} target="_blank" rel="noopener noreferrer">
                        <ItemText
                            isHovered={isHovered}
                            size={itemSize}
                            isTyping={isTyping}
                            isSelected={isSelected}
                        >
                            {label}
                        </ItemText>
                    </ItemLink>
                </ItemBubble>
            </ItemContainer>
        </AnimatedWrapper>
    );
};

export default MenuItem;