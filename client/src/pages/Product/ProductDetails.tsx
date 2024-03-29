import { Container, Loader } from 'components';
import { Button } from 'components/Utils';
import { addCard, getStock } from 'helper/product';
import { BreadCrumb } from 'primereact/breadcrumb';
import { Image } from 'primereact/image';
import type { MenuItem } from 'primereact/menuitem';
import { Rating } from 'primereact/rating';
import { FC, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById } from 'redux/product/productSlice';
import { useAppDispatch, useAppSelector } from 'redux/store';

const ProductDetails: FC = () => {
	const { id } = useParams();
	const appDispatch = useAppDispatch();
	const { product, isLoadingGetProductById } = useAppSelector((state) => state.products);

	useEffect(() => {
		appDispatch(getProductById(id as string));
	}, [appDispatch, id]);
	const items: MenuItem[] = [{ label: product?.name }];

	const home: MenuItem = { icon: 'pi pi-home', url: '/' };

	return (
		<Container>
			<div className='lg:max-w-main lg:mx-auto space-y-4 p-4'>
				<div className='mt-2'>
					<BreadCrumb className='shadow-md' model={items} home={home} />
				</div>

				{isLoadingGetProductById ? (
					<div className='flex items-center justify-center mt-2'>
						<Loader />
					</div>
				) : (
					<>
						<div className='grid lg:grid-cols-2 shadow-md gap-6 border border-gray rounded-lg p-4'>
							<Image preview className='w-full h-full' src={product?.image} alt={product?.name} />
							<div className='flex flex-col'>
								<div className='flex flex-col space-y-1'>
									<div className='text-blue font-medium text-md'>{product?.category}</div>
									<div className='text-2xl font-bold'>{product?.name}</div>
									<div className='flex flex-col items-start space-y-2'>
										<div className='flex items-center space-x-2 text-center'>
											<Rating value={product?.rating} readOnly cancel={false} />
											<span className='text-md text-gray'>{product?.rating}/5</span>
										</div>
										<div
											className={`text-center rounded-lg text-xs py-2 px-6 text-white ${
												getStock(product?.countInStock)?.stock
											}`}
										>
											<span className='text-xs font-medium'>{getStock(product?.countInStock)?.text}</span>
										</div>
									</div>
									<div className='h-[0.5px] bg-gray' />
								</div>
								<div className='text-primary font-medium my-2'>{product?.description}</div>
								<div className='text-2xl font-bold text-black mb-2'>${product?.price}</div>
								{(product?.countInStock as number) > 0 && (
									<Button onClick={() => addCard(product, appDispatch)} children='Add to card' />
								)}
							</div>
						</div>
					</>
				)}
			</div>
		</Container>
	);
};

export default ProductDetails;
