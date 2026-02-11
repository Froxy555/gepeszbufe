import React, { useContext, useEffect, useState } from 'react'
import './MyOrders.css'
import axios from 'axios'
import { StoreContext } from '../../Context/StoreContext';
import { assets } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';

const MyOrders = () => {
  
  const [data,setData] =  useState([]);
  const {url,token,currency} = useContext(StoreContext);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    const response = await axios.post(url+"/api/order/userorders",{},{headers:{token}});
    setData(response.data.data)
  }

  useEffect(()=>{
    if (token) {
      fetchOrders();
    }
  },[token])

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
          data.map((order,index)=>{
            const itemSummary = order.items.map((item, idx) => (
              idx === order.items.length - 1
                ? `${item.name} x ${item.quantity}`
                : `${item.name} x ${item.quantity}, `
            ));

            const statusLabel = order.status === 'Delivered'
              ? 'Kiszállítva'
              : order.status === 'Out for delivery'
              ? 'Kiszállítás alatt'
              : order.status === 'Processing'
              ? 'Feldolgozás alatt'
              : order.status;

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
