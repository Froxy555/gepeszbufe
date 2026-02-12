import React, { useContext } from 'react'
import './CartSidebar.css'
import { StoreContext } from '../../Context/StoreContext'
import { useNavigate } from 'react-router-dom'

const CartSidebar = () => {

    const { cartItems, food_list, removeFromCart, getTotalCartAmount, url, currency } = useContext(StoreContext);
    const navigate = useNavigate();

    const totalAmount = getTotalCartAmount();

    // Safety check for cartItems and food_list to prevent crash
    if (!cartItems || typeof cartItems !== 'object' || !food_list || !Array.isArray(food_list)) {
        return null;
    }

    // Check if cart has any items
    const hasItems = Object.values(cartItems).some(quantity => quantity > 0);

    if (!hasItems) {
        return null; // Don't render if empty
    }

    return (
        <div className='cart-sidebar'>
            <div className="cart-sidebar-header">
                <h3>Kosár tartalma</h3>
            </div>

            <div className="cart-sidebar-items">
                {food_list.map((item, index) => {
                    if (cartItems[item._id] > 0) {
                        return (
                            <div key={index} className="cart-sidebar-item">
                                <img src={url + "/images/" + item.image} alt="" />
                                <div className="cart-sidebar-item-details">
                                    <h4>{item.name}</h4>
                                    <p>{item.price * cartItems[item._id]} {currency}</p>
                                </div>
                                <div className="cart-sidebar-item-quantity">
                                    {cartItems[item._id]} db
                                </div>
                                <div onClick={() => removeFromCart(item._id)} style={{ cursor: 'pointer', color: '#aaa', fontSize: '18px' }}>
                                    ×
                                </div>
                            </div>
                        )
                    }
                })}
            </div>

            <div className="cart-sidebar-footer">
                <div className="cart-sidebar-total">
                    <span>Részösszeg:</span>
                    <span>{totalAmount} {currency}</span>
                </div>
                <div className="cart-sidebar-buttons">
                    <button onClick={() => navigate('/order')} className="cart-sidebar-btn btn-checkout">Pénztárhoz</button>
                </div>
            </div>
        </div>
    )
}

export default CartSidebar
