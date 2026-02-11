import React from 'react'
import './AppDownload.css'
import { assets } from '../../assets/assets'

const AppDownload = () => {
    return (
        <div className='app-download section animate-fade-up' id='app-download'>
            <div className="app-download-card">
                <div className="app-download-content">
                    <p className="badge">Hamarosan</p>
                    <h2>Rendelj még gyorsabban a mobilappból</h2>
                    <p className="subtitle">
                        Állítsd össze kedvenceidet, mentsd el a rendeléseidet, és kapj értesítést,
                        amikor elkészült az étel.
                    </p>
                    <div className="app-download-platforms">
                        <button className="store-pill">
                            <img src={assets.play_store} alt="Google Play" />
                            <span>
                                <small>Letöltés</small>
                                Google Play
                            </span>
                        </button>
                        <button className="store-pill">
                            <img src={assets.app_store} alt="App Store" />
                            <span>
                                <small>Letöltés</small>
                                App Store
                            </span>
                        </button>
                    </div>
                </div>
                <div className="app-download-visual" aria-hidden="true">
                    <div className="phone-mockup">
                        <div className="phone-screen">
                            <div className="phone-card shimmer">
                                <span className="dot dot-1" />
                                <span className="dot dot-2" />
                                <span className="dot dot-3" />
                            </div>
                            <div className="phone-card" />
                            <div className="phone-card" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AppDownload
