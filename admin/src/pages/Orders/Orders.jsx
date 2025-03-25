import React, { useEffect, useState } from 'react';
import './Orders.css';
import { toast } from 'react-toastify';
import axios from 'axios';
import { assets, url, currency } from '../../assets/assets';

const formatDate = (dateString) => {
  if (!dateString) return 'Dátum nem elérhető';

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Dátum nem elérhető';
    }

    return new Intl.DateTimeFormat('hu-HU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(date);
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Dátum nem elérhető';
  }
};

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${url}/api/order/list`);
      if (response.data.success) {
        setOrders(response.data.data);
      } else {
        toast.error("Hiba történt a rendelések betöltésekor");
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error("Hiba történt a rendelések betöltésekor");
    } finally {
      setLoading(false);
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(`${url}/api/order/status`, {
        orderId,
        status: event.target.value
      });

      if (response.data.success) {
        await fetchAllOrders();
        toast.success("Státusz sikeresen frissítve");
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error("Hiba történt a státusz frissítésekor");
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div className='order add'>
      <h3>Rendelések</h3>
      {loading ? (
        <div className="loading">Rendelések betöltése...</div>
      ) : (
        <div className="order-list">
          {orders.length === 0 ? (
            <div className="no-orders">Nincs aktív rendelés</div>
          ) : (
            orders.map((order) => (
              <div key={order._id} className='order-item'>
                <img src={assets.parcel_icon} alt="Parcel" />
                <div>
                  <p className='order-item-food'>
                    {order.items.map((item, index) => (
                      index === order.items.length - 1
                        ? `${item.name} x ${item.quantity}`
                        : `${item.name} x ${item.quantity}, `
                    ))}
                  </p>
                  <p><strong>Név:</strong> {order.address.firstName + " " + order.address.lastName}</p>
                  <p><strong>Rendelés dátuma:</strong> <span className="order-item-timestamp">{formatDate(order.date)}</span></p>
                  <p><strong>Szünet:</strong> {order.address.breakTime || "N/A"}</p>
                  <p><strong>Telefonszám:</strong> {order.address.phone}</p>
                  <p><strong>Rendelés kódja:</strong> <span className="order-item-code">{order.randomCode}</span></p>
                  
                  {/* Display the note/special request with improved visibility */}
                  {order.note && order.note !== "" && (
  <p className="special-request">
    <strong>Megjegyzés:</strong> 
    <span className="order-item-note">{order.note}</span>
  </p>
)}
                </div>
                <p>Termékek : {order.items.length}</p>
                <p>{order.amount}{currency}</p>
                <select
                  onChange={(e) => statusHandler(e, order._id)}
                  value={order.status}
                >
                  <option value="Felvettük rendelésed">Felvettük rendelésed</option>
                  <option value="Készítés alatt">Készítés alatt</option>
                  <option value="Elkészült">Elkészült</option>
                </select>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Order;