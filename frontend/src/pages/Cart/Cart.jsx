import React, { useContext, useEffect, useState } from 'react'
import './Cart.css'
import { StoreContext } from '../../Context/StoreContext'
import { useNavigate } from 'react-router-dom';

const Cart = () => {

  const {cartItems, food_list, removeFromCart, getTotalCartAmount, url, currency, deliveryCharge, setSpecialRequest} = useContext(StoreContext);
  const navigate = useNavigate();
  const [specialRequestText, setSpecialRequestText] = useState('');

  // Load special request from localStorage on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Load special request from localStorage if it exists
    const savedRequest = localStorage.getItem("specialRequest");
    if (savedRequest) {
      setSpecialRequestText(savedRequest);
      setSpecialRequest(savedRequest);
      console.log("Loaded special request from localStorage:", savedRequest);
    }
  }, [setSpecialRequest]);

  // Handle special request input changes
  const handleSpecialRequestChange = (e) => {
    const value = e.target.value;
    console.log("Setting special request in Cart:", value);
    setSpecialRequestText(value);
    setSpecialRequest(value);
    
    // Store in localStorage for persistence
    localStorage.setItem("specialRequest", value);
    console.log("Saved to localStorage:", value);
  };

  return (
    <div className='cart'>
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Elemek</p> <p>Név</p> <p>Ár</p> <p>Darabszám</p> <p>Összesen</p> <p>Eltávolítás</p>
        </div>
        <br />
        <hr />
        {food_list.map((item, index) => {
          if (cartItems[item._id]>0) {
            return (<div key={index}>
              <div className="cart-items-title cart-items-item">
                <img src={url+"/images/"+item.image} alt="" />
                <p>{item.name}</p>
                <p>{item.price} {currency}</p>
                <div>{cartItems[item._id]}</div>
                <p>{item.price*cartItems[item._id]}{currency}</p>
                <p className='cart-items-remove-icon' onClick={()=>removeFromCart(item._id)}>x</p>
              </div>
              <hr />
            </div>)
          }
          return null;
        })}
      </div>
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Kosár tartalma</h2>
          <div>
            <hr />
            <div className="cart-total-details"><b>Végösszeg</b><b>{getTotalCartAmount()===0?0:getTotalCartAmount()+deliveryCharge}{currency}</b></div>
            <hr />
          </div>
          <button onClick={()=>navigate('/order')}>Vásárlás</button>
        </div>
        <div className="cart-promocode">
          <div>
            <p>Ha van bármi kérésed, ide írd!</p>
            <div className='cart-promocode-input'>
              <input 
                type="text" 
                placeholder='nem kérek hagymát' 
                value={specialRequestText}
                onChange={handleSpecialRequestChange}
              />
              {/* Add a small indicator to show the special request is saved */}
              {specialRequestText && <div style={{fontSize: "12px", color: "green", marginTop: "5px"}}>Kérés elmentve!</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart