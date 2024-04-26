import express from 'express';
import { authorizeRoles, isAuthenticated } from '../middalware/auth';
import { createOrder, getAllOrders } from '../controllers/order.controller';
import { getAllOrderService } from '../services/order.services';
const orderRouter = express.Router();


orderRouter.post("/create-order", isAuthenticated, createOrder);
orderRouter.get("/get-orders", isAuthenticated , authorizeRoles("admin"), getAllOrders);

export default orderRouter;