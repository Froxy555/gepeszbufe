import React, { useContext } from 'react'
import './Cart.css'
import { StoreContext } from '../../Context/StoreContext'
import { useNavigate } from 'react-router-dom';

const Cart = () => {

  const {cartItems, food_list, removeFromCart,getTotalCartAmount,url,currency,deliveryCharge} = useContext(StoreContext);
  const navigate = useNavigate();

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
              <input type="text" placeholder='nem kérek hagymát'/>
              <button>Elküldés</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
