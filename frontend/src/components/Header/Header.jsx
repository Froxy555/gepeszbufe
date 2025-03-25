import React from 'react'
import './Header.css'

const Header = () => {
    const scrollToMenu = () => {
        const menuSection = document.getElementById('explore-menu');
        if (menuSection) {
            menuSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    return (
        <div className='header'>
            <div className='header-contents'>
                <h2>Rendeld meg kedvenc ételeid sorbanállás nélkül</h2>
                <button 
                    onClick={scrollToMenu}
                    style={{ position: 'relative', zIndex: 1, cursor: 'pointer' }}
                    className="header-buy-button" // Add a unique class for easier styling/selection
                >
                    Vásárlás
                </button>
            </div>
        </div>
    )
}

export default Header