import { Loader } from 'components';
import OrderDetails from 'components/Modal/OrderDetails';
import { formatCurrency } from 'helper/product';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { FC, useEffect, useState } from 'react';
import { getOrders } from 'redux/order/orderSlice';
import { useAppDispatch, useAppSelector } from 'redux/store';
import { SubOrdersResponse } from 'types/redux/order';

const Orders: FC = () => {
	const appDispatch = useAppDispatch();
	const { orders, isLoadingGetOrder } = useAppSelector((state) => state.order);
	const { id } = useAppSelector((state) => state.auth);
	const [showOrderDetailsModal, setShowOrderDetailsModal] = useState(false);
	const [propsSelectedOrderDetails, setPropsSelectedOrderDetails] = useState<
		| {
				orderId: string | undefined;
				userId: string | undefined;
		  }
		| undefined
	>(undefined);

	useEffect(() => {
		appDispatch(getOrders(id));
	}, [appDispatch, id]);

	const bgColorCalculator = (status: SubOrdersResponse['status']) => {
		if (status === 'GETTING_READY') {
			return {
				backgroundColor: orders.colors.pending,
				color: 'black'
			};
		} else if (status === 'CANCELLED') {
			return {
				backgroundColor: orders.colors.cancelled,
				color: 'black'
			};
		} else if (status === 'DELIVERED') {
			return {
				backgroundColor: orders.colors.delivered,
				color: 'black'
			};
		} else if (status === 'SHIPPING') {
			return {
				backgroundColor: orders.colors.shipping,
				color: 'white'
			};
		} else {
			return {
				backgroundColor: 'white',
				color: 'black'
			};
		}
	};

	const orderIdBody = (order: SubOrdersResponse) => {
		return <div className='text-blue'>{order.order_id}</div>;
	};

	const statusBody = (order: SubOrdersResponse) => {
		return (
			<div
				style={{
					backgroundColor: bgColorCalculator(order.status).backgroundColor,
					color: bgColorCalculator(order.status).color
				}}
				className='flex items-center justify-center rounded-full text-[8px] py-2 px-2'
			>
				<span className='text-xs font-bold text-center'>{order.status}</span>
			</div>
		);
	};

	const totalPriceBody = (order: SubOrdersResponse) => {
		return <div>{formatCurrency(order.total_price)}</div>;
	};

	const itemCountBody = (order: SubOrdersResponse) => {
		return <div>{order.item_count}</div>;
	};

	const dateBody = (order: SubOrdersResponse) => {
		return (
			<div>
				{new Date(order.date).toLocaleDateString('en-US', {
					year: 'numeric',
					month: 'long',
					day: 'numeric'
				})}
			</div>
		);
	};

	return (
		<>
			{showOrderDetailsModal && (
				<OrderDetails
					orderId={propsSelectedOrderDetails?.orderId}
					userId={propsSelectedOrderDetails?.userId}
					visible={showOrderDetailsModal}
					setVisible={setShowOrderDetailsModal}
				/>
			)}

			{isLoadingGetOrder ? (
				<div className='flex items-center justify-center'>
					<Loader />
				</div>
			) : orders?.orders?.length === 0 ? (
				<div className='flex items-center justify-center py-4'>
					<div className='text-lg text-black font-semibold select-none text-center'>You have no orders.</div>
				</div>
			) : (
				<>
					{orders?.orders?.length > 0 && (
						<div className='mb-4'>
							<DataTable
								onRowSelect={(event) => {
									setPropsSelectedOrderDetails({
										orderId: event.data.order_id,
										userId: id
									});
									setShowOrderDetailsModal(true);
								}}
								paginator
								selectionMode='single'
								rows={5}
								value={orders.orders}
								size='normal'
							>
								<Column field='order_id' header='Order ID' body={orderIdBody}></Column>
								<Column
									headerStyle={{
										alignItems: 'center',
										textAlign: 'center'
									}}
									field='item_count'
									header='Item Count'
									sortable
									body={itemCountBody}
								></Column>
								<Column field='date' header='Date' sortable body={dateBody}></Column>
								<Column field='total_price' header='Total Price' sortable body={totalPriceBody}></Column>
								<Column field='status' header='Status' sortable body={statusBody}></Column>
							</DataTable>
						</div>
					)}
				</>
			)}
		</>
	);
};

export default Orders;
