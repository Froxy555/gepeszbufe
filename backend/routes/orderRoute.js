import express from 'express';
import authMiddleware from '../middleware/auth.js';
import { 
    listOrders, 
    placeOrder, 
    updateStatus, 
    userOrders, 
    verifyOrder, 
    placeOrderCod,
    getOrderById 
} from '../controllers/orderController.js';

const orderRouter = express.Router();

// Apply JSON parsing middleware specifically for this router
orderRouter.use(express.json());
orderRouter.use(express.urlencoded({ extended: true }));

// List all orders (admin route)
orderRouter.get("/list", listOrders);

// Get single order by id for current user
orderRouter.get("/:id", authMiddleware, getOrderById);

// Get user's orders
orderRouter.post("/userorders", authMiddleware, userOrders);

// Place a new order with Stripe payment
orderRouter.post("/place", authMiddleware, placeOrder);

// Update order status
orderRouter.post("/status", updateStatus);

// Verify order payment
orderRouter.post("/verify", verifyOrder);

// Place a new order with Cash on Delivery
orderRouter.post("/placecod", authMiddleware, placeOrderCod);

export default orderRouter;