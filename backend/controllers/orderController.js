import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js"
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

//config variables
const currency = "huf";
const deliveryCharge = 0;
const frontend_URL = 'https://gepeszbufe-frontend.onrender.com';

// Placing User Order for Frontend using stripe
const placeOrder = async (req, res) => {
    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
            note: req.body.note,
            date: new Date(),
        });

        const savedOrder = await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        const line_items = req.body.items.map((item) => ({
            price_data: {
                currency: currency,
                product_data: {
                    name: item.name
                },
                unit_amount: item.price * 100 
            },
            quantity: item.quantity
        }));

        line_items.push({
            price_data: {
                currency: currency,
                product_data: {
                    name: "Delivery Charge"
                },
                unit_amount: deliveryCharge * 100
            },
            quantity: 1
        });

        const session = await stripe.checkout.sessions.create({
            success_url: `${frontend_URL}/verify?success=true&orderId=${savedOrder._id}`,
            cancel_url: `${frontend_URL}/verify?success=false&orderId=${savedOrder._id}`,
            line_items: line_items,
            mode: 'payment',
        });

        res.json({ success: true, session_url: session.url, randomCode: savedOrder.randomCode });

    } catch (error) {
        console.error('Place order error:', error);
        res.status(500).json({ success: false, message: "Error placing order", error: error.message });
    }
};

// Placing User Order for Frontend using COD
const placeOrderCod = async (req, res) => {
    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
            payment: true,
            date: new Date(),
        });

        const savedOrder = await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        res.json({ success: true, message: "Rendelés elküldve", randomCode: savedOrder.randomCode });

    } catch (error) {
        console.error('Place COD order error:', error);
        res.status(500).json({ success: false, message: "Error placing COD order", error: error.message });
    }
};

// Listing Order for Admin panel
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel
            .find({})
            .sort({ date: -1 })
            .lean(); // Use lean for better performance

        res.json({ 
            success: true, 
            data: orders.map(order => ({
                ...order,
                formattedDate: new Date(order.date).toLocaleString('hu-HU'),
                randomCode: order.randomCode
            }))
        });
    } catch (error) {
        console.error('List orders error:', error);
        res.status(500).json({ success: false, message: "Error fetching orders", error: error.message });
    }
};

// User Orders for Frontend
const userOrders = async (req, res) => {
    try {
        const orders = await orderModel
            .find({ userId: req.body.userId })
            .sort({ date: -1 })
            .lean(); // Use lean for better performance

        res.json({ 
            success: true, 
            data: orders.map(order => ({
                ...order,
                formattedDate: new Date(order.date).toLocaleString('hu-HU'),
                randomCode: order.randomCode
            }))
        });
    } catch (error) {
        console.error('User orders error:', error);
        res.status(500).json({ success: false, message: "Error fetching user orders", error: error.message });
    }
};

// Update Order Status
const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        console.log('Updating order:', { orderId, status });
        
        const updatedOrder = await orderModel.findByIdAndUpdate(
            orderId,
            { status },
            { 
                new: true,
                runValidators: true
            }
        );

        if (!updatedOrder) {
            console.log('Order not found:', orderId);
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        console.log('Order updated successfully:', updatedOrder);
        res.json({ success: true, message: "Status Updated", order: updatedOrder });
    } catch (error) {
        console.error('Update status error:', error);
        res.status(500).json({ success: false, message: "Error updating status", error: error.message });
    }
};

// Verify Order Payment
const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;
    try {
        if (success === "true") {
            const updatedOrder = await orderModel.findByIdAndUpdate(
                orderId,
                { 
                    payment: true,
                },
                { new: true }
            );

            if (!updatedOrder) {
                return res.status(404).json({ success: false, message: "Order not found" });
            }

            res.json({ success: true, message: "Paid", randomCode: updatedOrder.randomCode });
        } else {
            await orderModel.findByIdAndDelete(orderId);
            res.json({ success: false, message: "Not Paid" });
        }
    } catch (error) {
        console.error('Verify order error:', error);
        res.status(500).json({ success: false, message: "Error verifying order", error: error.message });
    }
};

export { 
    placeOrder, 
    listOrders, 
    userOrders, 
    updateStatus, 
    verifyOrder, 
    placeOrderCod 
};
