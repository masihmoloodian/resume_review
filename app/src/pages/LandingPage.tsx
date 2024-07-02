import { useEffect, useState } from 'react';
import './LandingPage.css';

const LandingPage = () => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const handleResize = () => setWindowWidth(window.innerWidth);
    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);


    const titleStyle: React.CSSProperties = {
        fontSize: windowWidth <= 768 ? '2rem' : '5rem',
        textAlign: 'center',
        position: 'absolute',
        top: '35%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 10,
        color: 'white',
    };

    const subtitleStyle: React.CSSProperties = {
        fontSize: windowWidth <= 768 ? '1rem' : '2rem',
        textAlign: 'center',
        position: 'absolute',
        top: windowWidth <= 768 ? '45%' : '55%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 10,
        color: 'white',
    };

    const linkStyle: React.CSSProperties = {
        color: 'white',
        textDecoration: 'none',
        marginRight: '20px',
        cursor: 'pointer',
    };

    const linkContainerStyle: React.CSSProperties = {
        position: 'absolute',
        top: '20px',
        right: '20px',
        zIndex: 10,
    };

    const mainContainerStyle: React.CSSProperties = {
        height: '100vh',
        width: '100vw',
        backgroundColor: 'black',
        backgroundImage: `url('/looper.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
    };

    const footerStyle: React.CSSProperties = {
        position: 'absolute',
        bottom: '0',
        width: '100%',
        textAlign: 'center',
        color: 'white',
        fontSize: windowWidth <= 768 ? '0.5rem' : '1rem',
        padding: '10px 0', // Padding for visual comfort
    };

    const productLinkStyle: React.CSSProperties = {
        color: 'white',
        textDecoration: 'underline',
        cursor: 'pointer',
    };

    return (
        <div className="App" style={mainContainerStyle}>
            <div style={linkContainerStyle}>
                <a href="/login" style={linkStyle}>Login</a>
                <a href="/register" style={linkStyle}>Register</a>
            </div>
            <div className='custom-container'>
                <h1 id='landing-title' style={titleStyle}>Resume Review</h1>
                <p style={subtitleStyle}>Get review for free!</p>
            </div>
            <div style={footerStyle}>
                © 2024 AI Proxy. All rights reserved. | <a href="https://j3su.com" style={productLinkStyle}>A product of J3SU</a>
            </div>
        </div>
    );
}

export default LandingPage;
