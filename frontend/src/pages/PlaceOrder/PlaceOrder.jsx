import React, { useContext, useEffect, useState } from 'react';
import './PlaceOrder.css';
import { StoreContext } from '../../Context/StoreContext';
import { assets } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const PlaceOrder = () => {
    const [payment, setPayment] = useState("cod");
    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        street: "",
        city: "",  
        phone: ""
    });

    const { getTotalCartAmount, token, food_list, cartItems, url, setCartItems, currency, deliveryCharge, specialRequest } = useContext(StoreContext);
    const navigate = useNavigate();
    
    // Log current special request on component mount
    useEffect(() => {
        console.log("PlaceOrder mounted with specialRequest:", specialRequest);
        console.log("localStorage specialRequest:", localStorage.getItem("specialRequest"));
    }, [specialRequest]);

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(prevData => ({ ...prevData, [name]: value }));
    };

    const placeOrder = async (e) => {
        e.preventDefault();
        
        // Get special request from both context and localStorage to be safe
        const noteToSend = specialRequest || localStorage.getItem("specialRequest") || "";
        
        // Log what we're about to send
        console.log("About to send order with note:", noteToSend);
        
        let orderItems = food_list.filter(item => cartItems[item._id] > 0)
          .map(item => ({ ...item, quantity: cartItems[item._id] }));
      
        let orderData = {
          userId: JSON.parse(localStorage.getItem('user'))?._id,
          address: {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            orderDate: data.street,
            breakTime: data.city,
            phone: data.phone
          },
          items: orderItems,
          amount: getTotalCartAmount() + deliveryCharge,
          note: noteToSend // Include the note in the order data
        };
      
        // Log the full order data that will be sent
        console.log("Full order data being sent:", JSON.stringify(orderData));
        
        try {
          // Use the same approach for both payment methods with slight differences
          if (payment === "stripe") {
            let response = await axios.post(url + "/api/order/place", orderData, { 
              headers: { 
                token,
                'Content-Type': 'application/json'
              } 
            });
            
            if (response.data.success) {
              // Clear the special request from localStorage after successful order
              localStorage.removeItem("specialRequest");
              window.location.replace(response.data.session_url);
            } else {
              toast.error("Valami hiba történt");
            }
          } else {
            // Make sure we're sending the request with the correct Content-Type
            let response = await axios.post(
              url + "/api/order/placecod", 
              orderData, 
              { 
                headers: { 
                  token,
                  'Content-Type': 'application/json'
                } 
              }
            );
            
            if (response.data.success) {
              // Clear the special request from localStorage after successful order
              localStorage.removeItem("specialRequest");
              navigate("/myorders");
              toast.success(response.data.message);
              setCartItems({});
            } else {
              toast.error("Valami hiba történt");
            }
          }
        } catch (error) {
          console.error("Rendelés leadási hiba", error);
          toast.error("Valami hiba történt");
        }
    };

    useEffect(() => {
        if (!token) {
            toast.error("Rendelés leadásához jelentkezz be");
            navigate('/cart');
        } else if (getTotalCartAmount() === 0) {
            navigate('/cart');
        }
    }, [token, getTotalCartAmount, navigate]);

    return (
        <form onSubmit={placeOrder} className='place-order'>
            <div className="place-order-left">
                <p className='title'>Vásárlási információk</p>
                <div className="multi-field">
                    <input type="text" name='firstName' onChange={onChangeHandler} value={data.firstName} placeholder='Vezetéknév' required />
                    <input type="text" name='lastName' onChange={onChangeHandler} value={data.lastName} placeholder='Keresztnév' required />
                </div>
                <input type="email" name='email' onChange={onChangeHandler} value={data.email} placeholder='Email cím' required />
                <input type="text" name='street' onChange={onChangeHandler} value={data.street} placeholder='Megrendelési dátum (hónap/nap)' required />
                <input type="text" name='city' onChange={onChangeHandler} value={data.city} placeholder='Hányadik szünetben' required />
                <input type="text" name='phone' onChange={onChangeHandler} value={data.phone} placeholder='Telefonszám' required />
                
                {/* Display current special request if it exists */}
                {(specialRequest || localStorage.getItem("specialRequest")) && (
                  <div style={{marginTop: "15px", padding: "10px", backgroundColor: "#f8f9fa", borderRadius: "5px"}}>
                    <p style={{fontWeight: "bold"}}>Speciális kérés:</p>
                    <p>{specialRequest || localStorage.getItem("specialRequest")}</p>
                  </div>
                )}
            </div>
            <div className="place-order-right">
                <div className="cart-total">
                    <h2>Végösszeg</h2>
                    <div>
                        <hr />
                        <div className="cart-total-details"><b>Összesen</b><b>{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount()}{currency}</b></div>
                        <hr />
                    </div>
                </div>
                <div className="payment">
                    <h2>Fizetési mód</h2>
                    <div onClick={() => setPayment("cod")} className="payment-option">
                        <img src={payment === "cod" ? assets.checked : assets.un_checked} alt="" />
                        <p>Helyben fizetés (KP/Bankkártya)</p>
                    </div>
                    <div onClick={() => setPayment("stripe")} className="payment-option">
                        <img src={payment === "stripe" ? assets.checked : assets.un_checked} alt="" />
                        <p>Online fizetés (Credit / Debit)</p>
                    </div>
                </div>
                <button className='place-order-submit' type='submit'>
                    {payment === "cod" ? "Fizetés" : "Tovább a fizetéshez"}
                </button>
            </div>
        </form>
    );
};

export default PlaceOrder;