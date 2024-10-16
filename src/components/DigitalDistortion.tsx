import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

const DistortionCanvas = styled.canvas`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
`;

const DigitalDistortion: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const createDistortion = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const distortionCount = Math.floor(Math.random() * 10) + 5;

            for (let i = 0; i < distortionCount; i++) {
                const x = Math.random() * canvas.width;
                const y = Math.random() * canvas.height;
                const width = Math.random() * 100 + 50;
                const height = Math.random() * 10 + 5;

                ctx.fillStyle = `rgba(0, 255, 0, ${Math.random() * 0.1})`;
                ctx.fillRect(x, y, width, height);
            }

            setTimeout(createDistortion, Math.random() * 2000 + 1000);
        };

        createDistortion();

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return <DistortionCanvas ref={canvasRef} />;
};

export default DigitalDistortion;