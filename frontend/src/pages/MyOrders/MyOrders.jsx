import React, { useContext, useEffect, useState } from 'react'
import './MyOrders.css'
import axios from 'axios'
import { StoreContext } from '../../Context/StoreContext';
import { assets } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';

const MyOrders = () => {

  const [data, setData] = useState([]);
  const { url, token, currency } = useContext(StoreContext);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    if (token) {
      const response = await axios.post(url + "/api/order/userorders", {}, { headers: { token } });
      setData(response.data.data)
    } else {
      // Guest mode: fetch orders stored in localStorage
      const guestOrders = JSON.parse(localStorage.getItem('guestOrders') || '[]');
      if (guestOrders.length > 0) {
        // We need to fetch each order individually or create a new endpoint. 
        // For now, let's try fetching them one by one. 
        // NOTE: The backend endpoint /api/order/userorders requires token.
        // We might need to use /api/order/:id but that might also require ownership check or token.
        // Let's check backend routes. /api/order/:id uses authMiddleware but might allow if we modify it or use a specific guest route.
        // Actually, I modified authMiddleware to be optional.

        const loadedOrders = [];
        for (const orderId of guestOrders) {
          try {
            const response = await axios.get(`${url}/api/order/${orderId}`);
            if (response.data.success) {
              loadedOrders.push(response.data.data);
            }
          } catch (err) {
            console.error("Error fetching guest order:", err);
          }
        }
        // Sort by date descending (assuming date string works for sort)
        loadedOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
        setData(loadedOrders);
      }
    }
  }

  useEffect(() => {
    fetchOrders();
  }, [token])

  return (
    <div className='my-orders section animate-fade-up'>
      <h2>Rendeléseim</h2>
      <div className="my-orders-container">
        {data.length === 0 ? (
          <div className="my-orders-empty">
            <p>Még nincs rendelésed.</p>
            <button type="button" onClick={fetchOrders}>Frissítés</button>
          </div>
        ) : (
          data.map((order, index) => {
            const itemSummary = order.items.map((item, idx) => (
              idx === order.items.length - 1
                ? `${item.name} x ${item.quantity}`
                : `${item.name} x ${item.quantity}, `
            ));

            const statusLabel = order.status;

            const previewItems = order.items.slice(0, 3);

            return (
              <div key={index} className='my-orders-card'>
                <div className="my-orders-main">
                  <div className="my-orders-thumb-stack">
                    {previewItems.map((item, idx) => (
                      <img
                        key={idx}
                        src={item.image ? `${url}/images/${item.image}` : assets.parcel_icon}
                        alt={item.name}
                      />
                    ))}
                  </div>
                  <div className="my-orders-info">
                    <p className="my-orders-title">{itemSummary}</p>
                    <p className="my-orders-meta">Elemek: {order.items.length} • Kód: <strong>{order.randomCode}</strong></p>
                  </div>
                </div>

                <div className="my-orders-side">
                  <p className="my-orders-amount">{order.amount}{currency}</p>
                  <span className={`my-orders-status my-orders-status-${order.status?.toLowerCase().replace(/\s+/g, '-') || 'default'}`}>
                    <span className="dot" />{statusLabel}
                  </span>
                  <div className="my-orders-actions">
                    <button
                      type="button"
                      className="my-orders-details-btn"
                      onClick={() => navigate(`/order-success/${order._id}`, { state: { randomCode: order.randomCode } })}
                    >
                      Rendelés részletei
                    </button>
                    <button type="button" onClick={fetchOrders}>Állapot frissítése</button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default MyOrders
