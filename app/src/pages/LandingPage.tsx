import './LandingPage.css';

const LandingPage = () => {
    const titleStyle: React.CSSProperties = {
        fontSize: '5rem',
        textAlign: 'center',
        position: 'absolute',
        top: '35%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 10,
        color: 'white',
    };

    const subtitleStyle: React.CSSProperties = {
        fontSize: '2rem',
        textAlign: 'center',
        position: 'absolute',
        top: '55%',
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

    return (
        <div className="App" style={mainContainerStyle}>
            <div style={linkContainerStyle}>
                <a href="/login" style={linkStyle}>Login</a>
                <a href="/register" style={linkStyle}>Register</a>
            </div>
            <div className='custom-container'>
                <h1 id="landing-title" style={titleStyle}>Resume Review</h1>
                <p style={subtitleStyle}>Receive feedback at no cost!</p>
            </div>
        </div>
    );
}

export default LandingPage;
