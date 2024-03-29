import {Document, model, Schema, Types} from 'mongoose';
import { types } from 'util';
import { Buyer, IngAddressType } from '../types/Payment/Payment.types';

export interface PaymentFields {
    _id?: string;
    user_id: string;
    order_id: string;
    transactionId: string;
    price: Number;
    buyer: Buyer;
    currency: string;
    billing_address_id: string;
    shipping_address_id: string;
    payment_date?: Date;
    payment_type: string;
}

export interface IPayment extends Document {};
const PaymentSchema = new Schema(
    {
        user_id: {type: String, required: true, ref: 'User'},
        order_id: {type: String, required: true, ref: 'Order'},
        transactionId: {type: String, required: true},
        price: {type: Number, required: true},
        buyer: {type: Object, required: true},
        currency: {type: String, required: true},
        billing_address_id: {type: String, required: true},
        shipping_address_id: {type: String, required: true},
        payment_date: {type: Date, required: false, default: Date.now()},
        payment_type: {type: String, required: true}
    }
);
export default model<IPayment>('Payment', PaymentSchema);