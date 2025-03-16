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
        city: "",  // Hányadik szünetben (Break time)
        phone: ""
    });

    const { getTotalCartAmount, token, food_list, cartItems, url, setCartItems, currency, deliveryCharge } = useContext(StoreContext);
    const navigate = useNavigate();

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(prevData => ({ ...prevData, [name]: value }));
    };

    const placeOrder = async (e) => {
        e.preventDefault();
        let orderItems = food_list.filter(item => cartItems[item._id] > 0)
            .map(item => ({ ...item, quantity: cartItems[item._id] }));

        let orderData = {
            address: {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                orderDate: data.street, // Megrendelési dátum
                breakTime: data.city,  // Hányadik szünetben (stored in city)
                phone: data.phone
            },
            items: orderItems,
            amount: getTotalCartAmount() + deliveryCharge
        };

        try {
            if (payment === "stripe") {
                let response = await axios.post(url + "/api/order/place", orderData, { headers: { token } });
                if (response.data.success) {
                    window.location.replace(response.data.session_url);
                } else {
                    toast.error("Something went wrong");
                }
            } else {
                let response = await axios.post(url + "/api/order/placecod", orderData, { headers: { token } });
                if (response.data.success) {
                    navigate("/myorders");
                    toast.success(response.data.message);
                    setCartItems({});
                } else {
                    toast.error("Something went wrong");
                }
            }
        } catch (error) {
            console.error("Order placement error:", error);
            toast.error("Something went wrong");
        }
    };

    useEffect(() => {
        if (!token) {
            toast.error("To place an order, sign in first");
            navigate('/cart');
        } else if (getTotalCartAmount() === 0) {
            navigate('/cart');
        }
    }, [token]);

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
