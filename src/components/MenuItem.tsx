import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';

interface MenuItemProps {
    label: string;
    index: number;
}

const bobAnimation = keyframes`
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-3px); }
`;

const glowAnimation = keyframes`
    0%, 100% { filter: drop-shadow(0 0 5px rgba(0, 255, 0, 0.7)); }
    50% { filter: drop-shadow(0 0 15px rgba(0, 255, 0, 0.9)); }
`;

const pulseAnimation = keyframes`
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.05); opacity: 0.9; }
`;

const ItemContainer = styled.div<{ index: number }>`
    position: absolute;
    animation: ${bobAnimation} 4s ease-in-out infinite,
               ${glowAnimation} 5s ease-in-out infinite;
    animation-delay: ${props => props.index * 0.5}s, ${props => props.index * 0.7}s;
    top: ${props => {
    switch (props.index) {
        case 0: return '25%';
        case 1: return '15%';
        case 2: return '45%';
        case 3: return '30%';
        case 4: return '60%';
        default: return '50%';
    }
}};
    left: ${props => {
    switch (props.index) {
        case 0: return '15%';
        case 1: return '40%';
        case 2: return '65%';
        case 3: return '80%';
        case 4: return '55%';
        default: return '50%';
    }
}};
    z-index: 10;

    @media (max-width: 768px) {
        position: relative;
        top: auto;
        left: auto;
        margin: 20px 0;
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
}

const ItemBubble = styled.div<ItemBubbleProps>`
    width: 150px;
    height: 150px;
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
    font-size: 18px;
    text-transform: lowercase;
    letter-spacing: 1px;
    transition: all 0.3s ease;
    text-shadow: 0 0 5px rgba(0, 255, 0, 0.8);
    opacity: ${props => props.isHovered ? 1 : 0.8};
`;

const MenuItem: React.FC<MenuItemProps> = ({ label, index }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <ItemContainer index={index}>
            <Strand />
            <ItemBubble
                isHovered={isHovered}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <ItemText isHovered={isHovered}>{label}</ItemText>
            </ItemBubble>
        </ItemContainer>
    );
};

export default MenuItem;