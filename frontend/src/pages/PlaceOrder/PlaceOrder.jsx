import React, { useContext, useEffect, useState } from 'react';
import './PlaceOrder.css';
import { StoreContext } from '../../Context/StoreContext';
import { assets } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const PlaceOrder = () => {
  const [payment, setPayment] = useState("cod");
  const today = new Date().toISOString().split('T')[0];
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: today,
    city: "",
    phone: ""
  });

  const { getTotalCartAmount, token, food_list, cartItems, url, setCartItems, currency, deliveryCharge, specialRequest, userData } = useContext(StoreContext);
  const navigate = useNavigate();

  // Log current special request on component mount
  useEffect(() => {
    // console.log("PlaceOrder mounted with specialRequest:", specialRequest);
    // console.log("localStorage specialRequest:", localStorage.getItem("specialRequest"));
  }, [specialRequest]);

  // Auto-fill user data if logged in
  useEffect(() => {
    if (token && userData) {
      // Try to split name into first and last if possible, or just put it in first name
      let firstName = "";
      let lastName = "";
      if (userData.name) {
        const nameParts = userData.name.split(' ');
        if (nameParts.length > 1) {
          lastName = nameParts[0]; // Assuming Hungarian order (Last First) or standard
          firstName = nameParts.slice(1).join(' '); // Remainder is first name(s)
          // Wait, Hungarian names are typically "Kovács János" (Last First)
          // But data.firstName/lastName usually map to user input.
          // Let's assume standard Western mapping for the inputs: "Vezetéknév" (Last) "Keresztnév" (First)
          // So if name is "Wick John", LastName=Wick, FirstName=John
          // Actually, the placeholder says "Vezetéknév" (Last name) and "Keresztnév" (First name)
          // If stored name is "John Wick", and we split by space...
          // Let's just create a best guess.

          // Actually, let's just assume the input fields "Vezetéknév" and "Keresztnév"
          // If we have a full name string, we place the first part in Vezetéknév and the rest in Keresztnév?
          // Hungarian names: "Kovács János". Kovács = Vezetéknév, János = Keresztnév.
          // So split(' ')[0] -> Vezetéknév.

          lastName = nameParts[0];
          firstName = nameParts.slice(1).join(' ');
        } else {
          lastName = userData.name;
        }
      }

      setData(prev => ({
        ...prev,
        firstName: firstName || prev.firstName,
        lastName: lastName || prev.lastName,
        email: userData.email || prev.email,
        phone: userData.phone || prev.phone,
        // We don't auto-fill street/city since those are date/break time in this app context
      }));
    }
  }, [token, userData]);

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
    // console.log("About to send order with note:", noteToSend);

    let orderItems = food_list.filter(item => cartItems[item._id] > 0)
      .map(item => ({ ...item, quantity: cartItems[item._id] }));

    if (!data.city) {
      toast.error("Válaszd ki, hányadik szünetben veszed át.");
      return;
    }

    let orderData = {
      userId: token ? JSON.parse(localStorage.getItem('user'))?._id : `guest_${Date.now()}`, // Guest ID or real ID
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
    // console.log("Full order data being sent:", JSON.stringify(orderData));

    try {
      // Prepare headers - only include token if it exists
      const headers = { 'Content-Type': 'application/json' };
      if (token) {
        headers.token = token;
      }

      // Use the same approach for both payment methods with slight differences
      if (payment === "stripe") {
        let response = await axios.post(url + "/api/order/place", orderData, { headers });

        if (response.data.success) {
          // Clear the special request from localStorage after successful order
          localStorage.removeItem("specialRequest");
          window.location.replace(response.data.session_url);
        } else {
          toast.error("Valami hiba történt");
        }
      } else {
        // Make sure we're sending the request with the correct Content-Type
        let response = await axios.post(url + "/api/order/placecod", orderData, { headers });

        if (response.data.success) {
          // Save guest order ID locally
          if (!token) {
            const guestOrders = JSON.parse(localStorage.getItem('guestOrders') || '[]');
            guestOrders.push(response.data.orderId);
            localStorage.setItem('guestOrders', JSON.stringify(guestOrders));
          }

          // Clear the special request from localStorage after successful order
          localStorage.removeItem("specialRequest");
          setCartItems({});
          navigate(`/order-success/${response.data.orderId}`, {
            state: { randomCode: response.data.randomCode }
          });
        } else {
          toast.error("Valami hiba történt");
        }
      }
    } catch (error) {
      console.error("Rendelés leadási hiba", error);
      toast.error("Valami hiba történt (Lehet, hogy be kell jelentkezned?)");
    }
  };

  useEffect(() => {
    // Only redirect if cart is empty. Guests are allowed now.
    if (getTotalCartAmount() === 0) {
      navigate('/cart');
    }
  }, [getTotalCartAmount, navigate]);

  return (
    <form onSubmit={placeOrder} className='place-order section animate-fade-up'>
      <div className="place-order-left">
        <p className='place-order-title'>Vásárlási információk</p>
        <div className="multi-field">
          <input type="text" name='firstName' onChange={onChangeHandler} value={data.firstName} placeholder='Vezetéknév' required />
          <input type="text" name='lastName' onChange={onChangeHandler} value={data.lastName} placeholder='Keresztnév' required />
        </div>
        <input type="email" name='email' onChange={onChangeHandler} value={data.email} placeholder='Email cím' required />
        <div className="place-order-field-group">
          <label>Megrendelési dátum</label>
          <input
            type="date"
            name='street'
            onChange={onChangeHandler}
            value={data.street}
            min={today}
            required
          />
        </div>

        <div className="place-order-field-group">
          <label>Hányadik szünetben</label>
          <div className="place-order-breaks">
            {["1", "2", "3", "4", "5", "6", "7"].map((value) => (
              <button
                key={value}
                type="button"
                className={`place-order-break-pill ${data.city === value ? 'active' : ''}`}
                onClick={() => setData(prev => ({ ...prev, city: value }))}
              >
                {value}. szünet
              </button>
            ))}
          </div>
        </div>
        <input type="text" name='phone' onChange={onChangeHandler} value={data.phone} placeholder='Telefonszám' required />

        {(specialRequest || localStorage.getItem("specialRequest")) && (
          <div className="place-order-note">
            <p className="place-order-note-label">Speciális kérés:</p>
            <p className="place-order-note-text">{specialRequest || localStorage.getItem("specialRequest")}</p>
          </div>
        )}
      </div>
      <div className="place-order-right">
        <div className="place-order-summary-card">
          <h2>Végösszeg</h2>
          <div className="place-order-summary-body">
            <div className="place-order-summary-row">
              <span>Összesen</span>
              <span className="place-order-summary-amount">{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount()}{currency}</span>
            </div>
          </div>
        </div>
        <div className="payment">
          <h2>Fizetési mód</h2>
          <div onClick={() => setPayment("cod")} className={`payment-option ${payment === 'cod' ? 'active' : ''}`}>
            <span className="payment-radio" />
            <div className="payment-content">
              <p className="payment-label">Helyben fizetés (KP/Bankkártya)</p>
              <p className="payment-desc">A büfében, átvételkor fizetsz készpénzzel vagy bankkártyával.</p>
            </div>
          </div>
          <div onClick={() => setPayment("stripe")} className={`payment-option ${payment === 'stripe' ? 'active' : ''}`}>
            <span className="payment-radio" />
            <div className="payment-content">
              <p className="payment-label">Online fizetés (Credit / Debit)</p>
              <p className="payment-desc">Biztonságos online fizetés bankkártyával.</p>
            </div>
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