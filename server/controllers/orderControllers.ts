import { Request, Response } from 'express';
import User from '../models/User';
import { unhandledExceptionsHandler } from '../utils/error';
import { createPayment } from '../utils/PaymentSystem/createPayment';
import { IPaymentFailResponse, IPaymentResponse } from '../types/Payment/Payment.types';
import Order,{ OrderFields } from '../models/Order';
import OrderDetail, { OrderDeatilFields, OrderDeatilResponse } from '../models/OrderDetail';
import Payment from '../models/Payment';
import { IUserOrderResponse } from '../types/OrderTypes/Order.responses.types';
import { ManageOrderDetailsByOrderID } from '../utils/OrderManager/OrderResponseController';

/**
 * @access user,
 * @method /api/orders/new-order POST
 */

export const newOrder = unhandledExceptionsHandler(async (req: Request, res: Response) => {
	const {
		user_id,
		price, 
		paidPrice,
		installment,
		paymentCard,
		buyer,
		shippingAddress,
        billingAddress,
        basketItems,
        currency,
	} = req.body;
	const user = await User.findById(user_id);
	if(user)
	{
		var response: IPaymentResponse | IPaymentFailResponse = await createPayment({
				price,
            	paidPrice,
            	installment,
            	paymentCard,
            	buyer,
				shippingAddress,
				billingAddress,
				basketItems,
            	currency
			}, user_id);
		return res.status(200).json(response);
	}
	return res.status(404).json();
});

/**
 * @access user
 * @method /api/orders/:user GET
 */

export const getUserOrders = unhandledExceptionsHandler(async (req: Request, res: Response) => {
	const orders: OrderFields[] = await Order.find({user_id: req.params.user});
	if(orders)
	{
		const ordersResponse: IUserOrderResponse = await ManageOrderDetailsByOrderID(orders[0]) as IUserOrderResponse;
		if(ordersResponse)
		{
			return res.status(200).json(ordersResponse);
		}
		else
		{
            return res.status(404).json();
        }
	}
	return res.status(404).json();
});
/**
 * @access user
 * @method /api/orders/user/:order
 */
export const getUserOrderDetails = unhandledExceptionsHandler(async (req: Request, res: Response) => {
	const orderDetails: OrderDeatilFields[] = await OrderDetail.find({user_id: req.params.user, order_id: req.params.order});
	if(orderDetails.length > 0)
		return res.status(200).json(orderDetails);
	return res.status(404).json({
		status: "not found",
		message: "Order not found",
		requirement: ""
	});
});

/**
 * @access admin
 * @method /api/orders/admin GET
 */
export const getAllOrders = unhandledExceptionsHandler(async (req: Request, res: Response) => {
	const orders: OrderFields[] = await Order.find({});	
	if(orders)
	{
		return res.status(200).json({
			orders: orders,
		});
	}
	return res.status(404).json();
});

/**
 * @access admin
 * @method /api/admin/orders/:id/to-shipping POST
 */
const orderToShipping = unhandledExceptionsHandler(async (req: Request, res: Response) => {
	return res.json();
});

/**
 * @access admin
 * @method /api/admin/orders/:id DELETE
 */
const deleteOrderByID = unhandledExceptionsHandler(async (req: Request, res: Response) => {
	return res.json();
});

/**
 * @access user,
 * @method /api/user/orders/:id
 */

const refundOrder = unhandledExceptionsHandler(async (req: Request, res: Response) => {
	return res.json();
});
export const hardResetOrders = unhandledExceptionsHandler(async (req: Request, res: Response) => {
	//let orders = await Order.deleteMany({});
	//let details = await OrderDetail.deleteMany({});
	//let payment = await Payment.deleteMany({});
	
	let response = {
		orders: await Order.find({}),
		details: await OrderDetail.find({}),
		payments: await Payment.find({}),
		/*results: {
			order: orders,
			details: details,
			payment: payment,
		}
		*/
	}
	return res.status(200).json({message: "success", response});
	
});

