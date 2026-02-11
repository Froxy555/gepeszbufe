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
        <div className='header section animate-fade-up'>
            <div className='header-contents'>
                <h2>
                    Rendeld meg<br />
                    kedvenc ételeid<br />
                    sorbanállás nélkül
                </h2>
                <p>
                    Válaszd ki, rendeld meg online, és mi szólunk, amikor átveheted – sorban állás helyett pár kattintás.
                </p>
                <button 
                    onClick={scrollToMenu}
                    style={{ position: 'relative', zIndex: 1, cursor: 'pointer' }}
                    className="header-buy-button"
                >
                    Vásárlás
                </button>
            </div>
        </div>
    )
}

export default Header