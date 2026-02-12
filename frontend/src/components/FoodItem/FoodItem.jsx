import React, { useContext } from 'react'
import './FoodItem.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../Context/StoreContext';

const FoodItem = ({ image, name, price, desc, id, available = true, rating = 5 }) => {
    const context = useContext(StoreContext) || {};
    const {
        cartItems = {},
        addToCart = () => { },
        removeFromCart = () => { },
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

    const renderStars = () => {
        const stars = [];
        for (let i = 0; i < 5; i++) {
            stars.push(
                <span key={i} style={{ color: i < rating ? '#ff9529' : '#dcdcdc', fontSize: '18px' }}>
                    ★
                </span>
            );
        }
        return stars;
    };

    return (
        <div className='food-item'>
            <div className='food-item-img-container'>
                <img className={`food-item-image ${!available ? 'grayscale' : ''}`} src={url + "/images/" + image} alt="" />

                {!available ? (
                    <div className="sold-out-overlay">
                        <p>Elfogyott</p>
                    </div>
                ) : (
                    !getCartCount()
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
                )}
            </div>
            <div className="food-item-info">
                <div className="food-item-name-rating">
                    <p>{name}</p>
                    <div className="rating-stars">
                        {renderStars()}
                    </div>
                </div>
                <p className="food-item-desc">{desc}</p>
                <p className="food-item-price">{price}{currency}</p>
            </div>
        </div>
    )
}

export default FoodItem