import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';

interface MenuItemProps {
    label: string;
    index: number;
}

const bobAnimation = keyframes`
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
`;

const glowAnimation = keyframes`
    0%, 100% { filter: drop-shadow(0 0 5px rgba(0, 255, 0, 0.7)); }
    50% { filter: drop-shadow(0 0 20px rgba(0, 255, 0, 0.9)); }
`;

const ItemContainer = styled.div<{ index: number }>`
    position: absolute;
    animation: ${bobAnimation} 3s ease-in-out infinite,
    ${glowAnimation} 4s ease-in-out infinite;
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
    background: linear-gradient(to bottom, rgba(0, 255, 0, 0.5), rgba(0, 255, 0, 0));
    top: -100vh;
    bottom: 100%;
    left: 50%;
`;

interface ItemBubbleProps {
    isHovered: boolean;
}

const ItemBubble = styled.div<ItemBubbleProps>`
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background-color: ${props => props.isHovered ? 'rgba(0, 255, 0, 0.25)' : 'rgba(0, 255, 0, 0.15)'};
    border: 2px solid ${props => props.isHovered ? 'rgba(0, 255, 0, 0.5)' : 'rgba(0, 255, 0, 0.3)'};
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.3s ease;
    cursor: pointer;
`;

const ItemText = styled.span<ItemBubbleProps>`
    color: ${props => props.isHovered ? '#ffffff' : '#00ff00'};
    font-family: 'Orbitron', sans-serif;
    font-size: 16px;
    text-transform: lowercase;
    letter-spacing: 1px;
    transition: all 0.3s ease;
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