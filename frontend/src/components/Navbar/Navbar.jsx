import React, { useContext, useEffect, useState } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { StoreContext } from '../../Context/StoreContext'

const Navbar = ({ setShowLogin }) => {

  const [menu, setMenu] = useState("home");
  const { getTotalCartAmount, token, setToken } = useContext(StoreContext);
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate('/')
  }

  const handleCartClick = () => {
    navigate('/cart');
  }

  // Check if current page is home page
  const isHomePage = location.pathname === '/' || location.pathname === '/home';

  return (
    <>
      <div className='navbar'>
        <Link to='/'><img className='logo' src={assets.logo} alt="" /></Link>
        <ul className="navbar-menu">
          <Link to="/" onClick={() => setMenu("home")} className={`${menu === "home" ? "active" : ""}`}>főoldal</Link>
          <a href='#explore-menu' onClick={() => setMenu("menu")} className={`${menu === "menu" ? "active" : ""}`}>menü</a>
          <a href='myorders' onClick={() => setMenu("mob-app")} className={`${menu === "mob-app" ? "active" : ""}`}>rendelések</a>
          <a href='#footer' onClick={() => setMenu("contact")} className={`${menu === "contact" ? "active" : ""}`}>kapcsolat</a>
        </ul>
        <div className="navbar-right">
          <img src={assets.search_icon} alt="" />
          <Link to='/cart' className='navbar-search-icon'>
            <img src={assets.basket_icon} alt="" />
            <div className={getTotalCartAmount() > 0 ? "dot" : ""}></div>
          </Link>
          {!token ? <button onClick={() => setShowLogin(true)}>Bejelentkzés</button>
            : <div className='navbar-profile'>
              <img src={assets.profile_icon} alt="" />
              <ul className='navbar-profile-dropdown'>
                <li onClick={()=>navigate('/myorders')}> <img src={assets.bag_icon} alt="" /> <p>Rendelések</p></li>
                <hr />
                <li onClick={logout}> <img src={assets.logout_icon} alt="" /> <p>Kijelentkezés</p></li> 
              </ul>
            </div>
          }
        </div>
      </div>

      {/* Fixed cart icon in the bottom right corner - only shows on home page */}
      {isHomePage && (
        <div className="fixed-cart-icon" onClick={handleCartClick}>
          <img src={assets.basket_icon} alt="Cart" />
          <div className={getTotalCartAmount() > 0 ? "dot" : ""}></div>
        </div>
      )}
    </>
  )
}

export default Navbar