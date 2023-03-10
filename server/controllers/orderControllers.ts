import { Request, Response } from 'express';
import Orders, { Order as intreface_order} from '../models/Order';
import { unhandledExceptionsHandler } from '../utils/error';
import { createPayment } from '../utils/PaymentSystem/createPayment';

/**
 * @access user,
 * @method /api/orders/new-order POST
 */

export const newOrder = unhandledExceptionsHandler(async(req: Request, res: Response) => {
	const {
		user_id,
		price,
		paidPrice,
		installment,
		card,
		buyer,
		shipAddress,
		billingAddress,
		items,
	} = await req.body;
	const result: any = createPayment(user_id,price, paidPrice, installment, card, buyer, shipAddress, billingAddress, items);
	return res.status(200).json(result);
	
});

/**
 * @access user
 * @method /api/orders/:user GET
 */

export const getUserOrders =  unhandledExceptionsHandler(async(req: Request, res: Response) => {
	const orders = (await Orders.find({user_id: req.params?.user as String}));
	if(orders)
		return res.status(200).json(orders);
	return res.status(404).json({message: "something went wrong"});
});

/**
 * @access admin
 * @method /api/admin/orders GET
 */ 

export const getAllOrders = unhandledExceptionsHandler(async(req: Request, res: Response) => {
	const allOrders = (await Orders.find({}) as intreface_order[]);
	if(allOrders)
		return res.status(200).json(allOrders);
	return res.status(404).json({message: "No Orders"});
});

/**
 * @access admin
 * @method /api/admin/orders/:id/to-shipping POST
 */
const orderToShipping = unhandledExceptionsHandler(async(req: Request, res: Response)=> {
	return res.json();
});

/**
 * @access admin
 * @method /api/admin/orders/:id DELETE
 */
const deleteOrderByID = unhandledExceptionsHandler(async(req: Request, res: Response) => {
	return res.json();
});

/**
 * @access user,
 * @method /api/user/orders/:id
 */

const refundOrder = unhandledExceptionsHandler(async(req: Request, res: Response)=> {
	return res.json();
});
