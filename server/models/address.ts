import { Document, model, Schema } from "mongoose";

export interface IAddress {
  user_id: string;
  address: string;
  zip_code: string;
  city_name: string;
  country_name: string;
}

export interface IAddressModel extends IAddress, Document {}

const AddressSchema = new Schema(
  {
    user_id: 
    {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    address: {
      type: String,
      required: true,
    },
    zip_code: {
      type: String,
      required: true
    },
    city_name: {
      type: String,
      required: true
    },
    country_name: {
      type: String,
      required: true
    }
  }
);

export default model<IAddressModel>('Addresses', AddressSchema);
