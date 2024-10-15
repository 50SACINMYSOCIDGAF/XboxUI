import React from 'react';
import styled, { createGlobalStyle, keyframes } from 'styled-components';
import MenuItem from './components/MenuItem';


const GlobalStyle = createGlobalStyle`
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap');

    body {
        margin: 0;
        padding: 0;
        font-family: 'Orbitron', sans-serif;
        background-color: #000800;
        overflow: hidden;
    }
`;

const backgroundPulse = keyframes`
    0%, 100% { background-color: #000800; }
    50% { background-color: #001200; }
`;

const AppContainer = styled.div`
    width: 100vw;
    height: 100vh;
    background-image: radial-gradient(circle at 50% 50%, rgba(0, 255, 0, 0.1) 0%, transparent 50%);
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    animation: ${backgroundPulse} 10s ease-in-out infinite;
    position: relative;
`;

const curveAnimation = keyframes`
    0% { transform: translateY(-50%) rotate(0deg); }
    100% { transform: translateY(-50%) rotate(360deg); }
`;

const CurvedLine = styled.div<{ delay: number; reverse?: boolean }>`
    position: absolute;
    top: 50%;
    left: -50%;
    width: 200%;
    height: 200%;
    border: 1px solid rgba(0, 255, 0, 0.1);
    border-radius: 50%;
    animation: ${curveAnimation} ${props => props.reverse ? '40s' : '30s'} linear infinite;
    animation-delay: ${props => props.delay}s;
    animation-direction: ${props => props.reverse ? 'reverse' : 'normal'};
`;

const MenuContainer = styled.div`
    position: relative;
    width: 100%;
    height: 100%;

    @media (max-width: 768px) {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
`;

const App: React.FC = () => {
    const menuItems = ['Portfolio', 'Github', 'Discord', 'Blog', 'Contact'];

    return (
        <>
            <GlobalStyle />
            <AppContainer>
                {[...Array(5)].map((_, index) => (
                    <CurvedLine key={index} delay={index * -2} reverse={index % 2 === 0} />
                ))}
                <MenuContainer>
                    {menuItems.map((item, index) => (
                        <MenuItem key={item} label={item} index={index} />
                    ))}
                </MenuContainer>
            </AppContainer>
        </>
    );
};

export default App;