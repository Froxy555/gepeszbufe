import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <div className='footer' id='footer'>
      <div className="footer-content">
        <div className="footer-content-left">
        
            <p>GépészBüfé - Lakj jól, ne várakozz!</p>
            <div className="footer-social-icons">
                <img src={assets.facebook_icon} alt="" />
                <img src={assets.twitter_icon} alt="" />
                <img src={assets.linkedin_icon} alt="" />
            </div>
        </div>
        <div className="footer-content-center">
            <h2>GépészBüfé</h2>
            <ul>
                <li>Főoldal</li>
                <li>Menü</li>
                <li>Rendelések</li>
                <li>Kapcsolat</li>
            </ul>
        </div>
        <div className="footer-content-right">
            <h2>Kapcsolat</h2>
            <ul>
                <li>+36-20-123-4567</li>
                <li>gepeszbufe@gmail.com</li>
            </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">Copyright 2025 © GepeszBufe - Minden jog fentartva.</p>
    </div>
  )
}

export default Footer
