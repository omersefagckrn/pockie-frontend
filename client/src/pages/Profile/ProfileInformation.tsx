import { Loader } from 'components';
import { AppToast } from 'helper/toast';
import { FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserProfile } from 'redux/profile/profileSlice';
import { useAppDispatch, useAppSelector } from 'redux/store';

const ProfileInformation: FC = () => {
	const appDispatch = useAppDispatch();
	const navigate = useNavigate();
	const { user, isLoadingGetUser, errorMessageGetUser, isErrorGetUser } = useAppSelector((state) => state.profile);

	useEffect(() => {
		appDispatch(getUserProfile());
	}, [appDispatch]);

	useEffect(() => {
		if (isErrorGetUser) {
			AppToast({
				type: 'error',
				message: errorMessageGetUser
			});
			localStorage.removeItem('token');
			navigate('/auth/login');
		}
	}, [isErrorGetUser, errorMessageGetUser, navigate]);

	const formatToLocalDate = (expectedDate: string | undefined): string => {
		const date = new Date(expectedDate as string);
		const formattedDate = date.toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' });
		return formattedDate;
	};

	return (
		<>
			<div className='flex items-center justify-between select-none'>
				<div className='text-xl text-black font-semibold'>Profile Info</div>
				<div className='text-xs'>
					Updated At: <span className='font-semibold'>{formatToLocalDate(user?.updatedAt)}</span>
				</div>
			</div>
			{isLoadingGetUser ? (
				<div className='flex items-center justify-center'>
					<Loader />
				</div>
			) : (
				<div className='flex flex-col space-y-4'>
					<div className='text-xs text-purple font-normal pt-2 select-none'>Here you can find and edit information about yourself.</div>
					<div>
						<div className='text-sm text-black font-semibold '>Name</div>
						<div className='text-xs text-purple font-normal'>{user?.name + ' ' + user?.surname}</div>
					</div>
					<div>
						<div className='text-sm text-black font-semibold'>Email</div>
						<div className='text-xs text-purple font-normal'>{user?.email}</div>
					</div>

					<div>
						<div className='text-sm text-black font-semibold'>Phone Number</div>
						<div className='text-xs text-purple font-normal'>{user?.phone}</div>
					</div>
				</div>
			)}
		</>
	);
};

export default ProfileInformation;
