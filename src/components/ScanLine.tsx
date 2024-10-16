import React from 'react';
import styled, { keyframes } from 'styled-components';

const scanAnimation = keyframes`
    0% { top: -50%; }
    100% { top: 100%; }
`;

const ScanLineContainer = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    overflow: hidden;
`;

const Line = styled.div`
    position: absolute;
    left: 0;
    right: 0;
    height: 50%;
    background: linear-gradient(to bottom, 
        rgba(0, 255, 0, 0) 0%,
        rgba(0, 255, 0, 0.1) 50%,
        rgba(0, 255, 0, 0) 100%
    );
    animation: ${scanAnimation} 5s linear infinite;
`;

const ScanLine: React.FC = () => {
    return (
        <ScanLineContainer>
            <Line />
        </ScanLineContainer>
    );
};

export default ScanLine;