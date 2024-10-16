import React, { useState, useMemo } from 'react';
import styled, { keyframes } from 'styled-components';

interface SelectButtonProps {
    windowSize: { width: number; height: number };
}

const pulseAnimation = keyframes`
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.05); opacity: 0.9; }
`;

const glowAnimation = keyframes`
    0%, 100% { filter: drop-shadow(0 0 5px rgba(0, 255, 0, 0.7)); }
    50% { filter: drop-shadow(0 0 15px rgba(0, 255, 0, 0.9)); }
`;

const SelectContainer = styled.div<{ size: number }>`
    position: absolute;
    bottom: 20px;
    right: 20px;
    width: ${props => props.size}px;
    height: ${props => props.size}px;
    z-index: 20;

    @media (max-width: 768px) {
        position: relative;
        bottom: auto;
        right: auto;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
`;

const SelectBubble = styled.div<{ isHovered: boolean; size: number }>`
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
    cursor: pointer;
    box-shadow: 0 0 20px rgba(0, 255, 0, 0.5),
    inset 0 0 20px rgba(0, 255, 0, 0.5);
    animation: ${pulseAnimation} 3s ease-in-out infinite,
    ${glowAnimation} 5s ease-in-out infinite;
    transition: all 0.3s ease;

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

    @media (max-width: 768px) {
        width: 80%;
        height: 80%;
    }
`;

const SelectLink = styled.a`
    text-decoration: none;
    color: inherit;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const SelectText = styled.span<{ size: number }>`
    color: #ffffff;
    font-family: 'Orbitron', sans-serif;
    font-size: ${props => props.size * 0.12}px;
    text-transform: lowercase;
    letter-spacing: 1px;
    text-shadow: 0 0 5px rgba(0, 255, 0, 0.8);
    text-align: center;
    line-height: 1.2;
`;

const SelectButton: React.FC<SelectButtonProps> = ({ windowSize }) => {
    const [isHovered, setIsHovered] = useState(false);

    const buttonSize = useMemo(() => {
        const baseSize = Math.min(windowSize.width, windowSize.height) * 0.1;
        return Math.max(baseSize, 80);
    }, [windowSize]);

    return (
        <SelectContainer size={buttonSize}>
            <SelectBubble
                isHovered={isHovered}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                size={buttonSize}
            >
                <SelectLink
                    href="https://x.com/intent/follow?screen_name=immunity"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <SelectText size={buttonSize}>
                        Made by<br />Noah
                    </SelectText>
                </SelectLink>
            </SelectBubble>
        </SelectContainer>
    );
};

export default SelectButton;