import { FormAddAddressValues, FormEditAddressValues, FormEditProfileValues, FormLoginValues, FormPaymentValues, FormRegisterValues } from 'types/helper/validation';
import * as Yup from 'yup';

export const validationSchemaLogin: Yup.ObjectSchema<FormLoginValues> = Yup.object({
	email: Yup.string().email('Invalid email format').required('Email is required'),
	password: Yup.string().required('Password is required')
});

export const validationSchemaRegister: Yup.ObjectSchema<FormRegisterValues> = Yup.object({
	name: Yup.string().required('Name is required'),
	surname: Yup.string().required('Surname is required'),
	email: Yup.string().email('Invalid email format').required('Email is required'),
	password: Yup.string().required('Password is required'),
	phone: Yup.string().required('Phone is required'),
	confirmPassword: Yup.string()
		.oneOf([Yup.ref('password')], 'Passwords must match')
		.required('Confirm password is required')
});

export const validationSchemaEditProfile: Yup.ObjectSchema<FormEditProfileValues> = Yup.object({
	name: Yup.string(),
	surname: Yup.string(),
	email: Yup.string().email('Invalid email format'),
	phone: Yup.string()
});

export const validationSchemaPayment = Yup.object<FormPaymentValues>({
	cardName: Yup.string().required('Card name is required'),
	cardNumber: Yup.number().required('Card number is required'),
	cardExpiry: Yup.string().required('Card expiry is required'),
	cardCvc: Yup.string().required('Card cvv is required').min(3, 'Card cvv must be 3 digits').max(3, 'Card cvv must be 3 digits')
});

export const validationSchemaEditAddress = Yup.object<FormEditAddressValues>({
	title: Yup.string(),
	address: Yup.string(),
	zip_code: Yup.string().min(5, 'Zip code must be 5 digits').max(5, 'Zip code must be 5 digits'),
	city_name: Yup.string(),
	country_name: Yup.string()
});

export const validationSchemaAddAddress = Yup.object<FormAddAddressValues>({
	title: Yup.string().required('Title is required'),
	address: Yup.string().required('Address is required'),
	zip_code: Yup.string().min(5, 'Zip code must be 5 digits').max(5, 'Zip code must be 5 digits').required('Zip code is required'),
	city_name: Yup.string().required('City name is required'),
	country_name: Yup.string().required('Country name is required')
});

export const validationSchemaPanelAddProduct = Yup.object({
	name: Yup.string().required('Name is required'),
	price: Yup.number().required('Price is required'),
	category: Yup.string().required('Category is required'),
	countInStock: Yup.number().required('Count in stock is required'),
	description: Yup.string().required('Description is required'),
	rating: Yup.number().required('Rating is required').min(0, 'Rating must be between 0 and 5').max(5, 'Rating must be between 0 and 5')
});

export const validationSchemaPanelEditProduct = Yup.object({
	name: Yup.string(),
	price: Yup.number(),
	category: Yup.string(),
	countInStock: Yup.number(),
	description: Yup.string(),
	rating: Yup.number().min(0, 'Rating must be between 0 and 5').max(5, 'Rating must be between 0 and 5')
});
