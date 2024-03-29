import Iyzipay, { LOCALE } from 'iyzipay-ts';
import Order, { OrderFields } from '../../models/Order';
import OrderDetail, { OrderDetailFields } from '../../models/OrderDetail';
import Payment, { PaymentFields } from '../../models/Payment';
import Product, { IProduct } from '../../models/Product';
import User, { IUser } from '../../models/User';
import Address, { AddressField } from '../../models/address';
import {
	IAdminOrdersResponse,
	IGetOrderDetailResponse,
	IRefundOrderResponse,
	IUserOrderResponse,
	SubDetailPaymentInfo,
	SubDetailResponse,
	SubOrdersResponse,
	defaultCancelledColorCode,
	defaultDeliveredColorCode,
	defaultPendingColorCode,
	defaultShippingColorCode
} from '../../types/OrderTypes/Order.responses.types';
import { ICancelPaymentRequest, ICancelPaymentResponse, IRefundPaymentResponse } from '../../types/Payment/Cancel.types';
import { IPaymentFailResponse } from '../../types/Payment/Payment.types';

export const GetUserRecentOrders = async (orders: OrderFields[]): Promise<IUserOrderResponse> => {
	let userOrderResponse: IUserOrderResponse = {
		orders: [] as SubOrdersResponse[],
		colors: {
			cancelled: defaultCancelledColorCode,
			delivered: defaultDeliveredColorCode,
			pending: defaultPendingColorCode,
			shipping: defaultShippingColorCode
		}
	};
	for (let i = 0; i < orders.length; i++) {
		let currentDetails = (await OrderDetail.find({ order_id: orders[i]._id?.toString() })) as OrderDetailFields[];
		let unitOrderResponse: SubOrdersResponse = {
			date: orders[i].created_at as Date,
			item_count: currentDetails.length,
			order_id: currentDetails[0].order_id,
			status: orders[i].status,
			total_price: currentDetails[0].total_price as number,
			image: Array<String>()
		};
		userOrderResponse.orders.push(unitOrderResponse);
		userOrderResponse.orders[i].image = [];
		for (let j = 0; j < currentDetails.length; j++) {
			let product = (await Product.findById(currentDetails[j].product_id)) as IProduct;
			userOrderResponse.orders[i].image?.push(product?.image);
		}
	}
	return userOrderResponse;
};

export const GetOrderDetails = async (order_id: string, user_id: string): Promise<IGetOrderDetailResponse | null> => {
	let allDetails: OrderDetailFields[] = (await OrderDetail.find({ order_id: order_id })) as OrderDetailFields[];
	let user: IUser = (await User.findById(user_id)) as IUser;
	let payment: PaymentFields = (await Payment.findOne({ order_id: order_id, user_id: user_id })) as PaymentFields;
	let payment_info: SubDetailPaymentInfo;
	if (user && payment && allDetails && allDetails.length > 0) {
		let detailResponse: IGetOrderDetailResponse = { details: [], payment_info: undefined };
		payment_info = {
			buyer: payment.buyer,
			payment_type: payment.payment_type,
			total_price: payment.price as number,
			shipping_address: (await Address.findById(payment.shipping_address_id)) as AddressField,
			billing_address: (await Address.findById(payment.billing_address_id)) as AddressField
		};
		detailResponse.payment_info = payment_info;
		for (let i = 0; i < allDetails.length; i++) {
			let isFound = false;
			let current_product: IProduct = (await Product.findById(allDetails[i].product_id)) as IProduct;
			let currentDetail: SubDetailResponse = {
				item: allDetails[i],
				item_image: current_product.image
			};

			detailResponse.details.map((item, index) => {
				if (item.item.product_id === currentDetail.item.product_id) {
					let newQuantity = (item.item.quantity as number) + 1;
					detailResponse.details[index].item.quantity = newQuantity as Number;
					isFound = true;
				}
			});
			if (!isFound) detailResponse.details.push(currentDetail);
		}
		return detailResponse;
	}
	return null;
};

export const GetAllOrdersForAdmin = async (): Promise<IAdminOrdersResponse | null> => {
	let orders: OrderFields[] = (await Order.find({})) as OrderFields[];
	if (orders) {
		let allOrdersResponse: IAdminOrdersResponse = {
			orders: [],
			colors: {
				cancelled: defaultCancelledColorCode,
				delivered: defaultDeliveredColorCode,
				pending: defaultPendingColorCode,
				shipping: defaultShippingColorCode
			}
		};
		for (let i = 0; i < orders.length; i++) {
			let currentDetail = (await OrderDetail.find({ order_id: orders[i]._id })) as OrderDetailFields[];
			let unitOrderResponse: SubOrdersResponse = {
				date: orders[i].created_at as Date,
				item_count: currentDetail.length,
				order_id: currentDetail[0]?.order_id,
				status: orders[i].status,
				total_price: currentDetail[0]?.total_price as number,
				image: Array<String>()
			};
			allOrdersResponse.orders.push(unitOrderResponse);
			allOrdersResponse.orders[i].image = [];
			for (let j = 0; j < currentDetail.length; j++) {
				let product = (await Product.findById(currentDetail[j].product_id)) as IProduct;
				allOrdersResponse.orders[i].image?.push(product?.image);
			}
		}

		return allOrdersResponse;
	}
	return null;
};

export const GetOrderDetailAdmin = async (order_id: string): Promise<IGetOrderDetailResponse | null> => {
	let currentOrder = (await Order.findById(order_id)) as OrderFields;
	let allDetails: OrderDetailFields[] = (await OrderDetail.find({ order_id: order_id })) as OrderDetailFields[];
	let user: IUser = (await User.findById(currentOrder.user_id)) as IUser;
	let payment: PaymentFields = (await Payment.findOne({ order_id: order_id, user_id: currentOrder.user_id })) as PaymentFields;
	let payment_info: SubDetailPaymentInfo;
	if (user && payment && allDetails && allDetails.length > 0) {
		let detailResponse: IGetOrderDetailResponse = { details: [], payment_info: undefined };
		payment_info = {
			buyer: payment.buyer,
			payment_type: payment.payment_type,
			total_price: payment.price as number,
			shipping_address: (await Address.findById(payment.shipping_address_id)) as AddressField,
			billing_address: (await Address.findById(payment.billing_address_id)) as AddressField
		};
		detailResponse.payment_info = payment_info;
		for (let i = 0; i < allDetails.length; i++) {
			let isFound = false;
			let current_product: IProduct = (await Product.findById(allDetails[i].product_id)) as IProduct;
			let currentDetail: SubDetailResponse = {
				item: allDetails[i],
				item_image: current_product.image
			};

			detailResponse.details.map((item, index) => {
				if (item.item.product_id === currentDetail.item.product_id) {
					let newQuantity = (item.item.quantity as number) + 1;
					detailResponse.details[index].item.quantity = newQuantity as Number;
					isFound = true;
				}
			});
			if (!isFound) detailResponse.details.push(currentDetail);
		}
		return detailResponse;
	}

	return null;
};

export const SetOrderToShipping = async (order_id: string): Promise<boolean> => {
	const updateVal = { status: 'SHIPPING' };
	const oldOrder = (await Order.findById(order_id)) as OrderFields;
	if (oldOrder.status === 'GETTING_READY') {
		let doc = await Order.findByIdAndUpdate(order_id, updateVal);
		let changedOrder = (await Order.findById(order_id)) as OrderFields;
		if (changedOrder && changedOrder.status == 'SHIPPING') {
			return true;
		} else return false;
	}
	return false;
};

export const CancelPayment = async (order_id: string): Promise<IPaymentFailResponse | ICancelPaymentResponse | null> => {
	let paymentController = new Iyzipay({
		apiKey: process.env.IYZICO_API_KEY as string,
		secretKey: process.env.IYZICO_SECRET as string,
		uri: process.env.IYZICO_URI as string
	});
	const payment: PaymentFields = (await Payment.findOne({ order_id: order_id })) as PaymentFields;
	if (payment) {
		const request: ICancelPaymentRequest = {
			locale: LOCALE.TR,
			conversationId: payment._id?.toString() as string,
			paymentId: payment.transactionId,
			ip: payment.buyer.ip as string
		};
		await Payment.deleteOne(payment);
		await Order.findByIdAndDelete(order_id);
		let details = (await OrderDetail.find({ order_id: order_id })) as OrderDetailFields[];
		details.forEach(async (detail) => {
			let newStock = (await Product.findById(detail.product_id)) as IProduct;
			newStock.countInStock += detail.quantity as number;
			await Product.findByIdAndUpdate(detail.product_id, newStock);
		});
		await OrderDetail.deleteMany({ order_id: order_id });

		return (await paymentController.cancel.create(request)) as IPaymentFailResponse | ICancelPaymentResponse;
	} else return null;
};

export const RefundOrder = async (
	order_id: string,
	conversation_id: string,
	item_transaction_id: string,
	unitPrice: number,
	currency: string,
	ip: string,
	description: string
): Promise<IPaymentFailResponse | IRefundOrderResponse> => {
	let paymentController = new Iyzipay({
		apiKey: process.env.IYZICO_API_KEY as string,
		secretKey: process.env.IYZICO_SECRET as string,
		uri: process.env.IYZICO_URI as string
	});
	var request = {
		locale: LOCALE.TR,
		conversationId: conversation_id,
		paymentTransactionId: item_transaction_id,
		price: unitPrice.toFixed(1).toString(),
		ip: ip,
		currency: currency
	};
	const response = (await paymentController.refund.create(request)) as IPaymentFailResponse | IRefundPaymentResponse;
	let detail = (await OrderDetail.findOne({ item_transaction_id: item_transaction_id })) as OrderDetailFields;
	let product = (await Product.findById(detail.product_id)) as IProduct;
	product.countInStock = product.countInStock + (detail.quantity as number);
	await Product.findByIdAndUpdate(detail.product_id, product);
	await Payment.findByIdAndUpdate(conversation_id, { price: (detail.total_price as number) - unitPrice });
	await OrderDetail.deleteOne(detail);
	return response;
};
