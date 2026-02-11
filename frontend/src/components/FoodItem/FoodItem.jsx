import React, { useContext } from 'react'
import './FoodItem.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../Context/StoreContext';

const FoodItem = ({ image, name, price, desc, id }) => {
    const context = useContext(StoreContext) || {};
    const {
        cartItems = {},
        addToCart = () => {},
        removeFromCart = () => {},
        url = '',
        currency = ''
    } = context;

    const handleAddToCart = () => {
        addToCart(id);
    };

    const handleRemoveFromCart = () => {
        removeFromCart(id);
    };

    const getCartCount = () => {
        if (!cartItems) return 0;
        return cartItems[id] || 0;
    };

    return (
        <div className='food-item'>
            <div className='food-item-img-container'>
                <img className='food-item-image' src={url + "/images/" + image} alt="" />
                {!getCartCount()
                    ? <img 
                        className='add'
                        onClick={handleAddToCart} 
                        src={assets.add_icon_white} 
                        alt="" 
                      />
                    : <div className="food-item-counter">
                        <img src={assets.remove_icon_red} onClick={handleRemoveFromCart} alt="" />
                        <p>{getCartCount()}</p>
                        <img src={assets.add_icon_green} onClick={handleAddToCart} alt="" />
                      </div>
                }
            </div>
            <div className="food-item-info">
                <div className="food-item-name-rating">
                    <p>{name}</p> <img src={assets.rating_starts} alt="" />
                </div>
                <p className="food-item-desc">{desc}</p>
                <p className="food-item-price">{price}{currency}</p>
            </div>
        </div>
    )
}

export default FoodItem