import mongoose, { Document, Model, model, Schema } from "mongoose";

export interface IOrder extends Document {
  userId?: string;
  courseId: string;
  payment_info: object;
}

export const orderSchema = new Schema<IOrder>(
  {
    userId: {
      type: String,
      required: true,
    },
    courseId: {
      type: String,
      required: true,
    },
    payment_info: {
      type: Object,
      // require: true,
    },
  },
  { timestamps: true }
);

const OrderModel: Model<IOrder> = mongoose.model("Order", orderSchema);
export default OrderModel;
