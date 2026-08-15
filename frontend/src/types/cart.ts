
export interface CartItem {
  _id: string;
  title: string;
  price: number;
  image: string;
  quantity?: number;
}


export interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}
