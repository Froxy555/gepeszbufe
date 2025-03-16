import React, { useContext } from 'react'
import './Header.css'
import { StoreContext } from '../../Context/StoreContext'

const Header = () => {
    const { showLogin } = useContext(StoreContext)

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
                {!showLogin && (
                    <button 
                        onClick={scrollToMenu}
                        style={{ position: 'relative', zIndex: 1, cursor: 'pointer' }}
                    >
                        Vásárlás
                    </button>
                )}
            </div>
        </div>
    )
}

export default Header