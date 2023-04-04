import { Document, model, Schema, Types } from 'mongoose';

export interface OrderDeatilFields {
    _id?: string;
    order_id: string;
    product_id: string;
    product_name: string;
    quantity: Number;
    unit_price: Number;
    discount: Number;
    total_price: Number;
}

export interface OrderDeatilResponse {
    [key: string]: OrderDeatilFields[];
}
export interface IOrderDeatil extends Document {}

const OrderDetailSchema = new Schema(
    {
        order_id: { type: String, required: true },
        product_id: { type: String, required: true },
        product_name: { type: String, required: true },
        quantity: { type: Number, required: true },
        unit_price: { type: Number, required: true },
        discount: { type: Number, required: true },
        total_price: { type: Number, required: true },
    }
);
export default model<IOrderDeatil>('OrderDetail', OrderDetailSchema);