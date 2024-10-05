import express from 'express';
import { authorizeRoles,
  isAuthenticated } from '../middalware/auth';
import { createOrder, getAllOrders } from '../controllers/order.controller';
import { getAllOrderService } from '../services/order.services';
import { updateAccessToken } from '../controllers/user.controller';
const orderRouter = express.Router();


orderRouter.post("/create-order", updateAccessToken,
  isAuthenticated, createOrder);
orderRouter.get("/get-orders", updateAccessToken,
  isAuthenticated , authorizeRoles("admin"), getAllOrders);

export default orderRouter;